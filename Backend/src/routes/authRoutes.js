import express from "express";
import {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    updateProfile
} from "../controllers/authController.js";

import protect from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/roleMiddleware.js";
import imageUpload from "../middlewares/imageUploadMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getCurrentUser);
router.post("/logout", protect, logoutUser);
router.put("/profile", protect, imageUpload.single("profilePic"), updateProfile);
router.get(
    "/admin-test",
    protect,
    authorize("admin"),
    (req, res) => {

        res.json({
            message: "Welcome Admin"
        });

    }
);

export default router;