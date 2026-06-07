import App from "@/App";
import ContactPage from "@/pages/ContactPage";
import ConfirmEmailPage from "@/pages/ConfirmEmailPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import RegisterPage from "@/pages/RegisterPage";
import { createBrowserRouter } from "react-router-dom";

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
        ],
    },
])
