# Setup - Hostify Tests Store

## Requisitos previos

- Node.js 18+
- npm o yarn
- Cuenta en Supabase
- Cuenta en Stripe

## 1. Clonar repo y instalar dependencias

```bash
cd hostify-tests-store
npm install
```

## 2. Configurar Supabase

### 2.1 Crear proyecto en Supabase
- Ir a https://supabase.com
- Crear nuevo proyecto
- Copiar URL y anon key

### 2.2 Ejecutar migraciones
- En Supabase dashboard → SQL Editor
- Copiar contenido de `migrations/001_init.sql`
- Ejecutar

### 2.3 Configurar autenticación
- En Supabase → Authentication → Providers
- Habilitar Email/Password
- (Opcional) Configurar Google OAuth

## 3. Configurar Stripe

### 3.1 Crear cuenta
- Ir a https://stripe.com
- Crear cuenta
- Ir a Developers → API keys
- Copiar Publishable key y Secret key

### 3.2 Configurar webhook
- En Stripe → Developers → Webhooks
- Add endpoint: `https://tu-dominio/api/stripe/webhook`
- Seleccionar evento: `checkout.session.completed`
- Copiar Signing secret

## 4. Variables de entorno

Copiar `.env.example` a `.env.local` y completar:

```bash
cp .env.example .env.local
```

Editar `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable_key
STRIPE_SECRET_KEY=tu_stripe_secret_key
STRIPE_WEBHOOK_SECRET=tu_stripe_webhook_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 5. Ejecutar en desarrollo

```bash
npm run dev
```

Abre http://localhost:3000

## 6. Prueba la plataforma

1. Haz click en "Ingresar"
2. Crea una cuenta
3. Ve a un test
4. Prueba la versión gratis (primeras N preguntas)
5. Intenta comprar (Stripe en modo test)
6. Verifica que el acceso se active

## 7. Deploy a Vercel

```bash
npm run build
# Luego subir a Vercel
```

En Vercel dashboard:
- Añadir variables de entorno (mismas que en .env.local)
- Deploy

## Troubleshooting

### Autenticación no funciona
- Verificar que NEXT_PUBLIC_SUPABASE_URL y KEY sean correctas
- Revisar console del navegador (Network tab)

### Stripe no funciona
- En modo test, usar tarjeta: 4242 4242 4242 4242
- Verificar que STRIPE_SECRET_KEY sea correcto
- Revisar logs de Stripe dashboard

### BD queries fallan
- Verificar que RLS policies estén habilitadas en Supabase
- Revisar error message en Network tab

## Documentos útiles

- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
