import { useEffect, useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"
import {
    AUTH_SESSION_EXPIRED_EVENT,
    loginService,
    logoutService,
    me,
    registerService,
} from "@/services/loginThunk"
import { useToast } from "@/hooks/useToast"
import type { LoginFormValues, User } from "@/types/Login.types"
import { toRegisterRequest, type RegisterFormValues } from "@/types/Register.types"
import { formatError } from "@/lib/utils"
import { AuthContext } from "@/contexts/auth-context"

interface Props {
    children: ReactNode
}

const getStoredUser = (): User | null => {
    const storedUser = localStorage.getItem("user")

    if (!storedUser) return null

    try {
        return JSON.parse(storedUser)
    } catch {
        localStorage.removeItem("user")
        return null
    }
}

export const AuthProvider = ({ children }: Props) => {
    const [user, setUser] = useState<User | null>(getStoredUser)
    const { toast } = useToast()
    const navigate = useNavigate()

    useEffect(() => {
        const handleExpiredSession = () => {
            setUser(null)
            toast.error("Tu sesión expiró. Inicia sesión nuevamente.")
            navigate("/login", { replace: true })
        }

        window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleExpiredSession)
        return () => window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleExpiredSession)
    }, [navigate, toast])

    const login = async (data: LoginFormValues) => {
        try {
            await loginService(data)
            const userData = await me()

            setUser(userData)
            localStorage.setItem("user", JSON.stringify(userData))
            toast.success("Inicio de sesión exitoso")
        } catch (error) {
            toast.error("No se pudo iniciar sesión")
            throw error
        }
    }

    const logout = async () => {
        try {
            await logoutService()
        } finally {
            setUser(null)
            localStorage.removeItem("user")
            navigate("/login", { replace: true })
        }
    }

    const register = async (data: RegisterFormValues) => {
        try {
            await registerService(toRegisterRequest(data))
            toast.success("Registro exitoso")
        } catch (error) {
            toast.error(formatError(error))
            throw error
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                logout,
                register,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
