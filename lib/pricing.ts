export type PackId = 'single' | 'trio' | 'team' | 'pareja'

export interface CreditPack {
  id: PackId
  credits: number
  priceUsd: number
  /** Precio en pesos para cobrar con Wompi. Redondeado, no convertido al vuelo:
   *  una tarifa que cambia con el dólar confunde y rompe la confianza. */
  priceCop: number
  name: string
  tagline: string
  badge?: string
  /** Contextual packs are sized for one specific test and are not offered in the
   *  general pricing grid, where they would sit next to a cheaper-per-credit pack
   *  and read as a worse deal than they are. */
  contextual?: boolean
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: 'single', credits: 1, priceUsd: 5, priceCop: 20000, name: 'Individual', tagline: 'Para descubrir tu perfil hoy.' },
  { id: 'trio', credits: 3, priceUsd: 9, priceCop: 36000, name: 'Trío', tagline: 'Combina tests y compáralos.', badge: 'Más elegido' },
  { id: 'team', credits: 10, priceUsd: 15, priceCop: 60000, name: 'Equipo', tagline: 'Evalúa a todo tu equipo.', badge: 'Mejor valor' },
]

export const CONTEXTUAL_PACKS: CreditPack[] = [
  {
    id: 'pareja',
    credits: 2,
    priceUsd: 7,
    priceCop: 28000,
    name: 'Pareja',
    tagline: 'Los dos perfiles y la lectura conjunta.',
    badge: 'Para dos',
    contextual: true,
  },
]

export const ALL_PACKS: CreditPack[] = [...CREDIT_PACKS, ...CONTEXTUAL_PACKS]

/** Con Wompi configurado la tienda cobra en pesos; sin él, sigue en dólares.
 *  Mostrar una moneda y cobrar en otra es la forma más rápida de perder una venta. */
export const COBRO_EN_PESOS = Boolean(process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY)

export const MONEDA = COBRO_EN_PESOS ? 'COP' : 'USD'

/** Checkout validates against every sellable pack, not just the ones on display. */
export function getPack(id: unknown): CreditPack | undefined {
  return ALL_PACKS.find((p) => p.id === id)
}

export function precioPack(pack: CreditPack) {
  return COBRO_EN_PESOS ? pack.priceCop : pack.priceUsd
}

export function pricePerTest(pack: CreditPack) {
  return precioPack(pack) / pack.credits
}

/** Lo que cuesta abrir un test: el paquete más barato que alcanza para sus créditos.
 *  El de pareja son 2 créditos, y el paquete Pareja los cubre más barato que dos sueltos. */
export function getTestPrice(credits: number) {
  return Math.min(...ALL_PACKS.filter((p) => p.credits >= credits).map((p) => precioPack(p)))
}

/** El precio por test más bajo del catálogo de paquetes, para el "desde". */
export function getCheapestPerTest() {
  return Math.min(...CREDIT_PACKS.map(pricePerTest))
}

export function formatUsd(value: number) {
  return `$${Number.isInteger(value) ? value : value.toFixed(2)}`
}

export function formatPrecio(valor: number) {
  return COBRO_EN_PESOS ? `$${Math.round(valor).toLocaleString('es-CO')}` : formatUsd(valor)
}
