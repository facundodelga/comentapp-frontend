import { useAuthContext } from "@/contexts/auth-context";
import { apiClient } from "@/services/loginThunk";

export const useBeACreator = () => {
    const { isAuthenticated, user } = useAuthContext();

    const markAsCreator = async () => {
        if (!isAuthenticated || !user) {
            throw new Error("Debes estar autenticado para realizar esta acción.");
        }
        //TODO modificar a endpoint correspondiente
        const response = await apiClient.post("/be-a-creator");
        //TODO borrar log
        console.log(response.data);
        return response.data;
    };

    return { markAsCreator };
};
