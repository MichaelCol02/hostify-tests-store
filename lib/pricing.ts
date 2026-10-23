import { CAMPANA, campanaActiva } from './campana'

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
  /** Lo que costaba antes de la oferta. Solo lo pone la campaña. */
  antesCop?: number
  antesUsd?: number
  /** Créditos de regalo frente a lo normal. Solo lo pone la campaña. */
  regalo?: number
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

const BASE_PACKS: CreditPack[] = [...CREDIT_PACKS, ...CONTEXTUAL_PACKS]

/** Aplica la oferta vigente a un paquete. Todo lo que muestra o cobra un
 *  precio pasa por aquí, así que la pantalla y la caja nunca discrepan. */
export function conCampana(pack: CreditPack, ahora?: number): CreditPack {
  if (!campanaActiva(ahora)) return pack
  const oferta = CAMPANA.ofertas[pack.id]
  if (!oferta) return pack
  return {
    ...pack,
    priceCop: oferta.priceCop,
    priceUsd: oferta.priceUsd,
    credits: oferta.creditos,
    antesCop: oferta.priceCop < pack.priceCop ? pack.priceCop : undefined,
    antesUsd: oferta.priceUsd < pack.priceUsd ? pack.priceUsd : undefined,
    regalo: oferta.creditos > pack.credits ? oferta.creditos - pack.credits : undefined,
  }
}

/** Los paquetes como se venden hoy: con oferta si la hay, normales si no. */
export function packsVigentes(packs: CreditPack[] = CREDIT_PACKS, ahora?: number): CreditPack[] {
  return packs.map((p) => conCampana(p, ahora))
}

export const ALL_PACKS: CreditPack[] = BASE_PACKS

/** Con Wompi configurado la tienda cobra en pesos; sin él, sigue en dólares.
 *  Mostrar una moneda y cobrar en otra es la forma más rápida de perder una venta. */
export const COBRO_EN_PESOS = Boolean(process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY)

export const MONEDA = COBRO_EN_PESOS ? 'COP' : 'USD'

/** Checkout validates against every sellable pack, not just the ones on display.
 *  Devuelve el paquete con la oferta ya aplicada: el cobro y los créditos que
 *  entrega salen de aquí, nunca de lo que mande el navegador. */
export function getPack(id: unknown, ahora?: number): CreditPack | undefined {
  const base = BASE_PACKS.find((p) => p.id === id)
  return base && conCampana(base, ahora)
}

export function precioPack(pack: CreditPack) {
  return COBRO_EN_PESOS ? pack.priceCop : pack.priceUsd
}

export function pricePerTest(pack: CreditPack) {
  return precioPack(pack) / pack.credits
}

/** Lo que cuesta abrir un test: el paquete más barato que alcanza para sus créditos.
 *  El de pareja son 2 créditos, y el paquete Pareja los cubre más barato que dos sueltos. */
export function getTestPrice(credits: number, ahora?: number) {
  return Math.min(
    ...packsVigentes(ALL_PACKS, ahora)
      .filter((p) => p.credits >= credits)
      .map((p) => precioPack(p))
  )
}

/** El precio por test más bajo del catálogo de paquetes, para el "desde". */
export function getCheapestPerTest(ahora?: number) {
  return Math.min(...packsVigentes(CREDIT_PACKS, ahora).map(pricePerTest))
}

/** Lo que costaba antes de la oferta, para mostrarlo tachado. */
export function precioAntes(pack: CreditPack) {
  return COBRO_EN_PESOS ? pack.antesCop : pack.antesUsd
}

export function formatUsd(value: number) {
  return `$${Number.isInteger(value) ? value : value.toFixed(2)}`
}

export function formatPrecio(valor: number) {
  return COBRO_EN_PESOS ? `$${Math.round(valor).toLocaleString('es-CO')}` : formatUsd(valor)
}
