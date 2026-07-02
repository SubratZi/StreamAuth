import { useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Subscribe() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const token = localStorage.getItem("access_token");

    const [step, setStep] = useState(1);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        card: "",
        expiry: "",
        cvv: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpgrade = async () => {
        setSubmitting(true);
        setError("");
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/users/upgrade`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await response.json();
            if (!response.ok) {
                setError(data.detail || "Upgrade failed!");
            } else {
                setSuccess(true);
                setTimeout(() => navigate("/profile"), 2000);
            }
        } catch (err) {
            setError("Server error, try again!");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={styles.center}><h2>Loading...</h2></div>;
    if (user?.is_paid) return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.center}>
                <div style={styles.card}>
                    <h2>You're already a paid user! </h2>
                    <button style={styles.button} onClick={() => navigate("/home")}>
                        Go Home
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.card}>

                    {/* Plan Info */}
                    <div style={styles.planBanner}>
                        <h2 style={styles.planTitle}> Upgrade to Paid</h2>
                        <p style={styles.planSubtitle}>Unlock premium streaming features</p>
                        <div style={styles.features}>
                            <p> 4 concurrent devices</p>
                            <p> 5GB bandwidth/month</p>
                            <p> 100 requests/minute</p>
                            <p> Priority support</p>
                        </div>
                        <p style={styles.price}>$9.99 / month</p>
                    </div>

                    {/* Step Indicator */}
                    <div style={styles.steps}>
                        <span style={{ ...styles.step, background: step >= 1 ? "#1e239b" : "#334155" }}>1. Personal</span>
                        <span style={styles.stepDivider}>→</span>
                        <span style={{ ...styles.step, background: step >= 2 ? "#1e239b" : "#334155" }}>2. Payment</span>
                        <span style={styles.stepDivider}>→</span>
                        <span style={{ ...styles.step, background: step >= 3 ? "#1e239b" : "#334155" }}>3. Confirm</span>
                    </div>

                    {success ? (
                        <div style={styles.success}>
                            <h3>🎉 Upgrade Successful!</h3>
                            <p>Redirecting to profile...</p>
                        </div>
                    ) : (
                        <>
                            {/* Step 1 - Personal Info */}
                            {step === 1 && (
                                <div style={styles.stepContent}>
                                    <h3 style={styles.stepTitle}>Personal Information</h3>
                                    <input style={styles.input} name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
                                    <input style={styles.input} name="email" placeholder="Email Address" value={form.email} onChange={handleChange} />
                                    <input style={styles.input} name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
                                    <button style={styles.button} onClick={() => setStep(2)} disabled={!form.name || !form.email}>
                                        Next →
                                    </button>
                                </div>
                            )}

                            {/* Step 2 - Payment */}
                            {step === 2 && (
                                <div style={styles.stepContent}>
                                    <h3 style={styles.stepTitle}>Payment Details</h3>
                                    <p style={styles.demoNote}> Demo only — no real payment processed</p>
                                    <input style={styles.input} name="card" placeholder="Card Number (demo)" value={form.card} onChange={handleChange} maxLength={16} />
                                    <div style={styles.row}>
                                        <input style={{ ...styles.input, width: "48%" }} name="expiry" placeholder="MM/YY" value={form.expiry} onChange={handleChange} />
                                        <input style={{ ...styles.input, width: "48%" }} name="cvv" placeholder="CVV" value={form.cvv} onChange={handleChange} maxLength={3} />
                                    </div>
                                    <div style={styles.rowButtons}>
                                        <button style={styles.backButton} onClick={() => setStep(1)}>← Back</button>
                                        <button style={styles.button} onClick={() => setStep(3)} disabled={!form.card || !form.expiry || !form.cvv}>
                                            Next →
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3 - Confirm */}
                            {step === 3 && (
                                <div style={styles.stepContent}>
                                    <h3 style={styles.stepTitle}>Confirm Subscription</h3>
                                    <div style={styles.summary}>
                                        <div style={styles.summaryRow}><span>Name</span><strong>{form.name}</strong></div>
                                        <div style={styles.summaryRow}><span>Email</span><strong>{form.email}</strong></div>
                                        <div style={styles.summaryRow}><span>Card</span><strong>**** **** **** {form.card.slice(-4)}</strong></div>
                                        <div style={styles.summaryRow}><span>Plan</span><strong>Paid — $9.99/mo</strong></div>
                                    </div>
                                    {error && <p style={styles.error}>{error}</p>}
                                    <div style={styles.rowButtons}>
                                        <button style={styles.backButton} onClick={() => setStep(2)}>← Back</button>
                                        <button style={styles.button} onClick={handleUpgrade} disabled={submitting}>
                                            {submitting ? "Processing..." : "Confirm & Upgrade 👑"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: { minHeight: "100vh", background: "#0f172a", color: "white" },
    container: { padding: "40px", display: "flex", justifyContent: "center" },
    center: { minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" },
    card: { background: "#1e293b", borderRadius: "12px", padding: "40px", width: "100%", maxWidth: "500px", boxShadow: "0 5px 15px rgba(0,0,0,0.25)" },
    planBanner: { background: "#0f172a", borderRadius: "10px", padding: "20px", marginBottom: "25px", textAlign: "center" },
    planTitle: { fontSize: "24px", marginBottom: "5px" },
    planSubtitle: { color: "#94a3b8", marginBottom: "15px" },
    features: { color: "#94a3b8", fontSize: "14px", marginBottom: "10px", textAlign: "left" },
    price: { fontSize: "28px", fontWeight: "bold", color: "#60a5fa" },
    steps: { display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "25px" },
    step: { padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: "bold" },
    stepDivider: { color: "#475569" },
    stepContent: { display: "flex", flexDirection: "column", gap: "15px" },
    stepTitle: { fontSize: "18px", marginBottom: "5px" },
    input: { padding: "12px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "white", fontSize: "14px", width: "100%", boxSizing: "border-box" },
    button: { padding: "12px", background: "#1e239b", color: "white", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "bold", cursor: "pointer" },
    backButton: { padding: "12px", background: "#334155", color: "white", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: "bold", cursor: "pointer" },
    row: { display: "flex", gap: "10px" },
    rowButtons: { display: "flex", gap: "10px" },
    summary: { background: "#0f172a", borderRadius: "8px", padding: "15px", marginBottom: "10px" },
    summaryRow: { display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #1e293b", color: "#94a3b8" },
    demoNote: { color: "#f59e0b", fontSize: "13px", margin: "0" },
    error: { color: "#f87171", fontSize: "14px" },
    success: { textAlign: "center", padding: "20px" },
};