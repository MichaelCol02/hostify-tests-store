import type { PackId } from './pricing'

/** Oferta por tiempo limitado. Vive en un solo archivo para que el precio que
 *  se muestra y el que se cobra no puedan separarse nunca: el servidor lee de
 *  aquí igual que la pantalla. Fuera de las fechas, todo vuelve solo. */

export interface Oferta {
  priceCop: number
  priceUsd: number
  /** Créditos que entrega el paquete durante la oferta. */
  creditos: number
}

/** Las horas son de Colombia (UTC-5): del 15 de noviembre a las 00:00 hasta
 *  el 29 a las 23:59:59. Guardadas en UTC para que no dependan del reloj del
 *  servidor, que en Netlify no está en Colombia. */
export const CAMPANA = {
  nombre: 'Black Friday',
  gancho: '2×1 en el test individual',
  desde: Date.UTC(2026, 10, 15, 5, 0, 0),
  hasta: Date.UTC(2026, 10, 30, 4, 59, 59),
  ofertas: {
    single: { priceCop: 20000, priceUsd: 5, creditos: 2 },
    pareja: { priceCop: 22000, priceUsd: 6, creditos: 2 },
    trio: { priceCop: 27000, priceUsd: 7, creditos: 3 },
    team: { priceCop: 45000, priceUsd: 11, creditos: 10 },
  } as Record<PackId, Oferta>,
}

export function campanaActiva(ahora: number = Date.now()) {
  return ahora >= CAMPANA.desde && ahora <= CAMPANA.hasta
}

/** Para contar los días que faltan sin repetir la cuenta en cada pantalla. */
export function diasRestantes(ahora: number = Date.now()) {
  return Math.max(0, Math.ceil((CAMPANA.hasta - ahora) / 86400000))
}

export function fechasEnTexto() {
  const f = (ms: number) =>
    new Date(ms).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', timeZone: 'America/Bogota' })
  return `${f(CAMPANA.desde)} al ${f(CAMPANA.hasta)}`
}
