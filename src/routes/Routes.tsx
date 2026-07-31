import App from "@/App";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import SettingsPage from "@/pages/SettingsPage";
import { createBrowserRouter } from "react-router-dom";
import CommentsPage from "@/pages/CommentsPage";
import DonationResultPage from "@/pages/DonationResultPage";
import ExplorePage from "@/pages/ExplorePage";
import BeCreatorPage from "@/pages/BeCreatorPage";
import PublicCreatorPage from "@/pages/PublicCreatorPage";
import ProtectedRoute from "./ProtectedRoute";
import CreatorRoute from "./CreatorRoute";
import CreatorLayout from "@/pages/creator/CreatorLayout";
import CreatorPageSettings from "@/pages/creator/CreatorPageSettings";
import PaymentMethodsPage from "@/pages/creator/PaymentMethodsPage";
import StreamPage from "@/pages/creator/StreamPage";
import ContactPage from "@/pages/ContactPage";

export const router = createBrowserRouter([
    {
        element: <App />, // layout con Navbar
        errorElement: <NotFoundPage />,
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/login", element: <LoginPage /> },
            { path: "/contact", element: <ContactPage /> },
            { path: "/explore", element: <ExplorePage /> },

            {
                element: <ProtectedRoute />,
                children: [
                    { path: "/be-creator", element: <BeCreatorPage /> },
                    { path: "/settings", element: <SettingsPage /> },
                    { path: "/new-comment", element: <CommentsPage /> },
                    { path: "/donation/result", element: <DonationResultPage /> },
                ]
            },

            {
                element: <CreatorRoute />,
                children: [
                    {
                        element: <CreatorLayout />,
                        children: [
                            { path: "/creator/page", element: <CreatorPageSettings /> },
                            { path: "/creator/payment-methods", element: <PaymentMethodsPage /> },
                            { path: "/creator/stream", element: <StreamPage /> },
                        ],
                    },
                ],
            },

            // Página pública de donaciones. Debe ir última: cede ante rutas estáticas.
            { path: "/:username", element: <PublicCreatorPage /> },
        ],
    },
])
