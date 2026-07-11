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
}
