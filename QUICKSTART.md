# Quick Start - 5 minutos

## Paso 1: Clonar y instalar

```bash
cd hostify-tests-store
npm install
```

## Paso 2: Crear cuentas

### Supabase (BD)
- Ir a https://supabase.com/dashboard
- Crear nuevo proyecto (nombre: hostify-tests)
- Copiar:
  - NEXT_PUBLIC_SUPABASE_URL (URL)
  - NEXT_PUBLIC_SUPABASE_ANON_KEY (anon key)

### Stripe (Pagos)
- Ir a https://dashboard.stripe.com
- Copiar:
  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_test_...)
  - STRIPE_SECRET_KEY (sk_test_...)
- Crear webhook en Developers → Webhooks:
  - URL: http://localhost:3000/api/stripe/webhook
  - Eventos: checkout.session.completed
  - Copiar: STRIPE_WEBHOOK_SECRET

## Paso 3: Configurar .env.local

Editar `.env.local` con tus keys:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Paso 4: Crear BD en Supabase

- En Supabase → SQL Editor
- Ejecutar contenido de `migrations/001_init.sql`

## Paso 5: Ejecutar en local

```bash
npm run dev
```

Abre http://localhost:3000

## Paso 6: Probar

1. Click en "Ingresar"
2. Click en "Crear cuenta"
3. Email: test@example.com
4. Contraseña: Test123!
5. Ve a un test
6. Prueba la versión gratis
7. Click en "Desbloquear"
8. En Stripe test, usa tarjeta: `4242 4242 4242 4242`
9. Expira: 12/25, CVC: 123
10. ¡Listo! Deberías tener acceso completo

## Próximos pasos

- Leer [SETUP.md](SETUP.md) para configuración detallada
- Leer [DEPLOYMENT.md](DEPLOYMENT.md) para deployar a producción
- Leer [ARCHITECTURE.md](ARCHITECTURE.md) para entender la estructura

## Troubleshooting

**Error: "Cannot find module @supabase"**
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

**Error: "NEXT_PUBLIC_SUPABASE_URL is not defined"**
- Verificar que .env.local tiene las variables
- Reiniciar servidor: Ctrl+C y npm run dev

**Error en Stripe webhook**
- Verificar que STRIPE_WEBHOOK_SECRET es correcto
- Revisar en Stripe → Developers → Webhooks logs

**Autenticación no funciona**
- En Supabase, ir a Authentication → Providers
- Verificar que Email es "Enable"
- Verificar RLS policies en Database → Policies
