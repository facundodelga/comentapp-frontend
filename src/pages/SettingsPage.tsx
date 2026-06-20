import { Settings } from "lucide-react"

const SettingsPage = () => {
    return (
        <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-primary/10 p-2 text-primary">
                        <Settings className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Configuración</h1>
                        <p className="text-sm text-muted-foreground">
                            Administra aquí las preferencias de tu cuenta.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default SettingsPage
