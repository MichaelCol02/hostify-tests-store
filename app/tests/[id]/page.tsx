import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TestIcon from '@/components/TestIcon'
import TestAccess from '@/components/TestAccess'
import { CATALOG, estaPublicado, fechaLarga, getCatalogTest } from '@/lib/catalog'
import { formatPrecio, getCheapestPerTest, getTestPrice, MONEDA } from '@/lib/pricing'
import StickyBuyBar from '@/components/StickyBuyBar'


/** La oferta entra y sale por fecha, asi que la pagina se rehace sola cada 10
 *  minutos. Sin esto habria que publicar a mano el dia que empieza y el que termina. */
export const revalidate = 600
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
  const aLaVenta = estaPublicado(test)
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
          availability: aLaVenta ? 'https://schema.org/InStock' : 'https://schema.org/PreOrder',
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

        {test.video && (
          <section className="pb-16">
            <div className="container-x">
              <div className="grid items-center gap-10 rounded-4xl bg-ink-900 p-6 text-white shadow-lift sm:p-10 lg:grid-cols-[auto,1fr] lg:gap-14">
                <video
                  className="mx-auto aspect-[9/16] w-full max-w-[320px] rounded-[1.75rem] bg-black object-cover ring-1 ring-white/10"
                  src={test.video.src}
                  poster={test.video.poster}
                  controls
                  playsInline
                  preload="none"
                />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">En video</p>
                  <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">{test.video.titulo}</h2>
                  <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/65">{test.video.texto}</p>
                  {aLaVenta && (
                    <a href="#empezar" className="mt-8 inline-flex rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:bg-brand-deep">
                      Hacer el test
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        <section id="empezar" className="scroll-mt-20 pb-28">
          <div className="container-x delay-3 animate-fade-up">
            {!aLaVenta ? (
              <div className="rounded-4xl bg-ink-900 p-8 text-white shadow-lift sm:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">Próximo lanzamiento</p>
                <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">Llega el {fechaLarga(test)}.</h2>
                <p className="mt-4 max-w-xl text-white/65">{test.deliver}</p>
                <p className="mt-4 max-w-xl text-white/65">
                  Ese día se abre aquí mismo. Si ya tienes créditos, te sirven para este test.
                </p>
                <Link href="/precios" className="mt-7 inline-flex rounded-full bg-brand px-6 py-3 font-semibold text-white">
                  Ver paquetes de créditos
                </Link>
              </div>
            ) : (
            <>
            <ul className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-400">
              {['Pago único', 'Sin suscripción', 'Resultado al terminar'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-1 w-1 rounded-full bg-brand" />
                  {t}
                </li>
              ))}
            </ul>
            <TestAccess test={test} />
            </>
            )}
          </div>
        </section>
      </main>
      {aLaVenta && <StickyBuyBar test={test} />}
      <Footer />
    </>
  )
}
