# Comentapp
Comentapp es una aplicacion para que usuarios puedan enviar donaciones con comentarios a creadores de contenido que estén registrados en la pagina por medio de Mercado Pago.

## Stack
- Lenguaje: Typescript
- Framework / runtime: React, Tailwind, Shadcn/radix, Formik/Yup
- Tests: Vitest
## Comandos
- `npm run dev` — arranca el servidor en local
- `npm run test` — ejecuta los tests (deben pasar antes de cada commit)
- `[comando lint]` — revisa el estilo (antes de cada PR)
- `[npm run build]` — compila para producción
## Estructura del proyecto
- `src/main.tsx`: punto de entrada. Monta `ThemeProvider`, `ToastProvider` y `RouterProvider`.
- `src/App.tsx`: layout principal. Monta `AuthProvider`, `Navbar` y el `Outlet` de rutas.
- `src/routes/Routes.tsx`: definicion centralizada de rutas con `createBrowserRouter`.
- `src/pages/`: vistas de pagina.
- `src/components/`: componentes reutilizables de la app.
- `src/components/ui/`: primitives UI compartidas, estilo shadcn/radix.
- `src/contexts/`: providers y contextos globales.
- `src/hooks/`: hooks reutilizables.
- `src/services/`: clientes y llamadas HTTP.
- `src/types/`: tipos, schemas y transformadores de datos.
- `src/lib/utils.ts`: utilidades compartidas, incluyendo `cn` y `formatError`.
- `src/config/env.ts`: lectura y normalizacion de variables de entorno.

## Convenciones de codigo

- Usar TypeScript y componentes funcionales de React.
- Preferir imports con alias `@/` para codigo dentro de `src`.
- Mantener las rutas en `src/routes/Routes.tsx`.
- Mantener formularios y validaciones cerca de sus tipos/schemas en `src/types/` cuando corresponda.
- Usar `cn()` de `src/lib/utils.ts` para combinar clases de Tailwind.
- Reutilizar componentes de `src/components/ui/` antes de crear markup propio.
- Para iconos, preferir `lucide-react` salvo que el componente existente use otra libreria.
- Evitar cambios grandes de estilo global en `src/index.css` si una clase local resuelve el caso.

## UI y estilos

- El sistema visual usa Tailwind CSS 4 y tokens CSS definidos en `src/index.css`.
- Los colores principales, radios, modo oscuro y tokens shadcn viven en `:root`, `.dark` y `@theme`.
- Mantener las pantallas responsivas con layouts simples y contenido centrado cuando aplique.
- Evitar hardcodear colores si ya existe un token (`primary`, `muted`, `border`, `background`, etc.).
- Para botones, inputs, cards, fields, selects y feedback visual, usar los componentes existentes en `src/components/ui/`.

## Auth y API

- `src/services/loginThunk.ts` define `apiClient` con `baseURL: "/api"` y `withCredentials: true`.
- El refresh de sesion se maneja con interceptores de Axios y el evento `AUTH_SESSION_EXPIRED_EVENT`.
- `AuthProvider` persiste el usuario en `localStorage` con la clave `user`.
- Si agregas endpoints nuevos, preferir funciones de servicio tipadas en `src/services/`.
- No leer `VITE_API_BASE_URL` directamente desde componentes; usar la configuracion existente.

## Convenciones
- Estilo de nombres, p. ej. camelCase para variables y funciones.
- Dónde van los tests, p. ej. al lado del archivo: `foo.ts` + `foo.test.ts`.
- clases propias en `src/errors/`.
- validar toda entrada del usuario antes de usarla.

## No hagas
- No instalar dependencias sin avisar.
- No subir archivos `.env*` al repositorio.
- Mo usar `any` en TypeScript sin justificarlo.

## Flujo de trabajo
- Antes de una tarea no trivial, propón un plan y espera mi OK.
- Una tarea a la vez; al terminar, dime qué cambiaste para que lo revise.
- Si no estás seguro al 80%, pregunta. No inventes.
## Documentación
- Referencias a más reglas, contexto, documentación y especificaciones.

