'use client'

import Link from 'next/link'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'

function SuccessContent() {
  const params = useSearchParams()
  const sessionId = params.get('session_id')
  const nextParam = params.get('next') || '/tests'
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') ? nextParam : '/tests'
  const { user, loading, credits, refreshCredits } = useAuth()
  const [added, setAdded] = useState<number | null>(null)
  const [timedOut, setTimedOut] = useState(false)

  // The webhook usually lands within a few seconds; poll for this session's credit grant.
  useEffect(() => {
    if (loading || !user || !sessionId) return
    let cancelled = false
    let tries = 0
    const poll = async () => {
      const { data } = await supabase
        .from('credit_transactions')
        .select('delta')
        .eq('stripe_session_id', sessionId)
        .maybeSingle()
      if (cancelled) return
      if (data) {
        setAdded(data.delta)
        refreshCredits()
        return
      }
      tries += 1
      if (tries >= 15) {
        setTimedOut(true)
        return
      }
      setTimeout(poll, 2000)
    }
    poll()
    return () => {
      cancelled = true
    }
  }, [loading, user, sessionId, refreshCredits])

  const confirmed = added !== null

  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden rounded-[2.5rem] bg-white px-6 py-16 text-center shadow-lift ring-1 ring-black/[0.05] sm:px-12 sm:py-20">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[80%] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
      <div className="relative">
        <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${confirmed ? 'bg-gradient-to-b from-brand to-brand-deep shadow-glow' : 'bg-ink-100'}`}>
          {confirmed ? (
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12.5l4.5 4.5L19 7.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-ink-300 border-t-brand" aria-hidden="true" />
          )}
        </div>

        <h1 className="mt-8 text-4xl font-semibold tracking-tightest sm:text-5xl">
          {confirmed ? '¡Pago confirmado!' : timedOut ? 'Pago recibido.' : 'Confirmando tu pago…'}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-ink-500">
          {confirmed
            ? `Sumamos ${added} ${added === 1 ? 'crédito' : 'créditos'} a tu cuenta. Tienes ${credits ?? '…'} disponibles.`
            : timedOut
              ? 'Tus créditos aparecerán en tu panel en unos minutos. Si no, escríbenos y lo resolvemos.'
              : 'Esto toma solo unos segundos.'}
        </p>

        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href={next} className="btn-primary px-7 py-3.5">
            {next.startsWith('/tests/') ? 'Comenzar mi test' : 'Elegir un test'}
          </Link>
          <Link href="/dashboard" className="btn-ghost px-7 py-3.5">
            Ver mi panel
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <>
      <Header />
      <main className="flex-grow px-5 py-16 sm:py-24">
        <Suspense fallback={<div className="mx-auto h-96 max-w-2xl animate-pulse rounded-[2.5rem] bg-white" />}>
          <SuccessContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
