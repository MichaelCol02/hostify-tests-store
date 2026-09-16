'use client'

import { useEffect, useRef, useState } from 'react'
import { CATALOG } from '@/lib/catalog'
import TestIcon from './TestIcon'

// Sample readings, one per test. Scores are illustrative: the slide says so.
const SAMPLES: Record<string, { score: number; level: string; values: number[] }> = {
  hii: { score: 82, level: 'Nivel Anfitrión', values: [86, 92, 78, 71, 84] },
  disc: { score: 74, level: 'Perfil Influyente', values: [68, 91, 76, 62] },
  '5-niveles-liderazgo': { score: 68, level: 'Nivel 3 · Producción', values: [72, 65, 70] },
  'checkbox-5-niveles': { score: 61, level: 'Nivel 2 · Permiso', values: [88, 74, 58, 42, 31] },
  '5-casas': { score: 79, level: 'Casa Puente', values: [83, 77, 74] },
  eneagrama: { score: 88, level: 'Tipo 2 · ala 3', values: [88, 81, 76, 69, 73] },
  'eneagrama-pareja': { score: 76, level: 'Tipo 2 y Tipo 8', values: [84, 72, 65, 79, 71] },
}

const SLIDES = CATALOG.filter((t) => SAMPLES[t.id]).map((t) => ({ test: t, ...SAMPLES[t.id] }))
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
  const circumference = 2 * Math.PI * 42

  return (
    <div
      className="relative mx-auto w-full max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div aria-hidden="true" className="absolute inset-x-10 -bottom-10 h-40 rounded-full bg-brand/40 blur-3xl" />

      <div className="relative overflow-hidden rounded-4xl bg-white/[0.06] p-2 ring-1 ring-white/15 backdrop-blur-2xl">
        <div
          key={slide.test.id}
          className="animate-fade-up rounded-[1.6rem] bg-gradient-to-b from-white to-ink-100 p-6 text-ink sm:p-8"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-deep">Ejemplo de resultado</p>
              <p className="mt-1 truncate font-display text-xl font-semibold tracking-tighter sm:text-2xl">{slide.test.name}</p>
            </div>
            <span className="hidden shrink-0 items-center gap-2 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white sm:inline-flex">
              <TestIcon name={slide.test.icon} className="h-3.5 w-3.5" />
              {slide.level}
            </span>
          </div>

          <div className="mt-8 grid min-h-[260px] items-center gap-8 sm:grid-cols-[auto,1fr]">
            <div className="relative mx-auto h-32 w-32">
              <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90" aria-hidden="true">
                <defs>
                  <linearGradient id="score-ring" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FF8A55" />
                    <stop offset="100%" stopColor="#D94D1A" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="42" fill="none" stroke="#E8E8ED" strokeWidth="9" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="url(#score-ring)"
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

            <ul className="space-y-3.5">
              {slide.test.modules.slice(0, slide.values.length).map((label, i) => (
                <li key={label}>
                  <div className="flex justify-between gap-3 text-[13px]">
                    <span className="truncate text-ink-500">{label}</span>
                    <span className="font-semibold">{slide.values[i]}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-300/50">
                    <div
                      className="h-full origin-left animate-bar-grow rounded-full bg-gradient-to-r from-[#FF8A55] to-brand-deep"
                      style={{ width: `${slide.values[i]}%`, animationDelay: `${120 + i * 110}ms` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="relative mt-6 flex items-center justify-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.test.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Ver ejemplo de ${s.test.name}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === index ? 'w-8 bg-brand' : 'w-1.5 bg-white/25 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
