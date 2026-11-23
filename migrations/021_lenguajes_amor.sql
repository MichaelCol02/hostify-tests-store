-- Conecta en la tienda «Los 5 lenguajes del amor» (vive dentro de la tienda).
-- Solo toca store_tests. Se puede ejecutar más de una vez.
-- La ficha sale a la venta sola el 15 de diciembre de 2026 (lib/catalog.ts).

INSERT INTO store_tests (id, name, description, price, free_questions, url, credit_cost) VALUES
  ('lenguajes-amor', 'Los 5 lenguajes del amor',
   'Como te sientes amado, como das amor y que te duele cuando falta, con guia para tu pareja y retos de 21 dias.',
   5, 0, 'interno:lenguajes-amor', 1)
ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name, description = EXCLUDED.description,
      url = EXCLUDED.url, credit_cost = EXCLUDED.credit_cost;

SELECT id, name, url, credit_cost FROM store_tests WHERE id = 'lenguajes-amor';

-- EL DÍA DEL LANZAMIENTO (15 de diciembre), correr esta línea para los 3 códigos de regalo:
--   SELECT * FROM store_codigos_lanzamiento('lenguajes-amor', 'AMOR');

-- Versión para los dos: mismo test, 2 créditos, y quien compra recibe un
-- enlace aparte para su pareja (lo arma /t/<intento> al ver «interno:…-pareja»).
INSERT INTO store_tests (id, name, description, price, free_questions, url, credit_cost) VALUES
  ('lenguajes-amor-pareja', 'Los 5 lenguajes del amor en pareja',
   'Cada uno responde por aparte y reciben tres lecturas: la de cada uno y la de los dos, en luz y en sombra.',
   7, 0, 'interno:lenguajes-amor-pareja', 2)
ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name, description = EXCLUDED.description,
      url = EXCLUDED.url, credit_cost = EXCLUDED.credit_cost;

SELECT id, name, url, credit_cost FROM store_tests WHERE id LIKE 'lenguajes-amor%' ORDER BY id;

-- EL DÍA DEL LANZAMIENTO, también los códigos de la versión en pareja:
--   SELECT * FROM store_codigos_lanzamiento('lenguajes-amor-pareja', 'PAREJA');
