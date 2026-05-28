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
        .required("El correo electrónico es obligatorio.")
        .max(100, "El correo electrónico es demasiado largo.")
        .matches(emailRegex, "Ingresa un correo electrónico válido."),

    password: Yup.string()
        .required("La contraseña es obligatoria.")
        .min(8, "La contraseña debe tener al menos 8 caracteres.")
        .max(100, "La contraseña debe tener como máximo 100 caracteres.")
        .matches(
            passwordRegex,
            "La contraseña debe incluir mayúscula, minúscula, número y símbolo.",
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
