import app from "../src/app.js";
import connectDB from "../src/config/db.js";
import dns from "node:dns";

// Set IPv4 as the default DNS resolution result order for MongoDB Atlas compatibility
dns.setDefaultResultOrder("ipv4first");

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
