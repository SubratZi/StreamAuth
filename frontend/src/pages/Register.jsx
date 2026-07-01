import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const navigate = useNavigate();
    const { isAuthenticated, loading } = useAuth();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    if (loading) {
        return (
            <div
                style={{
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#0f172a",
                    color: "white",
                    fontSize: "20px",
                }}
            >
                Loading...
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setSubmitting(true);

        try {
            await registerUser({
                username,
                email,
                password,
            });

            setSuccess("Registration successful! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err) {
            setError(
                err?.response?.data?.detail ||
                "Registration failed."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.heading}>Create Account</h2>

                {error && <p style={styles.error}>{error}</p>}
                {success && <p style={styles.success}>{success}</p>}

                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={styles.input}
                    required
                />

                <button
                    type="submit"
                    disabled={submitting}
                    style={styles.button}
                >
                    {submitting ? "Creating Account..." : "Register"}
                </button>

                <p style={styles.footer}>
                    Already have an account?{" "}
                    <Link to="/login" style={styles.link}>
                        Login
                    </Link>
                </p>
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
        width: "350px",
        background: "#1e293b",
        borderRadius: "12px",
        boxShadow: "0 10px 30px rgba(0,0,0,.3)",
    },
    heading: {
        textAlign: "center",
    },
    input: {
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #334155",
        outline: "none",
        fontSize: "14px",
    },
    button: {
        padding: "12px",
        background: "#3b82f6",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        fontSize: "15px",
    },
    footer: {
        textAlign: "center",
        fontSize: "14px",
    },
    link: {
        color: "#60a5fa",
        textDecoration: "none",
    },
    error: {
        color: "#ef4444",
        textAlign: "center",
    },
    success: {
        color: "#22c55e",
        textAlign: "center",
    },
};