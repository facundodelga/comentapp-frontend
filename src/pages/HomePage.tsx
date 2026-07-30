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
                        Apoyá a tus creadores favoritos
                    </h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto">
                        Enviá una donación con tu comentario por Mercado Pago y el creador
                        lo ve al instante en su stream.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <Button className="px-8 py-3 rounded-lg font-semibold">
                            <Link to="/new-comment">Enviar una donación</Link>
                        </Button>
                        <Button className="border-2 px-8 py-3 rounded-lg font-semibold">
                            <Link to="/explore">Explorar creadores</Link>
                        </Button>
                    </div>
                </Card>

                <Card className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 rounded-lg shadow-md p-6">
                    <Card className=" rounded-lg shadow-md p-6">
                        <div className="text-4xl mb-4">💬</div>
                        <h3 className="text-xl font-bold mb-2">Comentá</h3>
                        <p className="">
                            Escribí tu mensaje y elegí el monto que quieras donar.
                        </p>
                    </Card>

                    <Card className=" rounded-lg shadow-md p-6">
                        <div className="text-4xl mb-4">💸</div>
                        <h3 className="text-xl font-bold mb-2">Doná seguro</h3>
                        <p className="">
                            El pago va directo al creador vía Mercado Pago.
                        </p>
                    </Card>

                    <Card className=" rounded-lg shadow-md p-6">
                        <div className="text-4xl mb-4">⚡</div>
                        <h3 className="text-xl font-bold mb-2">En tiempo real</h3>
                        <p className="">
                            El creador ve tu comentario al instante, apenas se confirma el pago.
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
