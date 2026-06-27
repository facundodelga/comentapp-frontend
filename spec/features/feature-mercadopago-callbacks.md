# Feature: integración Mercado Pago — checkout y callbacks

## Descripción

Manejo del flujo de pago con Mercado Pago. El frontend no genera la preferencia directamente; la solicita al backend. Una vez que el usuario completa (o abandona) el pago, Mercado Pago redirige a una URL del frontend con el resultado.

## Tareas

- [ ] Definir las rutas de retorno: `/donate/success`, `/donate/pending`, `/donate/failure`
- [ ] Crear componente o página para cada estado de retorno con feedback visual claro al usuario
- [ ] Leer los query params que retorna Mercado Pago en la URL de retorno (`payment_id`, `status`, `merchant_order_id`)
- [ ] En `/donate/success`: mostrar confirmación y limpiar el estado del formulario
- [ ] En `/donate/pending`: informar al usuario que el pago está siendo procesado
- [ ] En `/donate/failure`: mostrar mensaje de error y ofrecer volver a intentar
- [ ] Configurar las URLs de retorno en la llamada al backend al momento de generar la preferencia
