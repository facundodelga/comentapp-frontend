import { ToastContext } from "@/contexts/ToastContext"
import { useContext } from "react"

export const useToast = () => {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useToast debe usarse dentro de ToastProvider")
  }

  return context
}