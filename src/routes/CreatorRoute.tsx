import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/contexts/auth-context";
import { Spinner } from "@/components/ui/spinner";

function CreatorRoute() {
    const { user, isLoading } = useAuthContext();

    if (isLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return user.isCreator ? <Outlet /> : <Navigate to="/be-creator" replace />;
}

export default CreatorRoute;
