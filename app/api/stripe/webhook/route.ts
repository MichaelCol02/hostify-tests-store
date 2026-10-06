import { NextResponse, NextRequest } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { getPack } from '@/lib/pricing'
import { findOrCreateUser, grantCredits } from '@/lib/account'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session
  const pack = getPack(session.metadata?.packId)
  const email = session.customer_details?.email || session.customer_email
  const userId = session.metadata?.userId

  // Sin paquete no sabemos qué vendimos, y sin cuenta ni correo no hay a quién abonarle.
  // Reintentar no lo arregla, así que se responde 200 y queda en el registro.
  if (!pack || (!userId && !email)) {
    console.warn(`Webhook ${event.id}: sesión ${session.id} sin paquete o sin destinatario, se omite`)
    return NextResponse.json({ received: true, skipped: 'missing metadata' })
  }

  if (session.payment_status !== 'paid') {
    console.warn(`Webhook ${event.id}: sesión ${session.id} payment_status=${session.payment_status}, se omite`)
    return NextResponse.json({ received: true, skipped: 'not paid' })
  }

  if (session.amount_total !== Math.round(pack.priceUsd * 100)) {
    console.error(`Webhook ${event.id}: sesión ${session.id} cobró ${session.amount_total}, que no corresponde al paquete ${pack.id}`)
    return NextResponse.json({ received: true, skipped: 'amount mismatch' })
  }

  try {
    const destinatario = userId || (await findOrCreateUser(email!, session.customer_details?.name || undefined))
    await grantCredits(session, pack, destinatario)
  } catch (error: any) {
    // 500 para que Stripe reintente: un fallo aquí significa que alguien pagó y no recibió nada.
    console.error(`Webhook ${event.id}: ${error.message}`)
    return NextResponse.json({ error: 'Failed to record purchase' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
