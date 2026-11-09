import type Stripe from 'stripe'
import { supabaseAdmin } from './supabase-admin'
import type { CreditPack } from './pricing'

/** Busca la cuenta por correo y, si no existe, la crea. Es lo que permite comprar
 *  sin registrarse: el correo que la persona da en Stripe es su identidad. */
export async function findOrCreateUser(email: string, name?: string): Promise<string> {
  return (await buscarOCrearCuenta(email, name)).id
}

/** Igual que findOrCreateUser, pero dice si la cuenta nació en esta llamada. Solo
 *  una cuenta nueva puede abrirse sin contraseña: un correo escrito en un formulario
 *  no prueba que quien lo escribió sea su dueño. */
export async function buscarOCrearCuenta(email: string, name?: string): Promise<{ id: string; creada: boolean }> {
  const correo = email.trim().toLowerCase()
  const nombre = name?.trim() || correo.split('@')[0]

  const { data: ficha } = await supabaseAdmin.from('users').select('id').eq('email', correo).maybeSingle()
  if (ficha) return { id: ficha.id as string, creada: false }

  const { data: creado, error: errorCrear } = await supabaseAdmin.auth.admin.createUser({
    email: correo,
    email_confirm: true,
    user_metadata: { name: nombre },
  })

  let id = creado?.user?.id
  if (!id) {
    // Ya existía la cuenta de acceso pero no su ficha (p. ej. alguien que se registró y nunca compró).
    id = await buscarEnAuth(correo)
    if (!id) throw new Error(`No se pudo crear ni encontrar la cuenta de ${correo}: ${errorCrear?.message}`)
  }

  const { error: errorFicha } = await supabaseAdmin
    .from('users')
    .upsert({ id, email: correo, name: nombre }, { onConflict: 'id', ignoreDuplicates: true })
  if (errorFicha) throw new Error(`No se pudo guardar la ficha de ${correo}: ${errorFicha.message}`)

  return { id, creada: Boolean(creado?.user?.id) }
}

/** Una compra solo puede abrir la cuenta sin contraseña si esa cuenta nació con la
 *  compra y nadie ha entrado nunca a ella. Una cuenta anterior exige su contraseña:
 *  de lo contrario, pagar con el correo de otra persona daría acceso a su cuenta. */
export async function nacioConLaCompra(userId: string, inicioCompra: number) {
  const { data } = await supabaseAdmin.auth.admin.getUserById(userId)
  const cuenta = data?.user
  if (!cuenta || cuenta.last_sign_in_at) return false
  return new Date(cuenta.created_at).getTime() >= inicioCompra
}

async function buscarEnAuth(correo: string): Promise<string | undefined> {
  for (let page = 1; page <= 10; page++) {
    const { data } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 })
    const encontrado = data?.users.find((u) => u.email?.toLowerCase() === correo)
    if (encontrado) return encontrado.id
    if (!data || data.users.length < 200) return undefined
  }
  return undefined
}

/** Abona los créditos de una compra. stripe_session_id es único, así que repetir
 *  la llamada (reintento de Stripe o regreso del pago) no abona dos veces. */
export async function grantCredits(session: Stripe.Checkout.Session, pack: CreditPack, userId: string) {
  const { error } = await supabaseAdmin.from('credit_transactions').upsert(
    {
      user_id: userId,
      delta: pack.credits,
      reason: 'purchase',
      pack_id: pack.id,
      amount: (session.amount_total ?? 0) / 100,
      currency: (session.currency || 'usd').toUpperCase(),
      stripe_session_id: session.id,
    },
    { onConflict: 'stripe_session_id', ignoreDuplicates: true }
  )
  if (error) throw new Error(`No se pudieron abonar los créditos: ${error.message}`)
}
