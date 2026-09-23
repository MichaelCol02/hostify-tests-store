'use client'

import { useEffect, useState } from 'react'
import type { CatalogTest } from '@/lib/catalog'
import { CREDIT_PACKS } from '@/lib/pricing'

/** Barra fija en móvil: en pantallas pequeñas el botón de compra queda muy abajo
 *  y mucha gente se va antes de llegar. Se esconde cuando el panel ya está a la vista. */
export default function StickyBuyBar({ test }: { test: CatalogTest }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const panel = document.getElementById('empezar')
    if (!panel) return
    const io = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting && window.scrollY > 240),
      { rootMargin: '-80px 0px -40% 0px' }
    )
    io.observe(panel)
    return () => io.disconnect()
  }, [])

  const desde = CREDIT_PACKS[0].priceUsd * test.credits

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-black/[0.06] bg-white/90 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl transition-transform duration-500 md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{test.name}</p>
          <p className="text-xs text-ink-500">
            {test.credits} {test.credits === 1 ? 'crédito' : 'créditos'} · desde ${desde} USD
          </p>
        </div>
        <a href="#empezar" className="btn-primary shrink-0 px-5 py-3 text-sm">
          Empezar
        </a>
      </div>
    </div>
  )
}
