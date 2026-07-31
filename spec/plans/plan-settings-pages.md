# Plan: páginas de configuración (cuenta + página del creador)

Cubre dos features:
- [feature-account-settings.md](../features/feature-account-settings.md) — cuenta de usuario (userName, foto de perfil).
- [feature-creator-settings-page.md](../features/feature-creator-settings-page.md) — "Mi página" del creador, ampliada con precios pre-seteados, mínimos, toggle de links y foto de portada.

## Objetivo

1. `/settings`: todo usuario edita `userName` y avatar.
2. `/creator/page`: el creador configura su página pública de donaciones (descripción, mínimo, precios sugeridos, largo máx mensaje, permitir links, portada, links sociales).

## Estado actual

- `/settings` es placeholder.
- `/creator/page` ya existe (MVP): descripción + links sociales, contra `GET/PATCH /Creators/me`.
- `User` no tiene `avatarUrl`. `Creator` no tiene mínimos/precios/portada/flags.

## Fases

### Fase 1 — Contratos y tipos (bloquea el resto)

- Backend: definir/confirmar endpoints (ver "Contrato backend" en cada feature).
  - `PATCH /users/me` `{ userName?, avatarUrl? }` + subida de avatar.
  - `Creator` + `PATCH /Creators/me` con: `minDonationAmount`, `presetAmounts`, `maxMessageLength`, `allowLinksInMessage`, `showPastDonations`, `allowPrivateDonations`, `coverImageUrl`.
- Frontend:
  - `User` suma `avatarUrl?: string`.
  - Extender `Creator` / `UpdateCreatorRequest` en `creatorService.ts`.
  - Nuevo `accountService.ts` (`getMe`, `updateAccount`, `uploadAvatar`).
  - Componente reutilizable `ImageUploader` (preview, validación tipo/tamaño) — sirve avatar, portada, foto perfil.

### Fase 2 — Cuenta de usuario (`/settings`)

- Reemplazar placeholder de `SettingsPage` por formulario.
- Campos: `userName` (validación de registro), `ImageUploader` de avatar.
- `PATCH` + actualizar `AuthContext.user` y `localStorage`.
- Manejar 409 (userName tomado).
- Navbar: mostrar avatar real.

### Fase 3 — "Mi página" del creador (ampliar)

- Sumar a `CreatorPageSettings`:
  - `minDonationAmount` (Input number, > 0).
  - Editor `presetAmounts` (agregar/quitar chips, > mínimo, sin duplicados).
  - `maxMessageLength` (Input number, > 0).
  - Toggle `allowLinksInMessage`.
  - `ImageUploader` de portada (`coverImageUrl`).
- Validar todo con Yup antes del `PATCH`.

### Fase 4 — Integración visual

- Página pública de donaciones consume portada, descripción, precios sugeridos, mínimo, flag de links (consumidor; se planifica aparte).
- Donation form respeta `presetAmounts` y `minDonationAmount`.

## Orden recomendado

1. Fase 1 (contratos) — coordinar con backend.
2. Fase 2 (cuenta) — independiente, entregable rápido.
3. Fase 3 (Mi página ampliada) — depende de contrato Creator.
4. Fase 4 (consumir en público/donación).

## Riesgos / decisiones abiertas

- Subida de imágenes: ¿backend recibe multipart o front sube a storage y guarda URL? Definir antes de Fase 1.
- Si login es solo Google: ¿`userName` editable o derivado? Afecta Fase 2.
- `presetAmounts`: ¿límite de cantidad? (sugerido máx 6).
- Sanitización de links en mensajes: ¿front, backend o ambos? (backend es la fuente de verdad).
