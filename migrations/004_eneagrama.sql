-- Registra los tests del Eneagrama en el catálogo de la tienda y les da su dirección.
-- El de pareja cuesta 2 créditos: uno por persona.
-- Solo crea o actualiza filas de store_tests. Se puede ejecutar más de una vez.

INSERT INTO store_tests (id, name, description, price, free_questions, url) VALUES
  ('eneagrama', 'Eneagrama', 'Cuál de las nueve esencias eres, medida con tres fuentes que se contrastan entre sí.', 5, 0, 'https://hostify-eneagrama.netlify.app'),
  ('eneagrama-pareja', 'Eneagrama en pareja', 'Responden los dos y salen tres lecturas: la esencia de cada uno y cómo se complementan.', 7, 0, 'https://hostify-eneagrama-pareja.netlify.app')
ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name,
      description = EXCLUDED.description,
      url = EXCLUDED.url;
