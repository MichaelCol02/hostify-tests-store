import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PricingCards from '@/components/PricingCards'

export const metadata: Metadata = {
  title: 'Precios — Hostify Tests',
  description: '1 test por $5, 3 tests por $9, 10 tests por $15. Pago único, créditos sin vencimiento.',
}

const INCLUDED = [
  'Acceso a los diez tests',
  'Cada test abierto 24 horas',
  'Resultados al terminar',
  'Repite tests o evalúa a tu equipo',
  'Pago seguro con Stripe',
  'Créditos sin vencimiento',
]

export default function PreciosPage() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <section className="pb-16 pt-16 text-center sm:pt-24">
          <div className="container-x">
            <p className="eyebrow animate-fade-up">Precios</p>
            <h1 className="delay-1 mx-auto mt-4 max-w-4xl animate-fade-up text-5xl font-semibold leading-[1.02] tracking-tightest sm:text-7xl">
              Paga por tests. <span className="text-gradient">No por meses.</span>
            </h1>
            <p className="delay-2 mx-auto mt-6 max-w-xl animate-fade-up text-lg text-ink-500">
              Compra créditos una vez y úsalos en cualquier test, cuando lo necesites.
            </p>
          </div>
        </section>

        <section className="pb-20">
          <div className="container-x delay-3 animate-fade-up">
            <PricingCards />
          </div>
        </section>

        <section className="pb-28">
          <div className="container-x">
            <div className="rounded-4xl bg-white p-8 shadow-soft ring-1 ring-black/[0.05] sm:p-12">
              <h2 className="text-2xl font-semibold sm:text-3xl">Todo incluido en cada crédito.</h2>
              <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[15px] text-ink-700">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-deep">
                      <svg width="11" height="11" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                        <path d="M2 5.2 4.1 7.3 8 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
