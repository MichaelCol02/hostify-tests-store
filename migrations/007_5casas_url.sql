-- La dirección anterior de 5 Casas (test5casas.netlify.app) dejó de existir y
-- quien gastaba un crédito ahí caía en una página de error de Netlify.

UPDATE store_tests
SET url = 'https://test5m.netlify.app'
WHERE id = '5-casas';

SELECT id, name, url FROM store_tests WHERE id = '5-casas';
