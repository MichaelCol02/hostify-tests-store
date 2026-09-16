/** WhatsApp number in international format, digits only (e.g. 573001112233).
 *  Empty hides the floating button everywhere. */
export const WHATSAPP_NUMBER = '573183397530'

export const WHATSAPP_MESSAGE = 'Hola, vengo de Hostify Tests y quiero hacer una consulta.'

export function whatsappLink(message: string = WHATSAPP_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
