# Feature: vista de comentarios en tiempo real

## Descripción

Panel exclusivo para creadores que muestra los comentarios y montos de donaciones recibidas en tiempo real, usando SignalR para la conexión con el backend.

## Estado: implementado

`StreamPage` (`/creator/stream`, `CreatorRoute`) + hook `src/hooks/useSignalR.ts`.
Hub backend: `/hubs/dashboard` (vía proxy: `/api/hubs/dashboard`), evento `commentReceived`.

## Tareas

- [x] Custom hook `useSignalR` con ciclo de vida completo (conectar, reconectar, desconectar)
- [x] Estados de conexión: `Connecting`, `Connected`, `Reconnecting`, `Disconnected`
- [x] Suscripción al evento del servidor (`commentReceived`)
- [x] Feed de comentarios recibidos (en `StreamPage`; carga inicial + vivo con dedupe)
- [x] Cada ítem muestra: nombre del donante (fallback "Anónimo"), monto y comentario
- [x] Nuevos comentarios al tope de la lista (resaltados hasta marcarlos como leídos)
- [x] Indicador de estado de conexión visible en la UI
- [x] Cleanup de suscripción y conexión en el `useEffect`
