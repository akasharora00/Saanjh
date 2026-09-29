/**
 * Purpose:
 * Entry point for the UniSphere backend Node.js server.
 * 
 * Responsibilities:
 * - Loads environment variables from dotenv.
 * - Configures Node.js DNS resolution order (IPv4 first) for MongoDB Atlas SRV compatibility.
 * - Establishes MongoDB database connection via connectDB().
 * - Starts Express HTTP server listening on configured PORT (default: 5000).
 */

import "dotenv/config";
import dns from "node:dns";
import app from "./app.js";
import connectDB from "./config/db.js";

// Set IPv4 as the default DNS resolution result order for Node.js v17+ compatibility with Atlas
dns.setDefaultResultOrder("ipv4first");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server due to database connection error:", error);
        process.exit(1);
    }
};

startServer();