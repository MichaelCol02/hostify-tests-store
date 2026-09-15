'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Logo from './Logo'

interface AuthModalProps {
  mode: 'login' | 'signup' | null
  onModeChange: (mode: 'login' | 'signup') => void
  onClose: () => void
}

const ERRORS: Record<string, string> = {
  'Invalid login credentials': 'Correo o contraseña incorrectos.',
  'Email not confirmed': 'Confirma tu correo antes de ingresar. Revisa tu bandeja de entrada.',
  'User already registered': 'Ya existe una cuenta con este correo. Ingresa en su lugar.',
}

export default function AuthModal({ mode, onModeChange, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    setError('')
    setNotice('')
  }, [mode])

  useEffect(() => {
    if (!mode) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mode, onClose])

  if (!mode) return null
  const isLogin = mode === 'login'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setNotice('')
    setLoading(true)

    try {
      if (isLogin) {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password })
        if (err) throw err
        onClose()
      } else {
        const { data, error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        })
        if (err) throw err

        if (!data.session) {
          setNotice('Te enviamos un correo para confirmar tu cuenta. Después vuelve aquí e ingresa.')
          onModeChange('login')
          return
        }

        if (data.user) {
          await supabase.from('users').insert({ id: data.user.id, email, name })
        }
        onClose()
      }
    } catch (err: any) {
      setError(ERRORS[err.message] || err.message || 'Algo salió mal. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-0 backdrop-blur-md sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
    >
      <div
        className="relative w-full max-w-md animate-fade-up rounded-t-4xl bg-white p-8 shadow-lift sm:rounded-4xl sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-ink-500 transition hover:bg-ink-300/60 hover:text-ink"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <Logo />
        <h2 id="auth-title" className="mt-8 text-3xl font-semibold">
          {isLogin ? 'Bienvenido de nuevo.' : 'Crea tu cuenta.'}
        </h2>
        <p className="mt-2 text-[15px] text-ink-500">
          {isLogin ? 'Ingresa para usar tus créditos.' : 'Tus créditos y resultados, siempre contigo.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-3">
          {!isLogin && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="field"
              placeholder="Nombre"
              autoComplete="name"
              required
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
            placeholder="Correo electrónico"
            autoComplete="email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field"
            placeholder="Contraseña"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            minLength={6}
            required
          />

          {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {notice && <p className="rounded-2xl bg-brand-soft px-4 py-3 text-sm text-brand-deep">{notice}</p>}

          <button type="submit" disabled={loading} className="btn-primary !mt-6 w-full py-3.5">
            {loading ? 'Un momento…' : isLogin ? 'Ingresar' : 'Crear cuenta'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          {isLogin ? '¿Primera vez aquí?' : '¿Ya tienes cuenta?'}{' '}
          <button
            type="button"
            onClick={() => onModeChange(isLogin ? 'signup' : 'login')}
            className="font-semibold text-brand-deep hover:underline"
          >
            {isLogin ? 'Crea una cuenta' : 'Ingresa'}
          </button>
        </p>
      </div>
    </div>
  )
}
