import { useEffect, useState } from "react"
import { CheckCircle2, CreditCard, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/useToast"
import { formatError } from "@/lib/utils"
import {
    disconnectMercadoPago,
    getMercadoPagoAuthUrl,
    getMercadoPagoStatus,
    type MercadoPagoStatus,
} from "@/services/creatorService"

const PaymentMethodsPage = () => {
    const { toast } = useToast()
    const [status, setStatus] = useState<MercadoPagoStatus | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isConnecting, setIsConnecting] = useState(false)

    useEffect(() => {
        let active = true

        const loadStatus = async () => {
            try {
                const data = await getMercadoPagoStatus()
                if (active) setStatus(data)
            } catch {
                if (active) setStatus({ connected: false })
            } finally {
                if (active) setIsLoading(false)
            }
        }

        loadStatus()
        return () => {
            active = false
        }
    }, [])

    const handleConnect = async () => {
        setIsConnecting(true)
        try {
            const url = await getMercadoPagoAuthUrl()
            window.location.href = url
        } catch (error) {
            toast.error(formatError(error))
            setIsConnecting(false)
        }
    }

    const handleDisconnect = async () => {
        try {
            await disconnectMercadoPago()
            setStatus({ connected: false })
            toast.success("Cuenta desvinculada")
        } catch (error) {
            toast.error(formatError(error))
        }
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <Spinner />
            </div>
        )
    }

    const connected = status?.connected ?? false

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Métodos de pago</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Vincula tu cuenta de Mercado Pago para recibir las donaciones.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-primary/10 p-2 text-primary">
                            <CreditCard className="size-5" />
                        </div>
                        <div>
                            <CardTitle>Mercado Pago</CardTitle>
                            <CardDescription>
                                Cuenta a la que llegarán las donaciones.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                        {connected ? (
                            <>
                                <CheckCircle2 className="size-4 text-emerald-500" />
                                <span>
                                    Conectada
                                    {status?.accountId ? ` (${status.accountId})` : ""}
                                </span>
                            </>
                        ) : (
                            <>
                                <XCircle className="size-4 text-muted-foreground" />
                                <span className="text-muted-foreground">No conectada</span>
                            </>
                        )}
                    </div>

                    {connected ? (
                        <Button variant="outline" onClick={handleDisconnect}>
                            Desvincular cuenta
                        </Button>
                    ) : (
                        <Button onClick={handleConnect} disabled={isConnecting}>
                            {isConnecting ? "Redirigiendo..." : "Configurar método de pago"}
                        </Button>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default PaymentMethodsPage
