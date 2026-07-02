import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function VideoCard({ video, onDelete }) {
    const { user } = useAuth();
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setDeleting(true);

        try {
            await onDelete(video.id);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div style={styles.wrapper}>
            <Link to={`/video/${video.id}`} style={styles.link}>
                <div style={styles.card}>
                    <div style={styles.thumbnail}>
                        🎬
                    </div>

                    <h3 style={styles.title}>
                        {video.title}
                    </h3>

                    <p style={styles.owner}>
                        Uploaded by admin #{video.owner_id}
                    </p>
                </div>
            </Link>

            {user?.roles === "admin" && (
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    style={styles.deleteButton}
                >
                    {deleting ? "Deleting..." : "🗑 Delete"}
                </button>
            )}
        </div>
    );
}

const styles = {
    wrapper: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },

    link: {
        textDecoration: "none",
        color: "inherit",
    },

    card: {
        background: "#1e239b",
        borderRadius: "12px",
        padding: "20px",
        cursor: "pointer",
        transition: "0.2s",
        color: "white",
        boxShadow: "0 5px 15px rgba(0,0,0,.25)",
    },

    thumbnail: {
        height: "180px",
        background: "#331455",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "50px",
        marginBottom: "15px",
    },

    title: {
        margin: "0",
        marginBottom: "10px",
        color: "white",
    },

    owner: {
        color: "#94a3b8",
        fontSize: "14px",
    },

    deleteButton: {
        background: "#ef4444",
        color: "white",
        border: "none",
        borderRadius: "8px",
        padding: "10px",
        cursor: "pointer",
        fontWeight: "bold",
    },
};