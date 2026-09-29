import fs from "fs";
import path from "path";

/**
 * Returns a writable upload destination path.
 * On Vercel (serverless environment), local directories are read-only except /tmp.
 */
export const getUploadDestination = (subDir = "") => {
  const baseDir = process.env.VERCEL ? "/tmp/uploads" : "uploads";
  const targetDir = path.join(baseDir, subDir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  return targetDir;
};
