/** Datos de la empresa que aparecen en las páginas legales.
 *  Mientras digan PENDIENTE, las páginas muestran un aviso de borrador y no se
 *  enlazan como si fueran definitivas. Michael debe reemplazarlos. */
export const EMPRESA = {
  razonSocial: '[PENDIENTE: razón social]',
  nit: '[PENDIENTE: NIT o cédula]',
  ciudad: '[PENDIENTE: ciudad]',
  pais: 'Colombia',
  correo: 'michael2colmenares@gmail.com',
  whatsapp: '+57 318 3397530',
  sitio: 'hostifycol.netlify.app',
}

export const BORRADOR = Object.values(EMPRESA).some((v) => v.includes('PENDIENTE'))

/** Días para pedir devolución. 0 = no se ofrecen devoluciones. */
export const DIAS_REEMBOLSO = 0
