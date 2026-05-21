function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, "")
}

/**
 * URL base del backend (sin barra final).
 * Definida en `.env.development` o `.env.production` como `VITE_API_BASE_URL`.
 */
function readApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_BASE_URL
  if (typeof raw !== "string" || raw.trim() === "") {
    throw new Error(
      "Falta VITE_API_BASE_URL. Copia .env.example, renómbralo o ajusta .env.development / .env.production.",
    )
  }
  return normalizeBaseUrl(raw)
}

export const apiBaseUrl = readApiBaseUrl()
