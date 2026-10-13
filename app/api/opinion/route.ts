import { NextResponse, NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { CATALOG } from '@/lib/catalog'

/** Recibe la calificación de quien acaba de hacer un test. No pide cuenta:
 *  exigir sesión aquí costaría más opiniones de las que ganaría honestidad,
 *  y lo único que se guarda es lo que la persona escribe. */
export async function POST(req: NextRequest) {
  const cuerpo = await req.json().catch(() => ({}))

  const estrellas = Number(cuerpo.rating)
  if (!Number.isInteger(estrellas) || estrellas < 1 || estrellas > 5) {
    return NextResponse.json({ error: 'calificacion_invalida' }, { status: 400 })
  }

  // El test solo se guarda si existe en el catálogo: así nadie llena la tabla
  // de etiquetas inventadas desde la barra de direcciones.
  const testId = typeof cuerpo.testId === 'string' && CATALOG.some((t) => t.id === cuerpo.testId) ? cuerpo.testId : null

  const limpiar = (valor: unknown, maximo: number) =>
    typeof valor === 'string' && valor.trim() ? valor.trim().slice(0, maximo) : null

  const { error } = await supabaseAdmin.from('reviews').insert({
    test_id: testId,
    rating: estrellas,
    comment: limpiar(cuerpo.comment, 1000),
    name: limpiar(cuerpo.name, 80),
    may_publish: cuerpo.mayPublish === true,
  })

  if (error) {
    console.error(`No se pudo guardar la opinión: ${error.message}`)
    return NextResponse.json({ error: 'no_guardada' }, { status: 500 })
  }

  return NextResponse.json({ guardada: true })
}
