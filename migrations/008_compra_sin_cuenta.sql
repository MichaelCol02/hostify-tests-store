-- Compra sin cuenta: el enlace de regreso de Stripe abre la sesión una sola vez.
-- claimed_at marca la compra ya usada para entrar. Se puede ejecutar más de una vez.

ALTER TABLE credit_transactions ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMPTZ;

SELECT 'listo' AS estado;
