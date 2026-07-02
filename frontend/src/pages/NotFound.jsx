import { useNavigate } from "react-router-dom";

export default function NotFound(){
    const navigate = useNavigate();

    return(
        <div style={styles.pages}>
            <div style={styles.container}>
                <h1 style={styles.code}>404</h1>
                <h2 style={styles.title}>Page Not Found!</h2>
                <p style={styles.subtitle}>Looks like this page doesn't exist or was moved</p>
                <button style={styles.button} onClick={() => navigate("/home")}>
                    Go Home
                </button>
            </div>
        </div>
    );
}

const styles = {
    page:{
        minHeight:"100vh",
        background:"#0f172a",
        color:"white",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
    },
    container:{
        textAlign:"center",
    },
    code:{
        fontSize:"120px",
        fontWeight:"bold",
        color:"#1e239b",
        margin:"0",
    },
    title:{
        fontSize: "32px",
        marginBottom:"10px",
    },
    subtitle:{
        color:"#93a3b8",
        marginBottom:"30px",
    },
    button:{
        padding:"12px 30px",
        background:"#1e239b",
        color:"white",
        border:"none",
        borderRadius:"8px",
        fontSize:"16px",
        fontWeight:"bold",
        cursor:"pointer",
    },
};