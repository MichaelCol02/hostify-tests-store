-- Los códigos de 009 y 012 quedaron a la vista en el repositorio público: se apagan
-- los que sigan sin usarse y se crean otros, generados aquí para que nunca pasen por git.
-- Se puede ejecutar más de una vez: siempre muestra la misma lista, no crea más.

UPDATE coupons
SET active = FALSE
WHERE note IN ('Cortesía de lanzamiento', 'Muestra de cortesía - octubre 2026')
  AND active;

INSERT INTO coupons (code, credits, max_uses, note)
SELECT 'REGALO-' || upper(substr(replace(gen_random_uuid()::TEXT, '-', ''), 1, 10)), 1, 1, 'Cortesía noviembre 2026'
FROM generate_series(1, 50)
WHERE NOT EXISTS (SELECT 1 FROM coupons WHERE note = 'Cortesía noviembre 2026');

SELECT code, used_count FROM coupons WHERE note = 'Cortesía noviembre 2026' ORDER BY code;
