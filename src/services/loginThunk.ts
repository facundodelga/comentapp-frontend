import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios"
import type { LoginFormValues, LoginResponse, User } from "@/types/Login.types"
import type { RegisterRequest } from "@/types/Register.types"

export const AUTH_SESSION_EXPIRED_EVENT = "auth:session-expired"

export interface ConfirmEmailRequest {
    email: string
    token: string
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean
}

export const apiClient = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})

const refreshClient = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
})

const refreshExcludedEndpoints = [
    "/authentication/login",
    "/authentication/logout",
    "/authentication/refresh",
    "/authentication/register",
    "/authentication/confirm-email",
]

let refreshRequest: Promise<void> | null = null

const expireSession = () => {
    localStorage.removeItem("user")
    window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT))
}

const refreshSession = async () => {
    await refreshClient.post("/authentication/refresh")
}

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as RetryableRequestConfig | undefined
        const requestUrl = originalRequest?.url ?? ""
        const shouldRefresh =
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !refreshExcludedEndpoints.some((endpoint) => requestUrl.includes(endpoint))

        if (!shouldRefresh) {
            return Promise.reject(error)
        }

        originalRequest._retry = true

        if (!refreshRequest) {
            refreshRequest = refreshSession().finally(() => {
                refreshRequest = null
            })
        }

        try {
            await refreshRequest
        } catch (refreshError) {
            expireSession()
            return Promise.reject(refreshError)
        }

        return apiClient(originalRequest)
    },
)

export async function loginService(data: LoginFormValues): Promise<LoginResponse> {
    const response = await apiClient.post("/authentication/login", data)
    return response.data
}

export async function registerService(data: RegisterRequest): Promise<void> {
    const response = await apiClient.post("/authentication/register", data)
    return response.data
}

export async function confirmEmailService(data: ConfirmEmailRequest): Promise<void> {
    const response = await apiClient.post("/authentication/confirm-email", data)
    return response.data
}

export async function logoutService(): Promise<void> {
    const response = await apiClient.post("/authentication/logout")
    return response.data
}

export async function refreshTokenService(): Promise<void> {
    const response = await refreshClient.post("/authentication/refresh")
    return response.data
}

export async function me(): Promise<User> {
    const response = await apiClient.get("/authentication/me")
    return response.data
}
