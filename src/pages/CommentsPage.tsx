import { useEffect } from "react"
import { DollarSign, MessageSquareText } from "lucide-react"
import { useFormik } from "formik"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuthContext } from "@/contexts/auth-context"
import {
    Combobox,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxInput,
    ComboboxList,
    ComboboxProfileItem,
} from "@/components/ui/combobox"
import {
    COMMENT_MAX_LENGTH,
    commentSchema,
    toCreateCommentRequest,
    type CommentFormValues,
} from "@/types/Comment.types"

interface CreatorOption {
    id: string
    name: string
    username: string
    imageSrc: string
}

const creators: CreatorOption[] = [
    {
        id: "elrubius",
        name: "El Rubius",
        username: "@elrubius",
        imageSrc: "/elrubius.jpg",
    },
    {
        id: "palandri",
        name: "Palandri",
        username: "@palandri",
        imageSrc: "/palandri.jpg",
    },
    {
        id: "kobrakai",
        name: "Kobra Kai",
        username: "@kobrakai",
        imageSrc: "/kobrakai.jpg",
    },
]

const initialValues: CommentFormValues = {
    creatorId: "",
    comment: "",
    price: "",
}

const CommentsPage = () => {
    const { user } = useAuthContext()
    const navigate = useNavigate()

    const formik = useFormik<CommentFormValues>({
        initialValues,
        validationSchema: commentSchema,
        onSubmit: async (values) => {
            const newComment = toCreateCommentRequest(values)

            // El request al endpoint de comentarios se conectará aquí.
            console.info("Nuevo comentario:", newComment)
        },
    })

    useEffect(() => {
        if (!user) {
            navigate("/login", { replace: true })
        }
    }, [navigate, user])

    if (!user) return null

    const commentHasError = Boolean(
        formik.touched.comment && formik.errors.comment,
    )
    const priceHasError = Boolean(formik.touched.price && formik.errors.price)
    const creatorHasError = Boolean(
        formik.touched.creatorId && formik.errors.creatorId,
    )
    const selectedCreator =
        creators.find((creator) => creator.id === formik.values.creatorId) ?? null

    return (
        <main className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-3xl px-4 py-10 sm:px-6">
            <div className="mb-8">
                <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MessageSquareText className="size-6" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Nuevo comentario
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Comparte tu experiencia y agrega el precio de referencia.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Crear comentario</CardTitle>
                    <CardDescription>
                        Completa los campos para publicar tu opinión.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={formik.handleSubmit} noValidate>
                        <FieldGroup>
                            <Field data-invalid={creatorHasError}>
                                <FieldLabel htmlFor="creator">
                                    Enviar comentario a
                                </FieldLabel>
                                <Combobox
                                    items={creators}
                                    value={selectedCreator}
                                    itemToStringLabel={(creator) => creator.name}
                                    itemToStringValue={(creator) => creator.id}
                                    isItemEqualToValue={(item, value) => item.id === value.id}
                                    onValueChange={(creator) => {
                                        void formik.setFieldValue(
                                            "creatorId",
                                            creator?.id ?? "",
                                        )
                                        void formik.setFieldTouched("creatorId", true, false)
                                    }}
                                >
                                    <ComboboxInput
                                        id="creator"
                                        placeholder="Buscar creador"
                                        showClear
                                        aria-invalid={creatorHasError}
                                        className="w-full"
                                    />
                                    <ComboboxContent>
                                        <ComboboxEmpty>
                                            No se encontraron creadores.
                                        </ComboboxEmpty>
                                        <ComboboxList>
                                            {(creator: CreatorOption) => (
                                                <ComboboxProfileItem
                                                    key={creator.id}
                                                    value={creator}
                                                    imageSrc={creator.imageSrc}
                                                    name={creator.name}
                                                    description={creator.username}
                                                />
                                            )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                                <FieldDescription>
                                    Selecciona el perfil que recibirá tu comentario.
                                </FieldDescription>
                                <FieldError>
                                    {formik.touched.creatorId && formik.errors.creatorId}
                                </FieldError>
                            </Field>

                            <Field data-invalid={commentHasError}>
                                <div className="flex items-center justify-between gap-4">
                                    <FieldLabel htmlFor="comment">
                                        Comentario
                                    </FieldLabel>
                                    <span className="text-xs tabular-nums text-muted-foreground">
                                        {formik.values.comment.length}/{COMMENT_MAX_LENGTH}
                                    </span>
                                </div>
                                <Textarea
                                    id="comment"
                                    name="comment"
                                    placeholder="Cuéntanos qué te pareció..."
                                    rows={6}
                                    maxLength={COMMENT_MAX_LENGTH}
                                    className="min-h-36 resize-y"
                                    value={formik.values.comment}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    aria-invalid={commentHasError}
                                />
                                <FieldError>
                                    {formik.touched.comment && formik.errors.comment}
                                </FieldError>
                            </Field>

                            <Field data-invalid={priceHasError}>
                                <FieldLabel htmlFor="price">
                                    Precio de referencia
                                </FieldLabel>
                                <div className="relative">
                                    <DollarSign className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        inputMode="decimal"
                                        min="0"
                                        step="0.01"
                                        placeholder="0,00"
                                        className="pl-9"
                                        value={formik.values.price}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        aria-invalid={priceHasError}
                                    />
                                </div>
                                <FieldDescription>
                                    Ingresa el importe pagado, sin símbolos monetarios.
                                </FieldDescription>
                                <FieldError>
                                    {formik.touched.price && formik.errors.price}
                                </FieldError>
                            </Field>

                            <Field orientation="horizontal" className="justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => formik.resetForm()}
                                    disabled={formik.isSubmitting || !formik.dirty}
                                >
                                    Limpiar
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={formik.isSubmitting || !formik.dirty}
                                >
                                    {formik.isSubmitting
                                        ? "Publicando..."
                                        : "Publicar comentario"}
                                </Button>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </main>
    )
}

export default CommentsPage
