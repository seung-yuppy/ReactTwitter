import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import LogIn from "./pages/LogIn";
import Join from "./pages/Join";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "profile",
                element: <Profile />
            }
        ]
    },
    {
        path: "/login",
        element: <LogIn />
    },
    {
        path: "/join",
        element: <Join />
    }
])

export default router;