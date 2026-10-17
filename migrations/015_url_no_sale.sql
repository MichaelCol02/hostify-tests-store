-- La dirección real de un test deja de viajar al navegador.
--
-- Hasta ahora, abrir un test entregaba su URL al cliente: quedaba en la barra
-- de direcciones y en el código de la página, así que reenviarla por WhatsApp
-- le daba el test gratis a cualquiera, para siempre. Ahora el test se sirve
-- desde la tienda (/t/<intento>) y la URL solo la conoce el servidor.
--
-- Se puede ejecutar más de una vez.

DROP FUNCTION IF EXISTS store_active_attempt(TEXT);

CREATE FUNCTION store_active_attempt(p_test_id TEXT)
RETURNS TABLE (attempt_id UUID, expires_at TIMESTAMPTZ)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT a.id, a.expires_at
  FROM test_attempts a
  WHERE a.user_id = auth.uid() AND a.test_id = p_test_id AND a.expires_at > now()
  ORDER BY a.started_at DESC
  LIMIT 1;
$$;

DROP FUNCTION IF EXISTS store_redeem_credit(TEXT);

CREATE FUNCTION store_redeem_credit(p_test_id TEXT)
RETURNS TABLE (attempt_id UUID, expires_at TIMESTAMPTZ, balance INTEGER)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
#variable_conflict use_column
DECLARE
  v_user UUID := auth.uid();
  v_existe BOOLEAN;
  v_cost INTEGER;
  v_balance INTEGER;
  v_attempt test_attempts%ROWTYPE;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  SELECT TRUE, credit_cost INTO v_existe, v_cost FROM store_tests WHERE id = p_test_id;
  IF NOT COALESCE(v_existe, FALSE) THEN
    RAISE EXCEPTION 'unknown_test';
  END IF;
  v_cost := COALESCE(v_cost, 1);

  -- Serializa por persona: dos pestañas no pueden gastar el mismo crédito.
  PERFORM pg_advisory_xact_lock(hashtext('store_credits:' || v_user::TEXT));

  SELECT COALESCE(SUM(delta), 0)::INTEGER INTO v_balance FROM credit_transactions WHERE user_id = v_user;

  -- Un intento vigente no se vuelve a cobrar: ya se pagó al abrirlo.
  SELECT * INTO v_attempt FROM test_attempts
  WHERE user_id = v_user AND test_id = p_test_id AND test_attempts.expires_at > now()
  ORDER BY started_at DESC LIMIT 1;

  IF FOUND THEN
    RETURN QUERY SELECT v_attempt.id, v_attempt.expires_at, v_balance;
    RETURN;
  END IF;

  IF v_balance < v_cost THEN
    RAISE EXCEPTION 'insufficient_credits';
  END IF;

  INSERT INTO test_attempts (user_id, test_id) VALUES (v_user, p_test_id) RETURNING * INTO v_attempt;
  INSERT INTO credit_transactions (user_id, delta, reason, attempt_id)
  VALUES (v_user, -v_cost, 'redeem', v_attempt.id);

  RETURN QUERY SELECT v_attempt.id, v_attempt.expires_at, v_balance - v_cost;
END;
$$;

REVOKE ALL ON FUNCTION store_active_attempt(TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION store_redeem_credit(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION store_active_attempt(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION store_redeem_credit(TEXT) TO authenticated;

SELECT 'listo' AS estado;
