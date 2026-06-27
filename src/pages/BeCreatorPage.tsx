import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useBeACreator } from "@/hooks/useBeACreator";
import { useToast } from "@/hooks/useToast";
import { Loader2 } from "lucide-react";

const BeCreatorPage = () => {
    const navigate = useNavigate();
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { markAsCreator } = useBeACreator();
    const { toast } = useToast();

    const handleTermsAcceptance = () => {
        setTermsAccepted(!termsAccepted);
    };

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!termsAccepted) {
            toast.error("Debes aceptar los términos y condiciones para continuar.");
            return;
        }

        setIsLoading(true);

        try {
            await markAsCreator();
            
            toast.success("Ya sos un Creador!");
            navigate("/"); 
        } catch (error) {
            console.error(error);
            toast.error("No se logró procesar la solicitud. Intentar nuevamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-border/40 bg-card p-8 shadow-xl">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Conviértete en creador
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        En breve podrás convertirte en creador y monetizar tus comentarios de manera sencilla y transparente.
                    </p>
                </div>

                <div className="mb-8 rounded-xl bg-accent/30 p-4 text-sm text-foreground">
                    <p className="mb-2">
                        Para avanzar, te invitamos a leer atentamente nuestras condiciones para usuarios creadores.
                    </p>
                    <Link
                        to="/creator-terms"
                        className="font-semibold text-primary underline-offset-4 hover:underline">

                        Ver Términos y Condiciones
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-accent/10 p-4 transition-colors hover:bg-accent/20">
                        <input
                            type="checkbox"
                            id="terms"
                            className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-border text-primary shadow-sm focus:ring-2 focus:ring-primary/20"
                            checked={termsAccepted}
                            onChange={handleTermsAcceptance}
                        />
                        <label htmlFor="terms" className="cursor-pointer text-sm font-medium leading-none text-foreground">
                            He leído y acepto los términos y condiciones
                        </label>
                    </div>

                    <Button
                        type="submit"
                        className="h-11 w-full text-base font-semibold shadow-sm transition-all"
                        disabled={isLoading || !termsAccepted}>

                        {isLoading? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Procesando...
                            </>
                        ) : (
                            "Continuar"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default BeCreatorPage;