import Link from 'next/link'
import { esNuevo, estaPublicado, fechaLarga, type CatalogTest } from '@/lib/catalog'
import { formatPrecio, getTestPrice } from '@/lib/pricing'
import { tonoDe } from '@/lib/tonos'
import Portada from './Portada'

/** Tarjeta del catálogo: la portada del test arriba, como la carátula de un
 *  programa, y debajo el nombre, la descripción y el precio, sin caja. */
export default function TestCard({ test }: { test: CatalogTest; featured?: boolean }) {
  const proximo = !estaPublicado(test)
  const nuevo = esNuevo(test)
  const tono = tonoDe(test.id)
  return (
    <Link href={`/tests/${test.id}`} className="group flex h-full flex-col">
      <div className="relative overflow-hidden rounded-3xl shadow-soft ring-1 ring-black/[0.06] transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:shadow-lift">
        <Portada id={test.id} nombre={test.name} className="aspect-[16/10] transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
        {(proximo || nuevo) && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider shadow-soft" style={{ color: tono.texto }}>
            {proximo ? `Llega el ${fechaLarga(test)}` : 'Nuevo'}
          </span>
        )}
        <span className="absolute bottom-3 right-3 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
          {test.duration}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-1 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ color: tono.texto }}>
          {test.kicker}
        </p>
        <h3 className="mt-1.5 text-xl font-semibold leading-snug">{test.name}</h3>
        <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-ink-500">{test.description}</p>
        <div className="mt-auto flex items-center justify-between pt-4 text-sm text-ink-400">
          <span>
            {test.questions} preguntas · <span className="font-semibold text-ink">{formatPrecio(getTestPrice(test.credits))}</span>
            {test.people > 1 && ' · para los dos'}
          </span>
          <span className="font-semibold transition-transform duration-300 group-hover:translate-x-1" style={{ color: tono.texto }} aria-hidden="true">
            Ver →
          </span>
        </div>
      </div>
    </Link>
  )
}
