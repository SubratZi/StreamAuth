import { useState,useEffect } from "react";
import Navbar from "../components/Navbar";
import VideoCard from "../components/VideoCard";
import { getVideos } from "../api/videos";

export default function Home(){
    const[videos, setVideos] = useState([]);
    const[loading, setLoading] = useState(true);
    const[error, setError] = useState("");

    useEffect(() => {
        loadVideos();
    }, []);

    const loadVideos = async() => {
        try{
            const data =await getVideos();
            setVideos(data);
        }catch(err){
            setError(
                err?.response?.data?.detail ||
                "Failed to load videos!"
            );
        }finally{
            setLoading(false);
        }
    };
    return(
        <div style={styles.page}>
            <Navbar/>
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

                {!loading && videos.length === 0 &&(
                    <p>No videos uploaded yet.</p>
                )}
                <div style={styles.grid}>
                    {videos.map((video) => (
                        <VideoCard
                        key={video.id}
                        video={video}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    page:{
        minHeight:"100vh",
        background:"#0f172a",
        color:"white",
    },
    container:{
        padding:"40px",
    },
    heading:{
        marginBottom:"30px",
    },
    grid:{
        display:"grid",
        gridTemplateColoumns:"repeat(auto-fill, minmax(260px,1fr))",
        gap:"25px",
    },
    error:{
        color:"#ef4444"
    }
}