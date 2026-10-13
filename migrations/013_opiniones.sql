-- Calificaciones de la plataforma. Las escribe el servidor; nadie puede leerlas
-- ni modificarlas desde el navegador. Se puede ejecutar más de una vez.

CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Qué test estaba haciendo. Nulo si califica la plataforma en general.
  test_id TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  name TEXT,
  -- Publicar el comentario requiere permiso explícito de quien lo escribió.
  may_publish BOOLEAN NOT NULL DEFAULT FALSE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
-- Sin políticas a propósito: solo el servidor entra aquí.

CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews(created_at DESC);

SELECT 'listo' AS estado;
