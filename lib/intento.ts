import { createHmac, timingSafeEqual } from 'crypto'

/** Un test abierto se sirve desde la tienda, nunca con su dirección real. El
 *  permiso para verlo es una firma guardada en una cookie del navegador que
 *  pagó: el enlace reenviado por WhatsApp no la lleva y no abre nada.
 *
 *  La llave de firma es la del servidor, que ya existe y nunca sale de él.
 *  Así no hay una variable más que configurar y equivocar. */
const LLAVE = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const nombreCookie = (intento: string) => `ht_${intento.replace(/[^a-zA-Z0-9-]/g, '')}`

export function firmarIntento(intento: string) {
  return createHmac('sha256', LLAVE).update(`intento:${intento}`).digest('base64url')
}

export function firmaValida(intento: string, firma: string | undefined) {
  if (!firma || !LLAVE) return false
  const esperada = Buffer.from(firmarIntento(intento))
  const recibida = Buffer.from(firma)
  return esperada.length === recibida.length && timingSafeEqual(esperada, recibida)
}
