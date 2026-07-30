import { useEffect, useRef, useState } from "react"
import {
    HubConnectionBuilder,
    HubConnectionState,
    LogLevel,
} from "@microsoft/signalr"

export type SignalRStatus =
    | "Connecting"
    | "Connected"
    | "Reconnecting"
    | "Disconnected"

/**
 * Conexión SignalR con reconexión automática y cleanup.
 * La autenticación viaja en la cookie de sesión (misma origin vía proxy Vite).
 *
 * @param hubUrl URL del hub (ej: "/api/hubs/dashboard")
 * @param eventName Evento del servidor a escuchar (ej: "commentReceived")
 * @param onEvent Callback por evento recibido (puede cambiar entre renders; se usa la última)
 */
export function useSignalR<T>(
    hubUrl: string,
    eventName: string,
    onEvent: (data: T) => void,
): SignalRStatus {
    const [status, setStatus] = useState<SignalRStatus>("Connecting")

    // Ref para no reiniciar la conexión cuando cambia la identidad del callback.
    const onEventRef = useRef(onEvent)
    useEffect(() => {
        onEventRef.current = onEvent
    }, [onEvent])

    useEffect(() => {
        let active = true

        const connection = new HubConnectionBuilder()
            .withUrl(hubUrl)
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Warning)
            .build()

        connection.on(eventName, (data: T) => {
            onEventRef.current(data)
        })

        connection.onreconnecting(() => {
            if (active) setStatus("Reconnecting")
        })
        connection.onreconnected(() => {
            if (active) setStatus("Connected")
        })
        connection.onclose(() => {
            if (active) setStatus("Disconnected")
        })

        // El estado inicial ya es "Connecting"; acá solo se refleja el resultado.
        connection
            .start()
            .then(() => {
                if (active) setStatus("Connected")
            })
            .catch(() => {
                if (active) setStatus("Disconnected")
            })

        return () => {
            active = false
            connection.off(eventName)
            if (connection.state !== HubConnectionState.Disconnected) {
                void connection.stop()
            }
        }
    }, [hubUrl, eventName])

    return status
}
