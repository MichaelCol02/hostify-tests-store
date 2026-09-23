export type PackId = 'single' | 'trio' | 'team' | 'pareja'

export interface CreditPack {
  id: PackId
  credits: number
  priceUsd: number
  name: string
  tagline: string
  badge?: string
  /** Contextual packs are sized for one specific test and are not offered in the
   *  general pricing grid, where they would sit next to a cheaper-per-credit pack
   *  and read as a worse deal than they are. */
  contextual?: boolean
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: 'single', credits: 1, priceUsd: 5, name: 'Individual', tagline: 'Para descubrir tu perfil hoy.' },
  { id: 'trio', credits: 3, priceUsd: 9, name: 'Trío', tagline: 'Combina tests y compáralos.', badge: 'Más elegido' },
  { id: 'team', credits: 10, priceUsd: 15, name: 'Equipo', tagline: 'Evalúa a todo tu equipo.', badge: 'Mejor valor' },
]

export const CONTEXTUAL_PACKS: CreditPack[] = [
  {
    id: 'pareja',
    credits: 2,
    priceUsd: 7,
    name: 'Pareja',
    tagline: 'Los dos perfiles y la lectura conjunta.',
    badge: 'Para dos',
    contextual: true,
  },
]

export const ALL_PACKS: CreditPack[] = [...CREDIT_PACKS, ...CONTEXTUAL_PACKS]

/** Checkout validates against every sellable pack, not just the ones on display. */
export function getPack(id: unknown): CreditPack | undefined {
  return ALL_PACKS.find((p) => p.id === id)
}

export function pricePerTest(pack: CreditPack) {
  return pack.priceUsd / pack.credits
}

export function formatUsd(value: number) {
  return `$${Number.isInteger(value) ? value : value.toFixed(2)}`
}
