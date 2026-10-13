import { supabaseAdmin } from './supabase-admin'
import { getPack } from './pricing'
import { findOrCreateUser } from './account'

export interface TransaccionWompi {
  id: string
  reference: string
  status: string
  amount_in_cents: number
  customer_email?: string | null
}

export type ResultadoAbono =
  | { abonado: true; creditos: number }
  | { abonado: false; motivo: string }

/** Abona los créditos de una compra de Wompi. La usan el aviso de Wompi y la
 *  página de regreso del pago: quien llegue primero abona, y el segundo no
 *  duplica nada porque la referencia es única y el pedido queda marcado. */
export async function abonarCompra(trx: TransaccionWompi): Promise<ResultadoAbono> {
  if (trx.status !== 'APPROVED') return { abonado: false, motivo: `la transacción está en ${trx.status}` }

  const { data: pedido } = await supabaseAdmin
    .from('wompi_orders')
    .select('reference, pack_id, credits, amount_cop, email, user_id, credited_at')
    .eq('reference', trx.reference)
    .maybeSingle()

  if (!pedido) return { abonado: false, motivo: 'no existe un pedido con esa referencia' }
  if (pedido.credited_at) return { abonado: true, creditos: pedido.credits }

  const pack = getPack(pedido.pack_id)
  if (!pack) return { abonado: false, motivo: 'el paquete del pedido ya no existe' }
  if (trx.amount_in_cents !== pedido.amount_cop * 100) {
    return { abonado: false, motivo: 'el monto cobrado no corresponde al pedido' }
  }

  const correo = pedido.email || trx.customer_email
  if (!pedido.user_id && !correo) return { abonado: false, motivo: 'no hay a quién abonarle' }

  const destinatario = pedido.user_id || (await findOrCreateUser(correo!))

  const { error } = await supabaseAdmin.from('credit_transactions').upsert(
    {
      user_id: destinatario,
      delta: pack.credits,
      reason: 'purchase',
      pack_id: pack.id,
      amount: pedido.amount_cop,
      currency: 'COP',
      provider: 'wompi',
      wompi_reference: trx.reference,
    },
    { onConflict: 'wompi_reference', ignoreDuplicates: true }
  )
  if (error) throw new Error(error.message)

  await supabaseAdmin
    .from('wompi_orders')
    .update({
      status: 'APPROVED',
      transaction_id: trx.id,
      user_id: destinatario,
      email: correo,
      credited_at: new Date().toISOString(),
    })
    .eq('reference', trx.reference)

  return { abonado: true, creditos: pack.credits }
}
