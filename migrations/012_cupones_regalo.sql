-- 40 códigos de cortesía: un test completo gratis cada uno, un solo uso.
-- Sirven para cualquier test, igual que los de lanzamiento.
-- Se puede ejecutar más de una vez: los repetidos se ignoran.

INSERT INTO coupons (code, credits, max_uses, note) VALUES
  ('REGALO-HCYWK9', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-RNKPTP', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-TGUCPV', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-KKGEEA', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-H8GEMV', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-P497XE', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-XGPQ7A', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-RWW3M4', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-E4X93C', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-KJ8TFJ', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-TFK7AX', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-HE8A9K', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-GFPCHR', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-ENUM78', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-37UTEE', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-RVJQKC', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-KQWPCR', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-4D6AMD', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-AD6DMC', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-CTP4RC', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-YPJ9JU', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-DUC44X', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-A4CPEF', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-7FJ8WY', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-G3WMKG', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-YX6P8V', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-KDRQ2U', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-VV4X4C', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-MFVJGV', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-KWF68C', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-XDYFFX', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-TP29V3', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-RWUA98', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-FRXFCM', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-KCUHH8', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-HGCUPU', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-RDTPVR', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-PKF4J8', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-NXGNQW', 1, 1, 'Muestra de cortesía - octubre 2026'),
  ('REGALO-A73RAK', 1, 1, 'Muestra de cortesía - octubre 2026')
ON CONFLICT (code) DO NOTHING;

SELECT count(*) AS cupones_de_regalo FROM coupons WHERE note = 'Muestra de cortesía - octubre 2026';
