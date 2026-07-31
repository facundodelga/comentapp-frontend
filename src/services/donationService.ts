import { apiClient } from "@/services/loginThunk"

// Contratos del backend: POST /DonationComments y GET /Payments/{donationId}.

export interface CreateDonationRequest {
    creatorId: number
    comment: string
    amount: number
}

export interface CreateDonationResponse {
    donationId: number
    preferenceId: string
    checkoutUrl: string
}

export type DonationStatus =
    | "pending"
    | "approved"
    | "rejected"
    | "cancelled"
    | "refunded"

export interface PaymentStatusResponse {
    donationId: number
    status: DonationStatus
    commentVisible: boolean
}

/**
 * Crea la intención de donación con comentario; el backend genera la preference
 * de Mercado Pago y devuelve la URL de checkout a la que redirigir.
 */
export async function createDonation(
    data: CreateDonationRequest,
): Promise<CreateDonationResponse> {
    const response = await apiClient.post("/donationcomments", data)
    return response.data
}

// La página pública se identifica por creatorName (no expone el id).
// TODO: confirmar con backend si /donationcomments acepta creatorName.
export interface CreateDonationByNameRequest {
    creatorName: string
    comment: string
    amount: number
}

export async function createDonationByName(
    data: CreateDonationByNameRequest,
): Promise<CreateDonationResponse> {
    const response = await apiClient.post("/donationcomments", data)
    return response.data
}

/**
 * Estado real del pago verificado server-side (no confiar en los query params
 * de retorno del checkout).
 */
export async function getPaymentStatus(
    donationId: number,
): Promise<PaymentStatusResponse> {
    const response = await apiClient.get(`/payments/${donationId}`)
    return response.data
}
