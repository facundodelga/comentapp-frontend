import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './contexts/theme-provider.tsx'
import { ToastProvider } from './contexts/ToastContext.tsx'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes/Routes.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <RouterProvider router={router} />

      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)
