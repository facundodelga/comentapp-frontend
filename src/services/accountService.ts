import { apiClient } from "@/services/loginThunk"
import type { User } from "@/types/Login.types"

// TODO: confirmar ruta exacta con el backend (migration "AccountAndPageConfig").
// Imágenes por URL (sin upload). userName único: backend responde 409 si está tomado.

export interface UpdateAccountRequest {
    userName?: string
    avatarUrl?: string
}

export async function updateAccount(
    data: UpdateAccountRequest,
): Promise<User> {
    const response = await apiClient.patch("/users/me", data)
    return response.data
}
