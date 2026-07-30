import { useAuthContext } from "@/contexts/auth-context";
import { registerCreator, type Creator } from "@/services/creatorService";

export const useBeACreator = () => {
    const { isAuthenticated, user } = useAuthContext();

    // Paso 2: registra al usuario como creador (POST /Creators con creatorName).
    const markAsCreator = async (creatorName: string): Promise<Creator> => {
        if (!isAuthenticated || !user) {
            throw new Error("Debes estar autenticado para realizar esta acción.");
        }
        return registerCreator(creatorName.trim());
    };

    return { markAsCreator };
};
