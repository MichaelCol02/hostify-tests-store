-- Regala 1 crédito a una persona que ya creó su cuenta.
-- Para regalar a otra, cambia el correo en las tres líneas marcadas.
-- Si se ejecuta dos veces no regala de más: solo entrega un crédito de cortesía por persona.

-- 1) Asegura la ficha de la persona (la cuenta de acceso ya existe; esto copia su correo).
INSERT INTO users (id, email, name)
SELECT au.id,
       au.email,
       COALESCE(au.raw_user_meta_data ->> 'name', split_part(au.email, '@', 1))
FROM auth.users au
WHERE lower(au.email) = lower('lauracorrea9310@gmail.com')   -- correo
ON CONFLICT (id) DO NOTHING;

-- 2) Entrega el crédito de cortesía.
INSERT INTO credit_transactions (user_id, delta, reason)
SELECT u.id, 1, 'grant'
FROM users u
WHERE lower(u.email) = lower('lauracorrea9310@gmail.com')    -- correo
  AND NOT EXISTS (
    SELECT 1 FROM credit_transactions t
    WHERE t.user_id = u.id AND t.reason = 'grant'
  );

-- 3) Comprueba el saldo. Si no devuelve ninguna fila, esa cuenta todavía no existe.
SELECT u.email,
       COALESCE(SUM(t.delta), 0) AS creditos_disponibles
FROM users u
LEFT JOIN credit_transactions t ON t.user_id = u.id
WHERE lower(u.email) = lower('lauracorrea9310@gmail.com')    -- correo
GROUP BY u.email;
