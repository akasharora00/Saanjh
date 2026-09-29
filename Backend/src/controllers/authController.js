import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import User from "../models/User.js";
import generateOTP from "../utils/generateOTP.js";
import { sendOTPEmail, sendFacultyCredentialsEmail } from "../services/emailService.js";

export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail.endsWith("@chitkarauniversity.edu.in")) {
      return res.status(400).json({
        message: "Only Chitkara University email is allowed",
      });
    }

    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    let user = await User.findOne({ email: normalizedEmail });

    if (user) {
      user.otpHash = otpHash;
      user.otpExpiry = otpExpiry;
      user.isVerified = false;
    } else {
      user = new User({
        name: "Temp User",
        email: normalizedEmail,
        password: "Temp@123",
        role: "student",
        department: "CSE",
        semester: 1,
        phone: "",
        isVerified: false,
        otpHash,
        otpExpiry,
      });
    }

    await user.save();
    console.log(`[OTP Verification] Generated OTP for ${normalizedEmail}: ${otp}`);
    await sendOTPEmail(normalizedEmail, otp);

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        message: "Please request OTP first",
      });
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    const isMatch = await bcrypt.compare(otp, user.otpHash);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    user.isVerified = true;
    user.otpHash = undefined;
    user.otpExpiry = undefined;

    await user.save();

    return res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, password, department, semester, phone } = req.body;

    if (!name || !email || !password || !department || !semester) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        message: "Please verify your email first",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email first",
      });
    }

    if (user.name !== "Temp User") {
      return res.status(400).json({
        message: "Account already exists",
      });
    }

    user.name = name;
    user.password = password; // pre-save hook will hash cleanly
    user.department = department;
    user.semester = Number(semester);
    user.phone = phone || "";
    user.role = "student";

    await user.save();

    const token = generateToken(user._id);

    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    };

    res.cookie("token", token, cookieOptions);

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.otpHash;

    return res.status(201).json({
      message: "Registration Successful",
      user: userObj,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const registerUser = register;

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (user.role === "student" && !user.isVerified) {
      return res.status(400).json({
        message: "Please verify your email first",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = generateToken(user._id);

    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    };

    res.cookie("token", token, cookieOptions);

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.otpHash;

    return res.status(200).json({
      message: "Login Successful",
      user: userObj,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getCurrentUser = async (req, res) => {
  const userObj = req.user ? req.user.toObject() : null;
  if (userObj) {
    delete userObj.password;
    delete userObj.otpHash;
  }
  res.status(200).json({
    user: userObj,
  });
};

export const logoutUser = async (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
    };

    res.clearCookie("token", cookieOptions);

    return res.status(200).json({
      message: "Logout Successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long" });
    }
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid temporary or current password" });
    }
    user.password = newPassword;
    user.mustChangePassword = false;
    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.otpHash;

    return res.status(200).json({
      message: "Password changed successfully",
      user: userObj,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

// ================= FORGOT PASSWORD WORKFLOW ================= //

export const forgotPasswordSendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "No registered account found with this email" });
    }

    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    user.otpHash = otpHash;
    user.otpExpiry = otpExpiry;
    await user.save();

    console.log(`[Forgot Password OTP] Generated OTP for ${normalizedEmail}: ${otp}`);
    await sendOTPEmail(normalizedEmail, otp);

    return res.status(200).json({
      message: "Password reset OTP sent to your email successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const forgotPasswordVerifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    const isMatch = await bcrypt.compare(otp, user.otpHash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    return res.status(200).json({
      message: "OTP verified successfully. You can now reset your password.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const forgotPasswordReset = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otpExpiry || user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP session expired. Please request a new OTP." });
    }

    const isMatch = await bcrypt.compare(otp, user.otpHash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    user.password = newPassword; // pre-save hook will hash
    user.otpHash = undefined;
    user.otpExpiry = undefined;

    await user.save();

    return res.status(200).json({
      message: "Password reset successful. Please log in with your new password.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createFaculty = async (req, res) => {
  try {
    const { name, email, department } = req.body;
    if (!name || !email || !department) {
      return res.status(400).json({ message: "Name, email, and department are required" });
    }
    const normalizedEmail = email.toLowerCase().trim();
    if (!normalizedEmail.endsWith("@chitkarauniversity.edu.in")) {
      return res.status(400).json({ message: "Only Chitkara University email is allowed" });
    }
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }
    const tempPassword = `Faculty@${Math.floor(1000 + Math.random() * 9000)}`;
    const faculty = new User({
      name,
      email: normalizedEmail,
      password: tempPassword,
      role: "faculty",
      department,
      isVerified: true,
      mustChangePassword: true,
    });
    await faculty.save();

    console.log(`[Faculty Creation] Temporary credentials generated for ${normalizedEmail}. Temp password: ${tempPassword}`);

    try {
      await sendFacultyCredentialsEmail(normalizedEmail, tempPassword);
    } catch (emailErr) {
      console.error("Failed to send faculty email:", emailErr);
    }

    return res.status(201).json({
      message: "Faculty created successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getFaculties = async (req, res) => {
  try {
    const faculties = await User.find({ role: "faculty" }).select("-password -otpHash");
    return res.status(200).json({ faculties });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password -otpHash");
    return res.status(200).json({ students });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update fields
    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.department = req.body.department || user.department;

    if (user.role === "student") {
      user.semester =
        req.body.semester !== undefined ?
        Number(req.body.semester) :
        user.semester;
    }

    // Update password if provided
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({
          message: "Password must be at least 6 characters long",
        });
      }
      user.password = req.body.password;
    }

    // Save profile picture file url if present
    if (req.file) {
      user.profilePic = req.file.path.replace(/\\/g, "/");
    }

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.otpHash;

    res.status(200).json({
      message: "Profile updated successfully",
      user: userObj,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
