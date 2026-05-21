'use client';

import { useState } from 'react';
import { Menu, X, BadgeDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const isAuthenticated = false; // Reemplaza con tu lógica de autenticación
    const user = {
        name: 'Usuario Ejemplo',
        email: 'usuario@example.com'
    }; // Reemplaza con tu lógica para obtener el usuario
    const logout = () => {
        // Reemplaza con tu lógica de cierre de sesión
        console.log('Cerrar sesión');
    }
    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Logo */}
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

                {/* Desktop Navigation */}
                <div className="hidden md:flex md:items-center md:gap-6">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-2">
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                >
                                    <Link to="/" className="group inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                                        Inicio
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                >
                                    <Link to="/contact" className="inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                                        Contacto
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Desktop Buttons */}
                <div className="hidden md:flex md:items-center md:gap-3">
                    {isAuthenticated && user ? (
                        <>
                            <span className="text-sm font-medium text-foreground">
                                {user?.name}
                            </span>
                            <Button
                                variant="ghost"
                                className="rounded-full px-5 text-sm font-medium"
                                onClick={logout}
                                >

                                    Cerrar sesión
                                
                            </Button>
                        </>

                    ) : (

                        <>
                            <Button
                                variant="ghost"
                                className="rounded-full px-5 text-sm font-medium">

                                <Link to="/register">
                                    Registrarse
                                </Link>
                            </Button>
                            <Button
                                className="rounded-full px-5 text-sm font-medium shadow-sm"
                            >
                                <Link to="/login" >
                                    Iniciar sesión
                                </Link>
                            </Button>

                        </>
                    )
                    }


                </div>

                {/* Mobile menu button */}
                <div className="md:hidden">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                        className="rounded-full"
                    >
                        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isOpen && (
                <div className="border-t border-border/40 bg-background/95 backdrop-blur md:hidden">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
                        <div className="space-y-1 rounded-2xl border bg-card p-3 shadow-sm">
                            <Link to="/" className="block rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent">
                                Inicio
                            </Link>
                            <Link
                                to="/about"
                                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                            >
                                Acerca de
                            </Link>
                            <Link
                                to="/contact"
                                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                            >
                                Contacto
                            </Link>
                        </div>

                        <div className="mt-4 grid gap-2">
                            {isAuthenticated && user ? (
                                <>
                                    <span>{user?.name}</span>
                                    <Link to="/logout" className="w-full rounded-full border border-border/40 bg-card px-5 py-2 text-center text-sm font-medium text-foreground transition-colors hover:bg-accent">
                                        Cerrar sesión
                                    </Link>
                                </>
                            ) : (
                                <>

                                    <Link to="/login" className="w-full rounded-full border border-border/40 bg-card px-5 py-2 text-center text-sm font-medium text-foreground transition-colors hover:bg-accent">
                                        Iniciar sesión
                                    </Link>
                                    <Link to="/register" className="w-full rounded-full border border-border/40 bg-card px-5 py-2 text-center text-sm font-medium text-foreground transition-colors hover:bg-accent">
                                        Registrarse
                                    </Link>

                                </>

                            )
                            }
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
