import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, loginUser, registerUser, logoutUser } from "../api/authApi";

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

    const login = async (userData) => {
        try {
            const res = await loginUser(userData);
            setUser(res.data.user);
            const role = res.data.user?.role;
            if (role === "admin") {
                navigate("/admin");
            } else if (role === "faculty") {
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

    const register = async (userData) => {
        try {
            const res = await registerUser(userData);
            setUser(res.data.user);
            const role = res.data.user?.role;
            if (role === "admin") {
                navigate("/admin");
            } else if (role === "faculty") {
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
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);