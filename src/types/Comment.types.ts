import * as Yup from "yup"

export const COMMENT_MAX_LENGTH = 300

export interface CommentFormValues {
    creatorId: string
    comment: string
    amount: number | ""
}

export const commentSchema: Yup.ObjectSchema<CommentFormValues> = Yup.object({
    creatorId: Yup.string()
        .required("Selecciona el creador al que quieres enviar el comentario."),
    comment: Yup.string()
        .trim()
        .required("El comentario es obligatorio.")
        .max(
            COMMENT_MAX_LENGTH,
            `El comentario no puede superar los ${COMMENT_MAX_LENGTH} caracteres.`,
        ),
    amount: Yup.number()
        .transform((value, originalValue) => originalValue === "" ? undefined : value)
        .typeError("Ingresa un monto válido.")
        .required("El monto es obligatorio.")
        .moreThan(0, "El monto debe ser mayor a 0."),
})
