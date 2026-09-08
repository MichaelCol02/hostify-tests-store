import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { email, password, action } = body

  const supabase = createRouteHandlerClient({ cookies })

  try {
    if (action === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) throw error
      return NextResponse.json({ user: data.user }, { status: 200 })
    }

    if (action === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      return NextResponse.json({ user: data.user }, { status: 200 })
    }

    if (action === 'logout') {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return NextResponse.json({ ok: true }, { status: 200 })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
