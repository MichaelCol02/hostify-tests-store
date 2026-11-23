import Link from 'next/link'
import { esNuevo, estaPublicado, fechaLarga, type CatalogTest } from '@/lib/catalog'
import { formatPrecio, getTestPrice } from '@/lib/pricing'
import TestIcon from './TestIcon'
import { tonoDe } from '@/lib/tonos'

export default function TestCard({ test, featured = false }: { test: CatalogTest; featured?: boolean }) {
  const proximo = !estaPublicado(test)
  const nuevo = esNuevo(test)
  const tono = tonoDe(test.id)
  return (
    <Link
      href={`/tests/${test.id}`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-4xl p-7 transition-all duration-500 ease-out hover:-translate-y-1 sm:p-8 ${
        featured
          ? 'bg-ink-900 text-white shadow-lift'
          : 'bg-white shadow-soft ring-1 ring-black/[0.05] hover:shadow-lift'
      }`}
    >
      {featured ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-50 blur-3xl transition-opacity duration-700 group-hover:opacity-70"
          style={{ background: tono.c }}
        />
      ) : (
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5" style={{ background: tono.c }} />
      )}

      <div className="relative flex items-start justify-between">
        <span
          className="flex h-12 w-12 items-center justify-center rounded-2xl"
          style={featured ? { background: 'rgba(255,255,255,.1)', color: tono.c } : { background: tono.suave, color: tono.texto }}
        >
          <TestIcon name={test.icon} />
        </span>
        <span className="flex items-center gap-2">
          {(proximo || nuevo) && (
            <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white" style={{ background: tono.c }}>
              {proximo ? `Llega el ${fechaLarga(test)}` : 'Nuevo'}
            </span>
          )}
          <span className={`text-xs font-medium ${featured ? 'text-white/50' : 'text-ink-400'}`}>{test.duration}</span>
        </span>
      </div>

      <p className="relative mt-8 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: featured ? tono.c : tono.texto }}>
        {test.kicker}
      </p>
      <h3 className={`relative mt-2 text-2xl font-semibold leading-tight ${featured ? 'text-white' : ''}`}>{test.name}</h3>
      <p className={`relative mt-3 text-[15px] leading-relaxed ${featured ? 'text-white/65' : 'text-ink-500'}`}>
        {test.description}
      </p>

      <div className="relative mt-auto flex items-center justify-between pt-8">
        <span className={`text-sm ${featured ? 'text-white/50' : 'text-ink-400'}`}>
          {test.questions} preguntas · {formatPrecio(getTestPrice(test.credits))}
          {test.people > 1 && ' · para los dos'}
        </span>
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-all duration-500 group-hover:translate-x-0.5"
          style={{ background: tono.c }}
          aria-hidden="true"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
