import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import VideoPlayer from "../components/VideoPlayer";

export default function Video() {
    const { id } = useParams();

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.container}>
                <VideoPlayer videoID={id} />
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
};