/**
 * Purpose:
 * Core Express application configuration file for UniSphere backend.
 * 
 * Responsibilities:
 * - Configures CORS middleware for frontend communication.
 * - Mounts body parsing (express.json) and cookie parsing (cookie-parser) middleware.
 * - Mounts static file serving for user uploads.
 * - Registers API routes: /api/auth, /api/notes, /api/events, /api/lost-found, /api/broadcast.
 * - Provides centralized global error handling middleware.
 */

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

// Route Imports
import authRoutes from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import lostFoundRoutes from "./routes/lostFoundRoutes.js";
import broadcastRoutes from "./routes/broadcastRoutes.js";

const app = express();

// Allowed Origins configuration for CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://localhost:80",
  "http://localhost",
];

if (process.env.CLIENT_URL) {
  const envOrigins = process.env.CLIENT_URL.split(",").map((url) => url.trim());
  envOrigins.forEach((origin) => {
    if (origin && !allowedOrigins.includes(origin)) {
      allowedOrigins.push(origin);
    }
  });
}

// Security & Parsing Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Static Uploads Directory (Support both local and Vercel serverless /tmp)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
if (process.env.VERCEL) {
  app.use("/uploads", express.static("/tmp/uploads"));
}

// API Route Mount Points
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/lost-found", lostFoundRoutes);
app.use("/api/broadcast", broadcastRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;