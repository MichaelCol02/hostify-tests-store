'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TestIcon from '@/components/TestIcon'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import { getCatalogTest } from '@/lib/catalog'
import { getPack } from '@/lib/pricing'

interface AttemptRow {
  id: string
  test_id: string
  started_at: string
  expires_at: string
}

interface PurchaseRow {
  id: string
  delta: number
  pack_id: string | null
  amount: number | null
  created_at: string
}

const dateFmt = (iso: string) => new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })

export default function DashboardPage() {
  const { user, loading, credits, openAuth } = useAuth()
  const [attempts, setAttempts] = useState<AttemptRow[]>([])
  const [purchases, setPurchases] = useState<PurchaseRow[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setDataLoading(false)
      return
    }
    setDataLoading(true)
    Promise.all([
      supabase.from('test_attempts').select('id, test_id, started_at, expires_at').order('started_at', { ascending: false }).limit(50),
      supabase.from('credit_transactions').select('id, delta, pack_id, amount, created_at').eq('reason', 'purchase').order('created_at', { ascending: false }).limit(50),
    ]).then(([a, p]) => {
      setAttempts((a.data as AttemptRow[]) ?? [])
      setPurchases((p.data as PurchaseRow[]) ?? [])
      setDataLoading(false)
    })
  }, [user])

  const now = Date.now()
  const active = attempts.filter((a) => new Date(a.expires_at).getTime() > now)
  const name = user?.user_metadata?.name as string | undefined

  return (
    <>
      <Header />
      <main className="flex-grow pb-28 pt-12 sm:pt-16">
        <div className="container-x">
          {loading ? (
            <div className="h-64 animate-pulse rounded-4xl bg-white shadow-soft" />
          ) : !user ? (
            <div className="rounded-4xl bg-white px-6 py-20 text-center shadow-soft ring-1 ring-black/[0.05]">
              <h1 className="text-4xl font-semibold">Tu panel te espera.</h1>
              <p className="mt-3 text-ink-500">Ingresa para ver tus créditos y tus tests.</p>
              <button type="button" onClick={() => openAuth('login')} className="btn-primary mt-8 px-7 py-3.5">
                Ingresar
              </button>
            </div>
          ) : (
            <>
              <p className="eyebrow animate-fade-up">Mi panel</p>
              <h1 className="delay-1 mt-3 animate-fade-up text-5xl font-semibold tracking-tightest sm:text-6xl">
                Hola{name ? `, ${name.split(' ')[0]}` : ''}.
              </h1>

              <div className="delay-2 mt-10 grid animate-fade-up gap-5 lg:grid-cols-[1.4fr,1fr]">
                <div className="relative overflow-hidden rounded-4xl bg-ink-900 p-8 text-white shadow-lift sm:p-10">
                  <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full bg-brand/40 blur-3xl" />
                  <p className="relative text-sm text-white/55">Créditos disponibles</p>
                  <p className="relative mt-2 font-display text-8xl font-semibold leading-none tracking-tightest">{credits ?? '–'}</p>
                  <p className="relative mt-4 max-w-sm text-sm text-white/55">Cada crédito abre un test completo durante 24 horas.</p>
                  <div className="relative mt-8 flex flex-wrap gap-3">
                    <Link href="/tests" className="btn-primary">Usar un crédito</Link>
                    <Link href="/precios" className="btn-ghost-dark">Comprar más</Link>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <Stat label="Tests realizados" value={dataLoading ? '–' : String(attempts.length)} />
                  <Stat label="En curso" value={dataLoading ? '–' : String(active.length)} />
                  <div className="col-span-2 rounded-4xl bg-white p-6 shadow-soft ring-1 ring-black/[0.05]">
                    <p className="text-xs text-ink-400">Cuenta</p>
                    <p className="mt-1.5 truncate font-medium">{user.email}</p>
                  </div>
                </div>
              </div>

              {active.length > 0 && (
                <Section title="Continúa donde quedaste">
                  <div className="grid gap-4 md:grid-cols-2">
                    {active.map((a) => {
                      const t = getCatalogTest(a.test_id)
                      return (
                        <Link key={a.id} href={`/tests/${a.test_id}`} className="group flex items-center gap-4 rounded-3xl bg-white p-5 shadow-soft ring-1 ring-black/[0.05] transition hover:-translate-y-0.5 hover:shadow-lift">
                          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-soft text-brand-deep">
                            {t && <TestIcon name={t.icon} />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-semibold">{t?.name ?? a.test_id}</span>
                            <span className="block text-sm text-ink-400">
                              Hasta {new Date(a.expires_at).toLocaleString('es-CO', { weekday: 'short', hour: 'numeric', minute: '2-digit' })}
                            </span>
                          </span>
                          <span className="text-sm font-semibold text-brand-deep transition group-hover:translate-x-0.5">Continuar →</span>
                        </Link>
                      )
                    })}
                  </div>
                </Section>
              )}

              <Section title="Historial de tests">
                {dataLoading ? (
                  <div className="h-24 animate-pulse rounded-3xl bg-white" />
                ) : attempts.length === 0 ? (
                  <Empty text="Aún no has comenzado ningún test." cta={{ href: '/tests', label: 'Explorar tests' }} />
                ) : (
                  <List>
                    {attempts.map((a) => {
                      const t = getCatalogTest(a.test_id)
                      const isActive = new Date(a.expires_at).getTime() > now
                      return (
                        <li key={a.id} className="flex items-center justify-between gap-4 px-6 py-4">
                          <span className="min-w-0">
                            <span className="block truncate font-medium">{t?.name ?? a.test_id}</span>
                            <span className="text-sm text-ink-400">{dateFmt(a.started_at)}</span>
                          </span>
                          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-ink-100 text-ink-500'}`}>
                            {isActive ? 'En curso' : 'Cerrado'}
                          </span>
                        </li>
                      )
                    })}
                  </List>
                )}
              </Section>

              <Section title="Compras">
                {dataLoading ? (
                  <div className="h-24 animate-pulse rounded-3xl bg-white" />
                ) : purchases.length === 0 ? (
                  <Empty text="Todavía no has comprado créditos." cta={{ href: '/precios', label: 'Ver paquetes' }} />
                ) : (
                  <List>
                    {purchases.map((p) => (
                      <li key={p.id} className="flex items-center justify-between gap-4 px-6 py-4">
                        <span>
                          <span className="block font-medium">
                            Paquete {getPack(p.pack_id)?.name ?? ''} · {p.delta} {p.delta === 1 ? 'crédito' : 'créditos'}
                          </span>
                          <span className="text-sm text-ink-400">{dateFmt(p.created_at)}</span>
                        </span>
                        <span className="font-display font-semibold tracking-tighter">${Number(p.amount ?? 0).toFixed(2)}</span>
                      </li>
                    ))}
                  </List>
                )}
              </Section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-4xl bg-white p-6 shadow-soft ring-1 ring-black/[0.05]">
      <p className="text-xs text-ink-400">{label}</p>
      <p className="mt-2 font-display text-5xl font-semibold tracking-tightest">{value}</p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14">
      <h2 className="mb-5 text-2xl font-semibold">{title}</h2>
      {children}
    </section>
  )
}

function List({ children }: { children: React.ReactNode }) {
  return <ul className="divide-y divide-black/[0.06] overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-black/[0.05]">{children}</ul>
}

function Empty({ text, cta }: { text: string; cta: { href: string; label: string } }) {
  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-3xl bg-white px-6 py-6 shadow-soft ring-1 ring-black/[0.05] sm:flex-row sm:items-center">
      <p className="text-ink-500">{text}</p>
      <Link href={cta.href} className="btn-dark px-5 py-2.5 text-sm">{cta.label}</Link>
    </div>
  )
}
