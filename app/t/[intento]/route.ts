import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { cookieInvitacion, firmaValida, firmarInvitacion, invitacionValida, nombreCookie } from '@/lib/intento'
import { esRecurso } from '@/lib/productos'
import { conContexto, PREFIJO_INTERNO, testInterno } from '@/lib/tests-internos'

/** Veces que un mismo crédito puede abrir su test. Alcanza de sobra para una
 *  recarga, una pantalla completa y un regreso al día siguiente; no alcanza
 *  para pasar el teléfono por toda la familia. */
const APERTURAS_MAXIMAS = 8

/** Sirve el test desde la tienda. El navegador nunca ve dónde vive de verdad:
 *  el servidor lo trae y lo entrega. Los tests son un solo archivo sin
 *  recursos externos, así que no hay nada más que reescribir. */
export async function GET(req: NextRequest, { params }: { params: { intento: string } }) {
  const intento = params.intento

  const dueno = firmaValida(intento, req.cookies.get(nombreCookie(intento))?.value)
  // La pareja entra con su propio enlace (?p=) y desde ahí con su propia cookie.
  const firmaPareja = req.nextUrl.searchParams.get('p') ?? req.cookies.get(cookieInvitacion(intento))?.value
  const pareja = !dueno && invitacionValida(intento, firmaPareja)

  if (!dueno && !pareja) {
    return respuesta(
      'Este enlace no es tuyo',
      'Los tests se abren desde tu panel, en el navegador donde compraste. Si lo recibiste de otra persona, su enlace no funciona fuera de su dispositivo.',
      403
    )
  }

  const { data: fila } = await supabaseAdmin
    .from('test_attempts')
    .select('test_id, expires_at')
    .eq('id', intento)
    .maybeSingle()

  if (!fila) {
    return respuesta('No encontramos este test', 'Vuelve a tu panel y ábrelo desde ahí.', 404)
  }

  const { data: test } = await supabaseAdmin
    .from('store_tests')
    .select('url')
    .eq('id', fila.test_id)
    .maybeSingle()

  const url = test?.url as string | undefined
  if (!url) {
    return respuesta('No encontramos este test', 'Vuelve a tu panel y ábrelo desde ahí.', 404)
  }

  if (new Date(fila.expires_at).getTime() <= Date.now()) {
    return respuesta(
      'Se acabó el tiempo',
      'Cada test queda abierto 24 horas desde que lo empiezas. Abre uno nuevo desde tu panel.',
      410
    )
  }

  // Un crédito no es barra libre. Las 24 horas son para que nadie pierda su
  // compra al cerrar la pestaña, no para responder el test veinte veces.
  // Un recurso comprado es otra cosa: se consulta, y se consulta muchas veces.
  const { data: veces } = await supabaseAdmin.rpc('store_registrar_apertura', { p_attempt: intento })
  const maximo = testInterno(url)?.pareja ? APERTURAS_MAXIMAS * 2 : APERTURAS_MAXIMAS
  if (!esRecurso(fila.test_id) && typeof veces === 'number' && veces > maximo) {
    return respuesta(
      'Este test ya se usó',
      `Un crédito abre el test hasta ${maximo} veces, para que puedas recargar o volver si se te cierra. Para responderlo otra vez hay que abrir uno nuevo.`,
      429
    )
  }

  const interno = testInterno(url)
  if (pareja && !interno?.pareja) {
    return respuesta('Este enlace no es tuyo', 'Este test no es para dos personas. Pídele a quien lo compró que lo abra desde su panel.', 403)
  }

  let html = interno?.html ?? null
  if (html === null) {
    if (url.startsWith(PREFIJO_INTERNO)) {
      return respuesta('No encontramos este test', 'Vuelve a tu panel y ábrelo desde ahí.', 404)
    }
    const origen = await fetch(url, { cache: 'no-store' }).catch(() => null)
    if (!origen?.ok) {
      return respuesta('El test no respondió', 'Inténtalo de nuevo en un momento.', 502)
    }
    html = await origen.text()
  }

  if (interno?.pareja) {
    html = conContexto(html, {
      pareja: true,
      invitado: pareja,
      // Solo quien compró recibe el enlace para invitar.
      invitacion: dueno ? `${req.nextUrl.origin}/t/${intento}?p=${firmarInvitacion(intento)}` : null,
    })
  }

  const res = new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      // Que ninguna caché intermedia guarde el test y lo sirva sin permiso.
      'Cache-Control': 'private, no-store, max-age=0',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
  // La pareja que entró por su enlace queda recordada en su navegador, para
  // que una recarga no le pida el enlace otra vez.
  if (pareja && firmaPareja) {
    const quedan = Math.floor((new Date(fila.expires_at).getTime() - Date.now()) / 1000)
    res.cookies.set(cookieInvitacion(intento), firmaPareja, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: Math.max(quedan, 0),
    })
  }
  return res
}

function respuesta(titulo: string, detalle: string, status: number) {
  return new NextResponse(
    `<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>${titulo}</title>
<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#F5F5F7;
font:16px/1.6 system-ui,-apple-system,"Segoe UI",sans-serif;color:#111;padding:24px}
.c{max-width:26rem;text-align:center;background:#fff;border-radius:24px;padding:40px 32px;
box-shadow:0 10px 40px rgba(0,0,0,.06)}h1{font-size:1.4rem;margin:0 0 12px}
p{color:#6E6E73;margin:0 0 24px}a{display:inline-block;background:#FF6B2C;color:#fff;
text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:600}</style></head>
<body><div class="c"><h1>${titulo}</h1><p>${detalle}</p>
<a href="/dashboard">Ir a mi panel</a></div></body></html>`,
    { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } }
  )
}
