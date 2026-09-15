'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthProvider'
import PricingCards from './PricingCards'

interface Attempt {
  attempt_id: string
  expires_at: string
  test_url: string
}

export default function TestAccess({ testId, testName }: { testId: string; testName: string }) {
  const { user, loading: authLoading, credits, refreshCredits, openAuth } = useAuth()
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [checking, setChecking] = useState(true)
  const [redeeming, setRedeeming] = useState(false)
  const [error, setError] = useState('')

  const loadAttempt = useCallback(async () => {
    setChecking(true)
    const { data, error: err } = await supabase.rpc('store_active_attempt', { p_test_id: testId })
    if (err) {
      setError('No pudimos verificar tu acceso. Recarga la página.')
    } else {
      setAttempt((data as Attempt[])?.[0] ?? null)
    }
    setChecking(false)
  }, [testId])

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setAttempt(null)
      setChecking(false)
      return
    }
    loadAttempt()
  }, [user, authLoading, loadAttempt])

  const start = async () => {
    setRedeeming(true)
    setError('')
    const { data, error: err } = await supabase.rpc('store_redeem_credit', { p_test_id: testId })
    if (err) {
      setError(
        err.message.includes('insufficient_credits')
          ? 'No te quedan créditos. Compra un paquete para continuar.'
          : 'No pudimos abrir el test. Intenta de nuevo.'
      )
      await refreshCredits()
    } else {
      setAttempt((data as Attempt[])?.[0] ?? null)
      await refreshCredits()
    }
    setRedeeming(false)
  }

  if (authLoading || (user && checking)) {
    return <div className="h-72 animate-pulse rounded-4xl bg-white shadow-soft ring-1 ring-black/[0.05]" />
  }

  if (attempt) {
    const until = new Date(attempt.expires_at).toLocaleString('es-CO', { weekday: 'short', hour: 'numeric', minute: '2-digit' })
    return (
      <div className="overflow-hidden rounded-4xl bg-white shadow-lift ring-1 ring-black/[0.05]">
        <div className="flex flex-col gap-3 border-b border-black/[0.06] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <p className="text-sm font-semibold">Test en curso</p>
            <p className="text-sm text-ink-400">Disponible hasta {until}</p>
          </div>
          <a href={attempt.test_url} target="_blank" rel="noopener noreferrer" className="btn-ghost px-4 py-2 text-sm">
            Abrir en pantalla completa ↗
          </a>
        </div>
        <iframe src={attempt.test_url} title={testName} className="block h-[80vh] min-h-[640px] w-full bg-ink-100" allow="microphone; camera; fullscreen" />
      </div>
    )
  }

  if (!user) {
    return (
      <Panel>
        <h2 className="text-3xl font-semibold sm:text-4xl">Ingresa para comenzar.</h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] text-ink-500">
          Tu cuenta guarda tus créditos y te permite volver a tu test en curso desde cualquier dispositivo.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={() => openAuth('signup')} className="btn-primary px-7 py-3.5">
            Crear cuenta
          </button>
          <button type="button" onClick={() => openAuth('login')} className="btn-ghost px-7 py-3.5">
            Ya tengo cuenta
          </button>
        </div>
      </Panel>
    )
  }

  if ((credits ?? 0) > 0) {
    return (
      <Panel>
        <p className="eyebrow">Listo para comenzar</p>
        <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
          Tienes {credits} {credits === 1 ? 'crédito' : 'créditos'}.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[15px] text-ink-500">
          Comenzar usa 1 crédito y deja el test abierto durante 24 horas, aunque cierres la ventana.
        </p>
        <button type="button" onClick={start} disabled={redeeming} className="btn-primary mt-8 px-8 py-4 text-base">
          {redeeming ? 'Abriendo test…' : 'Comenzar test · 1 crédito'}
        </button>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </Panel>
    )
  }

  return (
    <div className="rounded-4xl bg-ink-100 p-6 sm:p-10">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Elige tus créditos</p>
        <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Un paso para comenzar.</h2>
        <p className="mt-3 text-[15px] text-ink-500">Cada crédito es un test completo. Vuelves aquí justo después de pagar.</p>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>
      <div className="mt-10">
        <PricingCards compact returnTo={`/tests/${testId}`} />
      </div>
    </div>
  )
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-4xl bg-white px-6 py-16 text-center shadow-soft ring-1 ring-black/[0.05] sm:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-72 w-[70%] -translate-x-1/2 rounded-full bg-brand/15 blur-3xl" />
      <div className="relative">{children}</div>
    </div>
  )
}
