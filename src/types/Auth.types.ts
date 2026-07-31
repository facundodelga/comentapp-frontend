import type { LoginFormValues, User } from "./Login.types";
import type { RegisterFormValues } from "./Register.types";


export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginFormValues) => Promise<void>;
    loginGoogle: () => void;
    register: (
            data: RegisterFormValues
    ) => Promise<void>;
    logout: () => Promise<void>;
    /** Re-hidrata el usuario desde GET /me (p. ej. tras activar creador o conectar MP). */
    refreshUser: () => Promise<User | null>;
    /** Setea el usuario local (p. ej. tras editar la cuenta). Persiste en localStorage. */
    updateUser: (user: User) => void;
}
