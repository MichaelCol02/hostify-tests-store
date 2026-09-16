---
name: ajuste-rapido
description: Ciclo corto para cambios en la tienda Hostify Tests (Next.js + Supabase + Stripe en Netlify). Úsala para cualquier ajuste de interfaz, copy, precios, créditos o base de datos en este proyecto, y para publicarlo verificado. Cubre dónde vive cada cosa, cómo verificar en el navegador cuando el dev server se queda sin memoria, cómo aplicar SQL en producción y qué nunca tocar.
---

# Ajuste rápido — Hostify Tests

Tienda de tests con créditos. Michael no programa: hay que darle pasos de un clic y nunca
pedirle que edite código o toque claves en una terminal.

## Mapa: dónde tocar cada cosa

| Quiero cambiar | Archivo |
| --- | --- |
| Textos, secciones y diseño del inicio | `app/page.tsx` |
| Catálogo (nombre, descripción, duración, preguntas, icono, costo en créditos) | `lib/catalog.ts` |
| Precios y paquetes | `lib/pricing.ts` (el servidor cobra según esto; nunca confiar en el navegador) |
| Iconos de tests | `components/TestIcon.tsx` |
| Login / registro | `components/AuthModal.tsx` |
| Sesión y saldo de créditos | `components/AuthProvider.tsx` |
| Pantalla de "comenzar test" / paywall | `components/TestAccess.tsx` |
| Colores, sombras, animaciones | `tailwind.config.js` y `app/globals.css` |

Marca (manual Hostify): naranja `#FF6B2C`, profundo `#D94D1A`, carbón `#111111`.
Tipografías: Inter Tight (títulos, reemplaza a Neue Montreal) y Manrope (texto).

## Ciclo estándar

1. **Editar** el archivo del mapa.
2. **Compilar**: `npm run build` — es también el chequeo de tipos. No saltarlo.
3. **Verificar en el navegador** (ver abajo).
4. **Commit** con mensaje que explique el porqué, en inglés, con la línea `Co-Authored-By`.
5. **Pedir permiso para el push.** El push publica en producción; confirmar siempre.
6. Tras el push, **esperar el deploy y probar el sitio real** (comandos abajo).

## Verificar en el navegador

`npm run dev` suele morir por falta de memoria si hay otra sesión con su propio servidor.
Usar la vista de producción, que pesa mucho menos:

```
npm run build   # deja .next listo
```
Luego `preview_start` con la config `hostify-prod-preview` de `.claude/launch.json`.

Si `next start` dice "Could not find a production build", otra sesión borró `.next` con su
dev server: volver a compilar y arrancar enseguida.

Para estados con sesión iniciada no se puede probar (la cuenta es de Michael): verificar lo
que sí se puede (invitado, catálogo, precios, móvil) y pedirle a él la prueba final.

## Publicar y comprobar producción

```
git push origin main
```
Netlify despliega solo. Luego, para esperar y probar:

```
netlify api listSiteDeploys --data '{"site_id":"a93653f4-520f-45b2-8907-d38e9a22f761","per_page":1}'
```
Repetir hasta `state=ready` con el commit correcto, y después:

```
curl -s -o /dev/null -w '%{http_code}' https://hostifycol.netlify.app/
curl -s -X POST https://hostifycol.netlify.app/api/stripe/checkout -H 'Content-Type: application/json' -d '{"packId":"single"}'   # debe dar 401
curl -s https://hostifycol.netlify.app/tests/disc | grep -c netlify.app/   # debe dar 0: las URLs de tests no se filtran
```

Si solo cambiaron variables de entorno en Netlify (no el código), no hay push: forzar deploy
con `netlify api createSiteBuild --data '{"site_id":"a93653f4-520f-45b2-8907-d38e9a22f761"}'`.

## Cambios de base de datos

Supabase de producción es compartido con otra app (tablas `customers`, `orders`, `tests`…).
**Nunca** modificar ni borrar esas tablas: solo crear objetos nuevos, con nombres propios
(`store_tests`, `test_attempts`, `credit_transactions`, funciones `store_*`).

No hay acceso directo a la base desde aquí. El flujo que sí funciona:

1. Escribir el SQL en `migrations/00X_nombre.sql`, idempotente (`IF NOT EXISTS`,
   `DROP POLICY IF EXISTS`, `ON CONFLICT DO NOTHING`).
2. Copiarlo al portapapeles de Michael:
   `Get-Content -Raw -Encoding UTF8 <ruta> | Set-Clipboard` (PowerShell).
3. Pasos para él: Supabase → SQL Editor → "+ New query" → Ctrl+V → Run → confirmar el aviso
   de operación destructiva → debe decir "Success. No rows returned".

Alternativa cuando el portapapeles se pisa: prompt para Claude in Chrome con el SQL incrustado,
pidiéndole que lo inserte con `monaco.editor` y verifique inicio y fin antes de ejecutar.

## Reglas que no se rompen

- **Nunca leer, escribir ni pedir claves** (Stripe, Supabase service role). Michael las pega
  él mismo. Verificarlas solo por forma: largo, prefijo, últimos 4 caracteres.
- El precio y los créditos los decide el servidor (`lib/pricing.ts`), jamás el navegador.
- Las URLs de los tests solo salen de `store_redeem_credit` / `store_active_attempt`.
- Los errores de base de datos en el webhook devuelven 500 para que Stripe reintente.
- Trampa recurrente del portapapeles: si él copia un prompt, pierde lo que iba a pegar.
  Darle siempre el orden explícito: primero copiar el prompt, después la clave.
