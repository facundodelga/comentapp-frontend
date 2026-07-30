import { useEffect, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
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
import { Spinner } from "@/components/ui/spinner"
import { formatError } from "@/lib/utils"
import { useToast } from "@/hooks/useToast"
import {
    getMyCreator,
    updateMyCreator,
    type Creator,
} from "@/services/creatorService"

const DESCRIPTION_MAX_LENGTH = 1000
const LINK_MAX_LENGTH = 300

interface PageFormValues {
    description: string
    instagramLink: string
    tikTokLink: string
    youTubeLink: string
    twitchLink: string
    kickLink: string
}

const linkSchema = Yup.string()
    .trim()
    .url("Ingresa una URL válida (con https://).")
    .max(LINK_MAX_LENGTH, `Máximo ${LINK_MAX_LENGTH} caracteres.`)

const pageSchema: Yup.ObjectSchema<PageFormValues> = Yup.object({
    description: Yup.string()
        .trim()
        .max(
            DESCRIPTION_MAX_LENGTH,
            `La descripción no puede superar los ${DESCRIPTION_MAX_LENGTH} caracteres.`,
        )
        .defined(),
    instagramLink: linkSchema.defined(),
    tikTokLink: linkSchema.defined(),
    youTubeLink: linkSchema.defined(),
    twitchLink: linkSchema.defined(),
    kickLink: linkSchema.defined(),
})

const toFormValues = (creator: Creator): PageFormValues => ({
    description: creator.description ?? "",
    instagramLink: creator.instagramLink ?? "",
    tikTokLink: creator.tikTokLink ?? "",
    youTubeLink: creator.youTubeLink ?? "",
    twitchLink: creator.twitchLink ?? "",
    kickLink: creator.kickLink ?? "",
})

const linkFields: { name: keyof PageFormValues; label: string; placeholder: string }[] = [
    { name: "instagramLink", label: "Instagram", placeholder: "https://instagram.com/tu-usuario" },
    { name: "tikTokLink", label: "TikTok", placeholder: "https://tiktok.com/@tu-usuario" },
    { name: "youTubeLink", label: "YouTube", placeholder: "https://youtube.com/@tu-canal" },
    { name: "twitchLink", label: "Twitch", placeholder: "https://twitch.tv/tu-canal" },
    { name: "kickLink", label: "Kick", placeholder: "https://kick.com/tu-canal" },
]

const emptyValues: PageFormValues = {
    description: "",
    instagramLink: "",
    tikTokLink: "",
    youTubeLink: "",
    twitchLink: "",
    kickLink: "",
}

const CreatorPageSettings = () => {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [creatorName, setCreatorName] = useState("")

    const formik = useFormik<PageFormValues>({
        initialValues: emptyValues,
        validationSchema: pageSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                // "" borra el campo en backend; se manda todo el form tal cual.
                const updated = await updateMyCreator({
                    description: values.description.trim(),
                    instagramLink: values.instagramLink.trim(),
                    tikTokLink: values.tikTokLink.trim(),
                    youTubeLink: values.youTubeLink.trim(),
                    twitchLink: values.twitchLink.trim(),
                    kickLink: values.kickLink.trim(),
                })
                formik.resetForm({ values: toFormValues(updated) })
                toast.success("Configuración guardada")
            } catch (error) {
                toast.error(formatError(error))
            }
        },
    })

    const { resetForm } = formik

    useEffect(() => {
        let active = true

        const loadCreator = async () => {
            try {
                const creator = await getMyCreator()
                if (!active) return
                setCreatorName(creator.creatorName)
                resetForm({ values: toFormValues(creator) })
            } catch {
                // Sin datos previos: quedan los valores vacíos.
            } finally {
                if (active) setIsLoading(false)
            }
        }

        loadCreator()
        return () => {
            active = false
        }
    }, [resetForm])

    if (isLoading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <Spinner />
            </div>
        )
    }

    const err = (name: keyof PageFormValues) =>
        Boolean(formik.touched[name] && formik.errors[name])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Mi página
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {creatorName
                        ? `Configuración pública de ${creatorName}.`
                        : "Configuración pública de tu página de donaciones."}
                </p>
            </div>

            <form onSubmit={formik.handleSubmit} noValidate className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Descripción</CardTitle>
                        <CardDescription>
                            Mensaje que verán los donantes en tu página.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Field data-invalid={err("description")}>
                            <div className="flex items-center justify-between gap-4">
                                <FieldLabel htmlFor="description">Descripción</FieldLabel>
                                <span className="text-xs tabular-nums text-muted-foreground">
                                    {formik.values.description.length}/{DESCRIPTION_MAX_LENGTH}
                                </span>
                            </div>
                            <Textarea
                                id="description"
                                name="description"
                                rows={5}
                                maxLength={DESCRIPTION_MAX_LENGTH}
                                className="min-h-32 resize-y"
                                placeholder="Contales a tus seguidores por qué apoyarte..."
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                aria-invalid={err("description")}
                            />
                            <FieldError>
                                {formik.touched.description && formik.errors.description}
                            </FieldError>
                        </Field>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Links de redes sociales</CardTitle>
                        <CardDescription>
                            Dejá vacío un campo para quitar ese link.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            {linkFields.map(({ name, label, placeholder }) => (
                                <Field key={name} data-invalid={err(name)}>
                                    <FieldLabel htmlFor={name}>{label}</FieldLabel>
                                    <Input
                                        id={name}
                                        name={name}
                                        type="url"
                                        placeholder={placeholder}
                                        value={formik.values[name]}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        aria-invalid={err(name)}
                                    />
                                    <FieldError>
                                        {formik.touched[name] && formik.errors[name]}
                                    </FieldError>
                                </Field>
                            ))}
                            <FieldDescription>
                                Tus links se muestran en tu página pública de donaciones.
                            </FieldDescription>
                        </FieldGroup>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => formik.resetForm()}
                        disabled={formik.isSubmitting || !formik.dirty}
                    >
                        Descartar
                    </Button>
                    <Button type="submit" disabled={formik.isSubmitting || !formik.dirty}>
                        {formik.isSubmitting ? "Guardando..." : "Guardar cambios"}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default CreatorPageSettings
