'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AUDIENCES, CATALOG, type Audience } from '@/lib/catalog'
import TestIcon from './TestIcon'

export default function AudiencePicker() {
  const [selected, setSelected] = useState<Audience>('colaborador')
  const recomendados = CATALOG.filter((t) => t.audience.includes(selected)).slice(0, 3)
  const actual = AUDIENCES.find((a) => a.id === selected)!

  return (
    <div>
      <div role="tablist" aria-label="¿Para quién es?" className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {AUDIENCES.map((a) => {
          const on = a.id === selected
          return (
            <button
              key={a.id}
              role="tab"
              aria-selected={on}
              onClick={() => setSelected(a.id)}
              className={`flex-1 rounded-3xl px-6 py-5 text-left transition-all duration-300 sm:max-w-xs ${
                on
                  ? 'bg-ink text-white shadow-lift'
                  : 'bg-white text-ink shadow-soft ring-1 ring-black/[0.05] hover:-translate-y-0.5'
              }`}
            >
              <span className="block text-lg font-semibold">{a.label}</span>
              <span className={`mt-1 block text-sm ${on ? 'text-white/60' : 'text-ink-500'}`}>{a.blurb}</span>
            </button>
          )
        })}
      </div>

      <div className="mt-8 rounded-4xl bg-white p-6 shadow-soft ring-1 ring-black/[0.05] sm:p-8">
        <p className="text-center text-[15px] text-ink-500">
          Para <span className="font-semibold text-ink">{actual.label.toLowerCase()}</span> recomendamos empezar por:
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {recomendados.map((t, i) => (
            <Link
              key={t.id}
              href={`/tests/${t.id}`}
              className={`group flex items-center gap-4 rounded-3xl p-5 transition-all duration-300 hover:-translate-y-0.5 ${
                i === 0 ? 'bg-brand-soft ring-1 ring-brand/20' : 'bg-ink-100'
              }`}
            >
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${i === 0 ? 'bg-white text-brand-deep' : 'bg-white text-ink'}`}>
                <TestIcon name={t.icon} />
              </span>
              <span className="min-w-0">
                <span className="block truncate font-semibold">{t.name}</span>
                <span className="block text-sm text-ink-500">{i === 0 ? 'Empieza aquí' : t.duration}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
