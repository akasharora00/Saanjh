import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";
import { forgotPasswordSendOTP, forgotPasswordVerifyOTP, forgotPasswordReset } from "../../api/authApi";
import AuthLayout from "../../components/auth/AuthLayout";
import InputField from "../../components/auth/InputField";
import PasswordInput from "../../components/auth/PasswordInput";
import OTPInput from "../../components/common/OTPInput";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password

  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // STEP 1: Send Reset OTP
  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    setError("");

    if (!email) return setError("Registered Email is required.");

    try {
      setLoading(true);
      await forgotPasswordSendOTP(email);
      setSuccess("Reset OTP sent to your registered email.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset OTP.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOTP = async (codeToVerify) => {
    setError("");
    const code = codeToVerify || otpCode;
    if (!code || code.length < 6) {
      return setError("Please enter the complete 6-digit OTP.");
    }

    try {
      setLoading(true);
      await forgotPasswordVerifyOTP(email, code);
      setSuccess("OTP verified! Create your new password.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!newPassword) return setError("New password is required.");
    if (newPassword.length < 6) return setError("Password must be at least 6 characters long.");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");

    try {
      setLoading(true);
      await forgotPasswordReset(email, otpCode, newPassword);
      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Verify your email via OTP to reset your account password."
    >
      <div className="space-y-6">
        {/* Stepper Progress */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-xs font-bold">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? "text-blue-400" : "text-slate-600"}`}>
            <span>1. Email</span>
          </div>
          <div className={`w-6 h-0.5 ${step >= 2 ? "bg-blue-500" : "bg-slate-800"}`} />
          <div className={`flex items-center gap-1.5 ${step >= 2 ? "text-blue-400" : "text-slate-600"}`}>
            <span>2. OTP</span>
          </div>
          <div className={`w-6 h-0.5 ${step >= 3 ? "bg-blue-500" : "bg-slate-800"}`} />
          <div className={`flex items-center gap-1.5 ${step === 3 ? "text-blue-400" : "text-slate-600"}`}>
            <span>3. Reset</span>
          </div>
        </div>

        {/* Alerts */}
        {success && (
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-550/20 text-emerald-400 px-4 py-3 rounded-xl text-sm font-semibold animate-fadeIn">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>{success}</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-550/20 text-rose-400 px-4 py-3 rounded-xl text-sm font-semibold animate-fadeIn">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Email */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <InputField
              label="Registered Email"
              icon={Mail}
              type="email"
              name="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => {
                setError("");
                setEmail(e.target.value);
              }}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold shadow-lg shadow-blue-500/25 transition duration-200 cursor-pointer text-sm disabled:opacity-70"
            >
              {loading ? "Sending OTP..." : "Send Reset OTP"}
            </button>
          </form>
        )}

        {/* STEP 2: OTP */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center text-xs text-slate-400 font-medium">
              Enter the 6-digit code sent to <strong className="text-slate-200">{email}</strong>
            </div>

            <OTPInput
              onComplete={(code) => {
                setOtpCode(code);
                handleVerifyOTP(code);
              }}
              onResend={handleSendOTP}
              loading={loading}
            />

            <button
              type="button"
              onClick={() => handleVerifyOTP()}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold shadow-lg shadow-blue-500/25 transition duration-200 cursor-pointer text-sm"
            >
              {loading ? "Verifying OTP..." : "Verify OTP"}
            </button>
          </div>
        )}

        {/* STEP 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <PasswordInput
              label="New Password"
              name="newPassword"
              placeholder="Enter new password (min 6 chars)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <PasswordInput
              label="Confirm New Password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold shadow-lg shadow-blue-500/25 transition duration-200 cursor-pointer text-sm disabled:opacity-70"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-slate-400 pt-2 border-t border-slate-800">
          Remembered your password?{" "}
          <Link to="/login" className="text-blue-500 font-bold hover:text-blue-400 transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
