import { NextResponse, NextRequest } from 'next/server'
import { consultarTransaccion } from '@/lib/wompi'
import { abonarCompra } from '@/lib/wompi-abono'

/** Red de seguridad del cobro. Si el aviso automático de Wompi no llega o
 *  falla, la página de regreso llama aquí con el identificador de la
 *  transacción y la compra se confirma preguntándole a Wompi directamente.
 *  No se puede abusar: solo abona lo que Wompi declare aprobado, por el monto
 *  exacto que se pidió al abrir el cobro. */
export async function POST(req: NextRequest) {
  const { id } = await req.json().catch(() => ({ id: undefined }))
  if (typeof id !== 'string' || !id) {
    return NextResponse.json({ error: 'falta_id' }, { status: 400 })
  }

  const trx = await consultarTransaccion(id)
  if (!trx) return NextResponse.json({ error: 'transaccion_desconocida' }, { status: 404 })

  try {
    const resultado = await abonarCompra(trx)
    return NextResponse.json({ referencia: trx.reference, estado: trx.status, ...resultado })
  } catch (error: any) {
    console.error(`Confirmación de ${trx.reference} falló: ${error.message}`)
    return NextResponse.json({ error: 'no_abonado' }, { status: 500 })
  }
}
