import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TestIcon from '@/components/TestIcon'
import TestAccess from '@/components/TestAccess'
import { CATALOG, getCatalogTest } from '@/lib/catalog'
import { formatPrecio, getCheapestPerTest, getTestPrice, MONEDA } from '@/lib/pricing'
import StickyBuyBar from '@/components/StickyBuyBar'

export function generateStaticParams() {
  return CATALOG.map((t) => ({ id: t.id }))
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const test = getCatalogTest(params.id)
  if (!test) return {}
  const title = `${test.name} — Hostify Tests`
  return {
    title,
    description: test.description,
    alternates: { canonical: `/tests/${test.id}` },
    openGraph: {
      type: 'website',
      locale: 'es_CO',
      siteName: 'Hostify Tests',
      title,
      description: test.description,
      url: `/tests/${test.id}`,
    },
    twitter: { card: 'summary_large_image', title, description: test.description },
  }
}

export default function TestPage({ params }: { params: { id: string } }) {
  const test = getCatalogTest(params.id)
  if (!test) notFound()

  const precio = getTestPrice(test.credits)
  const faq = [
    {
      q: '¿Cuánto cuesta este test?',
      a: `${formatPrecio(precio)} ${MONEDA}${test.people > 1 ? ', e incluye a las dos personas' : ''}. Si compras varios de una vez, el precio por test baja hasta ${formatPrecio(getCheapestPerTest())}.`,
    },
    { q: '¿Cuánto tiempo tengo para responderlo?', a: 'Al comenzar, el test queda abierto 24 horas. Puedes cerrar la ventana y volver sin gastar otro crédito.' },
    { q: '¿Qué recibo al terminar?', a: test.deliver },
    { q: '¿Para quién es este test?', a: test.idealFor },
  ]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: test.name,
        description: test.description,
        category: 'Evaluación de talento',
        brand: { '@type': 'Brand', name: 'Hostify' },
        offers: {
          '@type': 'Offer',
          price: precio.toFixed(2),
          priceCurrency: MONEDA,
          availability: 'https://schema.org/InStock',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
                  { k: test.people > 1 ? 'Preguntas c/u' : 'Preguntas', v: String(test.questions) },
                  {
                    k: 'Precio',
                    v: `${formatPrecio(precio)} ${MONEDA}`,
                    nota: test.people > 1 ? 'incluye a los dos' : `o ${formatPrecio(getCheapestPerTest())} por test en el paquete Equipo`,
                  },
                ].map((s) => (
                  <div key={s.k} className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-black/[0.05]">
                    <dt className="text-xs text-ink-400">{s.k}</dt>
                    <dd className="mt-1.5 font-display text-lg font-semibold tracking-tighter">{s.v}</dd>
                    {s.nota && <dd className="mt-0.5 text-xs text-brand-deep">{s.nota}</dd>}
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

        <section id="empezar" className="scroll-mt-20 pb-28">
          <div className="container-x delay-3 animate-fade-up">
            <ul className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-400">
              {['Pago único', 'Sin suscripción', 'Resultado al terminar'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-1 w-1 rounded-full bg-brand" />
                  {t}
                </li>
              ))}
            </ul>
            <TestAccess test={test} />
          </div>
        </section>
      </main>
      <StickyBuyBar test={test} />
      <Footer />
    </>
  )
}
