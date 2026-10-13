import { NextResponse, NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { eventoLegitimo } from '@/lib/wompi'
import { abonarCompra } from '@/lib/wompi-abono'

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
  if (!trx?.reference) {
    return NextResponse.json({ received: true, skipped: 'sin referencia' })
  }

  if (trx.status !== 'APPROVED') {
    await supabaseAdmin.from('wompi_orders').update({ status: trx.status }).eq('reference', trx.reference)
    return NextResponse.json({ received: true, skipped: `estado ${trx.status}` })
  }

  try {
    const resultado = await abonarCompra({
      id: String(trx.id),
      reference: String(trx.reference),
      status: trx.status,
      amount_in_cents: Number(trx.amount_in_cents),
      customer_email: trx.customer_email ?? null,
    })
    if (!resultado.abonado) {
      console.warn(`Referencia ${trx.reference} no abonada: ${resultado.motivo}`)
    }
    return NextResponse.json({ received: true, ...resultado })
  } catch (error: any) {
    // 500 para que Wompi reintente: alguien pagó y todavía no recibió sus créditos.
    console.error(`Referencia ${trx.reference}: ${error.message}`)
    return NextResponse.json({ error: 'no_abonado' }, { status: 500 })
  }
}
