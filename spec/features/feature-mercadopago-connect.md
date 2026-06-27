# Feature: conexión de cuenta Mercado Pago

## Descripción

Desde la vista de configuración, un creador conecta su cuenta de Mercado Pago para poder recibir pagos. Sin este paso, el formulario de donación no puede generar preferencias de pago válidas para ese creador.

## Tareas

- [ ] Agregar sección "Cuenta de cobro" en la vista de configuración, visible solo si `user.isCreator === true`
- [ ] Mostrar estado de conexión actual: conectada o no conectada
- [ ] Implementar botón que inicia el flujo OAuth de Mercado Pago (redirige al usuario a Mercado Pago para autorizar)
- [ ] Manejar el callback OAuth de retorno: leer el código de autorización de los query params y enviarlo al backend
- [ ] Tras conexión exitosa, mostrar confirmación y actualizar el estado en la UI
- [ ] Permitir desconectar la cuenta con confirmación explícita del usuario
