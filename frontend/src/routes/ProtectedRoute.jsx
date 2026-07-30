import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BrandedLoader from "../components/common/BrandedLoader";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <BrandedLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Force faculty to change password on first login
  if (
    user.role === "faculty" &&
    user.mustChangePassword &&
    location.pathname !== "/faculty/change-password"
  ) {
    return <Navigate to="/faculty/change-password" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;