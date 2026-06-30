import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login(){
    const {login} = useAuth();
    const navigate = useNavigate();

    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[error,SetError] = useState("");
    const[loading,SetLoading] = useState(false);

    const handlesubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try{
            await login(username, password)
            navigate("/");
        } catch(err){
            setError(
                err?.response?.data?.detail || "login Failed"
            );
        } finally {
            setLoading(false);
        }
    };
    return(
        <div style= {styles.container}>
            <form onSubmit={handlesubmit} style = {styles.form}>
                <h2>Login</h2>
                {error && <p style={styles.error}>{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e)=> 
                        setUsername(e.target.value)
                    }
                    style={styles.input}
                />

                <input
                    type = "password"
                    placeholder="Password"
                    value = {password}
                    onChange= {(e)=>
                            setPassword(e.target.value)    
                    }
                    style = {styles.input}
                />
                <button
                    type="submit"
                    disabled= {loading}
                    style={styles.button}
                >
                    {loading ? "logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}

const styles = {
    container:{
        height: "100vh",
        display: "flex",
        justifyContent:"center",
        alignItems: "center",
        background: "#0f172a",
        color: "white",
    },
    form :{
        display:"flex",
        flexDirection:"column",
        gap:"15px",
        padding:"30px",
        background:"#1e293b",
        borderRadius:"12px",
        width:"320px",
        boxShadow:"0 10px 30px rgba(0,0,0,0.3)",
    },
    input:{
        padding:"10px",
        borderRadius:"8px",
        border:"1px solid #331455",
        outline:"none",
        fontSize:"14px",
    },
    button:{
        padding:"10px",
        background:"#3b82f6",
        color:"white",
        border:"none",
        borderRadius:"5px",
        cursor:"pointer",
        fontWeight:"bold",
    },
    error:{
        color: "red",
        fontSize:"14px",
    },
};