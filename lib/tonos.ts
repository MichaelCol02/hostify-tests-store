// Cada familia de tests tiene su color, para que en la portada y el catálogo
// no se vean todos iguales. El naranja de la marca queda para hospitalidad y
// para los botones de compra.

export interface Tono {
  nombre: string
  /** Color principal: barras, etiquetas, botón de la tarjeta. */
  c: string
  /** Fondo suave para el ícono. */
  suave: string
  /** Texto sobre fondo claro (más oscuro, para que se lea). */
  texto: string
}

export const TONOS = {
  amor: { nombre: 'Amor y pareja', c: '#E5466F', suave: '#FDEBF0', texto: '#B8284F' },
  familia: { nombre: 'Familia', c: '#0E9F8E', suave: '#E3F6F3', texto: '#0A7568' },
  autoconocimiento: { nombre: 'Autoconocimiento', c: '#7357F6', suave: '#EFEBFF', texto: '#5338D6' },
  liderazgo: { nombre: 'Liderazgo y equipos', c: '#2F6FEB', suave: '#E8F0FE', texto: '#1F55C2' },
  bienestar: { nombre: 'Bienestar', c: '#2F9E5B', suave: '#E7F5EC', texto: '#227843' },
  dinero: { nombre: 'Finanzas', c: '#D4900A', suave: '#FBF2DE', texto: '#9A6500' },
  hospitalidad: { nombre: 'Hospitalidad', c: '#FF6B2C', suave: '#FFF1EA', texto: '#D94D1A' },
} satisfies Record<string, Tono>

const POR_TEST: Record<string, keyof typeof TONOS> = {
  'lenguajes-amor': 'amor',
  'lenguajes-amor-pareja': 'amor',
  'eneagrama-pareja': 'amor',
  'estilo-crianza': 'familia',
  'inteligencias-hijo': 'familia',
  eneagrama: 'autoconocimiento',
  '5-heridas': 'autoconocimiento',
  '5-casas': 'autoconocimiento',
  disc: 'liderazgo',
  '5-niveles-liderazgo': 'liderazgo',
  'checkbox-5-niveles': 'liderazgo',
  'areas-vida': 'bienestar',
  finanzas: 'dinero',
  hii: 'hospitalidad',
}

export function tonoDe(testId: string): Tono {
  return TONOS[POR_TEST[testId] ?? 'hospitalidad']
}
