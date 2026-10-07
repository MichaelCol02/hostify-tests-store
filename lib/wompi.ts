import { createHash, timingSafeEqual } from 'crypto'

/** Wompi cobra en pesos y liquida a una cuenta colombiana, que es lo que Stripe
 *  no puede hacer. Queda apagado mientras no existan las llaves. */
export const WOMPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY || ''
const INTEGRITY_SECRET = process.env.WOMPI_INTEGRITY_SECRET || ''
const EVENTS_SECRET = process.env.WOMPI_EVENTS_SECRET || ''

export const WOMPI_ACTIVO = Boolean(WOMPI_PUBLIC_KEY)
export const CHECKOUT_URL = 'https://checkout.wompi.co/p/'

const sha256 = (texto: string) => createHash('sha256').update(texto, 'utf8').digest('hex')

/** Referencia única del pago. Wompi rechaza referencias repetidas, así que lleva azar. */
export function nuevaReferencia(packId: string) {
  const azar = Math.random().toString(36).slice(2, 10).toUpperCase()
  return `HT-${packId.toUpperCase()}-${Date.now().toString(36).toUpperCase()}-${azar}`
}

/** Firma que Wompi exige al abrir el cobro: evita que alguien altere el monto en la URL. */
export function firmaIntegridad(referencia: string, montoEnCentavos: number, moneda = 'COP') {
  return sha256(`${referencia}${montoEnCentavos}${moneda}${INTEGRITY_SECRET}`)
}

/** Verifica que el aviso de pago venga de Wompi y no de alguien simulando una compra.
 *  La firma se arma concatenando las propiedades que el propio evento indica. */
export function eventoLegitimo(cuerpo: any): boolean {
  const checksum: string | undefined = cuerpo?.signature?.checksum
  const propiedades: string[] | undefined = cuerpo?.signature?.properties
  const timestamp = cuerpo?.timestamp

  if (!checksum || !Array.isArray(propiedades) || timestamp === undefined || !EVENTS_SECRET) {
    return false
  }

  const valores = propiedades
    .map((ruta) => ruta.split('.').reduce<any>((acc, parte) => (acc == null ? acc : acc[parte]), cuerpo.data))
    .map((v) => (v === undefined || v === null ? '' : String(v)))
    .join('')

  const calculado = sha256(`${valores}${timestamp}${EVENTS_SECRET}`)

  const a = Buffer.from(calculado)
  const b = Buffer.from(checksum.toLowerCase())
  return a.length === b.length && timingSafeEqual(a, b)
}
