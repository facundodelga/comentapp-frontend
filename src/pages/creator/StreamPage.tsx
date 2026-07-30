import { useCallback, useEffect, useState } from "react"
import { DollarSign, Radio } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { useSignalR, type SignalRStatus } from "@/hooks/useSignalR"
import {
    getMyConfirmedComments,
    type CreatorComment,
} from "@/services/creatorService"

const statusView: Record<SignalRStatus, { label: string; dotClass: string }> = {
    Connecting: { label: "Conectando...", dotClass: "bg-amber-500" },
    Connected: { label: "En vivo", dotClass: "bg-emerald-500 animate-pulse" },
    Reconnecting: { label: "Reconectando...", dotClass: "bg-amber-500 animate-pulse" },
    Disconnected: { label: "Desconectado", dotClass: "bg-destructive" },
}

const formatTime = (iso: string) =>
    new Date(iso).toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    })

const StreamPage = () => {
    const [comments, setComments] = useState<CreatorComment[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Nuevos comentarios en vivo: al tope, sin duplicar (los reintentos del
    // webhook no repiten el evento, pero una reconexión + refetch podría).
    const handleCommentReceived = useCallback((comment: CreatorComment) => {
        setComments((prev) =>
            prev.some((c) => c.id === comment.id) ? prev : [comment, ...prev],
        )
    }, [])

    const connectionStatus = useSignalR<CreatorComment>(
        "/api/hubs/dashboard",
        "commentReceived",
        handleCommentReceived,
    )

    useEffect(() => {
        let active = true

        const loadComments = async () => {
            try {
                const data = await getMyConfirmedComments()
                if (active) setComments(data)
            } catch {
                // Sin feed inicial: el stream en vivo sigue funcionando igual.
            } finally {
                if (active) setIsLoading(false)
            }
        }

        loadComments()
        return () => {
            active = false
        }
    }, [])

    const markAsRead = (id: number) => {
        // Leído solo en UI; el backend no lo persiste todavía.
        setComments((prev) =>
            prev.map((c) => (c.id === id ? { ...c, isRead: true } : c)),
        )
    }

    const view = statusView[connectionStatus]

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Stream</h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Comentarios y donaciones en vivo.
                    </p>
                </div>
                <div className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm">
                    <span className={cn("size-2 rounded-full", view.dotClass)} />
                    {view.label}
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-primary/10 p-2 text-primary">
                            <Radio className="size-5" />
                        </div>
                        <div>
                            <CardTitle>Donaciones recibidas</CardTitle>
                            <CardDescription>
                                Solo se muestran comentarios con pago confirmado.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex min-h-40 items-center justify-center">
                            <Spinner />
                        </div>
                    ) : comments.length === 0 ? (
                        <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
                            Todavía no recibiste donaciones. Cuando llegue una, aparece acá al instante.
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {comments.map((comment) => (
                                <li
                                    key={comment.id}
                                    className={cn(
                                        "rounded-xl border p-4 transition-colors",
                                        !comment.isRead && "border-primary/40 bg-primary/5",
                                    )}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                                                <span className="font-semibold">
                                                    {comment.fromUserName}
                                                </span>
                                                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-2 py-0.5 font-medium text-emerald-600 dark:text-emerald-400">
                                                    <DollarSign className="size-3.5" />
                                                    {comment.amount.toLocaleString("es-AR")}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatTime(comment.createdAt)}
                                                </span>
                                            </div>
                                            <p className="mt-2 text-sm break-words">
                                                {comment.comment}
                                            </p>
                                        </div>
                                        {!comment.isRead && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="shrink-0"
                                                onClick={() => markAsRead(comment.id)}
                                            >
                                                Marcar leído
                                            </Button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default StreamPage
