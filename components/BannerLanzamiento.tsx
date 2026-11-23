import Link from 'next/link'
import { publicados, esNuevo } from '@/lib/catalog'
import { formatPrecio, getTestPrice } from '@/lib/pricing'
import { tonoDe } from '@/lib/tonos'
import TestIcon from './TestIcon'

/** Los tests lanzados en los últimos 30 días, arriba en la portada. Se arma
 *  solo con las fechas del catálogo: el día de un lanzamiento aparece y a los
 *  30 días se va, sin tocar nada. */
export default function BannerLanzamiento() {
  const nuevos = publicados().filter((t) => esNuevo(t)).slice(0, 3)
  if (nuevos.length === 0) return null
  const principal = tonoDe(nuevos[0].id)

  return (
    <section className="relative overflow-hidden bg-white py-16 sm:py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full opacity-[0.18] blur-[110px]"
        style={{ background: principal.c }}
      />
      <div className="container-x relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white" style={{ background: principal.c }}>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              Recién lanzado{nuevos.length > 1 ? 's' : ''}
            </p>
            <h2 className="mt-5 text-4xl font-semibold leading-[1.05] sm:text-5xl">
              {nuevos.length > 1 ? 'Nuevos tests para conocerte, amar mejor y criar con intención.' : `Nuevo: ${nuevos[0].name}.`}
            </h2>
            <p className="mt-4 text-lg text-ink-500">Ya a la venta. Resultado al terminar, con guía práctica y tu imagen para compartir.</p>
          </div>
        </div>

        <div className={`mt-10 grid gap-5 ${nuevos.length === 1 ? '' : nuevos.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
          {nuevos.map((t) => {
            const tono = tonoDe(t.id)
            return (
              <Link
                key={t.id}
                href={`/tests/${t.id}`}
                className="group relative flex flex-col overflow-hidden rounded-4xl p-7 text-white shadow-lift transition-all duration-500 hover:-translate-y-1 sm:p-8"
                style={{ background: `linear-gradient(145deg, ${tono.c} 0%, ${tono.texto} 100%)` }}
              >
                <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/15 blur-2xl" />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                  <TestIcon name={t.icon} />
                </span>
                <p className="relative mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-white/80">{t.kicker}</p>
                <h3 className="relative mt-2 text-2xl font-semibold leading-tight">{t.name}</h3>
                <p className="relative mt-3 text-[15px] leading-relaxed text-white/85">{t.description}</p>
                <span className="relative mt-auto flex items-center justify-between pt-8 text-sm font-semibold">
                  <span>
                    {formatPrecio(getTestPrice(t.credits))}
                    {t.people > 1 && ' · para los dos'}
                  </span>
                  <span className="rounded-full bg-white px-4 py-2 transition group-hover:translate-x-0.5" style={{ color: tono.texto }}>
                    Hacer el test →
                  </span>
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
