-- Credit packs: users buy credits; each full test run spends one credit and
-- opens a 24h attempt. Only creates new objects and tightens store_tests.
-- Safe to run more than once.

CREATE TABLE IF NOT EXISTS test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_id TEXT NOT NULL REFERENCES store_tests(id),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '24 hours'
);

CREATE TABLE IF NOT EXISTS credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  delta INTEGER NOT NULL CHECK (delta <> 0),
  reason TEXT NOT NULL CHECK (reason IN ('purchase', 'redeem', 'grant')),
  pack_id TEXT,
  amount DECIMAL(10, 2),
  currency TEXT,
  stripe_session_id TEXT UNIQUE,
  attempt_id UUID REFERENCES test_attempts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_credit_tx_user ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user_test ON test_attempts(user_id, test_id, expires_at DESC);

ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Read-only for clients; writes happen only in the functions below or the Stripe webhook (service role).
DROP POLICY IF EXISTS "Users can read own attempts" ON test_attempts;
CREATE POLICY "Users can read own attempts" ON test_attempts FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users can read own credit transactions" ON credit_transactions;
CREATE POLICY "Users can read own credit transactions" ON credit_transactions FOR SELECT USING (auth.uid() = user_id);

-- Test URLs are only handed out after a credit is spent, so hide the column from direct reads.
REVOKE SELECT ON store_tests FROM anon, authenticated;
GRANT SELECT (id, name, description, price, free_questions, created_at) ON store_tests TO anon, authenticated;

CREATE OR REPLACE FUNCTION store_credit_balance()
RETURNS INTEGER
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT COALESCE(SUM(delta), 0)::INTEGER FROM credit_transactions WHERE user_id = auth.uid();
$$;

-- Returns the active attempt for a test without spending a credit (empty if none).
CREATE OR REPLACE FUNCTION store_active_attempt(p_test_id TEXT)
RETURNS TABLE (attempt_id UUID, expires_at TIMESTAMPTZ, test_url TEXT)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT a.id, a.expires_at, t.url
  FROM test_attempts a
  JOIN store_tests t ON t.id = a.test_id
  WHERE a.user_id = auth.uid() AND a.test_id = p_test_id AND a.expires_at > now()
  ORDER BY a.started_at DESC
  LIMIT 1;
$$;

-- Spends one credit and opens a 24h attempt. Reuses an active attempt instead of charging twice.
CREATE OR REPLACE FUNCTION store_redeem_credit(p_test_id TEXT)
RETURNS TABLE (attempt_id UUID, expires_at TIMESTAMPTZ, test_url TEXT, balance INTEGER)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_user UUID := auth.uid();
  v_url TEXT;
  v_balance INTEGER;
  v_attempt test_attempts%ROWTYPE;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  SELECT url INTO v_url FROM store_tests WHERE id = p_test_id;
  IF v_url IS NULL THEN
    RAISE EXCEPTION 'unknown_test';
  END IF;

  -- Serialize redemptions per user so two tabs cannot spend the same credit.
  PERFORM pg_advisory_xact_lock(hashtext('store_credits:' || v_user::TEXT));

  SELECT COALESCE(SUM(delta), 0)::INTEGER INTO v_balance FROM credit_transactions WHERE user_id = v_user;

  SELECT * INTO v_attempt FROM test_attempts
  WHERE user_id = v_user AND test_id = p_test_id AND test_attempts.expires_at > now()
  ORDER BY started_at DESC LIMIT 1;

  IF FOUND THEN
    RETURN QUERY SELECT v_attempt.id, v_attempt.expires_at, v_url, v_balance;
    RETURN;
  END IF;

  IF v_balance < 1 THEN
    RAISE EXCEPTION 'insufficient_credits';
  END IF;

  INSERT INTO test_attempts (user_id, test_id) VALUES (v_user, p_test_id) RETURNING * INTO v_attempt;
  INSERT INTO credit_transactions (user_id, delta, reason, attempt_id) VALUES (v_user, -1, 'redeem', v_attempt.id);

  RETURN QUERY SELECT v_attempt.id, v_attempt.expires_at, v_url, v_balance - 1;
END;
$$;

REVOKE ALL ON FUNCTION store_credit_balance() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION store_active_attempt(TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION store_redeem_credit(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION store_credit_balance() TO authenticated;
GRANT EXECUTE ON FUNCTION store_active_attempt(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION store_redeem_credit(TEXT) TO authenticated;
