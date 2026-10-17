-- Tres cosas en una. Se puede ejecutar más de una vez.

-- ============================================================
-- 1. ABONA EL PAGO QUE QUEDÓ SIN CRÉDITOS
-- La compra HT-SINGLE-MV74EWDM-51YV0WYD se cobró ($20.000, aprobada en Wompi)
-- pero el índice roto impidió registrarla. Esto la registra ahora.
-- Si no existe cuenta con ese correo no abona nada, y el reporte final lo dice.
-- ============================================================

INSERT INTO credit_transactions (user_id, delta, reason, pack_id, amount, currency, provider, wompi_reference)
SELECT u.id, 1, 'purchase', 'single', 20000, 'COP', 'wompi', 'HT-SINGLE-MV74EWDM-51YV0WYD'
FROM users u
WHERE lower(u.email) = 'michael2colmenares@gmail.com'
ON CONFLICT (wompi_reference) DO NOTHING;

UPDATE wompi_orders
SET status = 'APPROVED',
    credited_at = COALESCE(credited_at, now()),
    user_id = COALESCE(user_id, (SELECT id FROM users WHERE lower(email) = 'michael2colmenares@gmail.com' LIMIT 1))
WHERE reference = 'HT-SINGLE-MV74EWDM-51YV0WYD';

-- ============================================================
-- 2. QUE CADA TEST COBRE LO QUE ANUNCIA
-- La tienda dice que el de pareja cuesta 2 créditos, pero la función
-- descontaba 1 fijo para todos. Media venta regalada en cada compra de pareja.
-- ============================================================

ALTER TABLE store_tests ADD COLUMN IF NOT EXISTS credit_cost INTEGER NOT NULL DEFAULT 1;
ALTER TABLE store_tests DROP CONSTRAINT IF EXISTS store_tests_credit_cost_check;
ALTER TABLE store_tests ADD CONSTRAINT store_tests_credit_cost_check CHECK (credit_cost > 0);

UPDATE store_tests SET credit_cost = 2 WHERE id = 'eneagrama-pareja';

CREATE OR REPLACE FUNCTION store_redeem_credit(p_test_id TEXT)
RETURNS TABLE (attempt_id UUID, expires_at TIMESTAMPTZ, test_url TEXT, balance INTEGER)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_user UUID := auth.uid();
  v_url TEXT;
  v_cost INTEGER;
  v_balance INTEGER;
  v_attempt test_attempts%ROWTYPE;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  SELECT url, credit_cost INTO v_url, v_cost FROM store_tests WHERE id = p_test_id;
  IF v_url IS NULL THEN
    RAISE EXCEPTION 'unknown_test';
  END IF;
  v_cost := COALESCE(v_cost, 1);

  -- Serialize redemptions per user so two tabs cannot spend the same credit.
  PERFORM pg_advisory_xact_lock(hashtext('store_credits:' || v_user::TEXT));

  SELECT COALESCE(SUM(delta), 0)::INTEGER INTO v_balance FROM credit_transactions WHERE user_id = v_user;

  -- Un intento vigente no se vuelve a cobrar: ya se pagó al abrirlo.
  SELECT * INTO v_attempt FROM test_attempts
  WHERE user_id = v_user AND test_id = p_test_id AND test_attempts.expires_at > now()
  ORDER BY started_at DESC LIMIT 1;

  IF FOUND THEN
    RETURN QUERY SELECT v_attempt.id, v_attempt.expires_at, v_url, v_balance;
    RETURN;
  END IF;

  IF v_balance < v_cost THEN
    RAISE EXCEPTION 'insufficient_credits';
  END IF;

  INSERT INTO test_attempts (user_id, test_id) VALUES (v_user, p_test_id) RETURNING * INTO v_attempt;
  INSERT INTO credit_transactions (user_id, delta, reason, attempt_id)
  VALUES (v_user, -v_cost, 'redeem', v_attempt.id);

  RETURN QUERY SELECT v_attempt.id, v_attempt.expires_at, v_url, v_balance - v_cost;
END;
$$;

REVOKE ALL ON FUNCTION store_redeem_credit(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION store_redeem_credit(TEXT) TO authenticated;

-- ============================================================
-- 3. REPORTE
-- ============================================================

SELECT
  (SELECT count(*) FROM users WHERE lower(email) = 'michael2colmenares@gmail.com') AS tienes_cuenta,
  (SELECT COALESCE(sum(ct.delta), 0) FROM credit_transactions ct
     JOIN users u ON u.id = ct.user_id
    WHERE lower(u.email) = 'michael2colmenares@gmail.com') AS tus_creditos,
  (SELECT credit_cost FROM store_tests WHERE id = 'eneagrama-pareja') AS cuesta_pareja;
