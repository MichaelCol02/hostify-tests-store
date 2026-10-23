import Link from 'next/link'
import { CAMPANA, campanaActiva, diasRestantes, fechasEnTexto } from '@/lib/campana'

/** Barra de oferta. Aparece y desaparece sola según las fechas: nadie tiene
 *  que acordarse de quitarla el día 30, que es como las ofertas terminan
 *  quedándose puestas hasta enero. */
export default function BarraCampana() {
  if (!campanaActiva()) return null

  const dias = diasRestantes()

  return (
    <div className="relative z-30 bg-ink-900 text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-5 py-2.5 text-center text-sm">
        <span className="rounded-full bg-gradient-to-b from-brand to-brand-deep px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide">
          {CAMPANA.nombre}
        </span>
        <span className="font-semibold">{CAMPANA.gancho}</span>
        <span className="text-white/55">
          {fechasEnTexto()} · {dias === 1 ? 'último día' : `quedan ${dias} días`}
        </span>
        <Link href="/precios" className="font-semibold text-brand underline-offset-4 hover:underline">
          Ver precios →
        </Link>
      </div>
    </div>
  )
}
