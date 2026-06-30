import {createContext, useContext, useEffect, useState} from "react";
import {loginUser, logoutUser} from "../api/auth";
import {getCurrentUser} from "../api/users";

const AuthContext = createContext();

export function AuthProvider ({children}){
    const[user, setUser] = useState(null);
    const[loading, setloading] = useState(true);
    
    useEffect(() => {
        initializeAuth();
    }, []);
    const initializeAuth = async () =>{
        const token = localStorage.getItem("access_token");
        if(!token){
            setloading(false);
            return;
        }

        try {
            const profile = await getCurrentUser();
            if (profile.access_token){
                localStorage.setItem(
                    "access_token",
                    profile.access_token
                );
            }
            setUser(profile);
        }catch (error){
            console.error(error);
            localStorage.removeItem("access_token");
            setUser(null);
        }finally{
            setloading(false);
        }
        
    };
    const login = async(username, password) =>{
        const data = await loginUser(username, password);
        localStorage.setItem(
            "access_token",
            data.access_token
        );
        setUser(data.user);
        return data.user;
    };
    const logout = async()=>{
        try{
            await logoutUser();
        }catch(error){
            console.error(error);
        }
        localStorage.removeItem("access_token");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{user,loading,login,logout,isAuthenticated:!!user,}}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(){
    return useContext(AuthContext);
}