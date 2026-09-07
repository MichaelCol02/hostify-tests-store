#!/bin/bash

echo "🚀 Hostify Tests Store - Complete Setup"
echo "========================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found"
    echo "Please create .env.local with your Supabase and Stripe credentials"
    exit 1
fi

echo "✅ .env.local found"
echo ""

# Install dependencies
echo "⏳ Installing dependencies..."
npm install

echo ""
echo "✅ Dependencies installed"
echo ""

echo "📝 Next steps:"
echo ""
echo "1. Go to Supabase Dashboard:"
echo "   https://supabase.com/dashboard"
echo ""
echo "2. Open your project → SQL Editor"
echo ""
echo "3. Create new query and paste this:"
cat migrations/001_init.sql
echo ""
echo "4. Click RUN"
echo ""
echo "5. Go to Settings → API and copy:"
echo "   - Project URL → NEXT_PUBLIC_SUPABASE_URL"
echo "   - anon key → NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo ""
echo "6. Update .env.local with those values"
echo ""
echo "7. Setup Stripe:"
echo "   - Go to https://stripe.com/dashboard"
echo "   - Copy test API keys"
echo "   - Add to .env.local"
echo ""
echo "8. Run dev server:"
echo "   npm run dev"
echo ""
echo "9. Open http://localhost:3000"
echo ""
