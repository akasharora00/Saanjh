import express from "express";
import protect from "../middlewares/authMiddleware.js";
import lostFoundUpload from "../middlewares/lostFoundUpload.js";
import {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
  claimItem,
  resolveReport,
} from "../controllers/lostFoundController.js";

const router = express.Router();

router.post("/", protect, lostFoundUpload.array("images", 3), createReport);
router.get("/", protect, getAllReports);
router.get("/:id", protect, getReportById);
router.patch("/:id", protect, lostFoundUpload.array("images", 3), updateReport);
router.delete("/:id", protect, deleteReport);
router.patch("/:id/claim", protect, claimItem);
router.patch("/:id/resolve", protect, resolveReport);

export default router;
