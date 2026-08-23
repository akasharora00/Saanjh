import express from "express";
import protect from "../middlewares/authMiddleware.js";
import authorize from "../middlewares/roleMiddleware.js";
import eventPosterUpload from "../middlewares/eventPosterUpload.js";
import {
  createEvent,
  getAllEvents,
  getEventById,
  registerForEvent,
  getRegisteredStudents,
  deleteEvent,
  cancelRegistration,
  updateEvent,
} from "../controllers/eventController.js";

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("faculty", "admin"),
  eventPosterUpload.fields([
    { name: "poster", maxCount: 1 },
    { name: "circular", maxCount: 1 },
  ]),
  createEvent
);

router.patch(
  "/:id",
  protect,
  authorize("faculty", "admin"),
  eventPosterUpload.fields([
    { name: "poster", maxCount: 1 },
    { name: "circular", maxCount: 1 },
  ]),
  updateEvent
);

router.get("/", protect, getAllEvents);

router.get("/:id", protect, getEventById);

router.post(
  "/:id/register",
  protect,
  authorize("student"),
  registerForEvent
);

router.get(
  "/:id/students",
  protect,
  authorize("faculty", "admin"),
  getRegisteredStudents
);

router.delete(
  "/:id",
  protect,
  authorize("faculty", "admin"),
  deleteEvent
);

router.delete(
  "/:id/register",
  protect,
  authorize("student"),
  cancelRegistration
);


export default router;

// Client
//    │
//    ▼
// protect
//    │
//    ▼
// Is user logged in?
//    │
//    ▼
// authorizeRoles("faculty", "admin")
//    │
//    ▼
// Is user Faculty/Admin?
//    │
//    ▼
// createEvent()
//    │
//    ▼
// Event Saved in MongoDB