import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

  return { user, loading }
}

export function usePurchases(userId: string | undefined) {
  const [purchases, setPurchases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    supabase
      .from('purchases')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .then(({ data, error }) => {
        if (!error && data) {
          setPurchases(data)
        }
        setLoading(false)
      })
  }, [userId])

  return { purchases, loading }
}

export function useTestAccess(userId: string | undefined, testId: string) {
  const [hasAccess, setHasAccess] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId || !testId) {
      setLoading(false)
      return
    }

    supabase
      .from('purchases')
      .select('id')
      .eq('user_id', userId)
      .eq('test_id', testId)
      .eq('status', 'completed')
      .single()
      .then(({ data, error }) => {
        setHasAccess(!!data && !error)
        setLoading(false)
      })
  }, [userId, testId])

  return { hasAccess, loading }
}
