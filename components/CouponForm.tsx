'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthProvider'

const MENSAJES: Record<string, string> = {
  cupon_no_valido: 'Ese código no existe, ya se usó o venció.',
  correo_invalido: 'Escribe un correo válido para enviarte el acceso.',
  codigo_invalido: 'Escribe el código del cupón.',
}

export default function CouponForm({ onCanjeado }: { onCanjeado?: () => void }) {
  const { user, refreshCredits } = useAuth()
  const [abierto, setAbierto] = useState(false)
  const [codigo, setCodigo] = useState('')
  const [correo, setCorreo] = useState('')
  const [estado, setEstado] = useState<'inicial' | 'enviando' | 'listo'>('inicial')
  const [error, setError] = useState('')

  const canjear = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setEstado('enviando')
    try {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      const res = await fetch('/api/cupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ code: codigo, email: correo }),
      })
      const json = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(MENSAJES[json.error] || 'No pudimos canjear el cupón. Intenta de nuevo.')
        setEstado('inicial')
        return
      }

      if (json.token_hash) {
        await supabase.auth.verifyOtp({ token_hash: json.token_hash, type: 'email' })
      }
      await refreshCredits()
      setEstado('listo')
      onCanjeado?.()
    } catch {
      setError('No pudimos conectar. Revisa tu conexión e intenta de nuevo.')
      setEstado('inicial')
    }
  }

  if (estado === 'listo') {
    return (
      <p className="mx-auto mt-6 max-w-md rounded-2xl bg-brand-soft px-4 py-3 text-center text-sm text-brand-deep">
        ¡Cupón aplicado! Ya puedes comenzar el test.
      </p>
    )
  }

  if (!abierto) {
    return (
      <p className="mt-6 text-center text-sm text-ink-500">
        ¿Tienes un cupón?{' '}
        <button type="button" onClick={() => setAbierto(true)} className="font-semibold text-brand-deep hover:underline">
          Canjéalo aquí
        </button>
      </p>
    )
  }

  return (
    <form onSubmit={canjear} className="mx-auto mt-6 max-w-md">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          className="field flex-1 uppercase"
          placeholder="HOSTIFY-XXXXXX"
          autoCapitalize="characters"
          required
        />
        {!user && (
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="field flex-1"
            placeholder="Tu correo"
            autoComplete="email"
            required
          />
        )}
        <button type="submit" disabled={estado === 'enviando'} className="btn-dark shrink-0 px-5 py-3 text-sm">
          {estado === 'enviando' ? 'Canjeando…' : 'Canjear'}
        </button>
      </div>
      {!user && <p className="mt-2 text-xs text-ink-400">Usamos tu correo para guardar el test; no tienes que crear contraseña.</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </form>
  )
}
