'use client'

import Link from 'next/link'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CATALOG } from '@/lib/catalog'

const SITIO = 'https://hostifycol.netlify.app'

function Formulario() {
  const params = useSearchParams()
  const testId = params.get('test')
  const test = CATALOG.find((t) => t.id === testId)

  const [estrellas, setEstrellas] = useState(0)
  const [sobre, setSobre] = useState(0) // estrella bajo el cursor
  const [comentario, setComentario] = useState('')
  const [nombre, setNombre] = useState('')
  const [publicar, setPublicar] = useState(false)
  const [estado, setEstado] = useState<'inicial' | 'enviando' | 'listo' | 'error'>('inicial')

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!estrellas) return
    setEstado('enviando')
    try {
      const res = await fetch('/api/opinion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: estrellas, comment: comentario, name: nombre, testId, mayPublish: publicar }),
      })
      setEstado(res.ok ? 'listo' : 'error')
    } catch {
      setEstado('error')
    }
  }

  if (estado === 'listo') return <Gracias estrellas={estrellas} />

  return (
    <div className="relative mx-auto max-w-xl overflow-hidden rounded-[2.5rem] bg-white px-6 py-12 shadow-lift ring-1 ring-black/[0.05] sm:px-10 sm:py-14">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[80%] -translate-x-1/2 rounded-full bg-brand/15 blur-3xl" />
      <div className="relative">
        <p className="eyebrow">Tu opinión</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tightest sm:text-4xl">
          {test ? `¿Qué te pareció ${test.name}?` : '¿Qué te pareció la experiencia?'}
        </h1>
        <p className="mt-3 text-ink-500">
          Toma menos de un minuto y nos sirve para mejorar lo que sigue. No pedimos cuenta ni correo.
        </p>

        <form onSubmit={enviar} className="mt-8">
          <fieldset>
            <legend className="text-sm font-medium text-ink-700">Tu calificación</legend>
            <div className="mt-3 flex gap-1.5" onMouseLeave={() => setSobre(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setEstrellas(n)}
                  onMouseEnter={() => setSobre(n)}
                  aria-label={`${n} ${n === 1 ? 'estrella' : 'estrellas'}`}
                  aria-pressed={estrellas === n}
                  className="rounded-xl p-1 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                >
                  <Estrella encendida={n <= (sobre || estrellas)} />
                </button>
              ))}
            </div>
            {estrellas > 0 && (
              <p className="mt-2 text-sm text-ink-500">
                {['', 'Nada bien.', 'Puede mejorar.', 'Está bien.', 'Muy bueno.', '¡Excelente!'][estrellas]}
              </p>
            )}
          </fieldset>

          <label className="mt-7 block">
            <span className="text-sm font-medium text-ink-700">¿Qué te llevas? <span className="font-normal text-ink-400">(opcional)</span></span>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={4}
              maxLength={1000}
              className="field mt-2 w-full resize-y"
              placeholder="Lo que más te sirvió, o lo que le falta."
            />
          </label>

          <label className="mt-5 block">
            <span className="text-sm font-medium text-ink-700">Tu nombre <span className="font-normal text-ink-400">(opcional)</span></span>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={80}
              className="field mt-2 w-full"
              placeholder="Como quieres que aparezca"
            />
          </label>

          <label className="mt-5 flex items-start gap-3 text-sm text-ink-600">
            <input
              type="checkbox"
              checked={publicar}
              onChange={(e) => setPublicar(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink-300 text-brand focus:ring-brand"
            />
            <span>Pueden publicar mi comentario en la página. Sin permiso no se publica nada.</span>
          </label>

          <button type="submit" disabled={!estrellas || estado === 'enviando'} className="btn-primary mt-8 w-full py-3.5 disabled:opacity-40">
            {estado === 'enviando' ? 'Enviando…' : 'Enviar mi calificación'}
          </button>
          {!estrellas && <p className="mt-3 text-center text-sm text-ink-400">Elige de una a cinco estrellas para continuar.</p>}
          {estado === 'error' && <p className="mt-3 text-center text-sm text-red-600">No se pudo enviar. Intenta de nuevo en un momento.</p>}
        </form>
      </div>
    </div>
  )
}

/** Después de calificar, el momento exacto en que alguien recomienda: ya vio su
 *  resultado y acaba de decir que le gustó. Pedirlo antes es pedirlo en frío. */
function Gracias({ estrellas }: { estrellas: number }) {
  const [copiado, setCopiado] = useState(false)
  const mensaje = `Hice un test de Hostify y me gustó el resultado. Te lo dejo por si quieres probarlo: ${SITIO}`

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(SITIO)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      setCopiado(false)
    }
  }

  return (
    <div className="relative mx-auto max-w-xl overflow-hidden rounded-[2.5rem] bg-white px-6 py-14 text-center shadow-lift ring-1 ring-black/[0.05] sm:px-10">
      <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[80%] -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
      <div className="relative">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-b from-brand to-brand-deep shadow-glow">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="mt-7 text-3xl font-semibold tracking-tightest sm:text-4xl">Gracias.</h1>
        <p className="mx-auto mt-3 max-w-sm text-ink-500">
          {estrellas >= 4
            ? 'Nos alegra que te sirviera. Si conoces a alguien a quien le vendría bien, pásale la página.'
            : 'Gracias por decirlo de frente. Lo que escribiste lo leemos y nos sirve para corregir.'}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(mensaje)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-6 py-3.5"
          >
            Compartir por WhatsApp
          </a>
          <button type="button" onClick={copiar} className="btn-ghost px-6 py-3.5">
            {copiado ? '¡Enlace copiado!' : 'Copiar el enlace'}
          </button>
        </div>

        <Link href="/tests" className="mt-8 inline-block text-sm font-medium text-brand-deep hover:underline">
          Ver los demás tests
        </Link>
      </div>
    </div>
  )
}

function Estrella({ encendida }: { encendida: boolean }) {
  return (
    <svg width="38" height="38" viewBox="0 0 24 24" aria-hidden="true" className={encendida ? 'text-brand' : 'text-ink-300'}>
      <path
        d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9L12 2.6z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function OpinarPage() {
  return (
    <>
      <Header />
      <main className="flex-grow px-5 py-16 sm:py-24">
        <Suspense fallback={<div className="mx-auto h-[32rem] max-w-xl animate-pulse rounded-[2.5rem] bg-white" />}>
          <Formulario />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
