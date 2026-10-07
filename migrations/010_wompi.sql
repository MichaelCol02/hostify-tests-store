-- Cobros con Wompi (pesos colombianos). Solo agrega objetos nuevos.
-- Se puede ejecutar más de una vez.

-- Pedido pendiente: se crea al abrir el cobro y se completa cuando Wompi avisa que se pagó.
CREATE TABLE IF NOT EXISTS wompi_orders (
  reference TEXT PRIMARY KEY,
  pack_id TEXT NOT NULL,
  credits INTEGER NOT NULL,
  amount_cop INTEGER NOT NULL,
  email TEXT,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  transaction_id TEXT,
  credited_at TIMESTAMPTZ,
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE wompi_orders ENABLE ROW LEVEL SECURITY;
-- Sin políticas: solo el servidor lee y escribe aquí.

-- La compra pagada se registra igual que las de Stripe, pero con su propia referencia.
ALTER TABLE credit_transactions ADD COLUMN IF NOT EXISTS provider TEXT NOT NULL DEFAULT 'stripe';
ALTER TABLE credit_transactions ADD COLUMN IF NOT EXISTS wompi_reference TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_credit_tx_wompi_ref
  ON credit_transactions(wompi_reference)
  WHERE wompi_reference IS NOT NULL;

SELECT 'listo' AS estado;
