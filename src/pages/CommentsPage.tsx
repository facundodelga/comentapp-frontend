import { useEffect, useState } from "react"
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
import { useToast } from "@/hooks/useToast"
import { formatError } from "@/lib/utils"
import { searchCreators, type PublicCreator } from "@/services/creatorService"
import { createDonation } from "@/services/donationService"
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
    type CommentFormValues,
} from "@/types/Comment.types"

const initialValues: CommentFormValues = {
    creatorId: "",
    comment: "",
    amount: "",
}

const CommentsPage = () => {
    const { user } = useAuthContext()
    const navigate = useNavigate()
    const { toast } = useToast()
    const [creators, setCreators] = useState<PublicCreator[]>([])

    const formik = useFormik<CommentFormValues>({
        initialValues,
        validationSchema: commentSchema,
        onSubmit: async (values) => {
            try {
                const { checkoutUrl } = await createDonation({
                    creatorId: Number(values.creatorId),
                    comment: values.comment.trim(),
                    amount: Number(values.amount),
                })
                // Redirige al checkout de Mercado Pago; al volver cae en /donation/result.
                window.location.href = checkoutUrl
            } catch (error) {
                toast.error(formatError(error))
            }
        },
    })

    useEffect(() => {
        if (!user) {
            navigate("/login", { replace: true })
        }
    }, [navigate, user])

    useEffect(() => {
        let active = true

        const loadCreators = async () => {
            try {
                const data = await searchCreators()
                // Solo creadores que pueden recibir pagos (MP conectado).
                if (active) setCreators(data.filter((c) => c.mercadoPagoConnected))
            } catch (error) {
                if (active) toast.error(formatError(error))
            }
        }

        loadCreators()
        return () => {
            active = false
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (!user) return null

    const commentHasError = Boolean(
        formik.touched.comment && formik.errors.comment,
    )
    const amountHasError = Boolean(formik.touched.amount && formik.errors.amount)
    const creatorHasError = Boolean(
        formik.touched.creatorId && formik.errors.creatorId,
    )
    const selectedCreator =
        creators.find((creator) => String(creator.id) === formik.values.creatorId) ??
        null

    return (
        <main className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-3xl px-4 py-10 sm:px-6">
            <div className="mb-8">
                <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <MessageSquareText className="size-6" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">
                    Enviar donación
                </h1>
                <p className="mt-2 text-muted-foreground">
                    Elegí un creador, escribí tu comentario y definí el monto a donar.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Donación con comentario</CardTitle>
                    <CardDescription>
                        Al confirmar serás redirigido al checkout de Mercado Pago.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={formik.handleSubmit} noValidate>
                        <FieldGroup>
                            <Field data-invalid={creatorHasError}>
                                <FieldLabel htmlFor="creator">
                                    Enviar donación a
                                </FieldLabel>
                                <Combobox
                                    items={creators}
                                    value={selectedCreator}
                                    itemToStringLabel={(creator) => creator.creatorName}
                                    itemToStringValue={(creator) => String(creator.id)}
                                    isItemEqualToValue={(item, value) => item.id === value.id}
                                    onValueChange={(creator) => {
                                        void formik.setFieldValue(
                                            "creatorId",
                                            creator ? String(creator.id) : "",
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
                                            {(creator: PublicCreator) => (
                                                <ComboboxProfileItem
                                                    key={creator.id}
                                                    value={creator}
                                                    imageSrc=""
                                                    name={creator.creatorName}
                                                    description={creator.description ?? ""}
                                                />
                                            )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                                <FieldDescription>
                                    Solo se listan creadores que pueden recibir pagos.
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
                                    placeholder="Escribí tu mensaje para el creador..."
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

                            <Field data-invalid={amountHasError}>
                                <FieldLabel htmlFor="amount">
                                    Monto a donar
                                </FieldLabel>
                                <div className="relative">
                                    <DollarSign className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="amount"
                                        name="amount"
                                        type="number"
                                        inputMode="decimal"
                                        min="0.01"
                                        step="0.01"
                                        placeholder="0,00"
                                        className="pl-9"
                                        value={formik.values.amount}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        aria-invalid={amountHasError}
                                    />
                                </div>
                                <FieldDescription>
                                    El monto lo definís vos; debe ser mayor a 0.
                                </FieldDescription>
                                <FieldError>
                                    {formik.touched.amount && formik.errors.amount}
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
                                        ? "Redirigiendo a Mercado Pago..."
                                        : "Donar y comentar"}
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
