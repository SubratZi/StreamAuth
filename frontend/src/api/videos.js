import api from "./axios";

// all videos

export const getVideos = async () => {
    const response = await api.get("/videos");
    return response.data;
};

export const uploadVideo = async(file) => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await api.post(
        "/videos/upload",
        formData ,
        {headers:
            {
                "Content-Type": "multipart/form-data",
            },
    });

    return response.data;
};

// Streaming URL
export const getVideoStreamURL = (videoId) => {
    return `html://127.0.0.1:8000/videos/${videoId}`
};

// Delete video
export const deleteVideo = (videoId) =>{
    const response = await api.delete(`/videos/${videoId}`);
    return response.data;
}