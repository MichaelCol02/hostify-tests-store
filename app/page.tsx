import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TestCard from '@/components/TestCard'
import PricingCards from '@/components/PricingCards'
import ReportPreview from '@/components/ReportPreview'
import { CATALOG } from '@/lib/catalog'

const PALABRAS = ['cero','una','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez']
const cuantos = PALABRAS[CATALOG.length] ?? String(CATALOG.length)
const Cuantos = cuantos.charAt(0).toUpperCase() + cuantos.slice(1)

const STEPS = [
  { n: '01', title: 'Elige tus créditos', body: 'Un test por $5, tres por $9 o diez por $15. Pagas una vez y los usas cuando quieras.' },
  { n: '02', title: 'Responde a tu ritmo', body: 'Cada crédito abre un test completo durante 24 horas. Sin prisas, desde cualquier dispositivo.' },
  { n: '03', title: 'Recibe tu resultado', body: 'Tu perfil y un plan de desarrollo al terminar. Repite el test o compártelo con tu equipo.' },
]

const FAQ = [
  { q: '¿Qué es un crédito?', a: 'Un crédito equivale a un test completo. Lo gastas al comenzar y el test queda abierto 24 horas para que lo termines, incluso si cierras la ventana.' },
  { q: '¿Puedo usar los créditos en tests distintos?', a: 'Sí. Tus créditos sirven para cualquiera de los tests, y también para repetir el mismo test más adelante o evaluar a otra persona de tu equipo.' },
  { q: '¿Los créditos vencen?', a: 'No. Quedan en tu cuenta hasta que los uses.' },
  { q: '¿Cómo pago?', a: 'Con tarjeta, a través de Stripe. Nunca vemos ni guardamos los datos de tu tarjeta.' },
]

export default function Home() {
  return (
    <>
      <Header tone="dark" />
      <main className="flex-grow">
        {/* Hero */}
        <section className="relative overflow-hidden bg-ink-900 pb-24 pt-16 text-white sm:pb-32 sm:pt-24">
          <div aria-hidden="true" className="bg-grid mask-fade-b pointer-events-none absolute inset-0" />
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[-18rem] h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-brand/25 blur-[140px]" />

          <div className="container-x relative text-center">
            <Link
              href="/precios"
              className="inline-flex animate-fade-up items-center gap-2 rounded-full bg-white/[0.07] py-1.5 pl-1.5 pr-4 text-sm text-white/80 ring-1 ring-white/10 backdrop-blur transition hover:bg-white/10"
            >
              <span className="rounded-full bg-gradient-to-b from-brand to-brand-deep px-2.5 py-0.5 text-xs font-semibold text-white">Nuevo</span>
              Tests desde $1.50 con créditos
              <span aria-hidden="true" className="text-white/40">→</span>
            </Link>

            <h1 className="delay-1 mx-auto mt-8 max-w-4xl animate-fade-up text-5xl font-semibold leading-[1.02] tracking-tightest text-white sm:text-7xl lg:text-[5.5rem]">
              Descubre el talento que hace grande tu <span className="text-gradient">hospitalidad.</span>
            </h1>
            <p className="delay-2 mx-auto mt-7 max-w-2xl animate-fade-up text-lg leading-relaxed text-white/60 sm:text-xl">
              {Cuantos} evaluaciones de liderazgo, perfil conductual e inteligencia de hospitalidad. Resultados al instante para ti y todo tu equipo.
            </p>
            <div className="delay-3 mt-10 flex animate-fade-up flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/tests" className="btn-primary px-7 py-3.5 text-base">
                Explorar tests
              </Link>
              <Link href="/precios" className="btn-ghost-dark px-7 py-3.5 text-base">
                Ver precios
              </Link>
            </div>

            <div className="delay-4 mt-20 animate-fade-up">
              <ReportPreview />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-black/[0.06] bg-white">
          <div className="container-x grid grid-cols-2 gap-y-8 py-12 text-center lg:grid-cols-4">
            {[
              { k: String(CATALOG.length), v: 'evaluaciones especializadas' },
              { k: '<30 min', v: 'por test completo' },
              { k: '24 h', v: 'para terminar a tu ritmo' },
              { k: '$1.50', v: 'por test en paquete Equipo' },
            ].map((s) => (
              <div key={s.v}>
                <p className="font-display text-4xl font-semibold tracking-tightest sm:text-5xl">{s.k}</p>
                <p className="mt-2 text-sm text-ink-500">{s.v}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tests */}
        <section className="py-24 sm:py-32">
          <div className="container-x">
            <div className="max-w-2xl">
              <p className="eyebrow">Los tests</p>
              <h2 className="mt-4 text-4xl font-semibold leading-[1.05] sm:text-6xl">
                {Cuantos} miradas.
                <br />
                <span className="text-ink-400">Un mismo propósito.</span>
              </h2>
            </div>
            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {CATALOG.map((test, i) => (
                <div key={test.id} className={i === 0 ? 'md:col-span-2 lg:col-span-2' : ''}>
                  <TestCard test={test} featured={i === 0} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-white py-24 sm:py-32">
          <div className="container-x">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Cómo funciona</p>
              <h2 className="mt-4 text-4xl font-semibold leading-[1.05] sm:text-6xl">Simple. Como debe ser.</h2>
            </div>
            <div className="mt-16 grid gap-5 md:grid-cols-3">
              {STEPS.map((s) => (
                <div key={s.n} className="rounded-4xl bg-ink-100 p-8 sm:p-10">
                  <span className="font-display text-sm font-semibold text-brand-deep">{s.n}</span>
                  <h3 className="mt-6 text-2xl font-semibold">{s.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-500">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="precios" className="py-24 sm:py-32">
          <div className="container-x">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Precios</p>
              <h2 className="mt-4 text-4xl font-semibold leading-[1.05] sm:text-6xl">
                Más tests. <span className="text-gradient">Menos por cada uno.</span>
              </h2>
              <p className="mt-5 text-lg text-ink-500">Un pago único. Sin suscripciones. Tus créditos no vencen.</p>
            </div>
            <div className="mt-16">
              <PricingCards />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-24 sm:py-28">
          <div className="container-x grid gap-12 lg:grid-cols-[1fr,1.4fr]">
            <div>
              <p className="eyebrow">Preguntas</p>
              <h2 className="mt-4 text-4xl font-semibold leading-[1.05] sm:text-5xl">Lo que suelen preguntarnos.</h2>
            </div>
            <div className="divide-y divide-black/[0.07]">
              {FAQ.map((f) => (
                <details key={f.q} className="group py-6 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold">
                    {f.q}
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink transition group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-500">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-5 py-24 sm:px-8">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] bg-ink-900 px-8 py-20 text-center text-white sm:py-24">
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[80%] -translate-x-1/2 rounded-full bg-brand/45 blur-[110px]" />
            <h2 className="relative mx-auto max-w-3xl text-4xl font-semibold leading-[1.05] text-white sm:text-6xl">
              Tu equipo ya hace sentir a otros como en casa.
            </h2>
            <p className="relative mx-auto mt-5 max-w-xl text-lg text-white/60">Ahora conoce exactamente cómo lo logra.</p>
            <Link href="/tests" className="btn-primary relative mt-10 px-8 py-4 text-base">
              Comenzar ahora
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
