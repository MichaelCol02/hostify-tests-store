import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { getPack } from '@/lib/pricing'
import { CHECKOUT_URL, WOMPI_ACTIVO, WOMPI_PUBLIC_KEY, firmaIntegridad, nuevaReferencia } from '@/lib/wompi'

export async function POST(req: NextRequest) {
  if (!WOMPI_ACTIVO) {
    return NextResponse.json({ error: 'wompi_no_configurado' }, { status: 503 })
  }

  const body = await req.json().catch(() => ({}))
  // El precio sale de la tabla del servidor, nunca del navegador.
  const pack = getPack(body.packId)
  if (!pack) {
    return NextResponse.json({ error: 'invalid_pack' }, { status: 400 })
  }

  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  let userId: string | null = null
  let email: string | null = null

  if (token) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
    const { data } = await supabase.auth.getUser(token)
    userId = data?.user?.id ?? null
    email = data?.user?.email ?? null
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  const returnTo =
    typeof body.returnTo === 'string' && body.returnTo.startsWith('/') && !body.returnTo.startsWith('//')
      ? body.returnTo
      : '/tests'

  const referencia = nuevaReferencia(pack.id)
  const montoEnCentavos = pack.priceCop * 100

  const { error } = await supabaseAdmin.from('wompi_orders').insert({
    reference: referencia,
    pack_id: pack.id,
    credits: pack.credits,
    amount_cop: pack.priceCop,
    email,
    user_id: userId,
  })
  if (error) {
    console.error(`No se pudo registrar el pedido ${referencia}: ${error.message}`)
    return NextResponse.json({ error: 'checkout_failed' }, { status: 500 })
  }

  const url = new URL(CHECKOUT_URL)
  url.searchParams.set('public-key', WOMPI_PUBLIC_KEY)
  url.searchParams.set('currency', 'COP')
  url.searchParams.set('amount-in-cents', String(montoEnCentavos))
  url.searchParams.set('reference', referencia)
  url.searchParams.set('signature:integrity', firmaIntegridad(referencia, montoEnCentavos))
  url.searchParams.set('redirect-url', `${appUrl}/success?ref=${referencia}&next=${encodeURIComponent(returnTo)}`)
  if (email) url.searchParams.set('customer-data:email', email)

  return NextResponse.json({ url: url.toString() })
}
