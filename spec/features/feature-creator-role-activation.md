# Feature: activación de rol creador

## Descripción

Desde la vista de configuración, un usuario autenticado puede activar su rol de creador de contenido. Esta acción es explícita y reversible. Hasta que no se active, el usuario no tiene acceso a la vista del creador ni puede recibir donaciones.

## Tareas

- [ ] Agregar sección "Modo creador" en la vista de configuración
- [ ] Mostrar el estado actual del rol (`activo` / `inactivo`) obtenido del perfil del usuario
- [ ] Implementar toggle o botón de activación/desactivación que llame al endpoint correspondiente del backend
- [ ] Actualizar el estado local del usuario tras la respuesta exitosa del backend
- [ ] Mostrar feedback visual del cambio (ej: toast de confirmación)
- [ ] Si el usuario activa el rol por primera vez, redirigir o sugerir conectar Mercado Pago
