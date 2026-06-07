import { cn } from "@/lib/utils"
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
import { AuthContext } from "@/contexts/AuthContext"
import { registerSchema, type RegisterFormValues } from "@/types/Register.types"
import { useFormik } from "formik"
import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Spinner } from "./ui/spinner"

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()
  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      name: "",
      surname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {

      try {
        await auth!.register(values)
        navigate("/confirm-email", { state: { email: values.email } })
      } catch {
        return
      }
    },
  })

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Crea tu cuenta</CardTitle>
          <CardDescription>
            Ingresa tu correo electrónico para crear tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} noValidate>
            <FieldGroup>
              <Field data-invalid={Boolean(formik.touched.name && formik.errors.name)}>
                <FieldLabel htmlFor="name">Nombre</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Juan"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-invalid={Boolean(formik.touched.name && formik.errors.name)}
                />
                <FieldError>{formik.touched.name && formik.errors.name}</FieldError>
              </Field>
              <Field data-invalid={Boolean(formik.touched.surname && formik.errors.surname)}>
                <FieldLabel htmlFor="surname">Apellido</FieldLabel>
                <Input
                  id="surname"
                  name="surname"
                  type="text"
                  placeholder="Pérez"
                  value={formik.values.surname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-invalid={Boolean(formik.touched.surname && formik.errors.surname)}
                />
                <FieldError>{formik.touched.surname && formik.errors.surname}</FieldError>
              </Field>
              <Field data-invalid={Boolean(formik.touched.username && formik.errors.username)}>
                <FieldLabel htmlFor="username">Nombre de usuario</FieldLabel>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="juanperez"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-invalid={Boolean(formik.touched.username && formik.errors.username)}
                />
                <FieldError>{formik.touched.name && formik.errors.name}</FieldError>
              </Field>
              <Field data-invalid={Boolean(formik.touched.email && formik.errors.email)}>
                <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  aria-invalid={Boolean(formik.touched.email && formik.errors.email)}
                />
                <FieldError>{formik.touched.email && formik.errors.email}</FieldError>
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field data-invalid={Boolean(formik.touched.password && formik.errors.password)}>
                    <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      aria-invalid={Boolean(formik.touched.password && formik.errors.password)}
                    />
                  </Field>
                  <Field data-invalid={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)}>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirmar contraseña
                    </FieldLabel>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      aria-invalid={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                    />
                  </Field>
                </Field>
                <FieldError>{formik.touched.password && formik.errors.password}</FieldError>
                <FieldError>{formik.touched.confirmPassword && formik.errors.confirmPassword}</FieldError>
                <FieldDescription>
                  Debe tener al menos 8 caracteres.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? (<Spinner/>) : "Crear cuenta"}
                </Button>
                <FieldDescription className="text-center">
                  ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Al continuar, aceptas nuestros <Link to="/terms">Términos de servicio</Link>{" "}
        y nuestra <Link to="/privacy">Política de privacidad</Link>.
      </FieldDescription>
    </div>
  )
}
