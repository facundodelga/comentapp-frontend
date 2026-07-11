import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/contexts/auth-context";
import { Spinner } from "@/components/ui/spinner";

function ProtectedRoute() {
    const { user, isLoading } = useAuthContext();

    if (isLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Spinner />
            </div>
        );
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute