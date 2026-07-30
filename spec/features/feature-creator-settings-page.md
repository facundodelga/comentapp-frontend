# Feature: página de configuración del creador

## Descripción

Panel de configuración del creador, accesible una vez activado el rol (ver [feature-creator-role-activation.md](./feature-creator-role-activation.md)). Layout con menú lateral y contenido a la derecha. Desde acá el creador configura su página pública de donaciones, vincula su método de cobro y accede a la vista de stream en vivo.

Referencia visual: dashboard tipo Ceneka con sidebar (Página de inicio, Recibidas, Enviadas, Estadísticas, Mi página, Métodos de pago, Stream, Cuenta, Salir) y panel principal con guía de pasos y tarjetas de resumen.

## Secciones

### Mi página

Formulario para configurar la página pública de donaciones del creador. Los datos se envían al backend para persistir la configuración propia del creador.

Campos (tomados de la referencia, agrupados por pestaña):

- **General**
  - Descripción (texto enriquecido): mensaje mostrado en la página de donaciones.
  - Monto mínimo de la donación (USD).
  - Largo máximo del mensaje de las donaciones (nro. caracteres, ej: 200).
  - ¿Mostrar donaciones en tu página? (select: mostrar últimas donaciones / ocultar / etc.).
  - Permitir donaciones privadas (toggle).
- **Imágenes**: header e imagen de perfil de la página.
- **Links**: nombre de fantasía y links de redes sociales del creador (al menos uno requerido, ver activación de rol).
- **Objetivo**: meta de recaudación opcional.
- **QR**: QR del link público de la página.

Header de la sección muestra el link público (`ceneka.net/<creatorName>` en la referencia) con acciones QR / Copiar / Visitar.

Estado MVP: "Mi página" implementada con el contrato real del backend (`GET/PATCH /Creators/me`):
descripción + links de redes sociales. Monto mínimo, largo máximo, imágenes, objetivo y QR
quedan para cuando el backend los soporte.

Tareas:

- [x] Ruta protegida por `user.isCreator === true` (`/creator/page`, `CreatorRoute`).
- [ ] Formulario con pestañas (General, Imágenes, Links, Objetivo, QR) — MVP: secciones Descripción + Links.
- [x] `GET` config actual del creador al montar y precargar el formulario.
- [x] `PATCH` para persistir cambios; toast de éxito/error.
- [ ] Validar monto mínimo > 0 y largo máximo del mensaje > 0 (backend aún sin esos campos).
- [ ] Mostrar link público con botones QR / Copiar / Visitar (página pública aún no existe).

### Métodos de pago

Botón que inicia el flujo OAuth de Mercado Pago para vincular la cuenta a la que llegarán las donaciones. Sin este paso el creador no puede recibir pagos. Detalle del flujo OAuth en [feature-mercadopago-connect.md](./feature-mercadopago-connect.md).

Tareas:

- [ ] Mostrar estado de conexión (conectada / no conectada).
- [ ] Botón "Configurar método de pago" que redirige a la autorización de Mercado Pago.
- [ ] Manejar el callback OAuth de retorno y enviar el código al backend.
- [ ] Permitir desvincular la cuenta con confirmación explícita.

### Stream

Lleva al creador a la vista de stream en vivo, conectada por **SignalR**, para recibir los comentarios/donaciones en tiempo real. Detalle en [feature-realtime-feed.md](./feature-realtime-feed.md).

Tareas:

- [ ] Ruta protegida por `user.isCreator === true`.
- [ ] Hook `useSignalR` con estados `Connecting`, `Connected`, `Disconnected`, `Reconnecting`.
- [ ] Render en vivo de comentarios recibidos.

## Notas

- Todas las rutas de configuración requieren rol creador activo.
- La página pública de donaciones (lo que ven los donantes) es un consumidor de esta configuración; no se edita desde acá.
