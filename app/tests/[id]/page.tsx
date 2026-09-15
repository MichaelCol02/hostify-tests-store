import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TestIcon from '@/components/TestIcon'
import TestAccess from '@/components/TestAccess'
import { CATALOG, getCatalogTest } from '@/lib/catalog'

export function generateStaticParams() {
  return CATALOG.map((t) => ({ id: t.id }))
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const test = getCatalogTest(params.id)
  return test ? { title: `${test.name} — Hostify Tests`, description: test.description } : {}
}

export default function TestPage({ params }: { params: { id: string } }) {
  const test = getCatalogTest(params.id)
  if (!test) notFound()

  return (
    <>
      <Header />
      <main className="flex-grow">
        <section className="pb-12 pt-10 sm:pt-16">
          <div className="container-x">
            <Link href="/tests" className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition hover:text-ink">
              <span aria-hidden="true">←</span> Todos los tests
            </Link>

            <div className="mt-8 grid items-end gap-10 lg:grid-cols-[1.3fr,1fr]">
              <div className="animate-fade-up">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand-deep">
                  <TestIcon name={test.icon} className="h-7 w-7" />
                </span>
                <p className="eyebrow mt-8">{test.kicker}</p>
                <h1 className="mt-3 text-5xl font-semibold leading-[1.02] tracking-tightest sm:text-6xl">{test.name}</h1>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-500">{test.description}</p>
              </div>

              <dl className="delay-1 grid animate-fade-up grid-cols-3 gap-3">
                {[
                  { k: 'Duración', v: test.duration },
                  { k: 'Preguntas', v: String(test.questions) },
                  { k: 'Costo', v: '1 crédito' },
                ].map((s) => (
                  <div key={s.k} className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-black/[0.05]">
                    <dt className="text-xs text-ink-400">{s.k}</dt>
                    <dd className="mt-1.5 font-display text-lg font-semibold tracking-tighter">{s.v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="delay-2 mt-8 flex animate-fade-up flex-wrap gap-2">
              {test.modules.map((m) => (
                <span key={m} className="rounded-full bg-white px-3.5 py-1.5 text-sm text-ink-700 ring-1 ring-black/[0.07]">
                  {m}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-28">
          <div className="container-x delay-3 animate-fade-up">
            <TestAccess testId={test.id} testName={test.name} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
