-- Códigos que solo sirven para un test: los de las dinámicas de lanzamiento.
--
-- Un cupón con test_id no da un crédito suelto (que se podría gastar en otro
-- test): abre directamente ESE test, en la misma operación. Los cupones sin
-- test_id siguen funcionando igual que siempre.
-- Se puede ejecutar más de una vez.

ALTER TABLE coupons ADD COLUMN IF NOT EXISTS test_id TEXT REFERENCES store_tests(id);

DROP FUNCTION IF EXISTS store_use_coupon(TEXT, UUID);

CREATE OR REPLACE FUNCTION store_use_coupon(p_code TEXT, p_user UUID, p_test TEXT DEFAULT NULL)
RETURNS INTEGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_codigo TEXT := upper(trim(p_code));
  v_creditos INTEGER;
  v_test TEXT;
  v_costo INTEGER;
  v_intento UUID;
BEGIN
  UPDATE coupons
  SET used_count = used_count + 1
  WHERE code = v_codigo
    AND active
    AND used_count < max_uses
    AND (expires_at IS NULL OR expires_at > now())
    AND (test_id IS NULL OR test_id = p_test)
  RETURNING credits, test_id INTO v_creditos, v_test;

  IF v_creditos IS NULL THEN
    RETURN 0;
  END IF;

  -- Si esta persona ya lo usó, se devuelve el uso descontado y no se regala de nuevo.
  BEGIN
    INSERT INTO coupon_redemptions (code, user_id) VALUES (v_codigo, p_user);
  EXCEPTION WHEN unique_violation THEN
    UPDATE coupons SET used_count = used_count - 1 WHERE code = v_codigo;
    RETURN 0;
  END;

  INSERT INTO credit_transactions (user_id, delta, reason, pack_id)
  VALUES (p_user, v_creditos, 'grant', 'cupon:' || v_codigo);

  -- Cupón de un test: el crédito se gasta ahí mismo en ese test.
  IF v_test IS NOT NULL THEN
    SELECT COALESCE(credit_cost, 1) INTO v_costo FROM store_tests WHERE id = v_test;
    INSERT INTO test_attempts (user_id, test_id) VALUES (p_user, v_test) RETURNING id INTO v_intento;
    INSERT INTO credit_transactions (user_id, delta, reason, attempt_id)
    VALUES (p_user, -LEAST(v_costo, v_creditos), 'redeem', v_intento);
  END IF;

  RETURN v_creditos;
END;
$$;

REVOKE ALL ON FUNCTION store_use_coupon(TEXT, UUID, TEXT) FROM PUBLIC, anon, authenticated;

-- Los códigos de lanzamiento quedan amarrados a su test.
CREATE OR REPLACE FUNCTION store_codigos_lanzamiento(p_test TEXT, p_prefijo TEXT, p_cantidad INTEGER DEFAULT 3)
RETURNS TABLE (codigo TEXT, usado INTEGER, vence DATE)
LANGUAGE plpgsql
AS $$
DECLARE
  v_nota TEXT := 'Lanzamiento ' || p_test;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM coupons c WHERE c.note = v_nota) THEN
    INSERT INTO coupons (code, credits, max_uses, expires_at, note, test_id)
    SELECT upper(p_prefijo) || '-' || upper(substr(replace(gen_random_uuid()::TEXT, '-', ''), 1, 6)),
           1, 1, now() + interval '30 days', v_nota, p_test
    FROM generate_series(1, p_cantidad);
  END IF;

  UPDATE coupons c SET test_id = p_test WHERE c.note = v_nota AND c.test_id IS NULL;

  RETURN QUERY
    SELECT c.code, c.used_count, (c.expires_at AT TIME ZONE 'America/Bogota')::DATE
    FROM coupons c WHERE c.note = v_nota ORDER BY c.code;
END;
$$;

REVOKE ALL ON FUNCTION store_codigos_lanzamiento(TEXT, TEXT, INTEGER) FROM PUBLIC, anon, authenticated;

-- Los tres de «Tu estilo de crianza» (los crea si no existen, o los amarra si ya estaban).
SELECT * FROM store_codigos_lanzamiento('estilo-crianza', 'CRIANZA');
