import express from "express";
import {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser
} from "../controllers/authController.js";
import protect from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/roleMiddleware.js";
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getCurrentUser);
router.post("/logout", protect, logoutUser);
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