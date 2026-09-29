import multer from "multer";
import path from "path";
import { getUploadDestination } from "../utils/uploadHelper.js";

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = getUploadDestination("events");
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// File validation filter for fields
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "poster") {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG and WEBP images are allowed for the event poster."), false);
    }
  } else if (file.fieldname === "circular") {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed for the event circular."), false);
    }
  } else {
    cb(new Error("Unexpected file upload field."), false);
  }
};

const eventPosterUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export default eventPosterUpload;
