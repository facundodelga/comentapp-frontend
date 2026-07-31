import { useEffect, useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { X } from "lucide-react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Spinner } from "@/components/ui/spinner"
import { formatError } from "@/lib/utils"
import { useToast } from "@/hooks/useToast"
import {
    getMyPageConfig,
    updateMyPageConfig,
    type CreatorPageConfig,
} from "@/services/creatorService"

const DESCRIPTION_MAX_LENGTH = 1000
const LINK_MAX_LENGTH = 300
const MAX_PRESETS = 6

interface PageFormValues {
    description: string
    coverPhotoUrl: string
    minimumAmount: number | ""
    presetAmounts: number[]
    allowLinks: boolean
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
        .max(DESCRIPTION_MAX_LENGTH, `Máximo ${DESCRIPTION_MAX_LENGTH} caracteres.`)
        .defined(),
    coverPhotoUrl: linkSchema.defined(),
    minimumAmount: Yup.number()
        .transform((value, original) => (original === "" ? undefined : value))
        .typeError("Ingresa un monto válido.")
        .min(0, "El mínimo no puede ser negativo.")
        .nullable()
        .defined(),
    presetAmounts: Yup.array()
        .of(Yup.number().moreThan(0).required())
        .max(MAX_PRESETS, `Máximo ${MAX_PRESETS} montos.`)
        .test(
            "above-min",
            "Cada preset debe ser mayor o igual al monto mínimo.",
            (presets, ctx) => {
                const min = ctx.parent.minimumAmount
                if (min === "" || min == null) return true
                return (presets ?? []).every((p) => p >= Number(min))
            },
        )
        .defined(),
    allowLinks: Yup.boolean().defined(),
    instagramLink: linkSchema.defined(),
    tikTokLink: linkSchema.defined(),
    youTubeLink: linkSchema.defined(),
    twitchLink: linkSchema.defined(),
    kickLink: linkSchema.defined(),
})

const toFormValues = (config: CreatorPageConfig): PageFormValues => ({
    description: config.description ?? "",
    coverPhotoUrl: config.coverPhotoUrl ?? "",
    minimumAmount: config.minimumAmount ?? "",
    presetAmounts: config.presetAmounts ?? [],
    allowLinks: config.allowLinks ?? false,
    instagramLink: config.instagramLink ?? "",
    tikTokLink: config.tikTokLink ?? "",
    youTubeLink: config.youTubeLink ?? "",
    twitchLink: config.twitchLink ?? "",
    kickLink: config.kickLink ?? "",
})

const emptyValues: PageFormValues = {
    description: "",
    coverPhotoUrl: "",
    minimumAmount: "",
    presetAmounts: [],
    allowLinks: false,
    instagramLink: "",
    tikTokLink: "",
    youTubeLink: "",
    twitchLink: "",
    kickLink: "",
}

const linkFields: { name: keyof PageFormValues; label: string; placeholder: string }[] = [
    { name: "instagramLink", label: "Instagram", placeholder: "https://instagram.com/tu-usuario" },
    { name: "tikTokLink", label: "TikTok", placeholder: "https://tiktok.com/@tu-usuario" },
    { name: "youTubeLink", label: "YouTube", placeholder: "https://youtube.com/@tu-canal" },
    { name: "twitchLink", label: "Twitch", placeholder: "https://twitch.tv/tu-canal" },
    { name: "kickLink", label: "Kick", placeholder: "https://kick.com/tu-canal" },
]

