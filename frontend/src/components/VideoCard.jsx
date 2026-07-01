import { Link } from "react-router-dom";

export default function VideoCard({ video }){
    return(
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
    );
}

const styles = {
    link:{
        textDecoration:"none",
        color:"inherit",
    },

    card:{
        background:"#1e239b",
        borderRadius:"12px",
        padding:"20px",
        cursor:"pointer",
        transition:"0.2s",
        color:"white",
        boxShadow:"0 5px 15px rgba(0,0,0,.25)",
    },
    thumbnail:{
        height:"180px",
        background:"#331455",
        borderRadius:"10px",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        fontSize:"50px",
        marginBottom:"15px",
    },

    title:{
        marginBottom:"10px",
        padding:"15px",
        margin:"0",
        color:"white",
    },
    owner:{
        color:"#93a3b8",
        fontSize:"14px",
        padding:"0",
        color:"#94a3b8",
        fontSize:"14px",
    },

};