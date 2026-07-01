import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, logoutUser } from "../api/auth";
import { getCurrentUser } from "../api/users";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        const token = localStorage.getItem("access_token");

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const profile = await getCurrentUser();
            setUser(profile);
        } catch (err) {
            console.error(err);
            localStorage.removeItem("access_token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        const data = await loginUser(username, password);

        localStorage.setItem("access_token", data.access_token);

        setUser(data.user);

        return data.user;
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch (err) {
            console.error(err);
        }

        localStorage.removeItem("access_token");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user || !!localStorage.getItem("access_token"),
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}