'use client'

import { useCheckout } from '@/lib/hooks'
import { formatUsd, getTestPrice, type PackId } from '@/lib/pricing'
import type { CatalogTest } from '@/lib/catalog'

/** Un solo botón, que lleva directo al pago. En una landing de campaña cualquier
 *  paso intermedio (registro, catálogo) es gente que se pierde. */
export default function LandingBuy({ test }: { test: CatalogTest }) {
  const { checkout, pending, error } = useCheckout()
  const precio = getTestPrice(test.credits)
  const paquete: PackId = test.credits > 1 ? 'pareja' : 'single'

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        onClick={() => checkout(paquete, `/tests/${test.id}`)}
        disabled={pending !== null}
        className="btn-primary px-9 py-4 text-base"
      >
        {pending ? 'Abriendo pago seguro…' : `Hacer el test · ${formatUsd(precio)}`}
      </button>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
    </div>
  )
}
