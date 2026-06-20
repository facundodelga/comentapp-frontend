import * as Yup from "yup"

export const COMMENT_MAX_LENGTH = 400

export interface CommentFormValues {
    creatorId: string
    comment: string
    price: number | ""
}

export interface CreateCommentRequest {
    creatorId: string
    comment: string
    price: number
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
    price: Yup.number()
        .transform((value, originalValue) => originalValue === "" ? undefined : value)
        .typeError("Ingresa un precio válido.")
        .required("El precio es obligatorio.")
        .min(0, "El precio no puede ser negativo."),
})

export const toCreateCommentRequest = (
    values: CommentFormValues,
): CreateCommentRequest => ({
    creatorId: values.creatorId,
    comment: values.comment.trim(),
    price: Number(values.price),
})
