import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import BlogPage from "../pages/BlogPage";
import CreateBlog from "../pages/CreateBlog";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";

export const routes = [
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },

    { path: "/", element: <HomePage /> },
    { path: "/create", element: <CreateBlog /> },
    { path: "/blog/:blogId", element: <BlogPage /> },
    { path: "/profile/:username", element: <ProfilePage /> },
]