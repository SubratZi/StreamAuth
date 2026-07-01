import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { login, isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    if (loading) {
        return (
            <div style={styles.container}>
                <h2>Loading...</h2>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await login(username, password);
            navigate("/home", { replace: true });
        } catch (err) {
            setError(err?.response?.data?.detail || "Login failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2>Login</h2>

                {error && <p style={styles.error}>{error}</p>}

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />

                <p style={styles.footer}>
                    Don't have an account?{" "}
                    <Link to="/register" style={styles.link}>
                        Register
                    </Link>
                </p>

                <button
                    type="submit"
                    disabled={submitting}
                    style={styles.button}
                >
                    {submitting ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        color: "white",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        padding: "30px",
        background: "#1e293b",
        borderRadius: "12px",
        width: "320px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    },
    input: {
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #331455",
        outline: "none",
        fontSize: "14px",
    },
    button: {
        padding: "10px",
        background: "#3b82f6",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
    },
    error: {
        color: "red",
        fontSize: "14px",
    },
    footer: {
        textAlign: "center",
        fontSize: "14px",
    },
    link: {
        color: "#60a5fa",
        textDecoration: "none",
    },
};