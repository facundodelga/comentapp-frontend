import { NavLink, Outlet } from "react-router-dom"
import { CreditCard, LayoutPanelLeft, Radio } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
    { to: "/creator/page", label: "Mi página", icon: LayoutPanelLeft },
    { to: "/creator/payment-methods", label: "Métodos de pago", icon: CreditCard },
    { to: "/creator/stream", label: "Stream", icon: Radio },
]

const CreatorLayout = () => {
    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row lg:px-8">
            <aside className="md:w-60 md:shrink-0">
                <nav className="flex gap-2 overflow-x-auto rounded-2xl border bg-card p-2 md:flex-col md:gap-1">
                    {navItems.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-accent hover:text-foreground",
                                )
                            }
                        >
                            <Icon className="size-4 shrink-0" />
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            <main className="min-w-0 flex-1">
                <Outlet />
            </main>
        </div>
    )
}

export default CreatorLayout
