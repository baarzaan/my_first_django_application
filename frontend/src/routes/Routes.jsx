import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import HomePage from "../pages/HomePage";

export const routes = [
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },

    { path: "/", element: <HomePage /> },
]