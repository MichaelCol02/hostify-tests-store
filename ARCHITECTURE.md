# Arquitectura - Hostify Tests Store

## Stack

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes + Supabase
- **Base de Datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth
- **Pagos:** Stripe
- **Hosting:** Vercel (frontend), Supabase (backend)
- **Tests:** Iframes a Netlify (tests externos)

## Estructura de Carpetas

```
hostify-tests-store/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles
│   ├── api/
│   │   ├── auth/route.ts       # Autenticación
│   │   ├── stripe/
│   │   │   ├── checkout/       # Crear sesión de Stripe
│   │   │   └── webhook/        # Webhook de Stripe
│   ├── tests/
│   │   ├── page.tsx            # Listado de tests
│   │   └── [id]/page.tsx       # Test individual
│   └── dashboard/page.tsx      # Panel de usuario
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── TestCard.tsx
│   ├── HeroSection.tsx
│   └── TestViewer.tsx
├── lib/
│   ├── types.ts                # Tipos TypeScript
│   ├── supabase.ts             # Cliente Supabase
│   ├── stripe.ts               # Cliente Stripe
│   └── db.ts                   # Utilidades de BD
└── public/                     # Assets estáticos

```

## Flujo de Compra

1. Usuario ve test en catálogo
2. Intenta tomar test (versión gratis limitada)
3. Al llegar al límite de preguntas, aparece paywall
4. Hace click en "Desbloquear"
5. Se redirige a checkout de Stripe
6. Stripe envía webhook confirmando pago
7. Se registra compra en Supabase
8. Usuario obtiene acceso completo

## Tablas Supabase

### users
- id (UUID, PK)
- email (string, unique)
- name (string)
- created_at (timestamp)

### purchases
- id (UUID, PK)
- user_id (UUID, FK -> users)
- test_id (string)
- amount (number)
- currency (string)
- stripe_payment_id (string)
- status (enum: pending, completed, failed)
- purchased_at (timestamp)

### test_results
- id (UUID, PK)
- user_id (UUID, FK -> users)
- test_id (string)
- score (number)
- profile (text)
- completed_at (timestamp)
- is_paid (boolean)

## Variables de Entorno

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_APP_URL=
```

## Próximos Pasos

- [ ] Integrar auth con UI
- [ ] Conectar Stripe completo
- [ ] Crear dashboard con resultados
- [ ] Exportar resultados a PDF
- [ ] Sistema de referidos
- [ ] Análisis y reportes de admin
