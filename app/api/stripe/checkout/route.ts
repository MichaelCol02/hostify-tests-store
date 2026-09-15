import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe'
import { getPack } from '@/lib/pricing'

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) {
    return NextResponse.json({ error: 'not_authenticated' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
  const { data: userData, error: userError } = await supabase.auth.getUser(token)
  const user = userData?.user
  if (userError || !user) {
    return NextResponse.json({ error: 'not_authenticated' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  // Price and credits come from the server-side pack table, never from the client.
  const pack = getPack(body.packId)
  if (!pack) {
    return NextResponse.json({ error: 'invalid_pack' }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  const returnTo = typeof body.returnTo === 'string' && body.returnTo.startsWith('/') && !body.returnTo.startsWith('//')
    ? body.returnTo
    : '/tests'

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Hostify Tests · ${pack.credits} ${pack.credits === 1 ? 'crédito' : 'créditos'}`,
              description: `Paquete ${pack.name}: ${pack.credits} ${pack.credits === 1 ? 'test completo' : 'tests completos'}.`,
            },
            unit_amount: Math.round(pack.priceUsd * 100),
          },
          quantity: 1,
        },
      ],
      customer_email: user.email,
      metadata: {
        userId: user.id,
        packId: pack.id,
        credits: String(pack.credits),
      },
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}&next=${encodeURIComponent(returnTo)}`,
      cancel_url: `${appUrl}${returnTo}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Checkout session creation failed:', error.message)
    return NextResponse.json({ error: 'checkout_failed' }, { status: 502 })
  }
}
