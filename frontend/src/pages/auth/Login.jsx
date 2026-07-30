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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email) return setError("Email is required.");
    if (!formData.password) return setError("Password is required.");

    try {
      setLoading(true);
      await login({
        email: formData.email,
        password: formData.password,
      });
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-550/20 text-rose-400 px-4 py-3.5 rounded-xl text-sm font-semibold animate-fadeIn">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <InputField
          label="University Email"
          icon={Mail}
          type="email"
          name="email"
          placeholder="you@chitkarauniversity.edu.in"
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

        <div className="flex justify-end text-xs">
          <Link
            to="/forgot-password"
            className="text-blue-500 font-bold hover:text-blue-400 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold shadow-lg shadow-blue-500/25 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-sm hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? "Logging In..." : "Log In"}
        </button>

        <p className="text-center text-sm text-slate-400 pt-2 border-t border-slate-800">
          No account?{" "}
          <Link to="/register" className="text-blue-500 font-bold hover:text-blue-400 transition-colors">
            Register here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;