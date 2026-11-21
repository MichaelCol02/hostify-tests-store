-- Conecta en la tienda «Tu estilo de crianza», el primer test que vive dentro
-- de la tienda (url «interno:...»: no hay sitio aparte que mantener).
-- Solo toca store_tests. Se puede ejecutar más de una vez.
-- La ficha sale a la venta sola el día de su lanzamiento (lib/catalog.ts).

INSERT INTO store_tests (id, name, description, price, free_questions, url, credit_cost) VALUES
  ('estilo-crianza', 'Tu estilo de crianza',
   'Qué tipo de papá o mamá eres de verdad, en calma y bajo presión, con guía práctica y plan de 21 días.',
   5, 0, 'interno:estilo-crianza', 1)
ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name,
      description = EXCLUDED.description,
      url = EXCLUDED.url,
      credit_cost = EXCLUDED.credit_cost;

SELECT id, name, url, credit_cost FROM store_tests WHERE id = 'estilo-crianza';
