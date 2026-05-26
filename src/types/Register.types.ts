import * as Yup from "yup";

export interface RegisterRequest {
    firstName: string;
    surname: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const emailRegex = /^(?!\.)[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).{8,100}$/;

export const registerSchema = Yup.object({
    firstName: Yup.string()
        .trim()
        .required("El nombre es obligatorio.")
        .max(50, "El nombre es demasiado largo."),

    surname: Yup.string()
        .trim()
        .required("El apellido es obligatorio.")
        .max(50, "El apellido es demasiado largo."),

    email: Yup.string()
        .trim()
        .required("El email es obligatorio.")
        .max(100, "El email es demasiado largo.")
        .matches(emailRegex, "Ingresa un email valido."),

    password: Yup.string()
        .required("La contrasena es obligatoria.")
        .min(8, "La contrasena debe tener al menos 8 caracteres.")
        .max(100, "La contrasena debe tener como maximo 100 caracteres.")
        .matches(
            passwordRegex,
            "La contrasena debe incluir mayuscula, minuscula, numero y simbolo.",
        ),

    confirmPassword: Yup.string()
        .required("Confirma tu contrasena.")
        .oneOf([Yup.ref("password")], "Las contrasenas no coinciden."),
});

export type RegisterFormValues = Yup.InferType<typeof registerSchema>;

export function toRegisterRequest(data: RegisterFormValues): RegisterRequest {
    return {
        
        firstName: data.firstName,
        surname: data.surname,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
    };
}
