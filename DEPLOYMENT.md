# Deployment Guide

## Preparación

### 1. Verificar que todo funciona en local

```bash
npm run dev
# Prueba toda la funcionalidad:
# - Crear cuenta
# - Login
# - Ver test gratis
# - Comprar test (Stripe test mode)
# - Verificar acceso completo
```

### 2. Build de producción

```bash
npm run build
npm run start
```

## Opción A: Deploy en Vercel (Recomendado)

### 1. Conectar repo
- Ir a https://vercel.com
- Click "New Project"
- Importar repo de GitHub (o GitLab)
- Seleccionar framework: Next.js

### 2. Configurar variables de entorno
En Vercel → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=tu_stripe_publishable_key
STRIPE_SECRET_KEY=tu_stripe_secret_key
STRIPE_WEBHOOK_SECRET=tu_stripe_webhook_secret
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

### 3. Deploy
- Click "Deploy"
- Esperar a que termine

### 4. Configurar Stripe webhook
En Stripe Dashboard → Developers → Webhooks:
- Add endpoint: `https://tu-dominio.vercel.app/api/stripe/webhook`
- Seleccionar `checkout.session.completed`
- Copiar nuevo Signing secret
- Actualizar `STRIPE_WEBHOOK_SECRET` en Vercel

## Opción B: Deploy en Railway

### 1. Conectar repo
- Ir a https://railway.app
- Click "New Project"
- Seleccionar "Deploy from GitHub"
- Conectar repo

### 2. Agregar variables de entorno
En Railway → Variables:
(Mismo que en Vercel)

### 3. Deploy
- Railway hace deploy automático

## Opción C: Deploy en tu propio servidor

### Con Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .next ./.next
COPY public ./public

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build
docker build -t hostify-tests-store .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  -e STRIPE_SECRET_KEY=... \
  hostify-tests-store
```

## Post-Deploy

### 1. Verificar que funciona
- Abrir la URL
- Crear cuenta
- Probar un test
- Hacer compra de prueba

### 2. Configurar dominio personalizado
En Vercel/Railway → Domains:
- Agregar tu dominio (ej: tests.hostify.co)
- Seguir instrucciones de DNS

### 3. Habilitar HTTPS
Vercel/Railway lo hace automáticamente

### 4. Monitoreo
- Configurar alertas en Supabase
- Revisar logs de Vercel/Railway
- Configurar Sentry (opcional)

## Troubleshooting

### Errores de autenticación
- Verificar que Supabase URL sea la de producción
- Verificar que RLS policies estén habilitadas

### Stripe no procesa pagos
- En Stripe, cambiar de test mode a live mode
- Actualizar las keys en Vercel
- Cambiar NEXT_PUBLIC_APP_URL a dominio correcto

### Página en blanco
- Revisar logs en Vercel console
- Verificar que todas las env vars estén presentes
- Revisar console del navegador

## Backups y Mantenimiento

### Backup de BD
```bash
# Con Supabase CLI
supabase db dump -f backup.sql
```

### Actualizar dependencias
```bash
npm update
npm audit fix
```

### Monitoreo continuo
- Revisar analytics en Supabase
- Revisar ventas en Stripe
- Revisar errores en Vercel logs

## Rollback

Si algo falla en producción:
```bash
# Vercel
vercel rollback

# Railway
# Ir a Deployments → Seleccionar versión anterior
```
