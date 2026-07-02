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
                const blob = new Blob([response.data], { type: "video/mp4" });
                const url = URL.createObjectURL(blob);
                setVideoUrl(url);
            } catch (err) {
                if (err?.response?.data instanceof Blob) {
                    const text = await err.response.data.text();
                    try {
                        const json = JSON.parse(text);
                        const detail = json?.detail;
                        setError(typeof detail === "object" ? detail?.message : detail || "Failed to load video");
                    } catch {
                        setError("Failed to load video");
                    }
                } else {
                    setError(err?.response?.data?.detail || "Failed to load video");
                }
            }
        };

        if (videoID) loadVideo();
    }, [videoID]);

    return (
        <div style={styles.container}>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!videoUrl && !error && <p style={{ color: "white" }}>Loading video... DOWNLOADING PLEASE WAIT</p>}
            {videoUrl && <video controls style={styles.video} src={videoUrl} />}
        </div>
    );
}

const styles = {
    container: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    video: {
        maxWidth: "1000px",
        width: "100%",
        borderRadius: "12px",
        background: "black",
    },
};