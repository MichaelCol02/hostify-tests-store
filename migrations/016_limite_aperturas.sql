-- Un crédito deja de ser una barra libre de 24 horas.
--
-- El intento sigue durando 24 horas para que nadie pierda su crédito si cierra
-- la pestaña, pero ahora se cuenta cuántas veces se abre. Pasado el límite, hay
-- que comprar otro: una persona no puede responder el mismo test veinte veces
-- con un solo pago, ni pasarle el teléfono a media familia.
--
-- Se puede ejecutar más de una vez.

ALTER TABLE test_attempts ADD COLUMN IF NOT EXISTS opens INTEGER NOT NULL DEFAULT 0;

-- Sumar y leer en un solo paso: dos pestañas a la vez no pueden saltarse la cuenta.
CREATE OR REPLACE FUNCTION store_registrar_apertura(p_attempt UUID)
RETURNS INTEGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_veces INTEGER;
BEGIN
  UPDATE test_attempts SET opens = opens + 1 WHERE id = p_attempt RETURNING opens INTO v_veces;
  RETURN COALESCE(v_veces, 0);
END;
$$;

-- Solo el servidor la llama; desde el navegador no se alcanza.
REVOKE ALL ON FUNCTION store_registrar_apertura(UUID) FROM PUBLIC, anon, authenticated;

SELECT 'listo' AS estado;
