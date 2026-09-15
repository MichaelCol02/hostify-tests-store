export type PackId = 'single' | 'trio' | 'team'

export interface CreditPack {
  id: PackId
  credits: number
  priceUsd: number
  name: string
  tagline: string
  badge?: string
}

export const CREDIT_PACKS: CreditPack[] = [
  { id: 'single', credits: 1, priceUsd: 5, name: 'Individual', tagline: 'Para descubrir tu perfil hoy.' },
  { id: 'trio', credits: 3, priceUsd: 9, name: 'Trío', tagline: 'Combina tests y compáralos.', badge: 'Más elegido' },
  { id: 'team', credits: 10, priceUsd: 15, name: 'Equipo', tagline: 'Evalúa a todo tu equipo.', badge: 'Mejor valor' },
]

export function getPack(id: unknown): CreditPack | undefined {
  return CREDIT_PACKS.find((p) => p.id === id)
}

export function pricePerTest(pack: CreditPack) {
  return pack.priceUsd / pack.credits
}

export function formatUsd(value: number) {
  return `$${Number.isInteger(value) ? value : value.toFixed(2)}`
}
