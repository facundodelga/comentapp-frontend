# Feature: formulario de donación

## Descripción

Formulario que permite a un usuario autenticado ingresar un monto libre y un comentario para donar a un creador. Al enviarlo, el backend genera una preferencia de pago y el usuario es redirigido al checkout de Mercado Pago.

## Tareas

- [ ] Crear componente `DonationForm` con campos: monto (number) y comentario (textarea)
- [ ] Definir esquema de validación con Yup: monto requerido y mayor a 0, comentario requerido con longitud máxima
- [ ] Conectar el form con Formik
- [ ] Al submit, llamar al endpoint del backend que genera la preferencia de pago y retorna la URL de checkout
- [ ] Redirigir al usuario a la URL de checkout de Mercado Pago
- [ ] Mostrar estado de carga mientras se genera la preferencia
- [ ] Mostrar error si el backend falla al generar la preferencia
