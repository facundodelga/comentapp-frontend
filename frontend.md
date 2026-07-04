# Frontend - contexto tecnico

## Ubicacion

App en `comentapp-frontend`.

## Stack

- TypeScript
- React 19
- Vite 8
- React Router 7
- Tailwind CSS 4 con plugin `@tailwindcss/vite`
- shadcn/ui-style components en `src/components/ui`
- Radix/Base UI para primitives
- Formik + Yup para formularios
- Axios para HTTP
- Sonner/toast propio via `ToastContext`
- Iconos: `lucide-react`, tambien `@tabler/icons-react` disponible

Scripts:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Configuracion HTTP

`vite.config.ts` define proxy:

```ts
"/api" -> VITE_API_BASE_URL
rewrite: quita "/api"
```

`src/services/loginThunk.ts` usa `apiClient` con:

```ts
baseURL: "/api"
withCredentials: true
```

Esto permite llamar `/api/authentication/login` desde frontend y proxyar a backend como `/authentication/login`.

Nota: `src/config/env.ts` lee `VITE_API_BASE_URL`, pero hoy no se usa en `apiClient`; el proxy de Vite si usa esa variable.

## Estructura relevante

- `src/main.tsx`: entrada React.
- `src/App.tsx`: layout principal con Navbar y outlet.
- `src/routes/Routes.tsx`: definicion de rutas.
- `src/routes/ProtectedRoute.tsx`: guard de rutas autenticadas.
- `src/contexts/AuthContext.tsx`: estado de usuario, login, logout, register.
- `src/contexts/auth-context.ts`: context/hook expuesto.
- `src/services/loginThunk.ts`: cliente Axios, auth API, refresh retry.
- `src/types/*.types.ts`: schemas Yup y tipos.
- `src/pages/*`: pantallas.
- `src/components/ui/*`: componentes reutilizables de UI.

## Rutas actuales

- `/`: `HomePage`, landing basica.
- `/login`: login.
- `/register`: registro.
- `/confirm-email`: confirma email con `email` y `token` por query string.
- `/contact`: contacto.
- `/settings`: settings. Aparece dos veces en routing: publica y protegida. Revisar.
- `/new-comment`: formulario inicial de comentario/donacion.
- `/explore`: placeholder.
- `/be-creator`: protegida, flujo inicial para aceptar terminos y llamar endpoint pendiente.

## Auth frontend

Flujo actual:

1. `login(data)` llama `POST /authentication/login`.
2. Luego llama `GET /authentication/me`.
3. Guarda usuario en `localStorage`.
4. Backend autentica por cookie `__Host-app_session`; Axios manda cookies con `withCredentials`.
5. Interceptor intenta `POST /authentication/refresh` ante 401, salvo endpoints excluidos.
6. Si refresh falla, borra usuario y dispara evento `auth:session-expired`.

Deuda:

- Tipo `User` frontend incluye `id`, pero backend `me` hoy devuelve solo `name` y `email`; contrato no esta alineado.
- No existe `isCreator` en usuario frontend/backend aunque specs lo requieren.
- `LoginResponse` parece viejo/no usado por flujo actual.

## UI y formularios existentes

### Login/Register

Usan Formik + Yup, validan email/password y datos de usuario.
Registro llama `POST /authentication/register` y backend envia email de confirmacion.

### ConfirmEmailPage

Lee `email` y `token` desde URL.
Llama `POST /authentication/confirm-email`.
Muestra estados `idle`, `loading`, `success`, `error`.

### CommentsPage

Ruta `/new-comment`.
Formulario con:

- creatorId
- comment max 300
- price

Hoy usa lista hardcodeada de creadores desde imagenes publicas.
`onSubmit` solo hace `console.info`; no llama backend todavia.
Validacion permite precio `0` porque usa `.min(0)`. Specs de donacion piden monto mayor a 0.

### BeCreatorPage

Ruta protegida `/be-creator`.
Pide aceptar terminos y llama `useBeACreator().markAsCreator()`.
El hook llama `POST /be-a-creator`, pero backend no tiene ese endpoint.

### SettingsPage

Pantalla base. Falta:

- modo creador
- conexion Mercado Pago
- edicion de perfil/configuracion real

### ExplorePage

Placeholder.

## Convenciones de desarrollo

- Preferir componentes existentes en `src/components/ui`.
- Formularios: Formik + Yup.
- Validaciones cerca de tipos/schemas existentes o archivo dedicado si crece.
- Rutas protegidas via `ProtectedRoute`.
- Servicios HTTP centralizados en `src/services`.
- Mantener `withCredentials` para cookies backend.
- Evitar estado global extra salvo necesidad clara.

## Riesgos conocidos

- Textos con encoding roto en varios archivos (`sesiÃ³n`, `ConfiguraciÃ³n`, etc.).
- `/settings` esta registrada publica y protegida.
- `HomePage` usa rutas que no existen: `/comentarios`, `/about`.
- `env.ts` exige `VITE_API_BASE_URL`, pero importar ese archivo sin env rompe build/runtime.
- No hay tests frontend configurados.
