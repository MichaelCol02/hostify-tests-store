// La marca de cada test: su portada, como la carátula de un libro.
// Cada uno tiene su fondo, su tipografía, su símbolo y su color de acento,
// para que en el catálogo ninguno se parezca a otro.

export type Fuente = 'anton' | 'serif' | 'script' | 'archivo'

export type Motivo =
  | 'corazones'
  | 'anillos'
  | 'raices'
  | 'arcoiris'
  | 'rueda'
  | 'barras'
  | 'grietas'
  | 'rayos'
  | 'cuadrantes'
  | 'escalones'
  | 'checks'
  | 'casas'
  | 'eneagrama'
  | 'eneagrama-doble'

export interface Linea {
  t: string
  f: Fuente
  /** Tamaño en % del ancho de la portada. */
  s: number
  i?: boolean
  /** Color propio de esta línea; si no, el de la marca. */
  c?: string
  /** Espaciado entre letras, en em. */
  ls?: number
}

export interface Marca {
  /** Degradado del fondo, de arriba a la izquierda hacia abajo a la derecha. */
  fondo: [string, string]
  /** Color del texto de la portada. */
  tinta: string
  /** Color del símbolo y de los detalles. */
  acento: string
  motivo: Motivo
  lineas: Linea[]
  /** Fondo oscuro de la ficha del test (el hero). */
  profundo: string
}

const ORO = '#E8B84A'

