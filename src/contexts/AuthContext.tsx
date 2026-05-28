import { createContext, useState,useEffect, type ReactNode } from "react"
import { redirect } from "react-router-dom"
import { loginService, registerService } from "@/services//loginThunk"
import { useToast } from "../hooks/useToast"
import type { LoginFormValues, User } from "@/types/Login.types"
import { toRegisterRequest, type RegisterFormValues } from "@/types/Register.types"
import type { AuthContextType } from "@/types/Auth.types"

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface Props {
    children: ReactNode
}

export const AuthProvider = ({ children }: Props) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const { toast } = useToast();
    useEffect(() => {
        const storedToken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")

        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))
        }
    }, [])

    const login = async (data: LoginFormValues) => {

        await loginService(data).then((response) => {
            toast.success("Inicio de sesión exitoso " + {response});
            localStorage.setItem("token", response.token)
            localStorage.setItem("user", JSON.stringify(response.user))
        }).catch((error) => {
            toast.error("No se pudo iniciar sesión");
            console.error("No se pudo iniciar sesión:", error);
        });

        
    }

    const logout = () => {
        setUser(null)
        setToken(null)

        localStorage.removeItem("token")
        localStorage.removeItem("user")
        throw redirect("/");
    }

    const register = async (data: RegisterFormValues) => {
        // aquí iría la llamada real al backend
        // const response = await api.post("/register", { name, surname, email, password })
        await registerService(toRegisterRequest(data)).then(() => {
            toast.success("Registro exitoso");
        }).catch((error) => {
            toast.error("No se pudo completar el registro " + error.message);
        });

    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user,
                login,
                logout,
                register
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
