'use client'

import { useCallback, useState } from 'react'
import { supabase } from './supabase'
import type { PackId } from './pricing'

export function useCheckout() {
  const [pending, setPending] = useState<PackId | null>(null)
  const [error, setError] = useState('')

  const checkout = useCallback(async (packId: PackId, returnTo?: string) => {
    setPending(packId)
    setError('')
    try {
      // Sin sesión también se compra: Stripe pide el correo y la cuenta se crea al volver.
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ packId, returnTo }),
      })
      const json = await res.json().catch(() => ({}))
      if (res.ok && json.url) {
        window.location.href = json.url
        return true
      }
      setError('No pudimos iniciar el pago. Intenta de nuevo en unos minutos.')
      return false
    } catch {
      setError('No pudimos conectar con el servidor de pagos. Revisa tu conexión.')
      return false
    } finally {
      setPending(null)
    }
  }, [])

  return { checkout, pending, error }
}
