# Feature: página pública de donaciones (`/{username}`)

## Descripción

Página pública, sin auth para verla, donde cualquiera ve el perfil de un creador y le envía una donación con comentario. Ruta `/:username` (última en el router: cede ante rutas estáticas como `/login`, `/explore`). Renderiza con la config traída del backend.

## Contrato backend

`GET /Creators/{creatorName}/page` (`AllowAnonymous`), definido en
`comentapp-backend/spec/features/feature-creator-page-config.md`. Devuelve:

- `creatorName`, `description`, `coverPhotoUrl`
- `minimumAmount`, `presetAmounts`, `allowLinks`
- links sociales
- `canReceiveDonations: boolean` (tiene conexión activa de Mercado Pago)
- `404` si el `creatorName` no existe.

Donación: `POST /donationcomments`. La página se identifica por `creatorName`
(la vista pública no expone el id). **Pendiente confirmar** con backend si el
endpoint acepta `creatorName` o requiere el id → `createDonationByName` en
`donationService.ts` con TODO.

## Comportamiento

- Carga config; `404` muestra "Creador no encontrado".
- Render: portada, nombre, descripción, links sociales.
- Formulario de donación:
  - Botones de montos pre-seteados (rellenan el monto).
  - Monto validado `>= minimumAmount`.
  - Mensaje máx 200; si `allowLinks === false`, rechaza URLs (regex).
  - Si `canReceiveDonations === false`: se oculta el form con aviso.
  - Si el usuario no está logueado: el submit redirige a `/login`.
- En éxito: redirige a `checkoutUrl` de Mercado Pago.

## Tareas

- [x] Ruta `/:username` (`PublicCreatorPage`), última en el router.
- [x] `GET /Creators/{creatorName}/page`; manejo de 404.
- [x] Render de portada/descripción/links.
- [x] Form con presets, validación de mínimo y de links según `allowLinks`.
- [x] Redirección a `/login` si no hay sesión.
- [ ] Confirmar contrato de donación por `creatorName` vs id.
- [ ] Mostrar donaciones pasadas (si la config lo permite).

## Notas de autenticación

Login solo por proveedores externos (Google). Se quitaron las rutas
`/register` y `/confirm-email`; `/login` quedó como entrada Google-only.
Ver donación requiere estar logueado para completar el checkout.
