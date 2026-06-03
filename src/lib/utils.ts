import type { AxiosError } from "axios";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatError(error : AxiosError): string {
  return (error.response?.data as any)?.message || error.message || "Error desconocido";
}
