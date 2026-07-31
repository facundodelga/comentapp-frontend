import { useFormik } from "formik"
import * as Yup from "yup"
import { UserCircle } from "lucide-react"
import type { AxiosError } from "axios"
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
import { useAuthContext } from "@/contexts/auth-context"
import { useToast } from "@/hooks/useToast"
import { formatError } from "@/lib/utils"
import { updateAccount } from "@/services/accountService"

interface AccountFormValues {
    userName: string
    avatarUrl: string
}

const accountSchema: Yup.ObjectSchema<AccountFormValues> = Yup.object({
    userName: Yup.string()
        .trim()
        .required("El nombre de usuario es obligatorio.")
        .min(3, "Mínimo 3 caracteres.")
        .max(30, "Máximo 30 caracteres.")
        .matches(
            /^[a-zA-Z0-9._-]+$/,
            "Solo letras, números, punto, guion y guion bajo.",
        ),
    avatarUrl: Yup.string()
        .trim()
        .url("Ingresa una URL válida (con https://).")
        .max(300, "Máximo 300 caracteres.")
        .defined(),
})

const SettingsPage = () => {
    const { user, updateUser } = useAuthContext()
    const { toast } = useToast()

    const currentName =
        user?.userName ?? user?.username ?? user?.name ?? ""

    const formik = useFormik<AccountFormValues>({
        initialValues: {
            userName: currentName,
            avatarUrl: user?.avatarUrl ?? "",
        },
        enableReinitialize: true,
        validationSchema: accountSchema,
        onSubmit: async (values, helpers) => {
            try {
                const updated = await updateAccount({
                    userName: values.userName.trim(),
                    avatarUrl: values.avatarUrl.trim(),
                })
                updateUser(updated)
                toast.success("Cuenta actualizada")
                helpers.resetForm({ values })
            } catch (error) {
                const status = (error as AxiosError)?.response?.status
                if (status === 409) {
                    helpers.setFieldError(
                        "userName",
                        "Ese nombre de usuario ya está en uso.",
                    )
                    return
                }
                toast.error(formatError(error))
            }
        },
    })

    const err = (name: keyof AccountFormValues) =>
        Boolean(formik.touched[name] && formik.errors[name])

    return (
        <main className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8">
                <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <UserCircle className="size-6" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Configuración de cuenta</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Administrá tu nombre de usuario y foto de perfil.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Datos de la cuenta</CardTitle>
                    <CardDescription>Estos datos son visibles para otros usuarios.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={formik.handleSubmit} noValidate>
                        <FieldGroup>
                            <Field orientation="horizontal" className="items-center">
                                <div className="size-16 shrink-0 overflow-hidden rounded-full border bg-muted">
                                    {formik.values.avatarUrl ? (
                                        <img
                                            src={formik.values.avatarUrl}
                                            alt="Vista previa del avatar"
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex size-full items-center justify-center text-muted-foreground">
                                            <UserCircle className="size-8" />
                                        </div>
                                    )}
                                </div>
                                <span className="text-sm text-muted-foreground">
                                    Vista previa
                                </span>
                            </Field>

                            <Field data-invalid={err("userName")}>
                                <FieldLabel htmlFor="userName">Nombre de usuario</FieldLabel>
                                <Input
                                    id="userName"
                                    name="userName"
                                    value={formik.values.userName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    aria-invalid={err("userName")}
                                />
                                <FieldDescription>
                                    Debe ser único. Se usa en tu URL pública.
                                </FieldDescription>
                                <FieldError>
                                    {formik.touched.userName && formik.errors.userName}
                                </FieldError>
                            </Field>

                            <Field data-invalid={err("avatarUrl")}>
                                <FieldLabel htmlFor="avatarUrl">Foto de perfil (URL)</FieldLabel>
                                <Input
                                    id="avatarUrl"
                                    name="avatarUrl"
                                    type="url"
                                    placeholder="https://.../foto.jpg"
                                    value={formik.values.avatarUrl}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    aria-invalid={err("avatarUrl")}
                                />
                                <FieldDescription>
                                    Pegá el enlace de una imagen. Dejá vacío para quitarla.
                                </FieldDescription>
                                <FieldError>
                                    {formik.touched.avatarUrl && formik.errors.avatarUrl}
                                </FieldError>
                            </Field>

                            <Field orientation="horizontal" className="justify-end">
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
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </main>
    )
}

export default SettingsPage
