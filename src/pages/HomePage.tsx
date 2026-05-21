import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen">

            <main className="max-w-6xl mx-auto px-4 py-16">
                <Card className="text-center">
                    <h2 className="text-5xl font-bold mb-4">
                        Bienvenido a ComentApp
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Una plataforma simple y moderna para comentar, compartir ideas y conectar con otros usuarios.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <Button className="px-8 py-3 rounded-lg font-semibold">
                            Comenzar
                        </Button>
                        <Button className="border-2 px-8 py-3 rounded-lg font-semibold">
                            <Link to="/about">Más Información</Link>
                        </Button>
                    </div>
                </Card>

                <Card className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 rounded-lg shadow-md p-6">
                    <Card className=" rounded-lg shadow-md p-6">
                        <div className="text-4xl mb-4">💬</div>
                        <h3 className="text-xl font-bold mb-2">Comenta</h3>
                        <p className="">
                            Comparte tus opiniones y comentarios de forma rápida y sencilla.
                        </p>
                    </Card>

                    <Card className=" rounded-lg shadow-md p-6">
                        <div className="text-4xl mb-4">🔗</div>
                        <h3 className="text-xl font-bold mb-2">Conecta</h3>
                        <p className="">
                            Interactúa con otros usuarios y construye tu comunidad.
                        </p>
                    </Card>

                    <Card className=" rounded-lg shadow-md p-6">
                        <div className="text-4xl mb-4">⚡</div>
                        <h3 className="text-xl font-bold mb-2">Rápido</h3>
                        <p className="">
                            Experiencia fluida y optimizada para tu comodidad.
                        </p>
                    </Card>
                </Card>
            </main>

            <footer className="text-white text-center py-8 mt-16">
                <p>&copy; 2026 ComentApp. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default HomePage;
