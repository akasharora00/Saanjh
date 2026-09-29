import multer from "multer";
import path from "path";
import { getUploadDestination } from "../utils/uploadHelper.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = getUploadDestination("broadcast");
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG and WEBP images are allowed."), false);
  }
};

const broadcastUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default broadcastUpload;
