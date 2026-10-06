-- Cupones: códigos que regalan créditos. Solo el servidor (service role) los lee y los
-- marca; los clientes no tienen acceso a estas tablas. Se puede ejecutar más de una vez.

CREATE TABLE IF NOT EXISTS coupons (
  code TEXT PRIMARY KEY,
  credits INTEGER NOT NULL CHECK (credits > 0),
  max_uses INTEGER NOT NULL DEFAULT 1 CHECK (max_uses > 0),
  used_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Una persona no puede usar dos veces el mismo código.
CREATE TABLE IF NOT EXISTS coupon_redemptions (
  code TEXT NOT NULL REFERENCES coupons(code) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (code, user_id)
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_redemptions ENABLE ROW LEVEL SECURITY;
-- Sin políticas a propósito: nadie puede leer la lista de códigos desde el navegador.

-- Canje atómico: descuenta un uso solo si el cupón sigue siendo válido.
-- Devuelve los créditos otorgados, o 0 si el cupón ya no sirve.
CREATE OR REPLACE FUNCTION store_use_coupon(p_code TEXT, p_user UUID)
RETURNS INTEGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_creditos INTEGER;
BEGIN
  UPDATE coupons
  SET used_count = used_count + 1
  WHERE code = upper(trim(p_code))
    AND active
    AND used_count < max_uses
    AND (expires_at IS NULL OR expires_at > now())
  RETURNING credits INTO v_creditos;

  IF v_creditos IS NULL THEN
    RETURN 0;
  END IF;

  -- Si esta persona ya lo usó, se devuelve el uso descontado y no se regala de nuevo.
  BEGIN
    INSERT INTO coupon_redemptions (code, user_id) VALUES (upper(trim(p_code)), p_user);
  EXCEPTION WHEN unique_violation THEN
    UPDATE coupons SET used_count = used_count - 1 WHERE code = upper(trim(p_code));
    RETURN 0;
  END;

  INSERT INTO credit_transactions (user_id, delta, reason, pack_id)
  VALUES (p_user, v_creditos, 'grant', 'cupon:' || upper(trim(p_code)));

  RETURN v_creditos;
END;
$$;

REVOKE ALL ON FUNCTION store_use_coupon(TEXT, UUID) FROM PUBLIC, anon, authenticated;

-- Los diez códigos de cortesía: un test gratis cada uno, un solo uso.
INSERT INTO coupons (code, credits, max_uses, note) VALUES
  ('HOSTIFY-H6HAZN', 1, 1, 'Cortesía de lanzamiento'),
  ('HOSTIFY-E548GY', 1, 1, 'Cortesía de lanzamiento'),
  ('HOSTIFY-YNDNFF', 1, 1, 'Cortesía de lanzamiento'),
  ('HOSTIFY-NGZAU5', 1, 1, 'Cortesía de lanzamiento'),
  ('HOSTIFY-DBN7GX', 1, 1, 'Cortesía de lanzamiento'),
  ('HOSTIFY-7WJXGP', 1, 1, 'Cortesía de lanzamiento'),
  ('HOSTIFY-TKXXDC', 1, 1, 'Cortesía de lanzamiento'),
  ('HOSTIFY-3GFV64', 1, 1, 'Cortesía de lanzamiento'),
  ('HOSTIFY-N5UTJX', 1, 1, 'Cortesía de lanzamiento'),
  ('HOSTIFY-FT6ADP', 1, 1, 'Cortesía de lanzamiento')
ON CONFLICT (code) DO NOTHING;

SELECT code, credits, max_uses, used_count FROM coupons ORDER BY created_at DESC LIMIT 10;
