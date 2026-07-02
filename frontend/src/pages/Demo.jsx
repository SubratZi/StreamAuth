import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Demo() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleDemo = async () => {
        console.log("API URL:", import.meta.env.VITE_API_URL)
        try {
            await login("demo", "123");
            navigate("/home");
        } catch (err) {
            console.error("Demo login failed", err);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <h1 style={styles.title}>StreamAuth</h1>
                <p style={styles.subtitle}>
                    A video streaming platform with authentication, bandwidth limiting, and concurrent stream control.
                </p>

                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Try the Demo</h2>
                    <p style={styles.cardText}>
                        Click below to instantly log in as an <strong>admin</strong> and explore all features.
                    </p>

                    <button style={styles.button} onClick={handleDemo}>
                        Launch Demo 
                    </button>
                </div>

                <div style={styles.features}>
                    <div style={styles.feature}> Rate Limiting</div>
                    <div style={styles.feature}> Bandwidth Control</div>
                    <div style={styles.feature}> Concurrent Streams</div>
                    <div style={styles.feature}> JWT Auth</div>
                </div>

                <p style={styles.footer}>
                    Already have an account?{" "}
                    <span style={styles.link} onClick={() => navigate("/login")}>
                        Login here
                    </span>
                </p>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        textAlign: "center",
        padding: "40px",
        maxWidth: "600px",
    },
    title: {
        fontSize: "48px",
        fontWeight: "bold",
        color: "#60a5fa",
        marginBottom: "10px",
    },
    subtitle: {
        color: "#94a3b8",
        fontSize: "16px",
        marginBottom: "40px",
        lineHeight: "1.6",
    },
    card: {
        background: "#1e293b",
        borderRadius: "12px",
        padding: "40px",
        marginBottom: "30px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.25)",
    },
    cardTitle: {
        fontSize: "24px",
        marginBottom: "10px",
    },
    cardText: {
        color: "#94a3b8",
        marginBottom: "25px",
        lineHeight: "1.6",
    },
    button: {
        padding: "14px 40px",
        background: "#1e239b",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "18px",
        fontWeight: "bold",
        cursor: "pointer",
    },
    features: {
        display: "flex",
        gap: "10px",
        justifyContent: "center",
        flexWrap: "wrap",
        marginBottom: "30px",
    },
    feature: {
        background: "#1e293b",
        padding: "8px 16px",
        borderRadius: "20px",
        fontSize: "14px",
        color: "#94a3b8",
    },
    footer: {
        color: "#94a3b8",
        fontSize: "14px",
    },
    link: {
        color: "#60a5fa",
        cursor: "pointer",
    },
};