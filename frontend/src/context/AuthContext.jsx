import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, loginUser, logoutUser, changePassword } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check whether user is logged in
  const checkAuth = async () => {
    try {
      const res = await getCurrentUser();
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const res = await loginUser(credentials);
      const loggedUser = res.data.user;
      setUser(loggedUser);

      if (loggedUser?.role === "faculty" && loggedUser?.mustChangePassword) {
        navigate("/faculty/change-password");
      } else if (loggedUser?.role === "admin") {
        navigate("/admin");
      } else if (loggedUser?.role === "faculty") {
        navigate("/faculty");
      } else {
        navigate("/student");
      }
      return res.data;
    } catch (error) {
      setUser(null);
      throw error;
    }
  };

  const changePasswordAuth = async (passwordData) => {
    const res = await changePassword(passwordData);
    const updatedUser = res.data.user;
    setUser(updatedUser);
    navigate("/faculty");
    return res.data;
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        checkAuth,
        login,
        changePasswordAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);