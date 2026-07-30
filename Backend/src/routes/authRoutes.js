import express from "express";
import {
  sendOTP,
  verifyOTP,
  register,
  loginUser,
  getCurrentUser,
  logoutUser,
  updateProfile,
  changePassword,
  forgotPasswordSendOTP,
  forgotPasswordVerifyOTP,
  forgotPasswordReset,
  createFaculty,
  getFaculties,
  getStudents,
} from "../controllers/authController.js";

import protect from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/roleMiddleware.js";
import imageUpload from "../middlewares/imageUploadMiddleware.js";

const router = express.Router();

// Public Auth Routes
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/register", register);
router.post("/login", loginUser);

// Forgot Password Public Routes
router.post("/forgot-password/send-otp", forgotPasswordSendOTP);
router.post("/forgot-password/verify-otp", forgotPasswordVerifyOTP);
router.post("/forgot-password/reset", forgotPasswordReset);

// Protected Auth Routes
router.get("/me", protect, getCurrentUser);
router.post("/logout", protect, logoutUser);
router.put("/profile", protect, imageUpload.single("profilePic"), updateProfile);
router.post("/change-password", protect, changePassword);

// Admin Only Management Routes
router.post("/create-faculty", protect, authorize("admin"), createFaculty);
router.get("/faculties", protect, authorize("admin"), getFaculties);
router.get("/students", protect, authorize("admin"), getStudents);

export default router;