const CreatorPageSettings = () => {
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [creatorName, setCreatorName] = useState("")
    const [presetInput, setPresetInput] = useState("")

    const formik = useFormik<PageFormValues>({
        initialValues: emptyValues,
        validationSchema: pageSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const updated = await updateMyPageConfig({
                    description: values.description.trim(),
                    coverPhotoUrl: values.coverPhotoUrl.trim(),
                    minimumAmount: values.minimumAmount === "" ? null : Number(values.minimumAmount),
                    presetAmounts: values.presetAmounts,
                    allowLinks: values.allowLinks,
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

    const { resetForm, values, setFieldValue } = formik

    useEffect(() => {
        let active = true

        const loadConfig = async () => {
            try {
                const config = await getMyPageConfig()
                if (!active) return
                setCreatorName(config.creatorName)
                resetForm({ values: toFormValues(config) })
            } catch {
                // Sin datos previos: quedan los valores vacíos.
            } finally {
                if (active) setIsLoading(false)
            }
        }

        loadConfig()
        return () => {
            active = false
        }
    }, [resetForm])

    const addPreset = () => {
        const amount = Number(presetInput)
        if (!presetInput || Number.isNaN(amount) || amount <= 0) return
        if (values.presetAmounts.length >= MAX_PRESETS) return
        if (values.presetAmounts.includes(amount)) {
            setPresetInput("")
            return
        }
        setFieldValue(
            "presetAmounts",
            [...values.presetAmounts, amount].sort((a, b) => a - b),
        )
        setPresetInput("")
    }

    const removePreset = (amount: number) => {
        setFieldValue(
            "presetAmounts",
            values.presetAmounts.filter((p) => p !== amount),
        )
    }

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
                <h1 className="text-2xl font-bold tracking-tight">Mi página</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {creatorName
                        ? `Configuración pública de ${creatorName}.`
                        : "Configuración pública de tu página de donaciones."}
                </p>
            </div>

            <form onSubmit={formik.handleSubmit} noValidate className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Presentación</CardTitle>
                        <CardDescription>
                            Portada y descripción que verán los donantes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            <Field data-invalid={err("coverPhotoUrl")}>
                                <FieldLabel htmlFor="coverPhotoUrl">Foto de portada (URL)</FieldLabel>
                                {values.coverPhotoUrl && (
                                    <img
                                        src={values.coverPhotoUrl}
                                        alt="Vista previa de la portada"
                                        className="mb-2 aspect-[3/1] w-full rounded-lg border object-cover"
                                    />
                                )}
                                <Input
                                    id="coverPhotoUrl"
                                    name="coverPhotoUrl"
                                    type="url"
                                    placeholder="https://.../portada.jpg"
                                    value={values.coverPhotoUrl}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    aria-invalid={err("coverPhotoUrl")}
                                />
                                <FieldError>
                                    {formik.touched.coverPhotoUrl && formik.errors.coverPhotoUrl}
                                </FieldError>
                            </Field>

                            <Field data-invalid={err("description")}>
                                <div className="flex items-center justify-between gap-4">
                                    <FieldLabel htmlFor="description">Descripción</FieldLabel>
                                    <span className="text-xs tabular-nums text-muted-foreground">
                                        {values.description.length}/{DESCRIPTION_MAX_LENGTH}
                                    </span>
                                </div>
                                <Textarea
                                    id="description"
                                    name="description"
                                    rows={5}
                                    maxLength={DESCRIPTION_MAX_LENGTH}
                                    className="min-h-32 resize-y"
                                    placeholder="Contales a tus seguidores por qué apoyarte..."
                                    value={values.description}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    aria-invalid={err("description")}
                                />
                                <FieldError>
                                    {formik.touched.description && formik.errors.description}
                                </FieldError>
                            </Field>
                        </FieldGroup>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Donaciones</CardTitle>
                        <CardDescription>
                            Monto mínimo, montos sugeridos y reglas del mensaje.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup>
                            <Field data-invalid={err("minimumAmount")}>
                                <FieldLabel htmlFor="minimumAmount">Monto mínimo</FieldLabel>
                                <Input
                                    id="minimumAmount"
                                    name="minimumAmount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Sin mínimo"
                                    value={values.minimumAmount}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    aria-invalid={err("minimumAmount")}
                                />
                                <FieldDescription>Dejá vacío para no exigir mínimo.</FieldDescription>
                                <FieldError>
                                    {formik.touched.minimumAmount && formik.errors.minimumAmount}
                                </FieldError>
                            </Field>

                            <Field data-invalid={err("presetAmounts")}>
                                <FieldLabel htmlFor="presetInput">
                                    Montos sugeridos ({values.presetAmounts.length}/{MAX_PRESETS})
                                </FieldLabel>
                                {values.presetAmounts.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {values.presetAmounts.map((amount) => (
                                            <span
                                                key={amount}
                                                className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-sm"
                                            >
                                                {amount.toLocaleString("es-AR")}
                                                <button
                                                    type="button"
                                                    onClick={() => removePreset(amount)}
                                                    className="text-muted-foreground hover:text-foreground"
                                                    aria-label={`Quitar ${amount}`}
                                                >
                                                    <X className="size-3.5" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex gap-2">
                                    <Input
                                        id="presetInput"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="Ej: 500"
                                        value={presetInput}
                                        onChange={(e) => setPresetInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                addPreset()
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addPreset}
                                        disabled={values.presetAmounts.length >= MAX_PRESETS}
                                    >
                                        Agregar
                                    </Button>
                                </div>
                                <FieldError>
                                    {typeof formik.errors.presetAmounts === "string" &&
                                        formik.errors.presetAmounts}
                                </FieldError>
                            </Field>

                            <Field orientation="horizontal">
                                <Checkbox
                                    id="allowLinks"
                                    checked={values.allowLinks}
                                    onCheckedChange={(checked) =>
                                        setFieldValue("allowLinks", checked === true)
                                    }
                                />
                                <FieldLabel htmlFor="allowLinks">
                                    Permitir que los donantes incluyan links en el mensaje
                                </FieldLabel>
                            </Field>
                        </FieldGroup>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Links de redes sociales</CardTitle>
                        <CardDescription>Dejá vacío un campo para quitar ese link.</CardDescription>
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
                                        value={values[name] as string}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        aria-invalid={err(name)}
                                    />
                                    <FieldError>
                                        {formik.touched[name] && (formik.errors[name] as string)}
                                    </FieldError>
                                </Field>
                            ))}
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
