import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../api/authApi";

const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    // Check whether user is logged in
    const checkAuth = async () => {
        try {
            const res = await getCurrentUser();
            setUser(res.data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
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
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => useContext(AuthContext);