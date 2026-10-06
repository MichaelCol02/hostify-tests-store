import { NextResponse, NextRequest } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getPack } from '@/lib/pricing'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { findOrCreateUser, grantCredits } from '@/lib/account'

/** Minutos que vale el enlace de regreso de Stripe como prueba de identidad.
 *  Pasado ese plazo hay que entrar con contraseña o pedir un enlace al correo. */
const VENTANA_MINUTOS = 60

export async function POST(req: NextRequest) {
  const { session_id: sessionId } = await req.json().catch(() => ({ session_id: null }))
  if (typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
    return NextResponse.json({ error: 'invalid_session' }, { status: 400 })
  }

  let session
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId)
  } catch {
    return NextResponse.json({ error: 'invalid_session' }, { status: 400 })
  }

  if (session.payment_status !== 'paid') {
    return NextResponse.json({ error: 'not_paid' }, { status: 402 })
  }

  const minutos = (Date.now() - session.created * 1000) / 60000
  if (minutos > VENTANA_MINUTOS) {
    return NextResponse.json({ error: 'expired' }, { status: 410 })
  }

  const pack = getPack(session.metadata?.packId)
  const email = session.customer_details?.email || session.customer_email
  if (!pack || !email) {
    return NextResponse.json({ error: 'invalid_session' }, { status: 400 })
  }

  try {
    const userId = session.metadata?.userId || (await findOrCreateUser(email, session.customer_details?.name || undefined))
    // El webhook suele haber abonado ya; esto cubre el caso de que venga demorado.
    await grantCredits(session, pack, userId)

    // Un solo uso: marcar la compra deja inservible el enlace de regreso.
    const { data: marcada, error: errorMarca } = await supabaseAdmin
      .from('credit_transactions')
      .update({ claimed_at: new Date().toISOString() })
      .eq('stripe_session_id', session.id)
      .is('claimed_at', null)
      .select('id')
      .maybeSingle()

    if (errorMarca) throw new Error(errorMarca.message)
    if (!marcada) {
      return NextResponse.json({ error: 'already_claimed' }, { status: 409 })
    }

    const { data: enlace, error: errorEnlace } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
    })
    if (errorEnlace || !enlace?.properties?.hashed_token) {
      throw new Error(errorEnlace?.message || 'sin token')
    }

    return NextResponse.json({ email, token_hash: enlace.properties.hashed_token })
  } catch (error: any) {
    console.error(`Claim de la sesión ${sessionId} falló: ${error.message}`)
    return NextResponse.json({ error: 'claim_failed' }, { status: 500 })
  }
}
