import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

/**
 * Uploads a single file or array of files to Cloudinary if configured.
 * Falls back seamlessly to local relative path if Cloudinary env vars are omitted.
 *
 * @param {Object|Object[]} fileOrFiles - Single file or array of files from Multer
 * @param {string} folder - Destination subfolder name in Cloudinary
 * @returns {Promise<string|string[]>} - Persistent HTTPS URL(s) or local path(s)
 */
export const uploadToCloudinary = async (fileOrFiles, folder = "general") => {
  if (!fileOrFiles) return Array.isArray(fileOrFiles) ? [] : "";

  const uploadSingle = async (file) => {
    if (!file) return "";

    const localPath = file.path ? file.path.replace(/\\/g, "/") : "";

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // If Cloudinary keys are missing in environment variables, fallback to local path
    if (!cloudName || !apiKey || !apiSecret) {
      console.warn(`[Cloudinary Notice]: Missing Cloudinary env variables. Storing local path: ${localPath}`);
      return localPath;
    }

    // Configure Cloudinary dynamically on every invocation
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    try {
      const isPdf = file.mimetype === "application/pdf" || file.originalname?.endsWith(".pdf");
      const resourceType = isPdf ? "raw" : "auto";

      const result = await cloudinary.uploader.upload(file.path, {
        folder: `unisphere/${folder}`,
        resource_type: resourceType,
      });

      // Cleanup local temp file after uploading to Cloudinary
      if (fs.existsSync(file.path)) {
        try {
          fs.unlinkSync(file.path);
        } catch (unlinkErr) {
          console.warn("Failed to remove temp file:", unlinkErr.message);
        }
      }

      return result.secure_url;
    } catch (error) {
      console.error(`Cloudinary upload failed for [${folder}]:`, error.message);
      return localPath;
    }
  };

  if (Array.isArray(fileOrFiles)) {
    const uploadPromises = fileOrFiles.map((file) => uploadSingle(file));
    return await Promise.all(uploadPromises);
  }

  return await uploadSingle(fileOrFiles);
};
