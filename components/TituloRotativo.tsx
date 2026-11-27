'use client'

import { useEffect, useState } from 'react'
import { TONOS } from '@/lib/tonos'

// «Conoce tu …» y la última parte va cambiando, cada una con el color de su familia de tests.
const FRASES = [
  { t: 'forma de amar.', c: TONOS.amor.c },
  { t: 'estilo de crianza.', c: TONOS.familia.c },
  { t: 'esencia.', c: TONOS.autoconocimiento.c },
  { t: 'propósito.', c: '#9DBCFF' },
  { t: 'forma de liderar.', c: TONOS.liderazgo.c },
  { t: 'relación con el dinero.', c: '#E8B84A' },
]
const INTERVALO = 2600

export default function TituloRotativo() {
  const [i, setI] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setI((n) => (n + 1) % FRASES.length), INTERVALO)
    return () => clearInterval(id)
  }, [])

  const f = FRASES[i]
  return (
    <>
      {/* El resplandor de fondo toma el color de la frase que se está mostrando. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[-18rem] h-[36rem] w-[60rem] -translate-x-1/2 rounded-full opacity-30 blur-[140px] transition-colors duration-1000"
        style={{ background: f.c }}
      />
      <h1 className="delay-1 relative mx-auto mt-8 max-w-5xl animate-fade-up text-5xl font-semibold leading-[1.04] tracking-tightest text-white sm:text-7xl lg:text-[5.5rem]">
        <span className="sr-only">Conoce tu forma de amar, tu estilo de crianza, tu esencia, tu propósito y tu forma de liderar.</span>
        <span aria-hidden="true">
          Conoce tu
          <span className="block min-h-[1.1em]">
            <span key={i} className="inline-block animate-fade-up" style={{ color: f.c }}>
              {f.t}
            </span>
          </span>
        </span>
      </h1>
    </>
  )
}
