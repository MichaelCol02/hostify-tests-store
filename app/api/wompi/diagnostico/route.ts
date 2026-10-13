import { NextResponse } from 'next/server'

/** Revisa que cada llave de Wompi esté en su variable, sin revelar ninguna.
 *  Wompi marca cada secreto con un prefijo propio, así que el prefijo basta
 *  para detectar el error más común: pegar el de eventos donde va el de
 *  integridad. Se puede borrar cuando el cobro quede funcionando. */

const PREFIJOS: Array<[string, string]> = [
  ['prod_integrity_', 'secreto de INTEGRIDAD (producción)'],
  ['test_integrity_', 'secreto de INTEGRIDAD (pruebas)'],
  ['prod_events_', 'secreto de EVENTOS (producción)'],
  ['test_events_', 'secreto de EVENTOS (pruebas)'],
  ['pub_prod_', 'llave PÚBLICA (producción)'],
  ['pub_test_', 'llave PÚBLICA (pruebas)'],
  ['prv_prod_', 'llave PRIVADA (producción)'],
  ['prv_test_', 'llave PRIVADA (pruebas)'],
]

function revisar(valor: string | undefined, deberiaSer: string) {
  // Vacía y ausente se arreglan distinto: una se edita, la otra se crea.
  if (valor === undefined) return { estado: 'NO EXISTE: hay que crearla', deberiaSer }
  if (valor.trim() === '') return { estado: 'EXISTE PERO ESTA VACIA: hay que pegarle el valor', deberiaSer }
  const limpio = valor.trim()
  const encontrado = PREFIJOS.find(([p]) => limpio.startsWith(p))
  return {
    deberiaSer,
    contiene: encontrado ? encontrado[1] : 'algo que no parece una llave de Wompi',
    correcto: encontrado?.[1] === deberiaSer,
    sobranEspacios: limpio !== valor,
    largo: valor.length,
  }
}

export async function GET() {
  return NextResponse.json({
    NEXT_PUBLIC_WOMPI_PUBLIC_KEY: revisar(process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY, 'llave PÚBLICA (producción)'),
    WOMPI_INTEGRITY_SECRET: revisar(process.env.WOMPI_INTEGRITY_SECRET, 'secreto de INTEGRIDAD (producción)'),
    WOMPI_EVENTS_SECRET: revisar(process.env.WOMPI_EVENTS_SECRET, 'secreto de EVENTOS (producción)'),
  })
}
