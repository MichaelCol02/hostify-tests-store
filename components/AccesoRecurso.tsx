'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthProvider'
import { useCheckout } from '@/lib/hooks'
import { formatPrecio, MONEDA } from '@/lib/pricing'
import type { Producto } from '@/lib/productos'

interface Pase {
  attempt_id: string
  expires_at: string
}

/** Vende el recurso a quien no lo tiene y lo abre a quien ya lo compró. Se
 *  compra sin cuenta: la cuenta se crea con el correo del pago, igual que los
 *  tests, porque pedir registro antes de pagar es donde más gente se cae. */
export default function AccesoRecurso({ producto }: { producto: Producto }) {
  const { user, loading: cargandoSesion } = useAuth()
  const { checkout, pending, error } = useCheckout()
  const [pase, setPase] = useState<Pase | null>(null)
  const [revisando, setRevisando] = useState(true)

  const permiso = useCallback(async (attemptId: string) => {
    const { data } = await supabase.auth.getSession()
    const token = data.session?.access_token
    if (!token) return
    await fetch('/api/abrir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ attemptId }),
    }).catch(() => null)
  }, [])

  const buscarPase = useCallback(async () => {
    setRevisando(true)
    const { data } = await supabase.rpc('store_active_attempt', { p_test_id: producto.recurso })
    const activo = (data as Pase[])?.[0] ?? null
    if (activo) await permiso(activo.attempt_id)
    setPase(activo)
    setRevisando(false)
  }, [producto.recurso, permiso])

  useEffect(() => {
    if (cargandoSesion) return
    if (!user) {
      setPase(null)
      setRevisando(false)
      return
    }
    buscarPase()
  }, [user, cargandoSesion, buscarPase])

  if (cargandoSesion || (user && revisando)) {
    return <div className="h-40 animate-pulse rounded-4xl bg-white shadow-soft ring-1 ring-black/[0.05]" />
  }

  if (pase) {
    const hasta = new Date(pase.expires_at).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })
    return (
      <div className="rounded-4xl bg-ink-900 p-8 text-white shadow-lift sm:p-10">
        <p className="eyebrow text-brand">Ya es tuyo</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tightest sm:text-3xl">Abre tu kit cuando quieras</h2>
        <p className="mt-3 text-white/60">Tu acceso va hasta el {hasta}. Puedes volver las veces que necesites.</p>
        <a href={`/t/${pase.attempt_id}`} target="_blank" rel="noopener noreferrer" className="btn-primary mt-7 inline-block px-7 py-3.5">
          Abrir el kit ↗
        </a>
      </div>
    )
  }

  return (
    <div className="rounded-4xl bg-white p-8 shadow-lift ring-1 ring-black/[0.05] sm:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Acceso por un año</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="font-display text-5xl font-semibold leading-none tracking-tightest">
              {formatPrecio(MONEDA === 'COP' ? producto.priceCop : producto.priceUsd)}
            </span>
            <span className="pb-1 text-sm text-ink-400">{MONEDA}</span>
          </div>
        </div>
        <p className="max-w-xs text-sm text-ink-500">
          Pago único. No es una suscripción y no se renueva solo.
        </p>
      </div>

      <button
        type="button"
        onClick={() => checkout(producto.id as any, `/kit/${producto.id}`)}
        disabled={pending !== null}
        className="btn-primary mt-7 w-full py-3.5"
      >
        {pending ? 'Abriendo pago seguro…' : 'Quiero el kit'}
      </button>

      {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
      <p className="mt-4 text-center text-xs text-ink-400">
        No necesitas crear cuenta antes: se crea sola con el correo con el que pagues.
      </p>
    </div>
  )
}
