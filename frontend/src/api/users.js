import api from "./axios";

// current-logged in users:

export const getCurrentUser = async() => {
    const response = await api.get("/users/me");
    return response.data;
};
