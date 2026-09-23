// Public catalog. Test URLs are deliberately absent: they live only in store_tests.url
// and are returned by store_redeem_credit after a credit is spent.

export type TestIcon = 'levels' | 'disc' | 'voice' | 'hospitality' | 'houses' | 'enneagram' | 'couple'

export interface CatalogTest {
  id: string
  name: string
  kicker: string
  description: string
  duration: string
  questions: number
  modules: string[]
  icon: TestIcon
  /** Credits a run costs. Must match store_tests.credit_cost, which is what the
   *  server actually charges; this copy only drives what the page says. */
  credits: number
  /** How many people one run covers. */
  people: number
  /** Contextual pack to put first when this test is opened without enough
   *  credits. Only ids from CONTEXTUAL_PACKS do anything here; the general
   *  packs are always offered. */
  suggestedPack?: 'pareja'
  /** Qué mide, para quién es y qué se lleva: las tres columnas del comparador. */
  measures: string
  idealFor: string
  deliver: string
  /** Perfiles a los que el selector de la home le recomienda este test. */
  audience: Audience[]
}

export type Audience = 'colaborador' | 'lider' | 'gerente'

export const AUDIENCES: { id: Audience; label: string; blurb: string }[] = [
  { id: 'colaborador', label: 'Colaborador', blurb: 'Trabajas de cara al huésped y quieres crecer.' },
  { id: 'lider', label: 'Líder de equipo', blurb: 'Diriges personas y quieres liderar mejor.' },
  { id: 'gerente', label: 'Dueño o gerente', blurb: 'Necesitas conocer y elegir a tu equipo.' },
]

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
    measures: 'Cinco dimensiones de la hospitalidad: conciencia personal, relación, experiencias, cultura y liderazgo.',
    idealFor: 'Personal de contacto y equipos completos de hotel.',
    deliver: 'Tu índice por dimensión y el nivel de hospitalidad que alcanzas hoy.',
    audience: ['colaborador', 'lider', 'gerente'],
    credits: 1,
    people: 1,
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
    measures: 'Tu estilo conductual: cómo decides, influyes, colaboras y cuidas los detalles.',
    idealFor: 'Selección de personal y armado de equipos que se complementen.',
    deliver: 'Tu perfil DISC dominante y cómo cambia bajo presión.',
    audience: ['colaborador', 'lider', 'gerente'],
    credits: 1,
    people: 1,
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
    measures: 'Los cinco niveles de liderazgo, con medición de voz y comunicación.',
    idealFor: 'Jefes de área, supervisores y quien aspira a dirigir.',
    deliver: 'El nivel desde el que lideras hoy y qué te falta para el siguiente.',
    audience: ['lider', 'gerente'],
    credits: 1,
    people: 1,
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
    measures: 'Cincuenta señales concretas de liderazgo, diez por cada nivel.',
    idealFor: 'Quien quiere una lectura rápida y sin rodeos de dónde está.',
    deliver: 'Tu nivel actual y las casillas que todavía no marcas.',
    audience: ['lider', 'gerente'],
    credits: 1,
    people: 1,
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
    measures: 'Tu casa de propósito: Pioneros, Los que Ven, Puente, Mesa o Raíces.',
    idealFor: 'Equipos que quieren entender el rol de cada uno.',
    deliver: 'Tu casa, tu rol natural y cómo aporta al equipo.',
    audience: ['colaborador', 'lider'],
    credits: 1,
    people: 1,
  },
  {
    id: 'eneagrama',
    name: 'Eneagrama',
    kicker: 'Esencia',
    description:
      'Cuál de las nueve esencias eres, medida con tres fuentes que se contrastan entre sí. Incluye ala, subtipo y grado de libertad frente al patrón.',
    duration: '20–25 min',
    questions: 79,
    modules: ['Afirmaciones', 'Duelos', 'Escenarios', 'Subtipo', 'Libertad'],
    icon: 'enneagram',
    measures: 'Cuál de las nueve esencias eres, contrastada con tres fuentes distintas.',
    idealFor: 'Quien busca autoconocimiento profundo, no una etiqueta.',
    deliver: 'Tu tipo con ala, subtipo y grado de libertad frente al patrón.',
    audience: ['colaborador', 'lider', 'gerente'],
    credits: 1,
    people: 1,
  },
  {
    id: 'eneagrama-pareja',
    name: 'Eneagrama en pareja',
    kicker: 'Pareja y matrimonio',
    description:
      'Responden los dos y salen tres lecturas: la esencia de cada uno y una tercera sobre cómo se complementan, dónde está el choque y qué acordar esta semana.',
    duration: '40–50 min · los dos',
    questions: 79,
    modules: ['Las dos esencias', 'Tríadas', 'El baile del conflicto', 'Dinero y palabra', 'El puente'],
    icon: 'couple',
    measures: 'Las dos esencias y cómo se comportan cuando están juntas.',
    idealFor: 'Parejas y matrimonios que quieren entenderse mejor.',
    deliver: 'Tres lecturas: la esencia de cada uno y el mapa de la relación.',
    audience: [],
    credits: 2,
    people: 2,
    suggestedPack: 'pareja',
  },
]

export function getCatalogTest(id: string) {
  return CATALOG.find((t) => t.id === id)
}
