# Feature: rutas protegidas por rol

## Descripción

Algunas rutas requieren que el usuario esté autenticado, y otras además requieren que tenga el rol de creador activo. El frontend debe proteger estas rutas y redirigir correctamente cuando no se cumplen las condiciones.

## Tareas

- [ ] Crear componente `ProtectedRoute` que verifique si el usuario está autenticado; si no, redirige a `/login`
- [ ] Crear componente `CreatorRoute` que extienda `ProtectedRoute` y además verifique `user.isCreator === true`; si no, redirige a `/settings`
- [ ] Aplicar `ProtectedRoute` a: `/settings`, `/donate/:creatorSlug`
- [ ] Aplicar `CreatorRoute` a: `/dashboard` (vista del creador)
- [ ] Mostrar un estado de carga mientras se resuelve la sesión del usuario para evitar redirecciones falsas
- [ ] No exponer rutas de creador en la navegación si `user.isCreator === false`
