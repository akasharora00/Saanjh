import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BrandedLoader from "../components/common/BrandedLoader";

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <BrandedLoader />;
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
