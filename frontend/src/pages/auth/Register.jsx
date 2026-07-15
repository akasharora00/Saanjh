import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import AuthLayout from "../../components/auth/AuthLayout";
import InputField from "../../components/auth/InputField";
import PasswordInput from "../../components/auth/PasswordInput";

const Register = () => {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    semester: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setError(""); // Clear error on change
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // General Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.name.trim()) {
      return setError("Full name is required.");
    }
    if (!formData.email) {
      return setError("Email is required.");
    }
    if (!emailRegex.test(formData.email)) {
      return setError("Please enter a valid email address.");
    }
    if (!formData.department) {
      return setError("Please select your department.");
    }
    if (role === "student" && !formData.semester) {
      return setError("Please select your current semester.");
    }
    if (!formData.password) {
      return setError("Password is required.");
    }
    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (!formData.agree) {
      return setError("You must agree to the Terms of Service.");
    }

    try {
      setLoading(true);
      
      // Construct registration payload
      const registerPayload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
        department: formData.department,
      };

      // Add semester for students
      if (role === "student") {
        registerPayload.semester = Number(formData.semester);
      }

      await register(registerPayload);
      // Success auto-login and redirect is handled in context
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of students and faculty on Saanjh."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-medium animate-fadeIn">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <InputField
          label="Full Name"
          icon={User}
          name="name"
          placeholder="Arjun Sharma"
          value={formData.name}
          onChange={handleChange}
        />

        <InputField
          label="University Email"
          icon={Mail}
          type="email"
          name="email"
          placeholder="you@university.edu"
          value={formData.email}
          onChange={handleChange}
        />

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            I am registering as a
          </label>
          <div className="grid grid-cols-3 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
            <button
              type="button"
              onClick={() => {
                setRole("student");
                setError("");
              }}
              className={`py-2.5 font-semibold text-sm transition cursor-pointer ${
                role === "student"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/15"
                  : "hover:bg-slate-100 text-slate-600"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => {
                setRole("faculty");
                setError("");
              }}
              className={`py-2.5 font-semibold text-sm transition cursor-pointer ${
                role === "faculty"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/15"
                  : "hover:bg-slate-100 text-slate-600"
              }`}
            >
              Faculty
            </button>
            <button
              type="button"
              onClick={() => {
                setRole("admin");
                setError("");
              }}
              className={`py-2.5 font-semibold text-sm transition cursor-pointer ${
                role === "admin"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/15"
                  : "hover:bg-slate-100 text-slate-600"
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Department */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Department / Program
          </label>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="w-full border border-slate-350 bg-white rounded-xl p-3 text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100 cursor-pointer text-sm"
          >
            <option value="">Select Department</option>
            <option value="Computer Science & Engineering">Computer Science & Engineering</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Business Administration">Business Administration</option>
            <option value="Law">Law</option>
          </select>
        </div>

        {/* Semester (Conditional for Student) */}
        {role === "student" && (
          <div className="animate-fadeIn">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Current Semester
            </label>
            <select
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              className="w-full border border-slate-350 bg-white rounded-xl p-3 text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100 cursor-pointer text-sm"
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>
        )}

        <PasswordInput
          label="Password"
          name="password"
          placeholder="Create a strong password"
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

        {/* Terms checkbox */}
        <label className="flex items-start gap-3 text-xs text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            className="mt-1 w-4 h-4 accent-violet-600 cursor-pointer"
          />
          <span>
            I agree to the{" "}
            <a href="#" className="text-violet-600 font-semibold hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-violet-600 font-semibold hover:underline">
              Privacy Policy
            </a>
          </span>
        </label>

        {/* Register Button */}
        <button
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-755 text-white font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-650/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-sm"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Creating Account...
            </span>
          ) : (
            "Create Account"
          )}
        </button>

        <p className="text-center text-sm text-slate-550 pt-1">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-violet-600 font-bold hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;