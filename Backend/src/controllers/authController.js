import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    // Get data from frontend
    const { name, email, password, role, department, semester, phone } = req.body;

    // Check if all required fields are present
    if (!name || !email || !password || !department) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // Check whether user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user in database
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      department,
      semester,
      phone,
    });

    await user.save();

    // Generate JWT Token
    const token = generateToken(user._id);

    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    // Send response
    res.status(201).json({
      message: "Registration Successful",
      user,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {

    // Step 1 : Get Data
    const { email, password } = req.body;

    // Step 2 : Check Empty Fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // Step 3 : Find User
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    // Step 4 : Compare Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    // Step 5 : Generate Token
    const token = generateToken(user._id);

    // Step 6 : Store Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    // Step 7 : Response
    res.status(200).json({
      message: "Login Successful",
      user,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getCurrentUser = async (req, res) => {

    res.status(200).json({
        user: req.user,
    });

};

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        });

        res.status(200).json({
            message: "Logout Successful",
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Server Error",
        });
    }
};

