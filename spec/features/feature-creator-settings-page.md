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
  - Precios pre-seteados: lista de montos sugeridos (ej: 5, 10, 20) que el donante ve como botones rápidos.
  - Largo máximo del mensaje de las donaciones (nro. caracteres, ej: 200).
  - ¿Permitir que el donante envíe links en el mensaje? (toggle). Si off, se sanitizan/eliminan URLs del comentario.
  - ¿Mostrar donaciones en tu página? (select: mostrar últimas donaciones / ocultar / etc.).
  - Permitir donaciones privadas (toggle).
- **Imágenes**: foto de portada/header e imagen de perfil de la página.
- **Links**: nombre de fantasía y links de redes sociales del creador (al menos uno requerido, ver activación de rol).
- **Objetivo**: meta de recaudación opcional.
- **QR**: QR del link público de la página.

Header de la sección muestra el link público (`ceneka.net/<creatorName>` en la referencia) con acciones QR / Copiar / Visitar.

Estado: implementada contra el contrato real del backend
`GET/PATCH /Creators/me/page-config` (ver `comentapp-backend/spec/features/feature-creator-page-config.md`).
Cubre descripción, portada, monto mínimo, montos pre-seteados, permitir links y links sociales.
Imágenes por URL (sin upload). Objetivo y QR quedan pendientes.

Tareas:

- [x] Ruta protegida por `user.isCreator === true` (`/creator/page`, `CreatorRoute`).
- [x] `GET /Creators/me/page-config` al montar y precargar el formulario.
- [x] `PATCH /Creators/me/page-config` para persistir; toast de éxito/error.
- [x] Foto de portada por URL con preview (`coverPhotoUrl`).
- [x] Monto mínimo (`minimumAmount`, >= 0, opcional).
- [x] Editor de montos pre-seteados (`presetAmounts`): agregar/quitar, máx 6, sin duplicados, cada uno >= mínimo.
- [x] Toggle "permitir links en el mensaje" (`allowLinks`).
- [ ] Objetivo (meta) y QR del link público.
- [ ] Mostrar link público con botones QR / Copiar / Visitar.

### Contrato backend (campos "Mi página")

`GET/PATCH /Creators/me/page-config` (owner) — implementado en backend:

- `description: string` (máx 1000)
- `coverPhotoUrl: string` (URL http(s), máx 300; "" borra)
- `minimumAmount: number | null` (>= 0)
- `presetAmounts: number[]` (cada > 0; >= `minimumAmount`; máx ~6)
- `allowLinks: boolean`
- `instagramLink` / `tikTokLink` / `youTubeLink` / `twitchLink` / `kickLink`
- `mercadoPagoConnected: boolean` (solo lectura)

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
