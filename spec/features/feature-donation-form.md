# Feature: formulario de donación

## Descripción

Formulario que permite a un usuario autenticado ingresar un monto libre y un comentario para donar a un creador. Al enviarlo, el backend genera una preferencia de pago y el usuario es redirigido al checkout de Mercado Pago.

## Estado: implementado

`CommentsPage` (`/new-comment`, protegida): combobox de creadores reales (`GET /Creators`,
filtrados por `mercadoPagoConnected`), comentario (max 300), monto (`amount > 0`).
Submit → `POST /DonationComments` → redirect a `checkoutUrl`. Errores via toast.

## Tareas

- [x] Formulario con monto (number) y comentario (textarea)
- [x] Esquema Yup: monto requerido y mayor a 0 (`moreThan(0)`), comentario requerido max 300
- [x] Conectado con Formik
- [x] Submit llama al backend que genera la preferencia y retorna la URL de checkout
- [x] Redirección a la URL de checkout de Mercado Pago
- [x] Estado de carga durante la generación de la preferencia
- [x] Error visible si el backend falla al generar la preferencia
- [x] Lista de creadores reales desde `GET /Creators` (solo con MP conectado)
