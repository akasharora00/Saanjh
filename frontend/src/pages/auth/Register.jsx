import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, AlertCircle, CheckCircle2, Phone } from "lucide-react";
import { sendOTP, verifyOTP, registerStudent } from "../../api/authApi";
import AuthLayout from "../../components/auth/AuthLayout";
import InputField from "../../components/auth/InputField";
import PasswordInput from "../../components/auth/PasswordInput";
import OTPInput from "../../components/common/OTPInput";
import { DEPARTMENTS } from "../../constants/departments";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Details

  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    password: "",
    confirmPassword: "",
    department: "CSE",
    semester: "1",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // STEP 1: Send OTP
  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    setError("");

    if (!email) return setError("University email is required.");
    if (!email.endsWith("@chitkarauniversity.edu.in")) {
      return setError("Only Chitkara University emails (@chitkarauniversity.edu.in) are allowed.");
    }

    try {
      setLoading(true);
      await sendOTP(email);
      setSuccess("OTP sent successfully to your university email.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP.");
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
      await verifyOTP(email, code);
      setSuccess("OTP verified! Fill in your student profile details.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Complete Registration
  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) return setError("Full Name is required.");
    if (!formData.password) return setError("Password is required.");
    if (formData.password.length < 6) return setError("Password must be at least 6 characters.");
    if (formData.password !== formData.confirmPassword) return setError("Passwords do not match.");

    try {
      setLoading(true);
      await registerStudent({
        name: formData.name,
        email,
        password: formData.password,
        department: formData.department,
        semester: Number(formData.semester),
        phone: formData.phone,
      });

      setSuccess("Registration Successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Student Registration"
      subtitle="Verify your Chitkara University email to create your account."
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
            <span>3. Details</span>
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

        {/* STEP 1: Email Form */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <InputField
              label="University Email"
              icon={Mail}
              type="email"
              name="email"
              placeholder="you@chitkarauniversity.edu.in"
              value={email}
              onChange={(e) => {
                setError("");
                setEmail(e.target.value);
              }}
            />
            <p className="text-[11px] text-slate-500 font-medium">
              Must end with @chitkarauniversity.edu.in
            </p>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold shadow-lg shadow-blue-500/25 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-sm"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2: OTP Verification */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center text-xs text-slate-400 font-medium">
              Enter the code sent to <strong className="text-slate-200">{email}</strong>
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

        {/* STEP 3: Student Details */}
        {step === 3 && (
          <form onSubmit={handleCompleteRegistration} className="space-y-4">
            <InputField
              label="Full Name"
              icon={User}
              name="name"
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={handleChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full border border-slate-800 bg-slate-950/40 rounded-xl p-3 text-slate-200 outline-none transition focus:border-blue-500 cursor-pointer text-sm font-semibold"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.value} value={dept.value} className="bg-[#0F172A]">
                      {dept.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Semester
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full border border-slate-800 bg-slate-950/40 rounded-xl p-3 text-slate-200 outline-none transition focus:border-blue-500 cursor-pointer text-sm font-semibold"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem} className="bg-[#0F172A]">
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <InputField
              label="Phone Number"
              icon={Phone}
              name="phone"
              placeholder="Phone number"
              value={formData.phone}
              onChange={handleChange}
            />

            <PasswordInput
              label="Password"
              name="password"
              placeholder="Create password (min 6 chars)"
              value={formData.password}
              onChange={handleChange}
            />

            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold shadow-lg shadow-blue-500/25 transition duration-200 cursor-pointer text-sm"
            >
              {loading ? "Completing..." : "Complete Registration"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-slate-400 pt-2 border-t border-slate-800">
          Already registered?{" "}
          <Link to="/login" className="text-blue-500 font-bold hover:text-blue-400 transition-colors">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
