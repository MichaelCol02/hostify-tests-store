-- Tres códigos de regalo por cada test que se lanza.
-- Los crea la base de datos al azar: nunca quedan escritos en git.
-- Cada uno da 1 crédito, sirve una sola vez y vence a los 30 días, para que
-- el regalo empuje el lanzamiento y no quede suelto para siempre.
--
-- En cada lanzamiento basta con correr una línea, por ejemplo:
--   SELECT * FROM store_codigos_lanzamiento('estilo-crianza', 'CRIANZA');
-- Si se corre otra vez para el mismo test, devuelve los mismos tres códigos
-- en lugar de crear otros.

CREATE OR REPLACE FUNCTION store_codigos_lanzamiento(p_test TEXT, p_prefijo TEXT, p_cantidad INTEGER DEFAULT 3)
RETURNS TABLE (codigo TEXT, usado INTEGER, vence DATE)
LANGUAGE plpgsql
AS $$
DECLARE
  v_nota TEXT := 'Lanzamiento ' || p_test;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM coupons c WHERE c.note = v_nota) THEN
    INSERT INTO coupons (code, credits, max_uses, expires_at, note)
    SELECT upper(p_prefijo) || '-' || upper(substr(replace(gen_random_uuid()::TEXT, '-', ''), 1, 6)),
           1, 1, now() + interval '30 days', v_nota
    FROM generate_series(1, p_cantidad);
  END IF;

  RETURN QUERY
    SELECT c.code, c.used_count, (c.expires_at AT TIME ZONE 'America/Bogota')::DATE
    FROM coupons c WHERE c.note = v_nota ORDER BY c.code;
END;
$$;

-- Solo se usa desde el SQL Editor. Que nadie la pueda llamar desde la web.
REVOKE ALL ON FUNCTION store_codigos_lanzamiento(TEXT, TEXT, INTEGER) FROM PUBLIC, anon, authenticated;

-- Los tres de «Tu estilo de crianza», lanzado el 21 de noviembre de 2026.
SELECT * FROM store_codigos_lanzamiento('estilo-crianza', 'CRIANZA');
