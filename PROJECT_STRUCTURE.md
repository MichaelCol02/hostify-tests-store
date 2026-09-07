# 📁 Estructura Completa del Proyecto - Hostify Tests Store

## 🏗️ Arquitectura General

```
hostify-tests-store/
│
├── app/                          # Rutas y páginas (Next.js 14 App Router)
│   ├── api/                      # Endpoints REST
│   │   ├── auth/route.ts         # Login, signup, logout
│   │   ├── purchases/route.ts    # Historial de compras
│   │   ├── stripe/
│   │   │   ├── checkout/route.ts # Crear sesión de pago
│   │   │   └── webhook/route.ts  # Recibir eventos de Stripe
│   │   └── tests/route.ts        # Listar tests
│   ├── tests/
│   │   ├── page.tsx              # Catálogo de tests
│   │   └── [id]/page.tsx         # Test individual
│   ├── dashboard/page.tsx        # Panel de usuario
│   ├── success/page.tsx          # Página post-compra
│   ├── error.tsx                 # Error boundary
│   ├── not-found.tsx             # 404
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Estilos globales
│
├── components/                   # Componentes React reutilizables
│   ├── Header.tsx                # Navegación principal
│   ├── Footer.tsx                # Footer
│   ├── HeroSection.tsx           # Hero landing
│   ├── TestCard.tsx              # Card de test
│   ├── AuthModal.tsx             # Login/signup modal
│   ├── TestViewer.tsx            # Visor de test (básico)
│   ├── TestViewerWithAuth.tsx    # Visor con auth + paywall
│   └── StripeCheckout.tsx        # Botón de compra
│
├── lib/                          # Librerías y utilidades
│   ├── supabase.ts               # Cliente Supabase
│   ├── stripe.ts                 # Cliente Stripe
│   ├── types.ts                  # Tipos TypeScript
│   ├── db.ts                     # Queries de BD
│   └── hooks.ts                  # Custom hooks
│
├── migrations/
│   └── 001_init.sql              # Schema SQL inicial
│
├── public/                       # Assets estáticos
│
├── middleware.ts                 # Middleware Next.js (auth, headers)
│
├── Configuration Files
│   ├── package.json              # Dependencias
│   ├── tsconfig.json             # TypeScript config
│   ├── next.config.js            # Next.js config
│   ├── tailwind.config.js        # Tailwind config
│   ├── postcss.config.js         # PostCSS config
│   └── .eslintrc.json            # ESLint config
│
├── Environment Files
│   ├── .env.local                # Variables de desarrollo
│   ├── .env.production           # Variables de producción
│   └── .env.example              # Template
│
├── Deployment & Security
│   ├── netlify.toml              # Configuración Netlify + headers de seguridad
│   ├── vercel.json               # Config Vercel (alternativa)
│   ├── SECURITY.md               # Guía de seguridad
│   └── DEPLOY_NETLIFY.md         # Instrucciones deploy
│
├── Documentation
│   ├── README.md                 # Readme principal
│   ├── QUICKSTART.md             # Primeros 5 minutos
│   ├── SETUP.md                  # Setup completo
│   ├── DEPLOYMENT.md             # Guía de deploy general
│   ├── ARCHITECTURE.md           # Arquitectura técnica
│   ├── ROADMAP.md                # Roadmap futuro
│   ├── STATUS.md                 # Estado del proyecto
│   └── PROJECT_STRUCTURE.md      # Este archivo
│
├── Testing & Utilities
│   ├── setup.ps1                 # Script de setup Windows
│   ├── install-stripe-cli.ps1    # Instalador Stripe CLI
│   ├── setup-db.js               # Setup automático de BD
│   └── .gitignore                # Git ignore
│
└── node_modules/                 # Dependencias instaladas

```

---

