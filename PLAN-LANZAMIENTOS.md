# Plan de lanzamientos · 48 tests

Dos lanzamientos al mes, el **1** y el **15**. Cada mes combina:
- un test **de conocimiento**, basado en un modelo reconocido;
- un test **de innovación**, creado por Hostify, en su mayoría uno por cada una de las 12 áreas de la vida.

Todos llevan lectura amplia, guías prácticas, plan de acción y recursos (libros), como «Tu estilo de crianza».

> 2 tests al mes son 24 al año: los 48 completan el calendario en dos años (dic 2026 – nov 2028).
> Para lanzarlos en un año hay que salir con uno por semana; en ese caso se compactan las fechas.

## Cómo se lanza un test

1. Su HTML se guarda en `tests-internos/` y se registra en `lib/tests-internos.ts`.
2. Su ficha va en `lib/catalog.ts` con `lanzamiento: 'AAAA-MM-DD'`.
3. Se corre su SQL en Supabase, que lo agrega a `store_tests` con url `interno:<id>`.
4. Desde que se publica, la tienda lo muestra como «Llega el …». El día del lanzamiento lo pone a la venta sola, lo destaca primero y le pone la etiqueta «Nuevo» durante 30 días.

Conviene tener cada test listo **al menos una semana antes** de su fecha, para que se vea como «Próximamente» y genere expectativa.

## Calendario

| # | Fecha | Test | Tipo | Base |
|---|---|---|---|---|
| 1 | 21 nov 2026 | **Tu estilo de crianza** ✅ lanzado | Conocimiento | Baumrind; Maccoby y Martin + 6 áreas |
| 2 | 15 dic 2026 | Los 5 lenguajes del amor | Conocimiento | Gary Chapman |
| 3 | 1 ene 2027 | Las inteligencias de tu hijo (lo responde el papá o la mamá) | Conocimiento | Howard Gardner |
| 4 | 15 ene 2027 | Área 1 · Espiritualidad | Innovación · 12 áreas | Hostify |
| 5 | 1 feb 2027 | Tu estilo de apego | Conocimiento | Bowlby y Ainsworth; apego adulto |
| 6 | 15 feb 2027 | La salud de tu matrimonio | Conocimiento | John Gottman |
| 7 | 1 mar 2027 | El temperamento de tu hijo | Conocimiento | Thomas y Chess |
| 8 | 15 mar 2027 | Área 2 · Propósito de vida | Innovación · 12 áreas | Hostify |
| 9 | 1 abr 2027 | Tus 5 grandes rasgos | Conocimiento | Big Five (IPIP, dominio público) |
| 10 | 15 abr 2027 | Tus dones motivacionales | Conocimiento | Romanos 12 |
| 11 | 1 may 2027 | Mamá hoy: carga, culpa e identidad (mes de la madre) | Innovación | Hostify |
| 12 | 15 may 2027 | Área 3 · Carácter | Innovación · 12 áreas | Hostify |
| 13 | 1 jun 2027 | Papá presente (mes del padre) | Innovación | Hostify |
| 14 | 15 jun 2027 | Área 4 · Vida familiar | Innovación · 12 áreas | Hostify |
| 15 | 1 jul 2027 | Tus fortalezas de carácter | Conocimiento | Peterson y Seligman (24 fortalezas) |
| 16 | 15 jul 2027 | Área 5 · Vida emocional | Innovación · 12 áreas | Hostify |
| 17 | 1 ago 2027 | Tu inteligencia emocional | Conocimiento | Daniel Goleman |
| 18 | 15 ago 2027 | El lenguaje del amor de tu hijo | Conocimiento | Chapman y Campbell |
| 19 | 1 sep 2027 | Lenguajes del amor en pareja, para los dos (mes de amor y amistad) | Conocimiento | Gary Chapman |
| 20 | 15 sep 2027 | Área 6 · Vida amorosa | Innovación · 12 áreas | Hostify |
| 21 | 1 oct 2027 | Tus talentos naturales | Innovación | Hostify |
| 22 | 15 oct 2027 | Área 7 · Carrera profesional | Innovación · 12 áreas | Hostify |
| 23 | 1 nov 2027 | Cómo manejas el conflicto | Conocimiento | Thomas y Kilmann (5 estilos) |
| 24 | 15 nov 2027 | Área 8 · Vida financiera | Innovación · 12 áreas | Hostify |
| 25 | 1 dic 2027 | Tu familia de origen | Innovación | Hostify |
| 26 | 15 dic 2027 | Tus 4 temperamentos | Conocimiento | Clásico (sanguíneo, colérico, melancólico, flemático) |
| 27 | 1 ene 2028 | Tu mentalidad: fija o de crecimiento | Conocimiento | Carol Dweck |
| 28 | 15 ene 2028 | Área 9 · Salud física | Innovación · 12 áreas | Hostify |
| 29 | 1 feb 2028 | Tus valores | Conocimiento | Shalom Schwartz |
| 30 | 15 feb 2028 | Área 10 · Vida intelectual | Innovación · 12 áreas | Hostify |
| 31 | 1 mar 2028 | Hijos adolescentes: el puente | Innovación | Hostify |
| 32 | 15 mar 2028 | Área 11 · Vida social | Innovación · 12 áreas | Hostify |
| 33 | 1 abr 2028 | Tu estilo de comunicación | Conocimiento | Asertividad |
| 34 | 15 abr 2028 | Área 12 · Calidad de vida | Innovación · 12 áreas | Hostify |
| 35 | 1 may 2028 | Tus inteligencias múltiples (adultos) | Conocimiento | Howard Gardner |
| 36 | 15 may 2028 | Tu resiliencia | Innovación | Hostify |
| 37 | 1 jun 2028 | Tu nivel de desgaste | Conocimiento | Maslach (burnout, no diagnóstico) |
| 38 | 15 jun 2028 | Tu capacidad de perdonar | Innovación | Hostify |
| 39 | 1 jul 2028 | Tus anclas de carrera | Conocimiento | Edgar Schein |
| 40 | 15 jul 2028 | Tu autoestima | Conocimiento | Rosenberg + Hostify |
| 41 | 1 ago 2028 | Tu forma de aprender | Conocimiento | David Kolb |
| 42 | 15 ago 2028 | Gratitud y contentamiento | Innovación | Hostify |
| 43 | 1 sep 2028 | Tu vocación | Conocimiento | Holland (RIASEC) |
| 44 | 15 sep 2028 | Tu relación con el tiempo | Innovación | Hostify |
| 45 | 1 oct 2028 | Tu liderazgo situacional | Conocimiento | Hersey y Blanchard |
| 46 | 15 oct 2028 | Tu forma de decidir | Conocimiento | Scott y Bruce |
| 47 | 1 nov 2028 | Tu sistema de hábitos | Innovación | Hostify |
| 48 | 15 nov 2028 | Tu legado | Innovación | Hostify |

## Reglas para todos los tests

- **Preguntas propias.** Los modelos (DISC, Big Five, Gardner, Chapman…) son ideas que se pueden usar. Los cuestionarios comerciales (CliftonStrengths, MBTI, VIA, el de Chapman) no se copian: las preguntas se escriben desde cero.
- **Dos fuentes que se contrastan**, como en el Eneagrama y Crianza: afirmaciones más situaciones reales. Da lecturas más ricas que una sola lista.
- **Siempre con salida práctica:**
  - lectura amplia;
  - las dos áreas más bajas con su guía;
  - frases para usar;
  - plan de 21 días;
  - libros.
- **Sin astrología ni nada esotérico.**
- **Aviso de que no es un diagnóstico clínico** en los tests de salud emocional, apego o desgaste.
