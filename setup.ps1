Write-Host "🚀 Hostify Tests Store - Complete Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Ask for Supabase credentials
Write-Host "📋 Supabase Credentials" -ForegroundColor Cyan
Write-Host "Visit: https://supabase.com/dashboard → Your Project → Settings → API" -ForegroundColor Yellow
Write-Host ""

$supabaseUrl = Read-Host "Supabase URL (NEXT_PUBLIC_SUPABASE_URL)"
$supabaseAnonKey = Read-Host "Anon Key (NEXT_PUBLIC_SUPABASE_ANON_KEY)"

if (-not $supabaseUrl -or -not $supabaseAnonKey) {
    Write-Host "❌ Error: Credentials are required" -ForegroundColor Red
    exit 1
}

# Ask for Stripe credentials
Write-Host ""
Write-Host "🔐 Stripe Test Credentials" -ForegroundColor Cyan
Write-Host "Visit: https://dashboard.stripe.com/test/apikeys" -ForegroundColor Yellow
Write-Host ""

$stripePublishable = Read-Host "Stripe Publishable Key (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)"
$stripeSecret = Read-Host "Stripe Secret Key (STRIPE_SECRET_KEY)"
$stripeWebhook = Read-Host "Stripe Webhook Secret (STRIPE_WEBHOOK_SECRET) [optional, press Enter to skip]"

# Create .env.local
Write-Host ""
Write-Host "⏳ Creating .env.local..." -ForegroundColor Yellow

$envContent = @"
NEXT_PUBLIC_SUPABASE_URL=$supabaseUrl
NEXT_PUBLIC_SUPABASE_ANON_KEY=$supabaseAnonKey
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$stripePublishable
STRIPE_SECRET_KEY=$stripeSecret
STRIPE_WEBHOOK_SECRET=$stripeWebhook
NEXT_PUBLIC_APP_URL=http://localhost:3000
"@

$envContent | Set-Content -Path ".env.local" -Encoding UTF8

Write-Host "✅ .env.local created" -ForegroundColor Green
Write-Host ""

# Show migration instructions
Write-Host "📝 IMPORTANT: Execute SQL Migrations" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to: $supabaseUrl/project/sql/new" -ForegroundColor Yellow
Write-Host "2. Copy ALL content from: migrations/001_init.sql" -ForegroundColor Yellow
Write-Host "3. Paste in SQL Editor and click RUN" -ForegroundColor Yellow
Write-Host ""
Write-Host "Copy this path to your migrations file:"
Write-Host "migrations/001_init.sql" -ForegroundColor Magenta
Write-Host ""

Read-Host "Press Enter once you've executed the SQL migrations in Supabase"

Write-Host ""
Write-Host "⏳ Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host "1. npm run dev" -ForegroundColor Yellow
Write-Host "2. Open http://localhost:3000" -ForegroundColor Yellow
Write-Host "3. Test the platform:" -ForegroundColor Yellow
Write-Host "   - Create account" -ForegroundColor Yellow
Write-Host "   - Try free test" -ForegroundColor Yellow
Write-Host "   - Stripe test card: 4242 4242 4242 4242" -ForegroundColor Yellow
Write-Host ""
