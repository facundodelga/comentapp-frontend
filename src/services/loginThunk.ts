import axios from "axios"
import type { LoginFormValues, LoginResponse } from "@/types/Login.types"
import type { RegisterRequest } from "@/types/Register.types"

export async function loginService(data: LoginFormValues): Promise<LoginResponse> {
    const response = await authClient.post(`/authentication/login`, data)
    return response.data
}

export async function registerService(data: RegisterRequest): Promise<void> {
    try {
        const response = await authClient.post(`/authentication/register`, data)
        return response.data
    } catch (e) {
        throw e;
    }

}

export async function logoutService() {
    const response = await authClient.post(`/authentication/logout`)
    return response.data
}

const authClient = axios.create({
    baseURL: "/api",
    // baseURL: "/Authentication",
    headers: {
        "Content-Type": "application/json"
    }
});
