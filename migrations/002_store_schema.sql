-- Store schema for hostify-tests-store.
-- This Supabase project also hosts another app that owns a `tests` table, so the
-- store catalog is `store_tests`. This script only creates new objects and never
-- alters or drops the other app's tables. Safe to run more than once.

CREATE TABLE IF NOT EXISTS store_tests (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  free_questions INTEGER DEFAULT 0,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_id TEXT NOT NULL REFERENCES store_tests(id),
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  stripe_payment_id TEXT UNIQUE,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed')) DEFAULT 'pending',
  purchased_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, test_id)
);

CREATE TABLE IF NOT EXISTS test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_id TEXT NOT NULL REFERENCES store_tests(id),
  score INTEGER,
  profile TEXT,
  raw_data JSONB,
  is_paid BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO store_tests (id, name, description, price, free_questions, url) VALUES
  ('checkbox-5-niveles', 'Checkbox 5 Niveles', 'Auditoría de nivel basada en 50 casillas', 49, 5, 'https://checkbox5level.netlify.app/'),
  ('disc', 'DISC', 'Perfil conductual: D, I, S, C', 39, 8, 'https://radiant-eclair-e24ff3.netlify.app/'),
  ('5-niveles-liderazgo', '5 Niveles de Liderazgo', 'Evaluación de liderazgo con medición de voz', 59, 10, 'https://5nivelesdeliderazgolvr.netlify.app/'),
  ('hii', 'Hospitality Intelligence Index', 'Mide tu desarrollo en la creación de experiencias memorables', 49, 10, 'https://admirable-tanuki-079b9d.netlify.app/'),
  ('5-casas', 'Test 5 Casas', 'Descubre tu casa: Pioneros, Los que Ven, Puente, Mesa, Raíces', 35, 15, 'https://test5casas.netlify.app/')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE store_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read store tests" ON store_tests;
CREATE POLICY "Anyone can read store tests" ON store_tests FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- No client INSERT policy on purchases: only the Stripe webhook (service role) may grant access.
DROP POLICY IF EXISTS "Users can read own purchases" ON purchases;
CREATE POLICY "Users can read own purchases" ON purchases FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read own results" ON test_results;
DROP POLICY IF EXISTS "Users can insert own results" ON test_results;
CREATE POLICY "Users can read own results" ON test_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own results" ON test_results FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_test_id ON purchases(test_id);
CREATE INDEX IF NOT EXISTS idx_test_results_user_id ON test_results(user_id);
CREATE INDEX IF NOT EXISTS idx_test_results_test_id ON test_results(test_id);
