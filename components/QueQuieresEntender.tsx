'use client'

import Link from 'next/link'
import { useState } from 'react'
import { publicados } from '@/lib/catalog'
import { formatPrecio, getTestPrice } from '@/lib/pricing'
import { TONOS } from '@/lib/tonos'
import Portada from './Portada'

// En vez de comparar todos los tests en una tabla, la persona dice qué quiere
// entender y solo ve los que le sirven para eso.
const INTENCIONES = [
  { id: 'yo', label: 'Entenderme', frase: 'Quiero entenderme a mí', c: TONOS.autoconocimiento.c, tests: ['eneagrama', '5-heridas', '5-casas', 'disc'] },
  { id: 'pareja', label: 'Amar mejor', frase: 'Quiero amar mejor a mi pareja', c: TONOS.amor.c, tests: ['lenguajes-amor', 'lenguajes-amor-pareja', 'eneagrama-pareja'] },
  { id: 'hijos', label: 'Criar mejor', frase: 'Quiero criar con más intención', c: TONOS.familia.c, tests: ['estilo-crianza', 'inteligencias-hijo'] },
  { id: 'equipo', label: 'Liderar mejor', frase: 'Quiero liderar mejor a mi equipo', c: TONOS.liderazgo.c, tests: ['5-niveles-liderazgo', 'checkbox-5-niveles', 'disc', 'hii'] },
  { id: 'vida', label: 'Ordenar mi vida', frase: 'Quiero ordenar mi vida y mi dinero', c: TONOS.bienestar.c, tests: ['areas-vida', 'finanzas'] },
] as const

export default function QueQuieresEntender() {
  const [sel, setSel] = useState<(typeof INTENCIONES)[number]['id']>('yo')
  const actual = INTENCIONES.find((i) => i.id === sel)!
  const disponibles = publicados()
  const tests = actual.tests.map((id) => disponibles.find((t) => t.id === id)).filter((t) => t !== undefined)

  return (
    <div>
      <div role="tablist" aria-label="¿Qué quieres entender?" className="flex flex-wrap justify-center gap-2.5">
        {INTENCIONES.map((i) => {
          const on = i.id === sel
          return (
            <button
              key={i.id}
              role="tab"
              aria-selected={on}
              onClick={() => setSel(i.id)}
              className={`rounded-full px-5 py-2.5 text-[15px] font-semibold transition-all duration-300 ${
                on ? 'text-white shadow-lift' : 'bg-white text-ink-700 ring-1 ring-black/[0.08] hover:-translate-y-0.5 hover:ring-black/20'
              }`}
              style={on ? { background: i.c } : undefined}
            >
              {i.label}
            </button>
          )
        })}
      </div>

      <p key={actual.id + '-f'} className="mt-8 animate-fade-up text-center font-display text-2xl font-semibold tracking-tighter sm:text-3xl">
        «{actual.frase}»
      </p>

      <div key={actual.id} role="tabpanel" className="mx-auto mt-8 grid max-w-5xl animate-fade-up gap-4 md:grid-cols-2">
        {tests.map((t) => (
          <Link
            key={t.id}
            href={`/tests/${t.id}`}
            className="group flex items-stretch gap-4 rounded-3xl bg-white p-3 shadow-soft ring-1 ring-black/[0.05] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift"
          >
            <Portada id={t.id} nombre={t.name} className="aspect-[4/3] w-32 shrink-0 rounded-2xl sm:w-40" />
            <div className="flex min-w-0 flex-1 flex-col py-1 pr-2">
              <h3 className="text-lg font-semibold leading-snug">{t.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-500">{t.measures}</p>
              <p className="mt-auto flex items-center justify-between pt-2 text-sm">
                <span className="text-ink-400">
                  {t.duration} · <span className="font-semibold text-ink">{formatPrecio(getTestPrice(t.credits))}</span>
                </span>
                <span className="font-semibold transition-transform group-hover:translate-x-1" style={{ color: actual.c }} aria-hidden="true">
                  Ver →
                </span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
