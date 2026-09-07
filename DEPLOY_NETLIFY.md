# 🚀 Deploy a Netlify - Guía Paso a Paso

## Requisitos Previos
- GitHub account (repo del proyecto)
- Netlify account (https://netlify.com)
- Dominio personalizado (opcional)

---

## PASO 1: Preparar el Repositorio

```bash
# 1. Inicializar git (si no está)
git init

# 2. Crear .gitignore si no existe
echo ".env.local
.env.*.local
node_modules/
.next/
dist/
.DS_Store" > .gitignore

# 3. Commit inicial
git add .
git commit -m "Initial commit: Hostify Tests Store MVP

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"

# 4. Crear repo en GitHub
# - Ve a https://github.com/new
# - Nombre: hostify-tests-store
# - NO agregues README (ya existe)

# 5. Agregar remoto
git remote add origin https://github.com/TU_USUARIO/hostify-tests-store.git
git branch -M main
git push -u origin main
```

---

## PASO 2: Conectar con Netlify

### Opción A: Deploy con GitHub (Recomendado)

1. **Ir a https://app.netlify.com**
2. Click en **"Add new site"** → **"Import an existing project"**
3. Seleccionar **GitHub**
4. Autorizar Netlify en GitHub
5. Seleccionar repo: `hostify-tests-store`
6. Click **"Deploy site"**

### Opción B: Manual (Drag & Drop)

```bash
# Compilar localmente
npm run build

# Subir carpeta .next a Netlify
# Ve a https://app.netlify.com
# Drag & drop la carpeta .next
```

---

## PASO 3: Configurar Variables de Entorno

### En Netlify Dashboard:

1. Ve a **Site Settings** → **Build & Deploy** → **Environment**
2. Click **"Edit variables"**
3. Agrega cada una:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_APP_URL = https://tu-netlify-domain.netlify.app
```

---

## PASO 4: Configurar Dominio Personalizado (Opcional)

### Si compras dominio en Hostinger:

1. En Netlify → **Domain Management** → **Add custom domain**
2. Ingresar: `tunombre.com`
3. Netlify te mostrará qué hacer en tu registrador DNS

### En Hostinger DNS:

1. Ir a **Hostinger → Domios → Gestionar DNS**
2. Agregar CNAME record:
   - **Name:** @
   - **Type:** CNAME
   - **Value:** tu-netlify-domain.netlify.app
3. Esperar 24-48 horas a que se propague

---

## PASO 5: Validar Certificado SSL

1. En Netlify, verás **"Provisioning SSL certificate"**
2. Esperar unos minutos
3. Debe cambiar a **"Certificate issued"** (verde)
4. Acceder a https://tu-dominio.com

---

## PASO 6: Configurar Webhooks de Stripe

Ahora que tienes URL pública:

```bash
# En tu terminal local
stripe login

stripe listen --forward-to https://tu-dominio.com/api/stripe/webhook
```

Copiar el `whsec_...` y actualizar en Netlify variables.

---

## PASO 7: Verificar Seguridad

### Checklist:

- [ ] HTTPS funciona: https://tu-dominio.com
- [ ] Headers de seguridad: F12 → Network → Response Headers
  - Buscar: `X-Frame-Options`, `Content-Security-Policy`, `Strict-Transport-Security`
- [ ] No hay errores en Console: F12 → Console
- [ ] CSP sin warnings: https://csp-evaluator.withgoogle.com
- [ ] HSTS preload: https://hstspreload.org

---

## PASO 8: Monitorear en Producción

### Ver Logs en Netlify:

1. Site Overview → Deploys → Haz click en último deploy
2. Ver build logs y function logs

### Errores en Producción:

1. Si algo falla, check Netlify logs
2. Check Supabase logs: Dashboard → Logs
3. Check Stripe Dashboard: Webhooks → Event attempts

---

## 🚨 Troubleshooting

### "Build failed"
- Ver logs en Netlify
- Asegurarse que `npm run build` funciona localmente
- Verificar Node version: `node --version` (debe ser 18+)

### "500 errors en API"
- Check Supabase connection strings
- Verificar que todas las env vars están en Netlify
- Revisar RLS policies en Supabase

### "Stripe webhooks no llegan"
- Verificar que webhook URL es correcto
- Check en Stripe Dashboard → Webhooks → Event attempts
- Asegurarse que STRIPE_WEBHOOK_SECRET es el correcto

### "CORS errors"
- Verificar CSP en netlify.toml
- Agregar tu dominio a allowedOrigins en middleware.ts

---

## 📊 Monitoreo Continuo

### Daily:
- [ ] Check Netlify deploy status
- [ ] Monitor errores en console (JavaScript)
- [ ] Verificar pagos en Stripe

### Weekly:
- [ ] Revisar Netlify analytics
- [ ] Check Supabase database usage
- [ ] Backup de BD

### Monthly:
- [ ] Audit de seguridad (headers, CSP, SSL)
- [ ] Rotar API keys
- [ ] Revisar logs de acceso

---

## 🔐 Producción Checklist Final

ANTES de cambiar a Stripe LIVE keys:

- [ ] HTTPS funcionando
- [ ] Headers de seguridad en place
- [ ] Rate limiting configurado
- [ ] Logs y monitoring activos
- [ ] Backup automático de BD
- [ ] Plan de disaster recovery
- [ ] Prueba de pago end-to-end
- [ ] Documentación de operaciones

---

**¡Listo! Tu plataforma está segura en producción.**

Para ayuda: support@hostify.co
