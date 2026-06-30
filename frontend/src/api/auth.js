import api from "./axios";

// For New User
export const registerUser = async (userData)=> {
    const response = await api.post("auth/register",userData)
    return response.data;
};

export const loginUser = async (username,password) => {
    const formData = new URLSearchParams();
    formData.append("username",username);
    formData.append("password", password);

    const response = await api.post(
        "/auth/login",
        formData,
        {
            headers:{
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );

    return response.data;
};

// For logging out:

export const logoutUser = async () => {
    const response = await api.post("/auth/logout");
    return response.data;
}