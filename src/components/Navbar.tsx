import { useContext, useState } from "react"
import {
    BadgeDollarSign,
    ChevronDown,
    LogOut,
    Menu,
    Settings,
    UserCircle,
    X,
} from "lucide-react"
import { Link } from "react-router-dom"
import { AuthContext } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import type { User } from "@/types/Login.types"

const getDisplayName = (user: User) => {
    if (user.userName || user.username || user.name) {
        return user.userName ?? user.username ?? user.name
    }

    const fullName = [user.firstName, user.lastName ?? user.surname]
        .filter(Boolean)
        .join(" ")

    return fullName || user.email
}

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const auth = useContext(AuthContext)
    const user = auth?.user
    const isAuthenticated = auth?.isAuthenticated ?? false

    const closeMobileMenu = () => setIsOpen(false)

    const logout = async () => {
        closeMobileMenu()
        await auth?.logout()
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <Link to="/" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <BadgeDollarSign className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-base font-semibold tracking-tight text-foreground">
                            ComentApp
                        </span>
                        <span className="text-xs text-muted-foreground">
                            Comenta, comparte y conecta
                        </span>
                    </div>
                </Link>

                <div className="hidden md:flex md:items-center md:gap-6">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-2">
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link to="/" className="group inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                                        Inicio
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link to="/contact" className="inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                                        Contacto
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                <div className="hidden md:flex md:items-center md:gap-3">
                    {isAuthenticated && user ? (
                        <details className="group relative">
                            <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">
                                <UserCircle className="h-5 w-5 text-muted-foreground" />
                                <span className="max-w-48 truncate">{getDisplayName(user)}</span>
                                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                            </summary>
                            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border bg-popover p-1.5 text-popover-foreground shadow-lg">
                                <Link
                                    to="/settings"
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                                >
                                    <Settings className="h-4 w-4" />
                                    Configuración
                                </Link>
                                <button
                                    type="button"
                                    onClick={logout}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-accent"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Cerrar sesión
                                </button>
                            </div>
                        </details>
                    ) : (
                        <>
                            <Button variant="ghost" className="rounded-full px-5 text-sm font-medium" asChild>
                                <Link to="/register">Registrarse</Link>
                            </Button>
                            <Button className="rounded-full px-5 text-sm font-medium shadow-sm" asChild>
                                <Link to="/login">Iniciar sesión</Link>
                            </Button>
                        </>
                    )}
                </div>

                <div className="md:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Abrir o cerrar menú"
                        aria-expanded={isOpen}
                        className="rounded-full"
                    >
                        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {isOpen && (
                <div className="border-t border-border/40 bg-background/95 backdrop-blur md:hidden">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
                        <div className="space-y-1 rounded-2xl border bg-card p-3 shadow-sm">
                            <Link onClick={closeMobileMenu} to="/" className="block rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent">
                                Inicio
                            </Link>
                            <Link onClick={closeMobileMenu} to="/contact" className="block rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent">
                                Contacto
                            </Link>
                        </div>

                        <div className="mt-4 grid gap-2">
                            {isAuthenticated && user ? (
                                <div className="rounded-2xl border bg-card p-3 shadow-sm">
                                    <div className="mb-2 flex items-center gap-2 px-3 py-2 text-sm font-semibold">
                                        <UserCircle className="h-5 w-5 text-muted-foreground" />
                                        <span className="truncate">{getDisplayName(user)}</span>
                                    </div>
                                    <Link
                                        onClick={closeMobileMenu}
                                        to="/settings"
                                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                                    >
                                        <Settings className="h-4 w-4" />
                                        Configuración
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={logout}
                                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-destructive transition-colors hover:bg-accent"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Cerrar sesión
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <Link onClick={closeMobileMenu} to="/login" className="w-full rounded-full border border-border/40 bg-card px-5 py-2 text-center text-sm font-medium text-foreground transition-colors hover:bg-accent">
                                        Iniciar sesión
                                    </Link>
                                    <Link onClick={closeMobileMenu} to="/register" className="w-full rounded-full border border-border/40 bg-card px-5 py-2 text-center text-sm font-medium text-foreground transition-colors hover:bg-accent">
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}
