import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
    try {

        // Step 1
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized"
            });
        }

        // Step 2
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Step 3
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        // Step 4
        req.user = user;

        next();

    } catch (error) {
        console.log(error);

        res.status(401).json({
            message: "Invalid Token"
        });
    }
};

export default protect;