export const MARCAS: Record<string, Marca> = {
  'lenguajes-amor': {
    fondo: ['#7A0F31', '#E5466F'],
    tinta: '#FFF4F6',
    acento: '#FFC2D1',
    motivo: 'corazones',
    profundo: '#3A0717',
    lineas: [
      { t: 'Los 5', f: 'script', s: 9 },
      { t: 'LENGUAJES', f: 'anton', s: 17 },
      { t: 'del amor', f: 'serif', s: 10.5, i: true },
    ],
  },
  'lenguajes-amor-pareja': {
    fondo: ['#2E0A18', '#A32E52'],
    tinta: '#FFF1EC',
    acento: '#F4B9A7',
    motivo: 'anillos',
    profundo: '#22070F',
    lineas: [
      { t: 'LOS 5 LENGUAJES DEL AMOR', f: 'anton', s: 6, ls: 0.06 },
      { t: 'en pareja', f: 'serif', s: 16, i: true, c: '#F4B9A7' },
    ],
  },
  'estilo-crianza': {
    fondo: ['#F4ECDF', '#E2D3BA'],
    tinta: '#0A5A51',
    acento: '#0E9F8E',
    motivo: 'raices',
    profundo: '#06352F',
    lineas: [
      { t: 'Tu estilo de', f: 'serif', s: 9, i: true },
      { t: 'CRIANZA', f: 'anton', s: 22 },
    ],
  },
  'inteligencias-hijo': {
    fondo: ['#FBF5E9', '#F3E7CF'],
    tinta: '#14213D',
    acento: '#0E9F8E',
    motivo: 'arcoiris',
    profundo: '#0B1830',
    lineas: [
      { t: 'LAS', f: 'archivo', s: 5.5, ls: 0.2 },
      { t: 'INTELIGENCIAS', f: 'archivo', s: 9.6 },
      { t: 'de tu hijo', f: 'script', s: 12, c: '#0E9F8E' },
    ],
  },
  'areas-vida': {
    fondo: ['#0C2818', '#2F9E5B'],
    tinta: '#F1FBF4',
    acento: '#9BE3B5',
    motivo: 'rueda',
    profundo: '#071A0F',
    lineas: [
      { t: 'LAS 12', f: 'anton', s: 9, ls: 0.08 },
      { t: 'ÁREAS', f: 'anton', s: 21 },
      { t: 'de tu vida', f: 'serif', s: 10, i: true },
    ],
  },
  finanzas: {
    fondo: ['#0B140E', '#1F3B27'],
    tinta: '#F5EFDF',
    acento: ORO,
    motivo: 'barras',
    profundo: '#070D09',
    lineas: [
      { t: 'Mi relación con el', f: 'serif', s: 8, i: true },
      { t: 'DINERO', f: 'archivo', s: 19, c: ORO },
    ],
  },
  '5-heridas': {
    fondo: ['#101010', '#2B2420'],
    tinta: '#F3EDE4',
    acento: ORO,
    motivo: 'grietas',
    profundo: '#0A0A0A',
    lineas: [
      { t: 'LAS 5', f: 'anton', s: 8, c: ORO, ls: 0.12 },
      { t: 'HERIDAS', f: 'anton', s: 21 },
      { t: 'y sus armaduras', f: 'serif', s: 7, i: true },
    ],
  },
  hii: {
    fondo: ['#1C0A02', '#FF6B2C'],
    tinta: '#FFF5EF',
    acento: '#FFB48F',
    motivo: 'rayos',
    profundo: '#140701',
    lineas: [
      { t: 'HOSPITALITY', f: 'anton', s: 12.5 },
      { t: 'INTELLIGENCE', f: 'anton', s: 12.5 },
      { t: 'index', f: 'serif', s: 10, i: true },
    ],
  },
  disc: {
    fondo: ['#111111', '#1D1D1D'],
    tinta: '#FFFFFF',
    acento: '#FFFFFF',
    motivo: 'cuadrantes',
    profundo: '#0D0D0D',
    lineas: [
      { t: 'DISC', f: 'archivo', s: 27, ls: 0.02 },
      { t: 'tu perfil conductual', f: 'serif', s: 7.5, i: true },
    ],
  },
  '5-niveles-liderazgo': {
    fondo: ['#081634', '#2F6FEB'],
    tinta: '#F0F5FF',
    acento: '#9DBCFF',
    motivo: 'escalones',
    profundo: '#050E22',
    lineas: [
      { t: 'LOS 5 NIVELES', f: 'anton', s: 12 },
      { t: 'de liderazgo', f: 'serif', s: 11, i: true },
    ],
  },
  'checkbox-5-niveles': {
    fondo: ['#EEF3FE', '#D9E5FD'],
    tinta: '#0B1B3F',
    acento: '#2F6FEB',
    motivo: 'checks',
    profundo: '#081634',
    lineas: [
      { t: 'CHECKBOX', f: 'archivo', s: 13 },
      { t: '5 niveles', f: 'script', s: 12, c: '#2F6FEB' },
    ],
  },
  '5-casas': {
    fondo: ['#1A1240', '#7357F6'],
    tinta: '#F4F1FF',
    acento: '#C9BCFF',
    motivo: 'casas',
    profundo: '#0F0A28',
    lineas: [
      { t: 'TEST', f: 'anton', s: 6.5, ls: 0.3 },
      { t: '5 CASAS', f: 'anton', s: 20 },
      { t: 'tu propósito', f: 'serif', s: 7.5, i: true },
    ],
  },
  eneagrama: {
    fondo: ['#120D2A', '#4B2FB8'],
    tinta: '#F3F0FF',
    acento: '#B7A6FF',
    motivo: 'eneagrama',
    profundo: '#0B0820',
    lineas: [
      { t: 'ENEAGRAMA', f: 'anton', s: 16 },
      { t: 'tu esencia', f: 'serif', s: 9, i: true },
    ],
  },
  'eneagrama-pareja': {
    fondo: ['#1C0C2B', '#8E2A6B'],
    tinta: '#FFF0F8',
    acento: '#F3A9D2',
    motivo: 'eneagrama-doble',
    profundo: '#13071E',
    lineas: [
      { t: 'ENEAGRAMA', f: 'anton', s: 14 },
      { t: 'en pareja', f: 'script', s: 13, c: '#F3A9D2' },
    ],
  },
}

/** Para un test nuevo que todavía no tiene marca: una portada sobria con su nombre. */
export function marcaDe(id: string, nombre: string): Marca {
  return (
    MARCAS[id] ?? {
      fondo: ['#1C0A02', '#FF6B2C'],
      tinta: '#FFF5EF',
      acento: '#FFB48F',
      motivo: 'rayos',
      profundo: '#140701',
      lineas: [{ t: nombre.toUpperCase(), f: 'anton', s: nombre.length > 18 ? 8 : 12 }],
    }
  )
}

/** ¿La portada es clara? Entonces el texto de encima va oscuro. */
export function esClara(m: Marca) {
  return m.tinta.startsWith('#0') || m.tinta.startsWith('#1')
}

function luz(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255
}

/** El color vivo de la marca, para barras, anillos y detalles sobre fondo blanco.
 *  Si el fondo de la portada es muy claro o muy oscuro, se usa el acento. */
export function colorVivo(m: Marca) {
  const l = luz(m.fondo[1])
  if (l > 0.25 && l < 0.75) return m.fondo[1]
  const la = luz(m.acento)
  return la > 0.75 ? m.fondo[1] === '#1D1D1D' ? '#2F6FEB' : '#B8862B' : m.acento
}
