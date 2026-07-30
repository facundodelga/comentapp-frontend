import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { CheckCircle2, Clock, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import {
    getPaymentStatus,
    type DonationStatus,
} from "@/services/donationService"

/**
 * Return page del checkout de Mercado Pago (?status=..&ref=<donationId>).
 * El query param es solo feedback: el estado real se consulta al backend,
 * que lo verificó server-side (webhook).
 */
const DonationResultPage = () => {
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState<DonationStatus | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const donationId = Number(searchParams.get("ref"))
    const hintedStatus = searchParams.get("status")

    useEffect(() => {
        let active = true

        const loadStatus = async () => {
            if (!Number.isInteger(donationId) || donationId <= 0) {
                if (active) setIsLoading(false)
                return
            }

            try {
                const data = await getPaymentStatus(donationId)
                if (active) setStatus(data.status)
            } catch {
                // Sin estado verificable: se muestra el resultado genérico.
                if (active) setStatus(null)
            } finally {
                if (active) setIsLoading(false)
            }
        }

        loadStatus()
        return () => {
            active = false
        }
    }, [donationId])

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <Spinner />
            </div>
        )
    }

    // El webhook puede demorar: si MP redirigió con success pero el backend aún
    // dice pending, se muestra pending (procesando), nunca un falso aprobado.
    const effective: DonationStatus =
        status ?? (hintedStatus === "failure" ? "rejected" : "pending")

    const view = {
        approved: {
            icon: <CheckCircle2 className="size-12 text-emerald-500" />,
            title: "¡Donación confirmada!",
            description:
                "El pago fue aprobado y tu comentario ya le llegó al creador. Gracias por el apoyo.",
        },
        pending: {
            icon: <Clock className="size-12 text-amber-500" />,
            title: "Pago en proceso",
            description:
                "Mercado Pago está procesando tu pago. Tu comentario se publicará automáticamente cuando se confirme.",
        },
        rejected: {
            icon: <XCircle className="size-12 text-destructive" />,
            title: "El pago no se completó",
            description:
                "El pago fue rechazado o cancelado. Tu comentario no fue enviado; podés intentarlo nuevamente.",
        },
        cancelled: {
            icon: <XCircle className="size-12 text-destructive" />,
            title: "Pago cancelado",
            description:
                "Cancelaste el pago. Tu comentario no fue enviado; podés intentarlo nuevamente.",
        },
        refunded: {
            icon: <XCircle className="size-12 text-muted-foreground" />,
            title: "Pago reembolsado",
            description: "Este pago fue reembolsado.",
        },
    }[effective]

    const failed = effective === "rejected" || effective === "cancelled"

    return (
        <div className="flex min-h-[70vh] items-center justify-center p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader className="items-center">
                    <div className="mb-2 flex justify-center">{view.icon}</div>
                    <CardTitle>{view.title}</CardTitle>
                    <CardDescription>{view.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center gap-3">
                    {failed ? (
                        <Button asChild>
                            <Link to="/new-comment">Intentar de nuevo</Link>
                        </Button>
                    ) : (
                        <Button asChild>
                            <Link to="/new-comment">Enviar otra donación</Link>
                        </Button>
                    )}
                    <Button variant="outline" asChild>
                        <Link to="/">Ir al inicio</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

export default DonationResultPage
