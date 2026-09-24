-- Conecta en la tienda los tests recién publicados: Áreas de Vida, Finanzas y 5 Heridas.
-- Solo toca store_tests. Se puede ejecutar más de una vez.

INSERT INTO store_tests (id, name, description, price, free_questions, url) VALUES
  ('areas-vida', 'Las 12 áreas de tu vida', 'Doce áreas agrupadas como un árbol: lo que te sostiene por dentro, cómo te cuidas, con quién caminas y qué produces.', 5, 0, 'https://hostify-areas-vida.netlify.app'),
  ('finanzas', 'Mi relación con el dinero', 'Tres dimensiones que sí miden salud financiera: cómo piensas el dinero, cómo estás hoy y qué necesitas.', 5, 0, 'https://hostify-finanzas.netlify.app'),
  ('5-heridas', 'Las 5 heridas', 'Veinte afirmaciones que revelan qué armadura construiste para protegerte y qué te está costando hoy.', 5, 0, 'https://hostify-5-heridas.netlify.app')
ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name,
      description = EXCLUDED.description,
      url = EXCLUDED.url;

-- Comprueba que quedaron las tres con su dirección.
SELECT id, name, url FROM store_tests WHERE id IN ('areas-vida', 'finanzas', '5-heridas');
