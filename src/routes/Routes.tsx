import App from "@/App";
import ContactPage from "@/pages/ContactPage";
import ConfirmEmailPage from "@/pages/ConfirmEmailPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import RegisterPage from "@/pages/RegisterPage";
import SettingsPage from "@/pages/SettingsPage";
import { createBrowserRouter } from "react-router-dom";
import CommentsPage from "@/pages/CommentsPage";

export const router = createBrowserRouter([
    {
        element: <App />, // layout con Navbar
        errorElement: <NotFoundPage />,
        children: [
            { path: "/", element: <HomePage /> },
            { path: "/login", element: <LoginPage /> },
            { path: "/register", element: <RegisterPage /> },
            { path: "/confirm-email", element: <ConfirmEmailPage /> },
            { path: "/contact", element: <ContactPage /> },
            { path: "/settings", element: <SettingsPage /> },
            { path: "/new-comment", element: <CommentsPage /> }
        ],
    },
])
