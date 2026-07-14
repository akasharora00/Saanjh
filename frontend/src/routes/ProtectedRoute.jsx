import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {

    const { user, loading } = useAuth();

    // Wait until authentication check finishes
    if (loading) {
        return <h2>Loading...</h2>;
    }

    // User not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // User logged in but doesn't have permission
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;