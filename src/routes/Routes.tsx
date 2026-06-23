import App from "@/App";
import ConfirmEmailPage from "@/pages/ConfirmEmailPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import RegisterPage from "@/pages/RegisterPage";
import SettingsPage from "@/pages/SettingsPage";
import { createBrowserRouter } from "react-router-dom";
import CommentsPage from "@/pages/CommentsPage";
import ExplorePage from "@/pages/ExplorePage";
import BeCreatorPage from "@/pages/BeCreatorPage";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
    {
        element: <App />, // layout con Navbar
        errorElement: <NotFoundPage />,
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/login", element: <LoginPage /> },
            { path: "/register", element: <RegisterPage /> },
            { path: "/confirm-email", element: <ConfirmEmailPage /> },
            { path: "/explore", element: <ExplorePage /> },
            { path: "/comentarios", element: <CommentsPage /> },
            
            {
                element: <ProtectedRoute />,
                children: [
                    { path: "/be-creator", element: <BeCreatorPage /> },
                    { path: "/settings", element: <SettingsPage /> }
                ]
            }
        ],
    },
])
