import { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Upload(){
    const token = localStorage.getItem("access_token");
    const navigate = useNavigate();
    const[file, setFile] = useState(null);
    const[uploading, setUploading] = useState(false);
    const[error, setError] = useState("");
    const[success, setSuccess] = useState("");

    const handleSubmit = async () =>{
        if (!file) return setError("Please select a File!");

        setUploading(true);
        setError("");
        setSuccess("");

        const formData = new FormData();
        formData.append("file", file);

        try{
            const response = await fetch (`${import.meta.env.VITE_API_URL}/videos/upload`,{
                method:"POST",
                headers:{Authorization: `Bearer ${token}`},
                body:formData,
            });
            const data =await response.json();

            if(!response.ok){
                setError(data.detail || "Upload failed!")
            }
            else{
                setSuccess("Video successfully uploaded! 🎬")
                setTimeout(() => navigate("/"), 2000);
            }
        }catch (err){
            setError("Server error, try again!")
        }finally{
            setUploading(false);
        }
    };

    return(
        <div style={styles.page}>
            <Navbar/>
            <div style= {styles.container}>
                <div style={styles.card}>
                    <h2 style={styles.title}>Upload Video 🎬</h2>
                    <div style={styles.dropzone}>
                        <input type ="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])}/>
                        {file?(
                            <p style={styles.fileName}> 📁 {file.name}</p>
                        ):(
                            <p style={styles.placeholder}> Click to select a video file</p>
                        )}
                    </div>
                    {error && <p style={styles.error}>{error}</p>}
                    {success && <p style={styles.success}>{success}</p>}

                    <button 
                        onClick={handleSubmit}
                        disabled={uploading || !file}
                        style={{
                            ...styles.button,
                            opacity:uploading || !file? 0.5 : 1,
                            cursor:uploading || !file? "not-allowed":"pointer",
                        }}
                    >
                        {uploading? "Uploading..." : "Upload Video"}
                    </button>
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
        display: "flex",
        justifyContent: "center",
    },
    card: {
        background: "#1e293b",
        borderRadius: "12px",
        padding: "40px",
        width: "100%",
        maxWidth: "500px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.25)",
    },
    title: {
        marginBottom: "30px",
        fontSize: "24px",
        textAlign: "center",
    },
    dropzone: {
        background: "#0f172a",
        border: "2px dashed #334155",
        borderRadius: "10px",
        padding: "40px",
        textAlign: "center",
        marginBottom: "20px",
        cursor: "pointer",
    },
    fileInput: {
        width: "100%",
        color: "white",
        marginBottom: "10px",
    },
    fileName: {
        color: "#94a3b8",
        fontSize: "14px",
        margin: "10px 0 0 0",
    },
    placeholder: {
        color: "#475569",
        margin: "10px 0 0 0",
    },
    button: {
        width: "100%",
        padding: "14px",
        background: "#1e239b",
        color: "white",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        fontWeight: "bold",
        marginTop: "10px",
    },
    error: {
        color: "#f87171",
        fontSize: "14px",
        marginBottom: "10px",
    },
    success: {
        color: "#4ade80",
        fontSize: "14px",
        marginBottom: "10px",
    },
};