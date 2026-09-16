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
  const [showPassword, setShowPassword] = useState(false)

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
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field pr-12"
              placeholder="Contraseña"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              minLength={6}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              aria-pressed={showPassword}
              title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl text-ink-400 transition hover:bg-black/5 hover:text-ink"
            >
              <EyeIcon off={showPassword} />
            </button>
          </div>

          {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {notice && <p className="rounded-2xl bg-brand-soft px-4 py-3 text-sm text-brand-deep">{notice}</p>}

          <button type="submit" disabled={loading} className="btn-primary !mt-6 w-full py-3.5">
            {loading ? 'Un momento…' : isLogin ? 'Ingresar' : 'Crear cuenta'}
          </button>
        </form>

        {mode === 'signup' && password.length > 0 && password.length < 6 && (
          <p className="mt-3 text-center text-xs text-ink-400">La contraseña necesita al menos 6 caracteres.</p>
        )}

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

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M4 20 20 4" />}
    </svg>
  )
}
