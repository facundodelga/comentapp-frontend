# Roadmap — Frontend
 
> Documento de referencia para agentes. Define el estado actual y el orden de construcción de cada vista.
> Actualizar el estado de cada vista a medida que avanza el desarrollo.
 
---
 
## Estado de vistas
 
| Estado | Significado |
|--------|-------------|
| `done` | Vista construida y funcional |
| `in-progress` | En desarrollo activo |
| `next` | Próxima a comenzar |
| `pending` | No iniciada |
 
---
 
## Vistas
 
### 1. Landing
- **Estado:** `done`
- **Ruta:** `/`
- **Audiencia:** Visitantes no autenticados
- **Descripción:** Página pública que explica para qué sirve la plataforma. Vista About y Contacto tambien entra. No requiere autenticación.
- **Dependencias:** Ninguna
---
 
### 2. Registro e inicio de sesión
- **Estado:** `done`
- **Rutas:** `/register`, `/login`
- **Audiencia:** Visitantes no autenticados
- **Descripción:** Autenticación de usuarios. Todo usuario que se registra obtiene el rol de usuario común por defecto. No es creador de contenido al registrarse.
- **Dependencias:** Ninguna
---
 
### 3. Formulario de donación con comentario
- **Estado:** `next`
- **Ruta:** `/new-comment` (o equivalente)
- **Audiencia:** Usuarios autenticados
- **Descripción:** El usuario elige un monto libre, escribe un comentario y es redirigido al checkout de Mercado Pago. Al volver, se maneja el callback de pago (éxito, pendiente, error).
- **Dependencias:**
  - Vista de configuración completada (el creador debe tener Mercado Pago conectado)
  - Integración con Mercado Pago Checkout Pro o Bricks
- **Notas para el agente:**
  - Usar Formik + Yup para validación del formulario
  - El monto lo define el usuario, no hay monto fijo
  - Manejar los tres estados de retorno de Mercado Pago: `success`, `pending`, `failure`
---
 
### 4. Vista de configuración
- **Estado:** `next`
- **Ruta:** `/settings`
- **Audiencia:** Usuarios autenticados
- **Descripción:** El usuario puede activar su rol de creador de contenido desde esta vista. También conecta su cuenta de Mercado Pago para poder recibir pagos.
- **Dependencias:**
  - Usuario autenticado
- **Notas para el agente:**
  - La activación como creador es un toggle/acción explícita, no ocurre al registrarse
  - La conexión con Mercado Pago es prerequisito para que el formulario de donación funcione
  - Usar Formik + Yup si hay campos editables (nombre, alias, etc.)
---
 
### 5. Vista del creador — comentarios en tiempo real
- **Estado:** `pending`
- **Ruta:** `/comments` (o equivalente, solo para creadores)
- **Audiencia:** Usuarios con rol de creador activo
- **Descripción:** Panel que muestra los comentarios recibidos junto al monto donado, los comentarios son una lista de tarjetas que contiene: nombre de usuario, monto, y el comentario, actualizándose en tiempo real a medida que llegan nuevas donaciones. en un apartado se muestra la cantidad de comentarios sin leer, se deben marcar como leidos/no-leidos de forma visual.
- **Dependencias:**
  - Formulario de donación funcionando end-to-end
  - Mercado Pago integrado y operativo
  - Backend con soporte de SignalR para eventos en tiempo real
- **Notas para el agente:**
  - Usar SignalR (ya incluido en el stack) para la conexión en tiempo real
  - El creador puede marcar como leido y la tarjeta de comentario esta como "apagada" (solo frontend).
  - Proteger la ruta: solo accesible si `user.isCreator === true`
  - Manejar reconexión automática de SignalR ante pérdida de conexión
---


## Orden de desarrollo recomendado
 
```
done        → Landing
done        → Registro / Login
next        → Formulario de donación   ← empezar acá
next        → Configuración
pending     → Vista del creador (tiempo real)
```
 
> La vista del creador queda al final porque depende de que el flujo de donación
> esté probado y de que Mercado Pago esté integrado end-to-end.