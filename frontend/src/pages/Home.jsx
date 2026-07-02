import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import VideoCard from "../components/VideoCard";
import { getVideos, deleteVideo } from "../api/videos";

export default function Home() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadVideos();
    }, []);

    const loadVideos = async () => {
        try {
            setLoading(true);

            const data = await getVideos();
            setVideos(data);
        } catch (err) {
            setError(
                err?.response?.data?.detail ||
                "Failed to load videos!"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (videoId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this video?"
        );

        if (!confirmed) return;

        try {
            await deleteVideo(videoId);

            setVideos((prevVideos) =>
                prevVideos.filter((video) => video.id !== videoId)
            );
        } catch (err) {
            alert(
                err?.response?.data?.detail ||
                "Failed to delete video."
            );
        }
    };

    return (
        <div style={styles.page}>
            <Navbar />

            <div style={styles.container}>
                <h1 style={styles.heading}>
                    Available Videos
                </h1>

                {loading && (
                    <p>Loading videos...</p>
                )}

                {error && (
                    <p style={styles.error}>{error}</p>
                )}

                {!loading && videos.length === 0 && (
                    <p>No videos uploaded yet.</p>
                )}

                <div style={styles.grid}>
                    {videos.map((video) => (
                        <VideoCard
                            key={video.id}
                            video={video}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
    },

    container: {
        padding: "40px",
    },

    heading: {
        marginBottom: "30px",
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px,1fr))",
        gap: "25px",
    },

    error: {
        color: "#ef4444",
    },
};