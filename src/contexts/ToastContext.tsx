import { createContext, useMemo, type ReactNode } from "react"
import { toast as sonnerToast } from "sonner"

import { Toaster } from "@/components/ui/sonner"

export type ToastContextType = {
  toast: typeof sonnerToast
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
)

/** z-index muy alto para que Sonner quede por encima de modales, navbars y overlays */
const TOASTER_Z_INDEX = 2147483647

type ToastProviderProps = {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const value = useMemo(() => ({ toast: sonnerToast }), [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster style={{ zIndex: TOASTER_Z_INDEX }} />
    </ToastContext.Provider>
  )
}
