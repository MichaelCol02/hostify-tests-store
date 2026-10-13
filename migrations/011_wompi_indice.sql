-- Arregla el índice que impedía abonar los créditos de una compra con Wompi.
--
-- El índice de la migración 010 era parcial (llevaba WHERE wompi_reference IS
-- NOT NULL). PostgreSQL no acepta un índice parcial para resolver un
-- "INSERT ... ON CONFLICT (wompi_reference) DO NOTHING", así que la escritura
-- fallaba y el pago quedaba cobrado sin entregar nada.
--
-- Un índice único normal sirve igual: PostgreSQL no considera iguales dos
-- valores NULL, así que las compras de Stripe (que no tienen referencia de
-- Wompi) siguen conviviendo sin estorbarse.
-- Se puede ejecutar más de una vez.

DROP INDEX IF EXISTS idx_credit_tx_wompi_ref;

CREATE UNIQUE INDEX IF NOT EXISTS idx_credit_tx_wompi_ref
  ON credit_transactions(wompi_reference);

SELECT 'listo' AS estado;
