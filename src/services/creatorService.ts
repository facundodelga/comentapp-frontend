import { apiClient } from "@/services/loginThunk"

// Rutas alineadas con el backend (monolito):
//   POST /Creators, GET/PATCH /Creators/me, GET/DELETE /MercadoPago/*.

// Contrato de GET/PATCH /Creators/me y POST /Creators (CreatorResponse).
export interface Creator {
    id: number
    creatorName: string
    userId: number
    description?: string | null
    instagramLink?: string | null
    tikTokLink?: string | null
    youTubeLink?: string | null
    twitchLink?: string | null
    kickLink?: string | null
    mercadoPagoConnected: boolean
}

// Contrato de PATCH /Creators/me: null/omitido = no tocar; "" = borrar.
export interface UpdateCreatorRequest {
    description?: string
    instagramLink?: string
    tikTokLink?: string
    youTubeLink?: string
    twitchLink?: string
    kickLink?: string
}

// Vista owner de GET /Creators/me/page-config.
export interface CreatorPageConfig {
    creatorName: string
    description?: string | null
    coverPhotoUrl?: string | null
    minimumAmount?: number | null
    presetAmounts: number[]
    allowLinks: boolean
    instagramLink?: string | null
    tikTokLink?: string | null
    youTubeLink?: string | null
    twitchLink?: string | null
    kickLink?: string | null
    mercadoPagoConnected: boolean
}

// Contrato de PATCH /Creators/me/page-config (parcial: solo campos presentes cambian).
export interface UpdatePageConfigRequest {
    description?: string
    coverPhotoUrl?: string
    minimumAmount?: number | null
    presetAmounts?: number[]
    allowLinks?: boolean
    instagramLink?: string
    tikTokLink?: string
    youTubeLink?: string
    twitchLink?: string
    kickLink?: string
}

// Vista pública de GET /Creators/{creatorName}/page (AllowAnonymous).
export interface PublicCreatorPage {
    creatorName: string
    description?: string | null
    coverPhotoUrl?: string | null
    minimumAmount?: number | null
    presetAmounts: number[]
    allowLinks: boolean
    instagramLink?: string | null
    tikTokLink?: string | null
    youTubeLink?: string | null
    twitchLink?: string | null
    kickLink?: string | null
    canReceiveDonations: boolean
}

// Contrato de GET /Creators/me/comments y del evento SignalR "commentReceived".
export interface CreatorComment {
    id: number
    comment: string
    amount: number
    fromUserName: string
    createdAt: string
    paymentStatus: string
    isRead: boolean
}

// Feed de comentarios confirmados (pago aprobado) del creador autenticado.
export async function getMyConfirmedComments(): Promise<CreatorComment[]> {
    const response = await apiClient.get("/creators/me/comments")
    return response.data
}

// Contrato de GET /MercadoPago/status.
export interface MercadoPagoStatus {
    isCreator?: boolean
    connected: boolean
    accountId?: string
}

// Contrato de GET /Creators (búsqueda pública, solo campos públicos).
export interface PublicCreator {
    id: number
    creatorName: string
    description?: string | null
    mercadoPagoConnected: boolean
}

// Búsqueda pública de creadores (donation form / explore).
export async function searchCreators(query?: string): Promise<PublicCreator[]> {
    const response = await apiClient.get("/creators", {
        params: query ? { query } : undefined,
    })
    return response.data
}

// Paso 2: registra al usuario autenticado como creador (solo creatorName por ahora).
export async function registerCreator(creatorName: string): Promise<Creator> {
    const response = await apiClient.post("/creators", { creatorName })
    return response.data
}

export async function getMyCreator(): Promise<Creator> {
    const response = await apiClient.get("/creators/me")
    return response.data
}

// Paso 3 ("Mi página"): descripción + links sociales del creador.
export async function updateMyCreator(
    data: UpdateCreatorRequest,
): Promise<Creator> {
    const response = await apiClient.patch("/creators/me", data)
    return response.data
}

// "Mi página" (owner): configuración de la página de donaciones.
export async function getMyPageConfig(): Promise<CreatorPageConfig> {
    const response = await apiClient.get("/creators/me/page-config")
    return response.data
}

export async function updateMyPageConfig(
    data: UpdatePageConfigRequest,
): Promise<CreatorPageConfig> {
    const response = await apiClient.patch("/creators/me/page-config", data)
    return response.data
}

// Página pública de donaciones de un creador. 404 si no existe.
export async function getCreatorPublicPage(
    creatorName: string,
): Promise<PublicCreatorPage> {
    const response = await apiClient.get(
        `/creators/${encodeURIComponent(creatorName)}/page`,
    )
    return response.data
}

export async function getMercadoPagoStatus(): Promise<MercadoPagoStatus> {
    const response = await apiClient.get("/mercadopago/status")
    return response.data
}

// Devuelve la URL de autorización OAuth de Mercado Pago a la que redirigir.
export async function getMercadoPagoAuthUrl(): Promise<string> {
    const response = await apiClient.get("/mercadopago/connect")
    return response.data.authorizationUrl
}

export async function disconnectMercadoPago(): Promise<void> {
    await apiClient.delete("/mercadopago/connection")
}
