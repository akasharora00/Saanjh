import multer from "multer";
import path from "path";
import { getUploadDestination } from "../utils/uploadHelper.js";

// Storage configuration
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    const uploadDir = getUploadDestination("");
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {

    const uniqueName =
      Date.now() + path.extname(file.originalname);

    cb(null, uniqueName);

  },

});

// Accept only PDF files
const fileFilter = (req, file, cb) => {

  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed."), false);
  }

};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;