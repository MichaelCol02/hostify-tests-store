'use client'

import { CREDIT_PACKS, formatUsd, pricePerTest, type CreditPack, type PackId } from '@/lib/pricing'
import { useCheckout } from '@/lib/hooks'
import { useAuth } from './AuthProvider'

export default function PricingCards({
  returnTo,
  compact = false,
  packs = CREDIT_PACKS,
  highlightId,
}: {
  returnTo?: string
  compact?: boolean
  packs?: CreditPack[]
  /** Defaults to the best-value pack, or to the first one when the caller
   *  supplies a list sized for a particular test. */
  highlightId?: PackId
}) {
  const destacado = highlightId ?? (packs === CREDIT_PACKS ? 'team' : packs[0]?.id)
  const { user, openAuth } = useAuth()
  const { checkout, pending, error } = useCheckout()

  const buy = (packId: PackId) => {
    if (!user) {
      openAuth('signup')
      return
    }
    checkout(packId, returnTo)
  }

  return (
    <div>
      {/* Tres columnas desde tablet: los paquetes solo venden si se comparan de un vistazo. */}
      <div
        className={`grid gap-4 ${
          packs.length > 3 ? 'sm:grid-cols-2 lg:grid-cols-4' : compact ? 'md:grid-cols-3' : 'gap-5 md:grid-cols-3'
        }`}
      >
        {packs.map((pack) => {
          const highlight = pack.id === destacado
          const saving = Math.round((1 - pricePerTest(pack) / CREDIT_PACKS[0].priceUsd) * 100)
          const unidad = pack.credits === 1 ? 'test completo' : 'tests completos'
          return (
            <div
              key={pack.id}
              className={`relative flex flex-col overflow-hidden rounded-4xl transition-all duration-500 ${
                compact ? 'p-6' : 'p-8 sm:p-9'
              } ${
                highlight
                  ? 'bg-ink-900 text-white shadow-lift md:-my-3'
                  : 'bg-white shadow-soft ring-1 ring-black/[0.05]'
              }`}
            >
              {highlight && (
                <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/2 h-64 w-[140%] -translate-x-1/2 rounded-full bg-brand/35 blur-3xl" />
              )}

              <div className="relative flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${highlight ? 'text-white' : ''}`}>{pack.name}</h3>
                {pack.badge && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      highlight ? 'bg-gradient-to-b from-brand to-brand-deep text-white' : 'bg-brand-soft text-brand-deep'
                    }`}
                  >
                    {pack.badge}
                  </span>
                )}
              </div>
              <p className={`relative mt-1 text-sm ${highlight ? 'text-white/55' : 'text-ink-500'}`}>{pack.tagline}</p>

              <div className="relative mt-8 flex items-end gap-2">
                <span className={`font-display font-semibold leading-none tracking-tightest ${compact ? 'text-5xl' : 'text-6xl'}`}>
                  {formatUsd(pack.priceUsd)}
                </span>
                <span className={`pb-1 text-sm ${highlight ? 'text-white/50' : 'text-ink-400'}`}>USD</span>
              </div>

              <ul className={`relative mt-6 space-y-2.5 text-[15px] ${highlight ? 'text-white/80' : 'text-ink-700'}`}>
                <li className="flex items-center gap-2.5">
                  <Check highlight={highlight} />
                  <span>
                    <strong className="font-semibold">{pack.credits}</strong>{' '}
                    {pack.id === 'pareja' ? 'personas, una lectura conjunta' : unidad}
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check highlight={highlight} />
                  <span>
                    {formatUsd(pricePerTest(pack))} por test
                    {saving > 0 && <span className="ml-1.5 font-semibold text-brand">−{saving}%</span>}
                  </span>
                </li>
                {!compact && (
                  <li className="flex items-center gap-2.5">
                    <Check highlight={highlight} />
                    <span>Úsalos en cualquier test, sin vencimiento</span>
                  </li>
                )}
              </ul>

              <button
                type="button"
                onClick={() => buy(pack.id)}
                disabled={pending !== null}
                className={`relative mt-8 w-full py-3.5 ${highlight ? 'btn-primary' : 'btn-dark'}`}
              >
                {pending === pack.id ? 'Abriendo pago seguro…' : `Comprar ${pack.credits} ${pack.credits === 1 ? 'crédito' : 'créditos'}`}
              </button>
            </div>
          )
        })}
      </div>
      {error && <p className="mt-5 text-center text-sm text-red-600">{error}</p>}
    </div>
  )
}

function Check({ highlight }: { highlight: boolean }) {
  return (
    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${highlight ? 'bg-brand/20 text-brand' : 'bg-brand-soft text-brand-deep'}`}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
        <path d="M2 5.2 4.1 7.3 8 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}
