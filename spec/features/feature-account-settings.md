# Feature: configuración de cuenta de usuario

## Descripción

Página donde cualquier usuario autenticado (creador o no) administra los datos de su cuenta: nombre de usuario y foto de perfil. Es la vista base de `/settings`, hoy placeholder. La configuración específica de creador (página de donaciones) vive en `/creator/*` y se documenta aparte en [feature-creator-settings-page.md](./feature-creator-settings-page.md).

## Alcance

Editable por el usuario:

- **Nombre de usuario** (`userName`): único, validado. Ver reglas de `Register.types` (mismo regex/longitud).
- **Foto de perfil** (`avatarUrl`): imagen subida por el usuario. Preview antes de guardar.

Fuera de alcance en esta feature:

- Cambio de email (requiere reverificación — feature futura).
- Cambio de contraseña (feature futura, o no aplica si login es solo Google).
- Baja de cuenta.

## Contrato backend

- `GET /Authentication/me` → incluye `userName`, `avatarUrl`, `isCreator`.
- `PATCH /users/me` → body `{ userName?, avatarUrl? }`. `null`/omitido = no tocar. (Ruta a confirmar con backend.)
- **Sin subida de archivos**: la foto se guarda como URL externa (campo `avatarUrl`).
- Validar unicidad de `userName` en backend; devolver `409` si está tomado (el front lo mapea a error de campo).

Estado frontend: implementado en `SettingsPage` (`/settings`). `userName` editable con validación + `avatarUrl` por URL con preview. 409 muestra "nombre de usuario en uso".

## Tareas frontend

- [ ] Ruta `/settings` protegida (usuario autenticado).
- [ ] Cargar datos actuales al montar (`me()`), precargar formulario.
- [ ] Campo `userName` con misma validación que registro; deshabilitar submit si no cambió.
- [ ] Uploader de foto: seleccionar archivo, preview, validar tipo (jpg/png/webp) y tamaño máx.
- [ ] `PATCH` de cambios; toast éxito/error; manejar 409 `userName` tomado.
- [ ] Actualizar `AuthContext.user` y `localStorage` tras guardar.
- [ ] Reflejar avatar en Navbar (hoy usa icono genérico).

## Notas

- `User` en `Login.types` debe sumar `avatarUrl?: string`.
- Si login es solo Google, evaluar si `userName` es editable o se deriva del perfil de Google.
