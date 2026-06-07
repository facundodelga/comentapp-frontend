import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { confirmEmailService } from "@/services/loginThunk"
import { formatError } from "@/lib/utils"
import { BadgeDollarSign, CircleAlert, MailCheck } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useLocation, useSearchParams } from "react-router-dom"

type ConfirmEmailLocationState = {
  email?: string
}

export default function ConfirmEmailPage() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const hasRequestedConfirmation = useRef(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const { email: stateEmail } = (location.state ?? {}) as ConfirmEmailLocationState

  const email = useMemo(() => searchParams.get("email") ?? stateEmail ?? "", [searchParams, stateEmail])
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams])

  useEffect(() => {
    if (!token) {
      setStatus("idle")
      return
    }

    if (!email) {
      setErrorMessage("El enlace de confirmacion no incluye el email.")
      setStatus("error")
      return
    }

    if (hasRequestedConfirmation.current) return
    hasRequestedConfirmation.current = true

    setStatus("loading")
    confirmEmailService({ email, token })
      .then(() => {
        setStatus("success")
      })
      .catch((error) => {
        setErrorMessage(formatError(error))
        setStatus("error")
      })
  }, [email, token])

  const isConfirming = status === "loading"
  const isConfirmed = status === "success"
  const hasError = status === "error"

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link to="/" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <BadgeDollarSign className="h-5 w-5" />
          </div>
          ComentApp
        </Link>
        <Card>
          <CardHeader className="items-center text-center">
            <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              {isConfirming ? (
                <Spinner />
              ) : hasError ? (
                <CircleAlert className="h-6 w-6" />
              ) : (
                <MailCheck className="h-6 w-6" />
              )}
            </div>
            <CardTitle className="text-xl">
              {isConfirmed ? "Correo confirmado" : hasError ? "No pudimos confirmar el correo" : "Confirma tu correo"}
            </CardTitle>
            <CardDescription>
              {isConfirming
                ? "Estamos validando tu enlace de confirmacion."
                : isConfirmed
                  ? "Tu cuenta ya esta activa."
                  : hasError
                    ? "El enlace puede estar vencido o incompleto."
                    : "Te enviamos un email para activar tu cuenta."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-center">
            <p className="text-sm text-muted-foreground">
              {isConfirmed
                ? "Ya podes iniciar sesion con tu cuenta."
                : hasError
                  ? errorMessage
                  : `Revisa tu bandeja de entrada${email ? ` en ${email}` : ""} y sigue el enlace de confirmacion.`}
            </p>
            {isConfirmed && (
              <Button asChild>
                <Link to="/login">Ir a iniciar sesion</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
