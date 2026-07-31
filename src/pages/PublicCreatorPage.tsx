import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useFormik } from "formik"
import * as Yup from "yup"
import { DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { useAuthContext } from "@/contexts/auth-context"
import { useToast } from "@/hooks/useToast"
import { formatError } from "@/lib/utils"
import {
    getCreatorPublicPage,
    type PublicCreatorPage as PublicPage,
} from "@/services/creatorService"
import { createDonationByName } from "@/services/donationService"

const COMMENT_MAX_LENGTH = 200
const URL_REGEX = /https?:\/\/|www\./i

interface DonationFormValues {
    amount: number | ""
    comment: string
}

const socialLinks = (page: PublicPage) =>
    [
        { label: "Instagram", url: page.instagramLink, icon: null },
        { label: "YouTube", url: page.youTubeLink, icon: null },
        { label: "TikTok", url: page.tikTokLink, icon: null },
        { label: "Twitch", url: page.twitchLink, icon: null },
        { label: "Kick", url: page.kickLink, icon: null },
    ].filter((l) => Boolean(l.url))

const PublicCreatorPage = () => {
    const { username = "" } = useParams()
    const { user } = useAuthContext()
    const { toast } = useToast()
    const navigate = useNavigate()

    const [page, setPage] = useState<PublicPage | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        let active = true

        const load = async () => {
            setIsLoading(true)
            setNotFound(false)
            try {
                const data = await getCreatorPublicPage(username)
                if (active) setPage(data)
            } catch {
                if (active) setNotFound(true)
            } finally {
                if (active) setIsLoading(false)
            }
        }

        load()
        return () => {
            active = false
        }
    }, [username])

    const validationSchema = useMemo(() => {
        const min = page?.minimumAmount ?? 0
        return Yup.object({
            amount: Yup.number()
                .transform((v, o) => (o === "" ? undefined : v))
                .typeError("Ingresa un monto válido.")
                .required("El monto es obligatorio.")
                .moreThan(0, "El monto debe ser mayor a 0.")
                .min(min, `El mínimo es ${min}.`),
            comment: Yup.string()
                .trim()
                .max(COMMENT_MAX_LENGTH, `Máximo ${COMMENT_MAX_LENGTH} caracteres.`)
                .test(
                    "no-links",
                    "Este creador no permite links en el mensaje.",
                    (value) => page?.allowLinks || !URL_REGEX.test(value ?? ""),
                )
                .defined(),
        }) as Yup.ObjectSchema<DonationFormValues>
    }, [page])

    const formik = useFormik<DonationFormValues>({
        initialValues: { amount: "", comment: "" },
        validationSchema,
        onSubmit: async (values) => {
            if (!user) {
                navigate("/login")
                return
            }
            try {
                const { checkoutUrl } = await createDonationByName({
                    creatorName: username,
                    comment: values.comment.trim(),
                    amount: Number(values.amount),
                })
                window.location.href = checkoutUrl
            } catch (error) {
                toast.error(formatError(error))
            }
        },
    })

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Spinner />
            </div>
        )
    }

    if (notFound || !page) {
        return (
            <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
                <h1 className="text-2xl font-bold">Creador no encontrado</h1>
                <p className="mt-2 text-muted-foreground">
                    No existe una página para “{username}”.
                </p>
                <Button asChild className="mt-6">
                    <Link to="/explore">Explorar creadores</Link>
                </Button>
            </main>
        )
    }

    const links = socialLinks(page)

    return (
        <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6">
            {page.coverPhotoUrl && (
                <img
                    src={page.coverPhotoUrl}
                    alt={`Portada de ${page.creatorName}`}
                    className="mb-6 aspect-[3/1] w-full rounded-2xl border object-cover"
                />
            )}

            <h1 className="text-3xl font-bold tracking-tight">{page.creatorName}</h1>
            {page.description && (
                <p className="mt-2 whitespace-pre-line text-muted-foreground">
                    {page.description}
                </p>
            )}

            {links.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {links.map(({ label, url, icon: Icon }) => (
                        <a
                            key={label}
                            href={url ?? "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors hover:bg-accent"
                        >
                            {Icon && <Icon className="size-4" />}
                            {label}
                        </a>
                    ))}
                </div>
            )}

            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Enviar una donación</CardTitle>
                </CardHeader>
                <CardContent>
                    {!page.canReceiveDonations ? (
                        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                            Este creador todavía no puede recibir donaciones.
                        </p>
                    ) : (
                        <form onSubmit={formik.handleSubmit} noValidate>
                            <FieldGroup>
                                {page.presetAmounts.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {page.presetAmounts.map((amount) => (
                                            <Button
                                                key={amount}
                                                type="button"
                                                variant={
                                                    formik.values.amount === amount
                                                        ? "default"
                                                        : "outline"
                                                }
                                                onClick={() => formik.setFieldValue("amount", amount)}
                                            >
                                                {amount.toLocaleString("es-AR")}
                                            </Button>
                                        ))}
                                    </div>
                                )}

                                <Field data-invalid={Boolean(formik.touched.amount && formik.errors.amount)}>
                                    <FieldLabel htmlFor="amount">Monto</FieldLabel>
                                    <div className="relative">
                                        <DollarSign className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            id="amount"
                                            name="amount"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            className="pl-9"
                                            placeholder="0,00"
                                            value={formik.values.amount}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                    </div>
                                    <FieldError>
                                        {formik.touched.amount && formik.errors.amount}
                                    </FieldError>
                                </Field>

                                <Field data-invalid={Boolean(formik.touched.comment && formik.errors.comment)}>
                                    <div className="flex items-center justify-between gap-4">
                                        <FieldLabel htmlFor="comment">Mensaje</FieldLabel>
                                        <span className="text-xs tabular-nums text-muted-foreground">
                                            {formik.values.comment.length}/{COMMENT_MAX_LENGTH}
                                        </span>
                                    </div>
                                    <Textarea
                                        id="comment"
                                        name="comment"
                                        rows={4}
                                        maxLength={COMMENT_MAX_LENGTH}
                                        className="min-h-24 resize-y"
                                        placeholder="Dejá tu mensaje..."
                                        value={formik.values.comment}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    <FieldError>
                                        {formik.touched.comment && formik.errors.comment}
                                    </FieldError>
                                </Field>

                                <Button type="submit" disabled={formik.isSubmitting}>
                                    {formik.isSubmitting
                                        ? "Redirigiendo..."
                                        : user
                                          ? "Donar"
                                          : "Iniciá sesión para donar"}
                                </Button>
                            </FieldGroup>
                        </form>
                    )}
                </CardContent>
            </Card>
        </main>
    )
}

export default PublicCreatorPage
