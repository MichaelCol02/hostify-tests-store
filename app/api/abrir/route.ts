import { NextResponse, NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { firmarIntento, nombreCookie } from '@/lib/intento'

/** Entrega el permiso para ver un test ya pagado: comprueba que el intento sea
 *  de quien lo pide y deja una cookie firmada en ESE navegador. Sin ella,
 *  /t/<intento> no abre nada, por más que alguien tenga el enlace. */
export async function POST(req: NextRequest) {
  const { attemptId } = await req.json().catch(() => ({ attemptId: undefined }))
  if (typeof attemptId !== 'string' || !attemptId) {
    return NextResponse.json({ error: 'falta_intento' }, { status: 400 })
  }

  const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')
  if (!token) return NextResponse.json({ error: 'sin_sesion' }, { status: 401 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
  const { data: sesion } = await supabase.auth.getUser(token)
  const userId = sesion?.user?.id
  if (!userId) return NextResponse.json({ error: 'sin_sesion' }, { status: 401 })

  const { data: intento } = await supabaseAdmin
    .from('test_attempts')
    .select('id, user_id, expires_at')
    .eq('id', attemptId)
    .maybeSingle()

  if (!intento || intento.user_id !== userId) {
    return NextResponse.json({ error: 'intento_ajeno' }, { status: 403 })
  }

  const quedan = Math.floor((new Date(intento.expires_at).getTime() - Date.now()) / 1000)
  if (quedan <= 0) return NextResponse.json({ error: 'vencido' }, { status: 410 })

  const res = NextResponse.json({ listo: true, expira: intento.expires_at })
  res.cookies.set(nombreCookie(attemptId), firmarIntento(attemptId), {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: quedan,
  })
  return res
}
