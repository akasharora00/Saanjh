import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import noteRoutes from "./routes/noteRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import path from "path";
import eventRoutes from "./routes/eventRoutes.js";

const app = express();

// Middlewares
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use( "/uploads", express.static(path.join(process.cwd(), "uploads")) );


app.use("/api/events", eventRoutes);
app.use("/uploads", express.static("uploads"));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(err.status || 500).json({
    message: err.message || "Server Error",
  });
});




export default app;