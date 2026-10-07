import { NextResponse, NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getPack } from '@/lib/pricing'
import { findOrCreateUser } from '@/lib/account'
import { eventoLegitimo } from '@/lib/wompi'

export async function POST(req: NextRequest) {
  const cuerpo = await req.json().catch(() => null)
  if (!cuerpo || !eventoLegitimo(cuerpo)) {
    // Sin firma válida no se abona nada: es la única defensa contra compras inventadas.
    return NextResponse.json({ error: 'firma_invalida' }, { status: 401 })
  }

  if (cuerpo.event !== 'transaction.updated') {
    return NextResponse.json({ received: true })
  }

  const trx = cuerpo.data?.transaction
  const referencia: string | undefined = trx?.reference
  if (!referencia) {
    return NextResponse.json({ received: true, skipped: 'sin referencia' })
  }

  if (trx.status !== 'APPROVED') {
    await supabaseAdmin.from('wompi_orders').update({ status: trx.status }).eq('reference', referencia)
    return NextResponse.json({ received: true, skipped: `estado ${trx.status}` })
  }

  const { data: pedido } = await supabaseAdmin
    .from('wompi_orders')
    .select('reference, pack_id, credits, amount_cop, email, user_id, credited_at')
    .eq('reference', referencia)
    .maybeSingle()

  if (!pedido) {
    console.warn(`Wompi avisó de la referencia ${referencia}, que no existe en wompi_orders`)
    return NextResponse.json({ received: true, skipped: 'pedido desconocido' })
  }

  if (pedido.credited_at) {
    return NextResponse.json({ received: true, skipped: 'ya abonado' })
  }

  const pack = getPack(pedido.pack_id)
  if (!pack || trx.amount_in_cents !== pedido.amount_cop * 100) {
    console.error(`Referencia ${referencia}: el monto cobrado no corresponde al pedido`)
    return NextResponse.json({ received: true, skipped: 'monto distinto' })
  }

  const correo = pedido.email || trx.customer_email
  if (!pedido.user_id && !correo) {
    console.error(`Referencia ${referencia}: no hay a quién abonarle los créditos`)
    return NextResponse.json({ received: true, skipped: 'sin destinatario' })
  }

  try {
    const destinatario = pedido.user_id || (await findOrCreateUser(correo!))

    const { error: errorCredito } = await supabaseAdmin.from('credit_transactions').upsert(
      {
        user_id: destinatario,
        delta: pack.credits,
        reason: 'purchase',
        pack_id: pack.id,
        amount: pedido.amount_cop,
        currency: 'COP',
        provider: 'wompi',
        wompi_reference: referencia,
      },
      { onConflict: 'wompi_reference', ignoreDuplicates: true }
    )
    if (errorCredito) throw new Error(errorCredito.message)

    await supabaseAdmin
      .from('wompi_orders')
      .update({ status: 'APPROVED', transaction_id: trx.id, user_id: destinatario, email: correo, credited_at: new Date().toISOString() })
      .eq('reference', referencia)
  } catch (error: any) {
    // 500 para que Wompi reintente: alguien pagó y todavía no recibió sus créditos.
    console.error(`Referencia ${referencia}: ${error.message}`)
    return NextResponse.json({ error: 'no_abonado' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
