# Feature: vista de comentarios en tiempo real

## Descripción

Panel exclusivo para creadores que muestra los comentarios y montos de donaciones recibidas en tiempo real, usando SignalR para la conexión con el backend.

## Tareas

- [ ] Crear custom hook `useSignalR` que gestione el ciclo de vida de la conexión (conectar, reconectar, desconectar)
- [ ] En el hook, manejar los estados de conexión: `Connecting`, `Connected`, `Reconnecting`, `Disconnected`
- [ ] Suscribirse al evento del servidor que notifica nuevas donaciones (ej: `OnDonationReceived`)
- [ ] Crear componente `DonationFeed` que renderice la lista de comentarios recibidos
- [ ] Cada ítem del feed muestra: nombre del donante (o anónimo), monto y comentario
- [ ] Los nuevos comentarios aparecen al tope de la lista con una animación de entrada sutil
- [ ] Mostrar indicador de estado de conexión visible en la UI (conectado / reconectando / desconectado)
- [ ] Limpiar la suscripción y cerrar la conexión en el cleanup del `useEffect`
