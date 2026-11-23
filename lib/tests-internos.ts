// Tests que viven dentro de la tienda en lugar de en un sitio aparte.
// En store_tests.url van como «interno:<id>» y /t/<intento> los entrega desde
// aquí. Para sumar uno: guarda su HTML en tests-internos/ y agrégalo abajo.
import estiloCrianza from '@/tests-internos/estilo-crianza.html'
import lenguajesAmor from '@/tests-internos/lenguajes-amor.html'

const TESTS: Record<string, string> = {
  'estilo-crianza': estiloCrianza,
  'lenguajes-amor': lenguajesAmor,
}

export const PREFIJO_INTERNO = 'interno:'

export function testInterno(url: string): string | null {
  if (!url.startsWith(PREFIJO_INTERNO)) return null
  return TESTS[url.slice(PREFIJO_INTERNO.length)] ?? null
}
