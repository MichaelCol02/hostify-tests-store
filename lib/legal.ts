/** Datos del responsable que aparecen en las páginas legales.
 *  Tomados del RUT: persona natural con nombre comercial, no sociedad. */
export const EMPRESA = {
  razonSocial: 'Michael Roberto Colmenares Chaparro',
  nombreComercial: 'Amazing College',
  tipo: 'persona natural' as const,
  nit: '1.098.734.562-5',
  ciudad: 'Bucaramanga, Santander',
  pais: 'Colombia',
  correo: 'michael2colmenares@gmail.com',
  whatsapp: '+57 318 3397530',
  sitio: 'hostifycol.netlify.app',
}

/** Nombre que el comprador ve en su extracto bancario. Callarlo es la causa
 *  número uno de reclamos y contracargos en pasarelas con nombre distinto. */
export const NOMBRE_EN_EL_COBRO = 'AMAZING COLLEGE'

export const BORRADOR = Object.values(EMPRESA).some((v) => String(v).includes('PENDIENTE'))

/** Días para pedir devolución. 0 = no se ofrecen devoluciones. */
export const DIAS_REEMBOLSO = 0
