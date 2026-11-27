import Link from 'next/link'
import { publicados, esNuevo } from '@/lib/catalog'
import { formatPrecio, getTestPrice } from '@/lib/pricing'
import { tonoDe } from '@/lib/tonos'
import Portada from './Portada'

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
              <Link key={t.id} href={`/tests/${t.id}`} className="group flex flex-col">
                <div className="relative overflow-hidden rounded-[1.75rem] shadow-lift transition-all duration-500 ease-out group-hover:-translate-y-1.5">
                  <Portada id={t.id} nombre={t.name} className={`${nuevos.length === 1 ? 'aspect-[21/9]' : 'aspect-[4/5] sm:aspect-[16/11] md:aspect-[4/5]'} transition-transform duration-700 group-hover:scale-[1.03]`} escala={nuevos.length === 1 ? 0.6 : 1.25} />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-wider" style={{ color: tono.texto }}>
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: tono.c }} />
                    Nuevo
                  </span>
                </div>
                <div className="flex flex-1 flex-col px-1 pt-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: tono.texto }}>{t.kicker}</p>
                  <h3 className="mt-1.5 text-2xl font-semibold leading-tight">{t.name}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-500">{t.description}</p>
                  <span className="mt-auto flex items-center justify-between pt-5 text-sm">
                    <span className="font-semibold">
                      {formatPrecio(getTestPrice(t.credits))}
                      {t.people > 1 && <span className="font-normal text-ink-400"> · para los dos</span>}
                    </span>
                    <span className="rounded-full px-4 py-2 font-semibold text-white transition group-hover:translate-x-0.5" style={{ background: tono.c }}>
                      Hacer el test →
                    </span>
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
