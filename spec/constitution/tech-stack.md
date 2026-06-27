## Stack principal
 
| Capa | Tecnología | Notas |
|------|-----------|-------|
| Lenguaje | TypeScript | Tipado estricto. Evitar `any`. |
| Framework UI | React + Vite | SPA. Sin SSR. |
| Estilos | Tailwind CSS | Utility-first. No usar CSS custom salvo casos excepcionales. |
| Componentes | shadcn/ui + Radix UI | Componentes accesibles y sin estilos propietarios. Preferir shadcn antes de crear componentes propios. |
| Formularios | Formik + Yup | Formik maneja el estado del form, Yup define el esquema de validación. |
| Tiempo real | SignalR (`@microsoft/signalr`) | Para la vista del creador. Manejar reconexión automática. |
| Pagos | Mercado Pago | Checkout Pro o Bricks. El monto lo define el usuario final. |
 
---
 
## Convenciones para el agente
 
### Componentes
- Functional components con TypeScript. Siempre tipar props con `interface` o `type`.
- Un componente por archivo. Nombre en PascalCase, archivo en PascalCase.tsx.
- Preferir shadcn/ui antes de crear componentes desde cero.
### Estilos
- Clases de Tailwind directamente en JSX.
- No usar `style={{}}` inline salvo valores dinámicos que Tailwind no puede expresar.
- Variantes de componentes con `cn()` (clsx + tailwind-merge, ya incluido en shadcn).
### Formularios
- Todo formulario usa Formik + Yup.
- El esquema Yup se define en el mismo archivo o en `/schemas`.
- No usar `useState` para manejar campos de formulario.
### Tiempo real (SignalR)
- Inicializar la conexión en un custom hook (`useSignalR` o similar).
- Manejar los estados: `Connecting`, `Connected`, `Disconnected`, `Reconnecting`.
- Limpiar la conexión en el cleanup del `useEffect`.
### Pagos (Mercado Pago)
- El frontend genera la preferencia de pago via el backend.
- El monto nunca se fija desde el frontend de forma hardcodeada; siempre viene del input del usuario.
- Manejar los tres callbacks de retorno: `success`, `pending`, `failure`.
### Autenticación y roles
- Todo usuario registrado es `role: "user"` por defecto.
- El rol `creator` se activa explícitamente desde la vista de configuración.
- Las rutas protegidas para creadores deben verificar `user.isCreator === true`.
---
 
## Lo que este stack NO incluye
 
- No hay SSR ni generación estática (no es Next.js).
- No hay manejo de estado global (Redux, Zustand, etc.) definido. Si se necesita, discutir antes de agregar.
- No hay librerías de animación definidas.
- No se procesan pagos fuera de Mercado Pago.