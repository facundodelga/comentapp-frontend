# Feature: activación de rol creador

## Descripción

Desde la vista de configuración, un usuario autenticado puede activar su rol de creador de contenido. Esta acción es explícita y reversible. Hasta que no se active, el usuario no tiene acceso a la vista del creador ni puede recibir donaciones.

## Requisitos para activar el rol

Para convertirse en creador, el usuario debe proporcionar:

1. **Nombre de fantasía** (`creatorName`): obligatorio. Nombre público con el que aparecerá ante los donantes.
2. **Al menos un link de red social**: obligatorio. El usuario debe proveer la URL de su perfil en alguna red social (ej: Instagram, X/Twitter, YouTube, Twitch, TikTok). Se requiere como mínimo uno; se pueden agregar varios.

Sin ambos datos el backend rechaza la activación del rol.

## Finalización de la configuración de creador

Una vez activado el rol, para **completar** la configuración y empezar a recibir donaciones el creador debe **vincular su cuenta de Mercado Pago**. Hasta que la cuenta de MP no esté conectada, el creador figura como incompleto y no puede recibir pagos. Ver [feature-mercadopago-connect.md](./feature-mercadopago-connect.md).

## Tareas

- [ ] Agregar sección "Modo creador" en la vista de configuración
- [ ] Mostrar el estado actual del rol (`activo` / `inactivo`) obtenido del perfil del usuario
- [ ] Formulario de activación con campo `creatorName` (requerido) y al menos un campo de link de red social (requerido)
- [ ] Validar en frontend que `creatorName` no esté vacío y que exista al menos un link válido (URL) antes de enviar
- [ ] Implementar toggle o botón de activación/desactivación que llame al endpoint correspondiente del backend
- [ ] Actualizar el estado local del usuario tras la respuesta exitosa del backend
- [ ] Mostrar feedback visual del cambio (ej: toast de confirmación)
- [ ] Si el usuario activa el rol por primera vez, redirigir o sugerir conectar Mercado Pago para finalizar la configuración
