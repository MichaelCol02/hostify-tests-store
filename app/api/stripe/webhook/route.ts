import { NextResponse, NextRequest } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getPack } from '@/lib/pricing'

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
  const userId = session.metadata?.userId
  const pack = getPack(session.metadata?.packId)

  // Sessions not created by our checkout (e.g. `stripe trigger`) can never be recorded, so retrying is pointless.
  if (!userId || !pack) {
    console.warn(`Webhook ${event.id}: session ${session.id} has no userId/pack metadata, skipping`)
    return NextResponse.json({ received: true, skipped: 'missing metadata' })
  }

  if (session.payment_status !== 'paid') {
    console.warn(`Webhook ${event.id}: session ${session.id} payment_status=${session.payment_status}, skipping`)
    return NextResponse.json({ received: true, skipped: 'not paid' })
  }

  if (session.amount_total !== Math.round(pack.priceUsd * 100)) {
    console.error(`Webhook ${event.id}: session ${session.id} amount ${session.amount_total} does not match pack ${pack.id}`)
    return NextResponse.json({ received: true, skipped: 'amount mismatch' })
  }

  const email = session.customer_details?.email || session.customer_email
  if (email) {
    // credit_transactions.user_id references users(id); make sure the profile row exists.
    const { error: userError } = await supabaseAdmin.from('users').upsert(
      {
        id: userId,
        email,
        name: session.customer_details?.name || email.split('@')[0],
      },
      { onConflict: 'id', ignoreDuplicates: true }
    )
    if (userError) {
      console.error(`Webhook ${event.id}: failed to ensure user ${userId}:`, userError.message)
      return NextResponse.json({ error: 'Failed to record purchase' }, { status: 500 })
    }
  }

  // stripe_session_id is UNIQUE, so Stripe retries of the same event never grant credits twice.
  const { error: creditError } = await supabaseAdmin.from('credit_transactions').upsert(
    {
      user_id: userId,
      delta: pack.credits,
      reason: 'purchase',
      pack_id: pack.id,
      amount: (session.amount_total ?? 0) / 100,
      currency: (session.currency || 'usd').toUpperCase(),
      stripe_session_id: session.id,
    },
    { onConflict: 'stripe_session_id', ignoreDuplicates: true }
  )

  if (creditError) {
    console.error(`Webhook ${event.id}: failed to add ${pack.credits} credits for user ${userId}:`, creditError.message)
    return NextResponse.json({ error: 'Failed to record purchase' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
