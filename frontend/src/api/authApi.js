import api from "./axios";

export const registerUser = (userData) => {
    return api.post("/auth/register", userData);
};

export const loginUser = (userData) => {
    return api.post("/auth/login", userData);
};

export const getCurrentUser = () => {
    return api.get("/auth/me");
};

export const logoutUser = () => {
    return api.post("/auth/logout");
};