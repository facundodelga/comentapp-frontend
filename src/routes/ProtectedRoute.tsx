import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/contexts/auth-context";

function ProtectedRoute() {
    const { user } = useAuthContext();

    return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute