import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { stripe } from '@/lib/stripe'
import { getPack } from '@/lib/pricing'

export async function POST(req: NextRequest) {
  // La compra no exige cuenta: si llega sin sesión, Stripe pide el correo y con él
  // se crea la cuenta al volver del pago. Si llega con sesión, se le asigna a esa cuenta.
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  let user = null

  if (token) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
    const { data } = await supabase.auth.getUser(token)
    user = data?.user ?? null
  }

  const body = await req.json().catch(() => ({}))
  // El precio y los créditos salen de la tabla del servidor, nunca del navegador.
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
              name: `Hostify Tests · ${pack.credits} ${pack.credits === 1 ? 'test' : 'tests'}`,
              description: `Paquete ${pack.name}: ${pack.credits} ${pack.credits === 1 ? 'test completo' : 'tests completos'}.`,
            },
            unit_amount: Math.round(pack.priceUsd * 100),
          },
          quantity: 1,
        },
      ],
      ...(user?.email ? { customer_email: user.email } : {}),
      metadata: {
        ...(user ? { userId: user.id } : {}),
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
