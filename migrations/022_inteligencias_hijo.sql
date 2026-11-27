-- Conecta en la tienda «Las inteligencias de tu hijo» (vive dentro de la tienda).
-- Solo toca store_tests. Se puede ejecutar más de una vez.
-- La ficha sale a la venta sola en su fecha (lib/catalog.ts).
INSERT INTO store_tests (id, name, description, price, free_questions, url, credit_cost) VALUES
  ('inteligencias-hijo', 'Las inteligencias de tu hijo',
   'Las 8 inteligencias de tu hijo, como aprende mejor y que hacer en casa segun su edad.',
   5, 0, 'interno:inteligencias-hijo', 1)
ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name, description = EXCLUDED.description,
      url = EXCLUDED.url, credit_cost = EXCLUDED.credit_cost;
SELECT id, name, url, credit_cost FROM store_tests WHERE id = 'inteligencias-hijo';
-- EL DÍA DEL LANZAMIENTO:
--   SELECT * FROM store_codigos_lanzamiento('inteligencias-hijo', 'HIJO');
