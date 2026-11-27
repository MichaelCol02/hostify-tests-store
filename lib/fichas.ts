// La historia de cada test en su ficha, como la página de un programa:
// 1. para quién es (el dolor que nombra), 2. lo que vas a descubrir,
// 3. cómo se ve el resultado por dentro y 4. en qué se basa.
// Todo lo que se promete aquí tiene que estar de verdad en el resultado del test.

export interface Ficha {
  dolor: { titulo: string; parrafos: string[]; frase: string }
  descubres: string[]
  resultado: { t: string; d: string }[]
  base: {
    /** Dos letras para el sello, por ejemplo «GC». */
    sello: string
    autor: string
    quien: string
    texto: string
    libro: string
  }
}

export const FICHAS: Record<string, Ficha> = {
  'lenguajes-amor': {
    dolor: {
      titulo: 'Si sientes que das amor y no llega, este test es para ti.',
      parrafos: [
        'Trabajas por tu casa, cocinas, dices «te amo»… y aun así la otra persona siente que le falta algo. O al revés: te sientes lejos, aunque te juren que hacen todo por ti.',
        'Casi nunca es falta de amor. Es que cada uno ama en un idioma distinto y espera recibirlo en el suyo.',
        'Este test te muestra en qué idioma recibes amor, en cuál lo das y qué es lo que más te duele cuando falta. Con eso, por fin pueden hablarse en el mismo idioma.',
      ],
      frase: 'Todos amamos en un idioma. Casi nunca es el mismo.',
    },
    descubres: [
      'Tu lenguaje del amor principal y el secundario',
      'Cómo das amor tú, que no siempre es como lo necesitas',
      'Lo que más te duele cuando falta',
      'Tu trampa: el error que repites sin darte cuenta',
      'Cómo pedir lo que necesitas sin reclamar',
      'Cómo se ve tu lenguaje con tus hijos y en el trabajo',
      'Un reto pequeño por día durante 21 días',
    ],
    resultado: [
      { t: 'Tus 5 lenguajes', d: 'Tu puntaje en palabras, tiempo, regalos, servicio y contacto, con tu lenguaje principal y el secundario.' },
      { t: 'Lo que te llena y lo que te vacía', d: 'Los gestos que de verdad te llenan y los que te apagan.' },
      { t: 'Cómo das y cómo recibes', d: 'Si das amor en el mismo idioma en que lo necesitas, o en otro.' },
      { t: 'Tu trampa', d: 'El error que más cometes por amar en tu propio idioma.' },
      { t: 'Cómo amarme bien', d: 'Una guía lista para enviarle a tu pareja: lo que más te llena y cómo pedirlo sin reclamar.' },
      { t: 'En la familia y en el trabajo', d: 'Cómo se ve tu lenguaje con tus hijos y con tus compañeros.' },
      { t: 'Llenar el tanque: 21 días', d: 'Un reto pequeño por día para practicarlo en casa.' },
      { t: 'Biblioteca y tu imagen para Instagram', d: 'Libros para seguir y una historia con tu lenguaje, lista para compartir.' },
    ],
    base: {
      sello: 'GC',
      autor: 'Gary Chapman',
      quien: 'Consejero matrimonial y autor de «Los 5 lenguajes del amor»',
      texto:
        'Chapman observó que las personas se sienten amadas de cinco formas principales: palabras, tiempo de calidad, regalos, actos de servicio y contacto físico. Cuando el otro nos ama en nuestro idioma, el «tanque del amor» se llena.',
      libro: 'Los 5 lenguajes del amor',
    },
  },

  'lenguajes-amor-pareja': {
    dolor: {
      titulo: 'Si se aman pero se sienten lejos, este test es para los dos.',
      parrafos: [
        'Él da lo que sabe dar; ella espera otra cosa. O al revés. Pasan los años y la conversación se vuelve reclamo: «tú nunca…», «yo siempre…».',
        'No es que se amen poco. Es que cada uno ama en su idioma y espera recibirlo en el suyo.',
        'Cada uno responde por aparte, en su celular o en el mismo, y reciben tres lecturas: la de cada uno y una de los dos, con su luz, su sombra y acuerdos para vivirlo.',
      ],
      frase: 'Amar bien es aprender el idioma del otro.',
    },
    descubres: [
      'El lenguaje del amor de cada uno, con su lectura completa',
      'Si lo que cada uno da le llega de verdad al otro',
      'Cómo se ve su amor cuando los dos tanques están llenos',
      'Cómo se ve cuando se vacían, y las señales de alerta',
      'La sombra de cada uno en la relación',
      'Una frase para que cada uno le diga al otro',
      'Acuerdos de amor concretos para esta semana',
    ],
    resultado: [
      { t: 'Dos resultados individuales completos', d: 'Cada uno recibe su propia lectura de los 5 lenguajes, con todo lo del test individual.' },
      { t: '¿Lo que cada uno da le llega al otro?', d: 'Cómo se cruzan sus dos lenguajes y dónde se pierde el amor en el camino.' },
      { t: 'Su luz', d: 'Así se ve su amor cuando los dos tanques están llenos.' },
      { t: 'Su sombra', d: 'Así se ve cuando se vacían, con las señales de alerta para no llegar ahí.' },
      { t: 'Una frase para cada uno', d: 'Lo que a cada uno le hace falta escuchar del otro.' },
      { t: 'Sus acuerdos de amor', d: 'Un ritual semanal y compromisos concretos para vivirlo juntos.' },
    ],
    base: {
      sello: 'GC',
      autor: 'Gary Chapman',
      quien: 'Consejero matrimonial y autor de «Los 5 lenguajes del amor»',
      texto:
        'Chapman propone que cada persona recibe amor sobre todo en uno de cinco lenguajes. En pareja, el reto no es amar más, sino amar en el idioma del otro.',
      libro: 'Los 5 lenguajes del amor',
    },
  },

  'estilo-crianza': {
    dolor: {
      titulo: 'Si quieres criar mejor pero a veces no te reconoces, este test es para ti.',
      parrafos: [
        'En calma tienes claro qué tipo de papá o mamá quieres ser. Pero llega el cansancio, el berrinche o la tarea a las 9 de la noche, y reaccionas de una forma que no te gusta.',
        'No hay papás perfectos. Hay papás que se conocen.',
        'Este test te muestra tu estilo de crianza en calma y bajo presión, y cómo vas en ocho áreas que deciden cómo crecen tus hijos. Con guías prácticas y un plan de 21 días.',
      ],
      frase: 'No hay papás perfectos. Hay papás que se conocen.',
    },
    descubres: [
      'Tu estilo de crianza: cómo combinas calidez y estructura',
      'Si eres el mismo en calma que bajo presión',
      'Cómo vas en 8 áreas: calidez, estructura, autonomía, escucha y más',
      'Tus fortalezas y lo que estás sembrando en tus hijos',
      'Tus dos áreas para fortalecer, con frases que ayudan',
      'Lo que tus hijos más necesitan de ti según su edad',
      'Un reto pequeño por día durante 21 días',
    ],
    resultado: [
      { t: 'Tu estilo de crianza', d: 'Dónde estás entre calidez y estructura, explicado sin juicios.' },
      { t: 'En calma y bajo presión', d: 'El contraste entre lo que crees y lo que haces cuando la situación aprieta.' },
      { t: 'Las 8 áreas de tu crianza', d: 'Tu mapa en calidez, estructura, autonomía, escucha, autorregulación, coherencia, presencia y reparación.' },
      { t: 'Tus fortalezas y tus riesgos', d: 'Lo que estás sembrando bien y lo que conviene cuidar.' },
      { t: 'Tus dos áreas para fortalecer', d: 'Guías con frases que ayudan, frases que evitar y qué hacer esta semana.' },
      { t: 'Según la edad de tus hijos', d: 'Lo que más necesitan de ti ahora.' },
      { t: 'Un reto pequeño por día: 21 días', d: 'Un plan sencillo para practicar en casa.' },
      { t: 'Libros y tu imagen para Instagram', d: 'Para seguir aprendiendo y para compartir tu estilo.' },
    ],
    base: {
      sello: 'DB',
      autor: 'Diana Baumrind',
      quien: 'Psicóloga del desarrollo, Universidad de California, Berkeley',
      texto:
        'Baumrind, y después Maccoby y Martin, describieron los estilos de crianza cruzando dos fuerzas: la calidez y la estructura. Les sumamos seis áreas más para que el resultado sea práctico en el día a día.',
      libro: 'Estilos parentales (Baumrind; Maccoby y Martin)',
    },
  },

  'inteligencias-hijo': {
    dolor: {
      titulo: 'Si tu hijo no encaja en el molde del colegio, este test es para ti.',
      parrafos: [
        'Le cuesta la tarea, pero arma cosas increíbles. No para de moverse, pero entiende a todo el mundo. Las notas no cuentan toda la historia.',
        'Todos los niños son inteligentes, pero no de la misma forma.',
        'Este test te muestra las inteligencias más fuertes de tu hijo, cómo aprende mejor y qué hacer en casa según su edad, de 3 a 17 años.',
      ],
      frase: 'No preguntes qué tan inteligente es. Pregunta cómo es inteligente.',
    },
    descubres: [
      'Las tres inteligencias más fuertes de tu hijo',
      'Su mapa de las 8 inteligencias',
      'Cómo aprende mejor y frases que la alimentan',
      'Actividades para hacer en casa según su edad',
      'Cómo ayudarle a estudiar con sus fortalezas',
      'Lo que ves en el día a día frente a lo que elige cuando es libre',
      'Un plan de 21 días para que florezca',
    ],
    resultado: [
      { t: 'Su constelación', d: 'Las tres inteligencias más fuertes de tu hijo y cómo se combinan.' },
      { t: 'Las 8 inteligencias', d: 'Su mapa completo: palabras, lógica, imágenes, cuerpo, música, personas, interior y naturaleza.' },
      { t: 'Su inteligencia principal, a fondo', d: 'Cómo piensa, cómo aprende mejor, frases que la alimentan, un cuidado y los caminos donde brilla.' },
      { t: 'Actividades para su edad', d: 'Ideas concretas para 3–5, 6–8, 9–12 o 13–17 años.' },
      { t: 'Cómo ayudarle a estudiar', d: 'Técnicas de estudio según sus fortalezas.' },
      { t: 'Lo que ves y lo que elige', d: 'El contraste entre su día a día y lo que hace cuando es libre.' },
      { t: 'Para que florezca: 21 días', d: 'Un plan sencillo para acompañarle en casa.' },
      { t: 'Libros y su imagen para Instagram', d: 'Para seguir aprendiendo. La imagen no muestra el nombre de tu hijo.' },
    ],
    base: {
      sello: 'HG',
      autor: 'Howard Gardner',
      quien: 'Psicólogo e investigador de la Universidad de Harvard',
      texto:
        'Gardner propuso que no existe una sola inteligencia, sino varias: cada persona tiene una combinación propia. Es un mapa de fortalezas para acompañar mejor a tu hijo, no un examen.',
      libro: 'Estructuras de la mente',
    },
  },
}
