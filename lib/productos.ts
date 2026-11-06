/** Recursos que se compran una vez y quedan disponibles: no son tests, no
 *  gastan créditos y no se responden. Se entregan con el mismo candado que
 *  los tests, porque un PDF o una guía circulan por WhatsApp más rápido que
 *  cualquier otra cosa. */

export interface Producto {
  id: string
  /** Fila de store_tests donde vive la dirección real. Nunca va en el código. */
  recurso: string
  nombre: string
  gancho: string
  descripcion: string
  /** A quién le sirve, en sus palabras, para la página de venta. */
  paraQuien: string[]
  incluye: string[]
  priceCop: number
  priceUsd: number
  /** Meses de acceso. Es material de consulta: se abre muchas veces. */
  meses: number
  /** Test después del cual tiene sentido ofrecerlo. */
  despuesDe?: string
}

export const PRODUCTOS: Producto[] = [
  {
    id: 'kit-5-heridas',
    recurso: 'kit-5-heridas',
    nombre: 'Kit de herramientas · 5 heridas',
    gancho: 'Para acompañar a otros, no solo para entenderte tú',
    descripcion:
      'El material de trabajo para llevar las cinco heridas a una sesión: ejercicios, guiones de conversación y el marco completo para explicarlas.',
    paraQuien: [
      'Psicólogos y terapeutas que trabajan heridas de infancia.',
      'Coaches y facilitadores que acompañan procesos personales.',
      'Quien ya hizo el test y quiere ir más a fondo.',
    ],
    incluye: [
      'Las cinco heridas explicadas para enseñarlas, no solo para leerlas.',
      'Ejercicios para trabajar cada armadura.',
      'Guiones de conversación para una sesión.',
      'Acceso durante un año, para volver cuantas veces quieras.',
    ],
    priceCop: 12000,
    priceUsd: 3,
    meses: 12,
    despuesDe: '5-heridas',
  },
]

export function getProducto(id: unknown): Producto | undefined {
  return PRODUCTOS.find((p) => p.id === id)
}

/** Un recurso se consulta muchas veces: el límite de aperturas de los tests
 *  no tiene sentido aquí. */
export function esRecurso(testId: string | null | undefined) {
  return PRODUCTOS.some((p) => p.recurso === testId)
}
