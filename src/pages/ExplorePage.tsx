import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Compass, HeartHandshake, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { searchCreators, type PublicCreator } from "@/services/creatorService"

const ExplorePage = () => {
    const [query, setQuery] = useState("")
    const [creators, setCreators] = useState<PublicCreator[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Debounce simple: espera 300ms tras el último tipeo antes de buscar.
    useEffect(() => {
        let active = true

        const timer = setTimeout(async () => {
            if (active) setIsLoading(true)
            try {
                const data = await searchCreators(query.trim() || undefined)
                if (active) setCreators(data)
            } catch {
                if (active) setCreators([])
            } finally {
                if (active) setIsLoading(false)
            }
        }, 300)

        return () => {
            active = false
            clearTimeout(timer)
        }
    }, [query])

    return (
        <main className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-5xl px-4 py-10 sm:px-6">
            <div className="mb-8">
                <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Compass className="size-6" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight">Explorar creadores</h1>
                <p className="mt-2 text-muted-foreground">
                    Encontrá creadores y apoyalos con una donación y un comentario.
                </p>
            </div>

            <div className="relative mb-8 max-w-md">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Buscar por nombre..."
                    className="pl-9"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            {isLoading ? (
                <div className="flex min-h-40 items-center justify-center">
                    <Spinner />
                </div>
            ) : creators.length === 0 ? (
                <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
                    No se encontraron creadores.
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {creators.map((creator) => (
                        <Card key={creator.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle className="truncate">
                                    {creator.creatorName}
                                </CardTitle>
                                <CardDescription className="line-clamp-3">
                                    {creator.description || "Este creador todavía no agregó una descripción."}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="mt-auto">
                                {creator.mercadoPagoConnected ? (
                                    <Button asChild size="sm">
                                        <Link to="/new-comment">
                                            <HeartHandshake className="size-4" />
                                            Apoyar
                                        </Link>
                                    </Button>
                                ) : (
                                    <p className="text-xs text-muted-foreground">
                                        Aún no puede recibir donaciones.
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </main>
    )
}

export default ExplorePage
