import { useEffect, useState, useRef } from "react";
import api from "../api/axios";

export default function VideoPlayer({ videoID }) {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const videoRef = useRef(null);

    useEffect(() => {
        const loadVideo = async () => {
            try {
                const res = await api.get(`/videos/${videoID}/stream-token`);
                const { token } = res.data;

                if (videoRef.current) {
                    videoRef.current.src = `${import.meta.env.VITE_API_URL}/videos/${videoID}?token=${token}`;
                }
                setLoading(false);
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
                setLoading(false);
            }
        };

        if (videoID) loadVideo();
    }, [videoID]);

    return (
        <div style={styles.container}>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {loading && <p style={{ color: "white" }}>Loading...</p>}
            {!error && (
                <video
                    ref={videoRef}
                    controls
                    style={styles.video}
                />
            )}
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