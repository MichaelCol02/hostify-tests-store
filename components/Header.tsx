'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import Logo from './Logo'
import { useAuth } from './AuthProvider'

const NAV = [
  { href: '/tests', label: 'Tests' },
  { href: '/#hoteles', label: 'Para hoteles' },
  { href: '/precios', label: 'Precios' },
]

export default function Header({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { user, loading, credits, openAuth, signOut } = useAuth()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [menuOpen])

  const dark = tone === 'dark' && !scrolled
  const initial = (user?.user_metadata?.name || user?.email || '?').charAt(0).toUpperCase()

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? 'border-b border-black/[0.06] bg-white/75 backdrop-blur-xl backdrop-saturate-150'
          : dark
            ? 'border-b border-transparent bg-ink-900'
            : 'border-b border-transparent bg-ink-50'
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between">
        <Link href="/" aria-label="Hostify Tests, inicio">
          <Logo tone={dark ? 'light' : 'dark'} />
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hidden rounded-full px-4 py-2 text-sm font-medium transition sm:inline-flex ${
                pathname === item.href
                  ? dark ? 'text-white' : 'text-ink'
                  : dark ? 'text-white/60 hover:text-white' : 'text-ink-500 hover:text-ink'
              }`}
            >
              {item.label}
            </Link>
          ))}

          {loading ? (
            <span className="ml-2 h-9 w-24 animate-pulse rounded-full bg-black/5" />
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className={`ml-1 inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                  dark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-brand-soft text-brand-deep hover:bg-brand/15'
                }`}
                title="Tus créditos disponibles"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {credits ?? '–'} {credits === 1 ? 'crédito' : 'créditos'}
              </Link>
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="Menú de cuenta"
                  aria-expanded={menuOpen}
                  className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white ring-2 ring-white/60 transition hover:bg-ink-700"
                >
                  {initial}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-60 animate-fade-up overflow-hidden rounded-3xl bg-white p-2 shadow-lift ring-1 ring-black/5">
                    <p className="truncate px-3 pb-2 pt-2 text-xs text-ink-400">{user.email}</p>
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block rounded-2xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-ink-100">
                      Mi panel
                    </Link>
                    <Link href="/tests" onClick={() => setMenuOpen(false)} className="block rounded-2xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-ink-100 sm:hidden">
                      Tests
                    </Link>
                    <Link href="/precios" onClick={() => setMenuOpen(false)} className="block rounded-2xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-ink-100">
                      Comprar créditos
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false)
                        signOut()
                      }}
                      className="block w-full rounded-2xl px-3 py-2.5 text-left text-sm font-medium text-ink-500 hover:bg-ink-100 hover:text-ink"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => openAuth('login')}
                className={`hidden rounded-full px-4 py-2 text-sm font-medium transition sm:inline-flex ${
                  dark ? 'text-white/60 hover:text-white' : 'text-ink-500 hover:text-ink'
                }`}
              >
                Ingresar
              </button>
              <button type="button" onClick={() => openAuth('signup')} className="btn-primary ml-1 px-4 py-2 text-sm">
                Empezar
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
