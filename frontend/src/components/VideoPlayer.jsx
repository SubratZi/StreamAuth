import { useEffect, useState } from "react";
import api from "../api/axios";

export default function VideoPlayer({ videoID }) {
    const [videoUrl, setVideoUrl] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadVideo = async () => {
            try {
                const response = await api.get(`/videos/${videoID}`, {
                    responseType: "blob",
                });

                const blob = new Blob([response.data], {
                    type: "video/mp4",
                });

                const url = URL.createObjectURL(blob);
                setVideoUrl(url);
            } catch (err) {
                setError(
                    err?.response?.data?.detail || "Failed to load video"
                );
            }
        };

        if (videoID) loadVideo();
    }, [videoID]);

    return (
        <div style={styles.container}>
            {error && <p style={{ color: "red" }}>{error}</p>}

            {videoUrl ? (
                <video controls style={styles.video} src={videoUrl} />
            ) : (
                <p>Loading video...</p>
            )}
        </div>
    );
}

const styles = {
    container: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
    },
    video: {
        maxWidth: "1000px",
        borderRadius: "12px",
        background: "black",
    },
};