# Feature: integración Mercado Pago — checkout y callbacks

## Descripción

Manejo del flujo de pago con Mercado Pago. El frontend no genera la preferencia directamente; la solicita al backend. Una vez que el usuario completa (o abandona) el pago, Mercado Pago redirige a una URL del frontend con el resultado.

**Ruta de retorno real** (definida por el backend en las back_urls de la preference):
`/donation/result?status=success|pending|failure&ref=<donationId>` — una sola página, no tres rutas.

## Estado: implementado

- `DonationResultPage` en `/donation/result` (protegida). Lee `status` y `ref` del query.
- El query param es solo hint: la página consulta `GET /Payments/{donationId}` y muestra el
  estado **verificado server-side** (webhook). Nunca muestra aprobado si el backend dice pending.
- Vistas: approved / pending / rejected / cancelled / refunded, con acciones (reintentar, inicio).
- Servicio: `src/services/donationService.ts` (`createDonation`, `getPaymentStatus`).

## Tareas

- [x] Página de retorno con feedback visual por estado
- [x] Leer query params de retorno (`status`, `ref`)
- [x] Verificar estado real contra el backend (no confiar en query params)
- [x] Pending: informar que el pago se está procesando
- [x] Failure: mensaje de error y volver a intentar
- [x] URLs de retorno configuradas por el backend al crear la preferencia
