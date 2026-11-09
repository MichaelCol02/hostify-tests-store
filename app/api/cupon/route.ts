import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { buscarOCrearCuenta } from '@/lib/account'

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
    // Un código inválido termina aquí: no crea cuentas ni revela cuáles existen.
    const { data: cupon } = await supabaseAdmin
      .from('coupons')
      .select('max_uses, used_count, expires_at, active')
      .eq('code', codigo)
      .maybeSingle()
    const vigente =
      cupon?.active &&
      cupon.used_count < cupon.max_uses &&
      (!cupon.expires_at || new Date(cupon.expires_at).getTime() > Date.now())
    if (!vigente) {
      return NextResponse.json({ error: 'cupon_no_valido' }, { status: 404 })
    }

    let destinatario = userId
    let cuentaNueva = false
    if (!destinatario) {
      const cuenta = await buscarOCrearCuenta(correo)
      // Escribir un correo no prueba ser su dueño: quien ya tiene cuenta debe ingresar.
      if (!cuenta.creada) {
        return NextResponse.json({ error: 'cuenta_existente' }, { status: 409 })
      }
      destinatario = cuenta.id
      cuentaNueva = true
    }

    const { data: creditos, error } = await supabaseAdmin.rpc('store_use_coupon', {
      p_code: codigo,
      p_user: destinatario,
    })
    if (error) throw new Error(error.message)

    if (!creditos) {
      return NextResponse.json({ error: 'cupon_no_valido' }, { status: 404 })
    }

    // La cuenta que acaba de nacer entra de inmediato. Nunca una que ya existía.
    let tokenHash: string | undefined
    if (cuentaNueva) {
      const { data: enlace } = await supabaseAdmin.auth.admin.generateLink({ type: 'magiclink', email: correo })
      tokenHash = enlace?.properties?.hashed_token
    }

    return NextResponse.json({ credits: creditos, token_hash: tokenHash })
  } catch (error: any) {
    console.error(`Canje del cupón ${codigo} falló: ${error.message}`)
    return NextResponse.json({ error: 'canje_fallido' }, { status: 500 })
  }
}
