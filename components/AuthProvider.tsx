'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import AuthModal from './AuthModal'

type AuthMode = 'login' | 'signup'

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  credits: number | null
  refreshCredits: () => Promise<number | null>
  openAuth: (mode?: AuthMode) => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState<number | null>(null)
  const [authMode, setAuthMode] = useState<AuthMode | null>(null)

  const refreshCredits = useCallback(async () => {
    const { data, error } = await supabase.rpc('store_credit_balance')
    const value = error ? null : (data as number)
    setCredits(value)
    return value
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
      setLoading(false)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) refreshCredits()
    else setCredits(null)
  }, [session, refreshCredits])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user: session?.user ?? null,
        session,
        loading,
        credits,
        refreshCredits,
        openAuth: (mode = 'login') => setAuthMode(mode),
        signOut,
      }}
    >
      {children}
      <AuthModal mode={authMode} onModeChange={setAuthMode} onClose={() => setAuthMode(null)} />
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
