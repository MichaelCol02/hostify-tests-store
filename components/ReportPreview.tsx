'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { publicados } from '@/lib/catalog'
import { colorVivo, marcaDe } from '@/lib/marcas'
import Portada from './Portada'

// Una lectura de ejemplo por test. Los puntajes son ilustrativos: la tarjeta lo dice.
const SAMPLES: Record<string, { score: number; level: string; values: number[] }> = {
  'lenguajes-amor': { score: 84, level: 'Tiempo de calidad', values: [62, 91, 38, 70, 77] },
  'lenguajes-amor-pareja': { score: 78, level: 'Tiempo y Contacto', values: [86, 74, 81, 58, 72] },
  'estilo-crianza': { score: 81, level: 'Guía con calidez', values: [88, 72, 79, 84, 61] },
  'areas-vida': { score: 72, level: 'Raíz firme', values: [84, 71, 66, 69] },
  finanzas: { score: 64, level: 'En construcción', values: [72, 58, 63] },
  '5-heridas': { score: 58, level: 'Armadura: Controlador', values: [34, 46, 28, 71, 52] },
  hii: { score: 82, level: 'Nivel Anfitrión', values: [86, 92, 78, 71, 84] },
  disc: { score: 74, level: 'Perfil Influyente', values: [68, 91, 76, 62] },
  '5-niveles-liderazgo': { score: 68, level: 'Nivel 3 · Producción', values: [72, 65, 70] },
  'checkbox-5-niveles': { score: 61, level: 'Nivel 2 · Permiso', values: [88, 74, 58, 42, 31] },
  '5-casas': { score: 79, level: 'Casa Puente', values: [83, 77, 74] },
  eneagrama: { score: 88, level: 'Tipo 2 · ala 3', values: [88, 81, 76, 69, 73] },
  'eneagrama-pareja': { score: 76, level: 'Tipo 2 y Tipo 8', values: [84, 72, 65, 79, 71] },
}

const SLIDES = publicados()
  .filter((t) => SAMPLES[t.id])
  .map((t) => ({ test: t, marca: marcaDe(t.id, t.name), ...SAMPLES[t.id] }))
const INTERVAL = 5200

export default function ReportPreview() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (paused || reduced.current || SLIDES.length < 2) return
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL)
    return () => clearInterval(id)
  }, [paused, index])

  const slide = SLIDES[index]
  const { marca } = slide
  const color = colorVivo(marca)
  const circumference = 2 * Math.PI * 42

  return (
    <div
      className="relative mx-auto w-full max-w-4xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* El resplandor de abajo toma el color del test que se está mostrando. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-10 -bottom-10 h-48 rounded-full opacity-60 blur-3xl transition-colors duration-1000"
        style={{ background: color }}
      />

      <div className="relative overflow-hidden rounded-4xl bg-white/[0.06] p-2 ring-1 ring-white/15 backdrop-blur-2xl">
        <div key={slide.test.id} className="grid animate-fade-up overflow-hidden rounded-[1.6rem] bg-white text-ink md:grid-cols-[0.85fr,1.15fr]" aria-live="polite">
          {/* La portada del test, como en el catálogo. */}
          <Link href={`/tests/${slide.test.id}`} className="group relative block overflow-hidden" aria-label={`Ver ${slide.test.name}`}>
            <Portada
              id={slide.test.id}
              nombre={slide.test.name}
              className="aspect-[16/10] h-full transition-transform duration-700 group-hover:scale-[1.03] md:aspect-auto md:min-h-[340px]"
              escala={1.15}
            />
          </Link>

          <div className="flex flex-col p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color }}>
                Ejemplo de resultado
              </p>
              <span className="rounded-full px-3 py-1.5 text-xs font-semibold text-white" style={{ background: marca.profundo }}>
                {slide.level}
              </span>
            </div>
            <p className="mt-2 font-display text-xl font-semibold tracking-tighter sm:text-2xl">{slide.test.name}</p>

            <div className="mt-6 grid flex-1 items-center gap-7 sm:grid-cols-[auto,1fr]">
              <div className="relative mx-auto h-28 w-28">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#EDEDF0" strokeWidth="9" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={color}
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - slide.score / 100)}
                    className="transition-[stroke-dashoffset] duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-4xl font-semibold tracking-tightest">{slide.score}</span>
                  <span className="text-[11px] text-ink-400">de 100</span>
                </div>
              </div>

              <ul className="space-y-3">
                {slide.test.modules.slice(0, slide.values.length).map((label, i) => (
                  <li key={label}>
                    <div className="flex justify-between gap-3 text-[13px]">
                      <span className="truncate text-ink-500">{label}</span>
                      <span className="font-semibold">{slide.values[i]}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-100">
                      <div
                        className="h-full origin-left animate-bar-grow rounded-full"
                        style={{
                          width: `${slide.values[i]}%`,
                          animationDelay: `${120 + i * 110}ms`,
                          background: `linear-gradient(90deg, ${color}99, ${color})`,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-6 flex flex-wrap items-center justify-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.test.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Ver ejemplo de ${s.test.name}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? 'w-8' : 'w-1.5 bg-white/25 hover:bg-white/50'}`}
            style={i === index ? { background: color } : undefined}
          />
        ))}
      </div>
    </div>
  )
}
