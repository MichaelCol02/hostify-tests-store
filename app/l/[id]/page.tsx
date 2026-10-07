import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Logo from '@/components/Logo'
import TestIcon from '@/components/TestIcon'
import LandingBuy from '@/components/LandingBuy'
import WhatsAppButton from '@/components/WhatsAppButton'
import { getCatalogTest } from '@/lib/catalog'
import { LANDINGS, getLanding } from '@/lib/landings'
import { formatUsd, getTestPrice } from '@/lib/pricing'

export function generateStaticParams() {
  return LANDINGS.map((l) => ({ id: l.testId }))
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const landing = getLanding(params.id)
  const test = getCatalogTest(params.id)
  if (!landing || !test) return {}
  const title = `${test.name} — ${landing.titular} ${landing.resaltado}`
  return {
    title,
    description: landing.subtitulo,
    alternates: { canonical: `/l/${test.id}` },
    openGraph: { type: 'website', locale: 'es_CO', siteName: 'Hostify Tests', title, description: landing.subtitulo },
  }
}

export default function LandingPage({ params }: { params: { id: string } }) {
  const landing = getLanding(params.id)
  const test = getCatalogTest(params.id)
  if (!landing || !test) notFound()

  const precio = getTestPrice(test.credits)

  return (
    <>
      {/* Sin menú a propósito: en una landing de campaña cada enlace extra es una fuga. */}
      <header className="border-b border-white/5 bg-ink-900">
        <div className="container-x flex h-16 items-center justify-between">
          <Logo tone="light" />
          <span className="text-sm text-white/40">{test.duration}</span>
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative overflow-hidden bg-ink-900 pb-20 pt-16 text-white sm:pb-28 sm:pt-20">
          <div aria-hidden="true" className="bg-grid mask-fade-b pointer-events-none absolute inset-0" />
          <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[-16rem] h-[32rem] w-[52rem] -translate-x-1/2 rounded-full bg-brand/25 blur-[130px]" />

          <div className="container-x relative max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-4 py-1.5 text-sm text-white/75 ring-1 ring-white/10">
              <TestIcon name={test.icon} className="h-4 w-4" />
              {landing.gancho}
            </span>
            <h1 className="delay-1 mt-7 animate-fade-up text-5xl font-semibold leading-[1.03] tracking-tightest text-white sm:text-6xl lg:text-7xl">
              {landing.titular} <span className="text-gradient">{landing.resaltado}</span>
            </h1>
            <p className="delay-2 mx-auto mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-white/60">
              {landing.subtitulo}
            </p>
            <div className="delay-3 mt-9 animate-fade-up">
              <LandingBuy test={test} />
            </div>
            <ul className="delay-4 mt-6 flex animate-fade-up flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/45">
              {[`${test.questions} preguntas`, 'Resultado al terminar', 'Pago único, sin suscripción'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span aria-hidden="true" className="h-1 w-1 rounded-full bg-brand" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Prueba de producto: el informe real, no una promesa */}
        <section className="bg-white py-20 sm:py-28">
          <div className="container-x">
            <div className="mx-auto max-w-2xl text-center">
              <p className="eyebrow">Esto es lo que recibes</p>
              <h2 className="mt-4 text-4xl font-semibold leading-[1.06] sm:text-5xl">El informe, por dentro.</h2>
              <p className="mt-4 text-[17px] text-ink-500">
                Capturas reales del resultado. No es una muestra inventada: es lo que ves al terminar.
              </p>
            </div>
            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {landing.imagenes.map((img) => (
                <figure key={img.src} className="overflow-hidden rounded-4xl bg-ink-50 shadow-soft ring-1 ring-black/[0.05]">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={800}
                    height={553}
                    className="w-full"
                    sizes="(min-width: 1024px) 33vw, 100vw"
                  />
                  <figcaption className="px-5 py-4 text-sm text-ink-500">{img.pie}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-28">
          <div className="container-x grid gap-12 lg:grid-cols-[1fr,1.3fr]">
            <div>
              <p className="eyebrow">Lo que vas a descubrir</p>
              <h2 className="mt-4 text-4xl font-semibold leading-[1.06] sm:text-5xl">Cinco cosas que hoy no sabes de ti.</h2>
            </div>
            <ul className="space-y-5">
              {landing.descubres.map((d, i) => (
                <li key={d} className="flex gap-4 border-b border-black/[0.06] pb-5 last:border-0">
                  <span className="font-display text-lg font-semibold text-brand-deep">0{i + 1}</span>
                  <span className="text-[17px] leading-relaxed text-ink-700">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-white py-20 sm:py-24">
          <div className="container-x grid gap-6 md:grid-cols-2">
            <div className="rounded-4xl bg-ink-50 p-8 ring-1 ring-black/[0.04] sm:p-10">
              <h3 className="text-2xl font-semibold">Es para ti si…</h3>
              <ul className="mt-6 space-y-3">
                {landing.paraQuien.map((t) => (
                  <li key={t} className="flex gap-3 text-[16px] text-ink-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-4xl bg-ink-50 p-8 ring-1 ring-black/[0.04] sm:p-10">
              <h3 className="text-2xl font-semibold text-ink-500">No es para ti si…</h3>
              <ul className="mt-6 space-y-3">
                {landing.noEsPara.map((t) => (
                  <li key={t} className="flex gap-3 text-[16px] text-ink-500">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-300" aria-hidden="true" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-20 sm:py-24">
          <div className="container-x grid gap-10 lg:grid-cols-[1fr,1.4fr]">
            <h2 className="text-4xl font-semibold leading-[1.06] sm:text-5xl">Antes de empezar.</h2>
            <div className="divide-y divide-black/[0.07]">
              {landing.faq.map((f) => (
                <details key={f.q} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold">
                    {f.q}
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-100 transition group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-ink-500">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-24 sm:px-8">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.5rem] bg-ink-900 px-8 py-16 text-center text-white sm:py-20">
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/2 h-72 w-[80%] -translate-x-1/2 rounded-full bg-brand/40 blur-[110px]" />
            <h2 className="relative mx-auto max-w-2xl text-4xl font-semibold leading-[1.06] text-white sm:text-5xl">
              {formatUsd(precio)} una vez. El informe es tuyo para siempre.
            </h2>
            <div className="relative mt-9 flex justify-center">
              <LandingBuy test={test} />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/[0.06] bg-ink-50 py-8">
        <div className="container-x flex flex-col gap-3 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Hostify · Pago seguro con Stripe</p>
          <div className="flex gap-4">
            <Link href="/legal/terminos" className="hover:text-ink">Términos</Link>
            <Link href="/legal/privacidad" className="hover:text-ink">Datos</Link>
            <Link href="/tests" className="hover:text-ink">Todos los tests</Link>
          </div>
        </div>
      </footer>
      <WhatsAppButton />
    </>
  )
}
