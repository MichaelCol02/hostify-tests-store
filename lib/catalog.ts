// Public catalog. Test URLs are deliberately absent: they live only in store_tests.url
// and are returned by store_redeem_credit after a credit is spent.

export type TestIcon = 'levels' | 'disc' | 'voice' | 'hospitality' | 'houses' | 'enneagram' | 'couple' | 'tree' | 'money' | 'shield' | 'family'

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
  /** Día en que sale a la venta (AAAA-MM-DD, hora de Colombia). Antes de esa
   *  fecha la ficha muestra «Próximamente» y no deja comprar; el día llega y
   *  la tienda lo lanza sola, sin publicar nada. Sin fecha: ya está a la venta. */
  lanzamiento?: string
  /** Video vertical que explica el test (en public/videos). La ficha lo muestra antes de comprar. */
  video?: { src: string; poster: string; titulo: string; texto: string }
}

export type Audience = 'colaborador' | 'lider' | 'gerente'

export const AUDIENCES: { id: Audience; label: string; blurb: string }[] = [
  { id: 'colaborador', label: 'Colaborador', blurb: 'Trabajas de cara al huésped y quieres crecer.' },
  { id: 'lider', label: 'Líder de equipo', blurb: 'Diriges personas y quieres liderar mejor.' },
  { id: 'gerente', label: 'Dueño o gerente', blurb: 'Necesitas conocer y elegir a tu equipo.' },
]

export const CATALOG: CatalogTest[] = [
  {
    id: 'estilo-crianza',
    name: 'Tu estilo de crianza',
    kicker: 'Familia y paternidad',
    description:
      'Qué tipo de papá o mamá eres de verdad: lo que haces en el día a día y lo que haces cuando la situación aprieta. Con guía práctica y plan de 21 días.',
    duration: '15–20 min',
    questions: 48,
    modules: ['Calidez', 'Estructura', 'Autonomía', 'Escucha', 'Autorregulación', 'Coherencia', 'Presencia', 'Reparación'],
    icon: 'family',
    measures: 'Tu estilo de crianza en calma y bajo presión, y ocho áreas que deciden cómo crecen tus hijos.',
    idealFor: 'Mamás, papás y cuidadores que quieren criar con más intención.',
    deliver: 'Tu estilo, tu perfil en 8 áreas, guías para las dos más bajas, consejos según la edad de tus hijos y un plan de 21 días.',
    audience: ['colaborador', 'lider', 'gerente'],
    credits: 1,
    people: 1,
    lanzamiento: '2026-11-21',
  },
  {
    id: 'areas-vida',
    name: 'Las 12 áreas de tu vida',
    kicker: 'Equilibrio',
    description:
      'Doce áreas agrupadas como un árbol: lo que te sostiene por dentro, cómo te cuidas, con quién caminas y qué produces.',
    duration: '12–15 min',
    questions: 24,
    modules: ['Raíz', 'Tronco', 'Ramas', 'Fruto'],
    icon: 'tree',
    measures: 'El estado real de doce áreas de tu vida y cuáles están sosteniendo a las demás.',
    idealFor: 'Quien siente que algo no cuadra pero no sabe dónde mirar.',
    deliver: 'Tu mapa por área, las que están en riesgo y una ruta de trabajo personal.',
    audience: ['colaborador', 'lider', 'gerente'],
    credits: 1,
    people: 1,
  },
  {
    id: 'finanzas',
    name: 'Mi relación con el dinero',
    kicker: 'Finanzas personales',
    description:
      'Tres dimensiones que sí miden salud financiera: cómo piensas el dinero, cómo estás hoy y qué necesitas.',
    duration: '3–5 min',
    questions: 3,
    modules: ['Mentalidad', 'Realidad', 'Necesidad'],
    icon: 'money',
    measures: 'Tu relación con el dinero: la emocional, la real y la que te hace falta.',
    idealFor: 'Quien quiere una lectura honesta y rápida de su situación financiera.',
    deliver: 'Tu termómetro financiero y el paso siguiente según dónde estés.',
    audience: ['colaborador', 'lider', 'gerente'],
    credits: 1,
    people: 1,
  },
  {
    id: '5-heridas',
    name: 'Las 5 heridas',
    kicker: 'Inventario de armaduras',
    description:
      'Veinte afirmaciones que revelan qué armadura construiste para protegerte y qué te está costando hoy.',
    duration: '5–8 min',
    questions: 20,
    modules: ['Rechazo', 'Abandono', 'Humillación', 'Traición', 'Injusticia'],
    icon: 'shield',
    measures: 'Cuál de las cinco heridas pesa más en ti y la armadura que levantaste para cubrirla.',
    idealFor: 'Trabajo personal, terapia y procesos de acompañamiento.',
    deliver: 'Tu herida principal, el costo que te cobra y un movimiento concreto para esta semana.',
    audience: ['colaborador', 'lider'],
    credits: 1,
    people: 1,
  },
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
    video: {
      src: '/videos/hii-de-adentro-hacia-afuera.mp4',
      poster: '/videos/hii-de-adentro-hacia-afuera.jpg',
      titulo: '¿En qué nivel de hospitalidad está hoy tu hotel?',
      texto:
        'El éxito en la hotelería no está en invertir más en pauta, hacer más reels o abrir más plataformas. Está en entrenar a tus equipos en la hospitalidad irracional, de adentro hacia afuera.',
    },
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

/** Medianoche de Colombia (UTC-5) del día de lanzamiento. */
export function fechaLanzamiento(t: CatalogTest): Date | null {
  return t.lanzamiento ? new Date(`${t.lanzamiento}T00:00:00-05:00`) : null
}

export function estaPublicado(t: CatalogTest, ahora = new Date()) {
  const f = fechaLanzamiento(t)
  return !f || f.getTime() <= ahora.getTime()
}

/** Lanzado hace menos de 30 días: lleva la etiqueta «Nuevo». */
export function esNuevo(t: CatalogTest, ahora = new Date()) {
  const f = fechaLanzamiento(t)
  return !!f && f.getTime() <= ahora.getTime() && ahora.getTime() - f.getTime() < 30 * 86400000
}

/** Lo que ya se puede comprar, con los recién lanzados primero. */
export function publicados(ahora = new Date()) {
  const lista = CATALOG.filter((t) => estaPublicado(t, ahora))
  return [...lista.filter((t) => esNuevo(t, ahora)), ...lista.filter((t) => !esNuevo(t, ahora))]
}

/** Lo que ya tiene ficha pero todavía no sale, del más cercano al más lejano. */
export function proximos(ahora = new Date()) {
  return CATALOG.filter((t) => !estaPublicado(t, ahora)).sort(
    (a, b) => fechaLanzamiento(a)!.getTime() - fechaLanzamiento(b)!.getTime()
  )
}

export function fechaLarga(t: CatalogTest) {
  const f = fechaLanzamiento(t)
  return f ? f.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', timeZone: 'America/Bogota' }) : ''
}

export function getCatalogTest(id: string) {
  return CATALOG.find((t) => t.id === id)
}
