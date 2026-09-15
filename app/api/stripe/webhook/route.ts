import { NextResponse, NextRequest } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

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
  const testId = session.metadata?.testId
  const userId = session.metadata?.userId

  // Sessions not created by our checkout (e.g. `stripe trigger`) can never be recorded, so retrying is pointless.
  if (!testId || !userId) {
    console.warn(`Webhook ${event.id}: session ${session.id} has no testId/userId metadata, skipping`)
    return NextResponse.json({ received: true, skipped: 'missing metadata' })
  }

  if (session.payment_status !== 'paid') {
    console.warn(`Webhook ${event.id}: session ${session.id} payment_status=${session.payment_status}, skipping`)
    return NextResponse.json({ received: true, skipped: 'not paid' })
  }

  const email = session.customer_details?.email || session.customer_email
  if (email) {
    // purchases.user_id references users(id); client-side profile inserts are blocked by RLS, so ensure the row here.
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

  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id

  // Upsert on (user_id, test_id) makes Stripe's retries of the same event idempotent.
  const { error: purchaseError } = await supabaseAdmin.from('purchases').upsert(
    {
      user_id: userId,
      test_id: testId,
      amount: (session.amount_total ?? 0) / 100,
      currency: (session.currency || 'usd').toUpperCase(),
      stripe_payment_id: paymentIntentId || session.id,
      status: 'completed',
    },
    { onConflict: 'user_id,test_id' }
  )

  if (purchaseError) {
    console.error(`Webhook ${event.id}: failed to record purchase for user ${userId}, test ${testId}:`, purchaseError.message)
    return NextResponse.json({ error: 'Failed to record purchase' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
