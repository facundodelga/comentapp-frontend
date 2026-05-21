import * as Yup from "yup";

export interface User {
    id: string;
    email: string;
    name: string;
}

export const emailRegex = /^(?!\.)[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).{8,100}$/;

export const loginSchema = Yup.object({
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
});

export type LoginFormValues = Yup.InferType<typeof loginSchema>;

export interface LoginResponse {
    token: string;
    user: {
        id: number;
        firstName: string;
        lastName: string;
        dni: string;
        dateOfRegistration: string;
        _links: {
            additionalProp1: {
                href: string;
                hreflang: string;
                title: string;
                type: string;
                deprecation: string;
                profile: string;
                name: string;
                templated: boolean;
            };
            additionalProp2: {
                href: string;
                hreflang: string;
                title: string;
                type: string;
                deprecation: string;
                profile: string;
                name: string;
                templated: boolean;
            };
            additionalProp3: {
                href: string;
                hreflang: string;
                title: string;
                type: string;
                deprecation: string;
                profile: string;
                name: string;
                templated: boolean;
            };
        };
    };
    roles: string[];
}
