import express from "express";
import protect from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/roleMiddleware.js";
import broadcastUpload from "../middlewares/broadcastUpload.js";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  createComment,
  replyToComment,
  updateComment,
  deleteComment,
} from "../controllers/broadcastController.js";

const router = express.Router();

// Post CRUD
router.post("/", protect, authorize("student"), broadcastUpload.single("attachment"), createPost);
router.get("/", protect, getAllPosts);
router.get("/:id", protect, getPostById);
router.patch("/:id", protect, authorize("student"), broadcastUpload.single("attachment"), updatePost);
router.delete("/:id", protect, authorize("student"), deletePost);

// Comments
router.post("/:id/comments", protect, authorize("student"), createComment);
router.post("/comments/:commentId/reply", protect, authorize("student"), replyToComment);
router.patch("/comments/:commentId", protect, authorize("student"), updateComment);
router.delete("/comments/:commentId", protect, authorize("student"), deleteComment);

export default router;
