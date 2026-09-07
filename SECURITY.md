# Guía de Seguridad - Hostify Tests Store

## 🔐 Protocolos de Seguridad Implementados

### 1. HTTPS Forzado
- ✅ Redirección automática HTTP → HTTPS
- ✅ HSTS (HTTP Strict Transport Security) por 1 año
- ✅ Certificado SSL automático en Netlify

### 2. Headers de Seguridad

#### Content Security Policy (CSP)
```
default-src 'self' - Solo recursos del mismo origen
script-src 'self' cdnjs.cloudflare.com - Scripts de confianza
style-src 'self' fonts.googleapis.com - Estilos de confianza
connect-src 'self' supabase.co api.stripe.com - Conexiones permitidas
frame-ancestors 'none' - No se puede incrustar en iframes
```

#### Otros Headers
- `X-Frame-Options: DENY` - Evita clickjacking
- `X-Content-Type-Options: nosniff` - Evita sniffing de MIME
- `X-XSS-Protection: 1; mode=block` - Protección XSS
- `Referrer-Policy: strict-origin-when-cross-origin` - Privacidad de referrer
- `Permissions-Policy` - Deshabilita acceso a cámara, micrófono, geolocalización

### 3. Autenticación y Autorización

#### Supabase Auth
- ✅ JWT tokens con expiración
- ✅ Row Level Security (RLS) en BD
- ✅ Validación en middleware

#### Rate Limiting
- Implementar en Netlify Edge Functions o Supabase
- Limitar: 100 requests/min por IP
- Limitar: 10 login attempts/hora por email

### 4. Base de Datos

#### RLS (Row Level Security)
```sql
-- Usuarios solo ven sus propios datos
CREATE POLICY "Users can read own data" 
ON users FOR SELECT USING (auth.uid() = id);

-- Usuarios solo ven sus propias compras
CREATE POLICY "Users can read own purchases" 
ON purchases FOR SELECT USING (auth.uid() = user_id);
```

#### Validación
- ✅ Tipos TypeScript estrictos
- ✅ Validación en API endpoints
- ✅ SQL injection prevention (Supabase parameterized queries)

### 5. Pago Seguro (Stripe)

#### Webhook Verification
```typescript
// Verificar que webhook viene de Stripe
const event = stripe.webhooks.constructEvent(
  body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET
);
```

#### PCI Compliance
- ✅ Nunca guardamos números de tarjeta
- ✅ Stripe maneja encriptación
- ✅ Solo storage de payment intents seguros

### 6. Variables de Entorno

#### Local (.env.local)
- ✅ Nunca commitear .env
- ✅ .gitignore incluye .env*
- ✅ Usar claves test en desarrollo

#### Producción (.env.production)
- ✅ Claves reales en Netlify secrets (NO en .env.production)
- ✅ Separar test keys de live keys
- ✅ Rotar keys regularmente

### 7. CORS (Cross-Origin Resource Sharing)

#### Configurado en Middleware
```typescript
// Solo el dominio de producción puede acceder
const allowedOrigins = ['https://tu-dominio.com'];
```

### 8. Caché

#### API Responses
```
Cache-Control: no-cache, no-store, must-revalidate
```

#### Static Assets
```
Cache-Control: public, max-age=31536000, immutable
```

---

## 🚀 Despliegue Seguro en Netlify

### Paso 1: Crear Cuenta en Netlify
1. Ve a https://netlify.com
2. Conecta tu GitHub
3. Autoriza Netlify

### Paso 2: Agregar Secrets
En Netlify → Site Settings → Build & Deploy → Environment:

```
NEXT_PUBLIC_SUPABASE_URL = ...
NEXT_PUBLIC_SUPABASE_ANON_KEY = ...
SUPABASE_SERVICE_ROLE_KEY = ...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = ...
STRIPE_SECRET_KEY = ...
STRIPE_WEBHOOK_SECRET = ...
NEXT_PUBLIC_APP_URL = https://tu-dominio-netlify.app
```

### Paso 3: Certificado SSL
- ✅ Netlify proporciona automáticamente Let's Encrypt
- ✅ Se renueva automáticamente
- ✅ No requiere acción

### Paso 4: DNS
Si usas dominio personalizado:
1. En tu registrador de DNS (GoDaddy, Namecheap, etc.)
2. Apunta A record a: `75.3.206.168` (Netlify)
3. O agrega CNAME a: `tu-dominio-netlify.app`

---

## 🛡️ Checklist Antes de Producción

- [ ] Cambiar Stripe keys de test a live
- [ ] Actualizar NEXT_PUBLIC_APP_URL a dominio real
- [ ] Verificar CSP en navegador (F12 → Console)
- [ ] Probar HTTPS en https://tu-dominio.com
- [ ] Verificar HSTS con: https://hstspreload.org
- [ ] Habilitar Rate Limiting en Netlify
- [ ] Backup regular de BD Supabase
- [ ] Monitoreo de errores (Sentry/LogRocket)
- [ ] Auditoría de seguridad mensual
- [ ] Rotar API keys cada 90 días

---

## 🚨 Vulnerabilidades Comunes - PREVENIDAS

| Vulnerabilidad | Mitigación |
|---|---|
| SQL Injection | Supabase parameterized queries |
| XSS | CSP + sanitization |
| CSRF | CORS headers + token validation |
| Clickjacking | X-Frame-Options: DENY |
| Man-in-the-Middle | HTTPS + HSTS |
| Session Hijacking | JWT + HttpOnly cookies |
| Brute Force | Rate limiting + account lockout |
| Credential Stuffing | Email verification + 2FA (futuro) |

---

## 📞 Monitoreo en Producción

### Herramientas Recomendadas
1. **Sentry** - Error tracking
   - Setup: `npm install @sentry/nextjs`
   
2. **Vercel Analytics** - Performance
   - Built-in en Vercel (si usas Vercel en lugar de Netlify)
   
3. **LogRocket** - Session replay
   - Para debugging de usuarios
   
4. **Stripe Dashboard** - Payment monitoring
   - Ver transacciones, rechazos, etc.

---

## 🔄 Rotación de Keys

**Cada 90 días:**
1. En Supabase: generar nuevas API keys
2. En Stripe: crear nuevas keys
3. Actualizar en Netlify secrets
4. Invalidar keys antiguas

---

**Última actualización:** 2026-09-03
**Versión:** 1.0.0
