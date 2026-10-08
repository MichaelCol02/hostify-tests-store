/** Landings de campaña: una página por test, sin menú ni distracciones, para mandar
 *  tráfico de anuncios. Las imágenes son capturas reales del informe de cada test. */
export interface Landing {
  testId: string
  gancho: string
  titular: string
  resaltado: string
  subtitulo: string
  descubres: string[]
  imagenes: { src: string; alt: string; pie: string }[]
  paraQuien: string[]
  noEsPara: string[]
  faq: { q: string; a: string }[]
}

export const LANDINGS: Landing[] = [
  {
    testId: 'eneagrama',
    gancho: 'Eneagrama con tres fuentes',
    titular: 'Sabes cómo actúas.',
    resaltado: 'Esto te dice por qué.',
    subtitulo:
      'La mayoría de tests te pone una etiqueta. Este mide tu esencia con tres fuentes distintas que se contrastan entre sí, y te dice qué tan firme es el resultado.',
    descubres: [
      'Cuál de las nueve esencias te mueve de verdad, y cuáles dos se le parecen',
      'Tu ala y tu subtipo: por qué dos personas del mismo número se comportan distinto',
      'La trampa de tu esencia, esa que repites sin darte cuenta',
      'Qué tan libre eres hoy del patrón, y qué se ve cuando no lo estás',
      'Cómo se nota tu esencia en el trabajo, el amor, la familia y el dinero',
    ],
    imagenes: [
      { src: '/informes/eneagrama/perfil.jpg', alt: 'Resultado con la esencia identificada', pie: 'Tu esencia, con ala y tríada' },
      { src: '/informes/eneagrama/escala.jpg', alt: 'Las nueve esencias ordenadas por presencia', pie: 'Las nueve, de la más presente a la menos' },
      { src: '/informes/eneagrama/candidatas.jpg', alt: 'Las tres esencias candidatas con su motivación', pie: 'Tus tres candidatas, para que elijas con criterio' },
    ],
    paraQuien: [
      'Quien ya leyó sobre eneagrama y quedó con la duda de su número',
      'Quien lidera gente y quiere entender por qué choca con ciertos perfiles',
      'Quien está en terapia o en un proceso de desarrollo personal',
    ],
    noEsPara: [
      'Quien busca un diagnóstico clínico: esto no lo es',
      'Quien quiere una respuesta en dos minutos sin leer',
      'Quien va a responder pensando en cómo le gustaría ser',
    ],
    faq: [
      { q: '¿Cuánto me demoro?', a: 'Entre 20 y 25 minutos. Son 79 preguntas repartidas en tres bloques: afirmaciones, duelos y escenarios.' },
      { q: '¿Qué recibo exactamente?', a: 'Un informe de 14 secciones con tu esencia, tu ala, tu subtipo, tus tres candidatas y cómo se ve tu patrón en cada área de tu vida.' },
      { q: '¿Tengo que crear una cuenta?', a: 'No. Pagas, y con el correo de tu pago te creamos la cuenta sola. El test se abre enseguida.' },
      { q: '¿Y si me interrumpen?', a: 'El test queda abierto 24 horas. Puedes cerrar la ventana y volver donde ibas.' },
    ],
  },
]

export function getLanding(testId: string) {
  return LANDINGS.find((l) => l.testId === testId)
}
