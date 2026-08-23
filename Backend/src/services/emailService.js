import nodemailer from "nodemailer";

const getTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendOTPEmail = async (email, otp) => {
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"UniSphere - Chitkara University" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your UniSphere Verification OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #ddd; border-radius:10px; background-color:#ffffff;">
            <h2 style="color:#2563eb;">Welcome to UniSphere 🎓</h2>
            <p>Your verification code is:</p>
            <h1 style="letter-spacing:8px; text-align:center; color:#2563eb; background:#f0f7ff; padding:15px; border-radius:8px;">
                ${otp}
            </h1>
            <p>This OTP is valid for <strong>5 minutes</strong>.</p>
            <p>If you didn't request this OTP, please ignore this email.</p>
            <hr style="border:none; border-top:1px solid #eee; margin:20px 0;">
            <p style="font-size:12px; color:gray;">UniSphere - Chitkara University</p>
        </div>
      `,
    });
    console.log("OTP Email Sent Successfully to", email);
  } catch (error) {
    console.error("Email Service Error (OTP):", error);
    throw new Error("Unable to send OTP email");
  }
};

export const sendFacultyCredentialsEmail = async (email, tempPassword) => {
  try {
    const transporter = getTransporter();
    await transporter.sendMail({
      from: `"UniSphere Admin Portal" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your UniSphere Faculty Account Credentials",
      html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; border:1px solid #ddd; border-radius:10px; background-color:#ffffff;">
            <h2 style="color:#2563eb;">Faculty Account Created 🎓</h2>
            <p>An administrator has created your UniSphere Faculty Portal account.</p>
            <div style="background:#f8fafc; padding:15px; border-radius:8px; border-left:4px solid #2563eb; margin:20px 0;">
              <p style="margin:5px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin:5px 0;"><strong>Temporary Password:</strong> <code style="background:#e2e8f0; padding:2px 6px; border-radius:4px; font-size:14px;">${tempPassword}</code></p>
            </div>
            <p style="color:#e11d48; font-size:13px; font-weight:bold;">Important: You will be required to change this temporary password on your first login.</p>
            <hr style="border:none; border-top:1px solid #eee; margin:20px 0;">
            <p style="font-size:12px; color:gray;">UniSphere University Portal - Chitkara University</p>
        </div>
      `,
    });
    console.log("Faculty Credentials Email Sent Successfully to", email);
  } catch (error) {
    console.error("Email Service Error (Faculty Credentials):", error);
    throw new Error("Unable to send Faculty credentials email");
  }
};
