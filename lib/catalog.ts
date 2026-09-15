// Public catalog. Test URLs are deliberately absent: they live only in store_tests.url
// and are returned by store_redeem_credit after a credit is spent.

export type TestIcon = 'levels' | 'disc' | 'voice' | 'hospitality' | 'houses'

export interface CatalogTest {
  id: string
  name: string
  kicker: string
  description: string
  duration: string
  questions: number
  modules: string[]
  icon: TestIcon
}

export const CATALOG: CatalogTest[] = [
  {
    id: 'hii',
    name: 'Hospitality Intelligence Index',
    kicker: 'Hospitalidad',
    description: 'Mide tu capacidad para crear experiencias memorables en cinco dimensiones.',
    duration: '15–20 min',
    questions: 50,
    modules: ['Conciencia personal', 'Inteligencia relacional', 'Experiencias', 'Cultura', 'Liderazgo'],
    icon: 'hospitality',
  },
  {
    id: 'disc',
    name: 'DISC',
    kicker: 'Perfil conductual',
    description: 'Descubre cómo decides, influyes, colaboras y cuidas los detalles.',
    duration: '20–25 min',
    questions: 28,
    modules: ['Determinación', 'Influencia', 'Serenidad', 'Corrección'],
    icon: 'disc',
  },
  {
    id: '5-niveles-liderazgo',
    name: '5 Niveles de Liderazgo',
    kicker: 'Liderazgo',
    description: 'Evaluación completa de liderazgo con medición de voz y comunicación.',
    duration: '10–30 min',
    questions: 80,
    modules: ['Niveles', 'Voz', 'Comunicación'],
    icon: 'voice',
  },
  {
    id: 'checkbox-5-niveles',
    name: 'Checkbox 5 Niveles',
    kicker: 'Auditoría rápida',
    description: 'Cincuenta casillas para ubicar con precisión dónde está tu liderazgo hoy.',
    duration: '10–15 min',
    questions: 50,
    modules: ['Posición', 'Permiso', 'Producción', 'Desarrollo', 'Pináculo'],
    icon: 'levels',
  },
  {
    id: '5-casas',
    name: 'Test 5 Casas',
    kicker: 'Propósito',
    description: 'Encuentra tu casa: Pioneros, Los que Ven, Puente, Mesa o Raíces.',
    duration: '15–20 min',
    questions: 40,
    modules: ['Propósito', 'Rol', 'Servicio'],
    icon: 'houses',
  },
]

export function getCatalogTest(id: string) {
  return CATALOG.find((t) => t.id === id)
}
