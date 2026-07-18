import express from "express";

import upload from "../middlewares/uploadMiddleware.js";
import protect from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/roleMiddleware.js";

import {
  uploadNote,
  getAllNotes,
  getMyNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from "../controllers/noteController.js";

const router = express.Router();

router.post(
  "/upload",
  protect,
  authorize("faculty"),
  upload.single("pdf"),
  uploadNote
);

router.get(
  "/my-notes",
  protect,
  authorize("faculty"),
  getMyNotes
);

router.get("/", protect, getAllNotes);
router.get("/:id", protect, getNoteById);
router.patch("/:id", protect, authorize("faculty", "admin"), updateNote);
router.delete("/:id", protect, authorize("faculty", "admin"), deleteNote);

export default router;