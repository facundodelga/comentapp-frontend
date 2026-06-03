import * as Yup from "yup";

export interface RegisterRequest {
    name: string;
    surname: string;
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const emailRegex = /^(?!\.)[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).{8,100}$/;

export const registerSchema = Yup.object({
    name: Yup.string()
        .trim()
        .required("El nombre es obligatorio.")
        .max(50, "El nombre es demasiado largo."),

    surname: Yup.string()
        .trim()
        .required("El apellido es obligatorio.")
        .max(50, "El apellido es demasiado largo."),

    username: Yup.string()
        .trim()
        .required("El nombre de usuario es obligatorio.")
        .max(50, "El nombre de usuario es demasiado largo."),

    email: Yup.string()
        .trim()
        .required("El correo electrónico es obligatorio.")
        .max(100, "El correo electrónico es demasiado largo.")
        .matches(emailRegex, "Ingresa un correo electrónico válido."),

    password: Yup.string()
        .required("La contraseña es obligatoria.")
        //.min(8, "La contraseña debe tener al menos 8 caracteres.")
        .max(100, "La contraseña debe tener como máximo 100 caracteres.")
        /*
        .matches(
            passwordRegex,
            "La contraseña debe incluir mayúscula, minúscula, número y símbolo.",
        ) */,
       

    confirmPassword: Yup.string()
        .required("Confirma tu contraseña.")
        .oneOf([Yup.ref("password")], "Las contraseñas no coinciden."),
});

export type RegisterFormValues = Yup.InferType<typeof registerSchema>;

export function toRegisterRequest(data: RegisterFormValues): RegisterRequest {
    return {
        userName: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
    };
}
