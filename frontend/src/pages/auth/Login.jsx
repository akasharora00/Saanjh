import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import AuthLayout from "../../components/auth/AuthLayout";
import InputField from "../../components/auth/InputField";
import PasswordInput from "../../components/auth/PasswordInput";

const Login = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setError(""); // Clear error on input change
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      return setError("Email is required.");
    }
    if (!emailRegex.test(formData.email)) {
      return setError("Please enter a valid email address.");
    }
    if (!formData.password) {
      return setError("Password is required.");
    }
    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    try {
      setLoading(true);
      await login({
        email: formData.email,
        password: formData.password,
      });
      // Redirect is handled inside context automatically
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to your Saanjh account to continue."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3.5 rounded-xl text-sm font-medium animate-fadeIn">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <InputField
          label="University Email"
          icon={Mail}
          type="email"
          name="email"
          placeholder="you@university.edu"
          value={formData.email}
          onChange={handleChange}
        />

        <PasswordInput
          label="Password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
              className="w-4 h-4 accent-violet-600 cursor-pointer"
            />
            Remember me
          </label>

          <button
            type="button"
            className="text-violet-600 hover:text-violet-750 font-semibold transition"
          >
            Forgot password?
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-750 text-white font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-600/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Logging In...
            </span>
          ) : (
            "Log In"
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-slate-200"></div>
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
            or continue with
          </span>
          <div className="flex-1 h-px bg-slate-200"></div>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className="border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl py-3 font-medium transition cursor-pointer flex items-center justify-center gap-2 text-slate-700 text-sm"
          >
            Google
          </button>

          <button
            type="button"
            className="border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl py-3 font-medium transition cursor-pointer flex items-center justify-center gap-2 text-slate-700 text-sm"
          >
            Microsoft
          </button>
        </div>

        {/* Register */}
        <p className="text-center text-sm text-slate-550 pt-2">
          No account?{" "}
          <Link
            to="/register"
            className="text-violet-600 font-bold hover:underline"
          >
            Create one free
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;