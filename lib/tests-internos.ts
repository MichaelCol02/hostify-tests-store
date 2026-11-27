// Tests que viven dentro de la tienda en lugar de en un sitio aparte.
// En store_tests.url van como «interno:<id>» y /t/<intento> los entrega desde
// aquí. Para sumar uno: guarda su HTML en tests-internos/ y agrégalo abajo.
import estiloCrianza from '@/tests-internos/estilo-crianza.html'
import lenguajesAmor from '@/tests-internos/lenguajes-amor.html'
import inteligenciasHijo from '@/tests-internos/inteligencias-hijo.html'

interface TestInterno {
  html: string
  /** Para dos personas: quien compra recibe un enlace aparte para su pareja. */
  pareja?: boolean
}

const TESTS: Record<string, TestInterno> = {
  'estilo-crianza': { html: estiloCrianza },
  'lenguajes-amor': { html: lenguajesAmor },
  'lenguajes-amor-pareja': { html: lenguajesAmor, pareja: true },
  'inteligencias-hijo': { html: inteligenciasHijo },
}

export const PREFIJO_INTERNO = 'interno:'

export function testInterno(url: string): TestInterno | null {
  if (!url.startsWith(PREFIJO_INTERNO)) return null
  return TESTS[url.slice(PREFIJO_INTERNO.length)] ?? null
}

/** Le cuenta al test, antes de que cargue, si es para dos y quién lo abre. */
export function conContexto(html: string, contexto: Record<string, unknown>) {
  const etiqueta = `<script>window.HOSTIFY=${JSON.stringify(contexto).replace(/</g, '\\u003c')}</script>`
  return html.includes('</head>') ? html.replace('</head>', `${etiqueta}</head>`) : etiqueta + html
}
