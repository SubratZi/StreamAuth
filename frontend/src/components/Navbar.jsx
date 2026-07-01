import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar(){
    const{user, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = async()=> {
        await logout();
        navigate("/login");
    };

    return(
        <nav style={styles.navbar} >
            <div style={styles.logo}>
                StreamAuth
            </div>

            <div style={styles.links}>
                <Link style={styles.link} to="/home">
                    Home
                </Link>
                <Link style={styles.link} to="/profile">
                    Profile
                </Link> 

                {user?.roles === "admin" && (
                    <Link style={styles.link} to="/upload">
                        Upload
                    </Link>
                )}
            </div>

            <div style={styles.right}>
                <span style={styles.username}>
                    {user?.username}
                </span>
                <button style={styles.button}
                        onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

const styles = {
    navbar:{
        height:"70px",
        background: "#1e293b",
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center",
        padding:"0 40px",
        color:"white",
        boxShadow:"0 2px 10px rgba(0,0,0,.3)"
    },

    logo:{
        fontSize:"24px",
        fontWeight:"bold",
        color:"#60a5fa",
    },
    links:{
        display:"flex",
        gap:"35px",
        alignItems:"center",
    },

    link:{
        color:"white",
        textDecoration:"none",
        fontWeight:"500",
    },
    right:{
        display:"flex",
        alignItems:"center",
        gap:"20px",
    },

    username:{
        color:"#cbd5e1",
    },
    button:{
        padding:"8px 15px",
        border:"none",
        borderRadius:"6px",
        background:"#ef4444",
        color:"white",
        cursor:"pointer",
        fontWeight:"bold",
    },
};