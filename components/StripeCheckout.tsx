'use client'

import { loadStripe } from '@stripe/stripe-js'
import { useState } from 'react'

interface StripeCheckoutProps {
  testId: string
  testName: string
  price: number
  userId: string
  email: string
}

export default function StripeCheckout({
  testId,
  testName,
  price,
  userId,
  email,
}: StripeCheckoutProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheckout = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testId,
          testName,
          price,
          userId,
          email,
        }),
      })

      const { url } = await response.json()

      if (response.ok && url) {
        window.location.href = url
        return
      }
      setError('No pudimos iniciar el pago. Intenta de nuevo en unos minutos.')
    } catch (err) {
      console.error('Checkout error:', err)
      setError('No pudimos conectar con el servidor de pagos. Revisa tu conexión e intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="btn-primary disabled:opacity-50"
      >
        {loading ? 'Procesando...' : `Desbloquear por $${price}`}
      </button>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  )
}
