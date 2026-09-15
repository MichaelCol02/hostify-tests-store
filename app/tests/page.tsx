import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TestCard from '@/components/TestCard'
import { CATALOG } from '@/lib/catalog'

export const metadata: Metadata = {
  title: 'Tests — Hostify',
  description: 'Cinco evaluaciones para líderes y equipos de hospitalidad.',
}

export default function TestsPage() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <section className="pb-10 pt-16 sm:pt-24">
          <div className="container-x">
            <p className="eyebrow animate-fade-up">Catálogo</p>
            <h1 className="delay-1 mt-4 max-w-3xl animate-fade-up text-5xl font-semibold leading-[1.02] tracking-tightest sm:text-7xl">
              Todos los tests.
            </h1>
            <p className="delay-2 mt-6 max-w-xl animate-fade-up text-lg text-ink-500">
              Cada test completo usa 1 crédito.{' '}
              <Link href="/precios" className="font-semibold text-brand-deep hover:underline">
                Desde $1.50 por test →
              </Link>
            </p>
          </div>
        </section>

        <section className="pb-28">
          <div className="container-x grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {CATALOG.map((test) => (
              <TestCard key={test.id} test={test} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
