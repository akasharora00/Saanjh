import api from "./axios";

export const sendOTP = (email) => {
  return api.post("/auth/send-otp", { email });
};

export const verifyOTP = (email, otp) => {
  return api.post("/auth/verify-otp", { email, otp });
};

export const registerStudent = (userData) => {
  return api.post("/auth/register", userData);
};

export const registerUser = registerStudent;

export const loginUser = (userData) => {
  return api.post("/auth/login", userData);
};

export const getCurrentUser = () => {
  return api.get("/auth/me");
};

export const logoutUser = () => {
  return api.post("/auth/logout");
};

export const updateProfile = (formData) => {
  return api.put("/auth/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const changePassword = (passwordData) => {
  return api.post("/auth/change-password", passwordData);
};

export const forgotPasswordSendOTP = (email) => {
  return api.post("/auth/forgot-password/send-otp", { email });
};

export const forgotPasswordVerifyOTP = (email, otp) => {
  return api.post("/auth/forgot-password/verify-otp", { email, otp });
};

export const forgotPasswordReset = (email, otp, newPassword) => {
  return api.post("/auth/forgot-password/reset", { email, otp, newPassword });
};

export const createFaculty = (facultyData) => {
  return api.post("/auth/create-faculty", facultyData);
};

export const getFaculties = () => {
  return api.get("/auth/faculties");
};

export const getStudents = () => {
  return api.get("/auth/students");
};