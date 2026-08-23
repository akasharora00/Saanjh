import mongoose from "mongoose";
import User from "../models/User.js";

const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: "admin" });
        if (!adminExists) {
            console.log("No Administrator account found in database. Seeding default Admin...");
            const admin = new User({
                name: "System Administrator",
                email: "admin@chitkarauniversity.edu.in",
                password: "Admin@123",
                role: "admin",
                department: "CSE",
                semester: 1,
                phone: "9999999999",
                isVerified: true,
            });
            await admin.save();
            console.log("Default Admin seeded successfully ✅ (email: admin@chitkarauniversity.edu.in, password: Admin@123)");
        } else {
            console.log("Admin account already exists in database.");
        }
    } catch (err) {
        console.error("Failed to seed default Admin:", err.message);
    }
};

const connectDB = async () => {
    const options = {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4, // Force IPv4 resolution to prevent ECONNRESET
    };

    console.log("Mongo URI exists:", !!process.env.MONGO_URI);

    let connectionURI = process.env.MONGO_URI;
    if (connectionURI && connectionURI.includes(".mongodb.net/")) {
        const parts = connectionURI.split(".mongodb.net/");
        if (parts[1] && (parts[1].startsWith("?") || parts[1].trim() === "")) {
            connectionURI = connectionURI.replace(".mongodb.net/", ".mongodb.net/unisphere");
            console.log("Database path missing. Appended default '/unisphere' to Atlas connection string.");
        }
    }

    try {
        console.log("Connecting to MongoDB Atlas...");
        if (!connectionURI) {
            throw new Error("MONGO_URI is undefined");
        }
        await mongoose.connect(connectionURI, options);
        console.log("MongoDB Connected to Atlas ✅");
        await seedAdmin();
    } catch (error) {
        console.error("MongoDB Atlas Connection Failed ❌. Reason:", error.message);
        
        const localURI = "mongodb://127.0.0.1:27017/unisphere";
        console.log(`Attempting fallback to local MongoDB instance: ${localURI}...`);
        try {
            await mongoose.connect(localURI, options);
            console.log("MongoDB Connected to Local Instance ✅ (Fallback Active)");
            await seedAdmin();
        } catch (localError) {
            console.error("Local MongoDB Connection Failed as well ❌. Reason:", localError.message);
            console.error(
                "\n⚠️  DIAGNOSTIC NOTE: If you are on a restricted campus network (like Chitkara University Wi-Fi), outbound traffic on port 27017 to MongoDB Atlas is blocked by the campus firewall. To resolve this:\n" +
                "1. Switch to a mobile hotspot or connect via a VPN to bypass port restrictions.\n" +
                "2. Install MongoDB Community Server locally and ensure the local service is running on port 27017.\n"
            );
            throw new Error("MongoDB Connection Failed: " + error.message + " / Local fallback failed: " + localError.message);
        }
    }
};

export default connectDB;