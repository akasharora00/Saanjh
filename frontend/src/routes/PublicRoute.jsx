import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (user) {
        if (user.role === "admin") {
            return <Navigate to="/admin" replace />;
        } else if (user.role === "faculty") {
            return <Navigate to="/faculty" replace />;
        } else {
            return <Navigate to="/student" replace />;
        }
    }

    return children;
};

export default PublicRoute;
