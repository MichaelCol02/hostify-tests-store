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

  const handleCheckout = async () => {
    setLoading(true)

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

      const { sessionId, url } = await response.json()

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="btn-primary disabled:opacity-50"
    >
      {loading ? 'Procesando...' : `Desbloquear por $${price}`}
    </button>
  )
}
