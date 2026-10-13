import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

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

/** Tapa el correo: basta para reconocer el pedido sin publicarlo. */
function taparCorreo(correo: string | null) {
  if (!correo) return null
  const [nombre, dominio] = correo.split('@')
  return `${nombre.slice(0, 2)}***@${dominio ?? ''}`
}

export async function GET() {
  const { data: pedidos } = await supabaseAdmin
    .from('wompi_orders')
    .select('reference, pack_id, credits, amount_cop, status, email, credited_at, claimed_at, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return NextResponse.json({
    llaves: {
      NEXT_PUBLIC_WOMPI_PUBLIC_KEY: revisar(process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY, 'llave PÚBLICA (producción)'),
      WOMPI_INTEGRITY_SECRET: revisar(process.env.WOMPI_INTEGRITY_SECRET, 'secreto de INTEGRIDAD (producción)'),
      WOMPI_EVENTS_SECRET: revisar(process.env.WOMPI_EVENTS_SECRET, 'secreto de EVENTOS (producción)'),
    },
    ultimosPedidos: (pedidos ?? []).map((p) => ({
      referencia: p.reference,
      paquete: p.pack_id,
      creditos: p.credits,
      monto: p.amount_cop,
      estado: p.status,
      correo: taparCorreo(p.email),
      creditosEntregados: Boolean(p.credited_at),
      cuandó: p.created_at,
    })),
  })
}