## 📊 Flujo de Datos

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTE (Browser)                        │
│  Landing → Catálogo Tests → Test Gratis → Paywall → Pago       │
└─────────────────────────────────────────────────────────────────┘
                                ↓
        ┌───────────────────────┴────────────────────────┐
        ↓                                                  ↓
   ┌─────────────────┐                            ┌──────────────┐
   │  NEXT.JS BACKEND │                          │   STRIPE API  │
   ├─────────────────┤                          ├──────────────┤
   │ API Routes      │ ←──Webhook──────────────→ │ Payment Proc.│
   │ Auth            │                          │ Webhooks     │
   │ Payments        │                          └──────────────┘
   │ Database        │
   └────────┬────────┘
            ↓
   ┌────────────────────────┐
   │    SUPABASE (BD)        │
   ├────────────────────────┤
   │ Users                  │
   │ Tests                  │
   │ Purchases              │
   │ Results                │
   │ RLS Policies           │
   └────────────────────────┘
```

---

## 🔐 Capas de Seguridad

```
Layer 1: HTTPS / TLS
         ↓
Layer 2: CSP Headers / CORS
         ↓
Layer 3: Authentication (JWT)
         ↓
Layer 4: Row Level Security (Supabase)
         ↓
Layer 5: Rate Limiting
         ↓
Layer 6: Input Validation
         ↓
Layer 7: Stripe Webhook Verification
```

---

## 🗄️ Base de Datos (Supabase)

### Tablas Principales

```sql
-- Usuarios
users (id, email, name, created_at)

-- Tests
tests (id, name, price, free_questions, url)

-- Compras
purchases (id, user_id, test_id, amount, status, stripe_payment_id)

-- Resultados
test_results (id, user_id, test_id, score, profile, completed_at)
```

### RLS Policies

```
✅ Users: Solo ven sus propios datos
✅ Purchases: Solo ven sus propias compras
✅ Results: Solo ven sus propios resultados
✅ Tests: Todos pueden ver (public)
```

---

## 🚀 Stack Tecnológico

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS 3 |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (JWT) |
| Payments | Stripe |
| Hosting | Netlify (con alternativa Vercel) |
| CDN | Netlify CDN automático |
| SSL | Let's Encrypt automático |

---

## 📦 Dependencias Principales

```json
{
  "dependencies": {
    "next": "14.2.35",
    "react": "18.2.0",
    "typescript": "5.2.0",
    "@supabase/supabase-js": "2.38.0",
    "@supabase/auth-helpers-nextjs": "0.7.0",
    "stripe": "13.0.0",
    "@stripe/react-stripe-js": "2.4.0",
    "zustand": "4.4.0",
    "axios": "1.6.0"
  },
  "devDependencies": {
    "tailwindcss": "3.3.0",
    "postcss": "8.4.0",
    "autoprefixer": "10.4.0",
    "eslint": "8.50.0"
  }
}
```

---

## 📋 Rutas y Endpoints

### Público
- `GET /` - Landing page
- `GET /tests` - Catálogo
- `GET /tests/[id]` - Test individual
- `GET /success` - Post-compra
- `GET /test` - Test página (debug)

### Autenticado
- `GET /dashboard` - Panel de usuario
- `POST /api/auth` - Login/signup/logout
- `GET /api/purchases` - Historial
- `GET /api/tests` - Listar tests

### Stripe
- `POST /api/stripe/checkout` - Crear sesión
- `POST /api/stripe/webhook` - Recibir eventos

---

## 🌐 Variables de Entorno

### Desarrollo (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Producción (.env.production)
```
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=https://tu-dominio.com
NODE_ENV=production
```

---

## 🚀 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Inicia servidor en localhost:3000

# Build
npm run build            # Compila para producción
npm start                # Inicia servidor compilado
npm run lint             # Ejecuta ESLint

# Database
npm run db:setup        # Setup inicial de BD

# Stripe
stripe login             # Autentica con Stripe
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## 📈 Escalabilidad

### Actual (MVP)
- ✅ 5 tests
- ✅ Hasta 1M usuarios (Supabase free tier)
- ✅ Hasta 10K requests/día (Netlify free tier)

### Próximas Mejoras
- [ ] Multi-tenancy
- [ ] Dashboard de admin
- [ ] Analytics
- [ ] Email automático
- [ ] 2FA
- [ ] API pública
- [ ] Mobile app

---

## 📞 Contacto y Soporte

- Email: support@hostify.co
- Docs: Ver README.md
- Issues: GitHub issues
- Security: security@hostify.co

---

**Última actualización:** 2026-09-03
**Versión:** 1.0.0 MVP
