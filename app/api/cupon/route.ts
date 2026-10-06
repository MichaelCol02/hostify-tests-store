import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { findOrCreateUser } from '@/lib/account'

const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const codigo = typeof body.code === 'string' ? body.code.trim().toUpperCase() : ''
  const correo = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

  if (!codigo) {
    return NextResponse.json({ error: 'codigo_invalido' }, { status: 400 })
  }

  // Si ya tiene sesión, los créditos van a su cuenta; si no, el correo es su identidad.
  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  let userId: string | null = null

  if (token) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
    const { data } = await supabase.auth.getUser(token)
    userId = data?.user?.id ?? null
  }

  if (!userId && !CORREO.test(correo)) {
    return NextResponse.json({ error: 'correo_invalido' }, { status: 400 })
  }

  try {
    const destinatario = userId || (await findOrCreateUser(correo))

    const { data: creditos, error } = await supabaseAdmin.rpc('store_use_coupon', {
      p_code: codigo,
      p_user: destinatario,
    })
    if (error) throw new Error(error.message)

    if (!creditos) {
      return NextResponse.json({ error: 'cupon_no_valido' }, { status: 404 })
    }

    // Quien llegó sin cuenta entra de inmediato, igual que después de pagar.
    let tokenHash: string | undefined
    if (!userId) {
      const { data: enlace } = await supabaseAdmin.auth.admin.generateLink({ type: 'magiclink', email: correo })
      tokenHash = enlace?.properties?.hashed_token
    }

    return NextResponse.json({ credits: creditos, token_hash: tokenHash })
  } catch (error: any) {
    console.error(`Canje del cupón ${codigo} falló: ${error.message}`)
    return NextResponse.json({ error: 'canje_fallido' }, { status: 500 })
  }
}
