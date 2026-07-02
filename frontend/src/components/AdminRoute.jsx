import { Navigate, replace } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Children } from "react";

export default function AdminRoute({children}) {
    const {user, loading} = useAuth();

    if (loading){
        return(
            <div
                style={{
                    height:"100vh",
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center",
                    fontSize:"20px",
                    fontWeight:"bold",
                }}
            >
                loading... 
            </div>
        );
    }

    if(!user){
        return <Navigate to="/login" replace/>
    }

    if(user.roles !== "admin"){
        return <Navigate to="/" replace/>
    }

    return children;
}