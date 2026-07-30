import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "../../components/auth/AuthLayout";
import PasswordInput from "../../components/auth/PasswordInput";
import { CheckCircle2, AlertCircle } from "lucide-react";

const FacultyChangePassword = () => {
  const { changePasswordAuth, user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentPassword) return setError("Temporary Password is required.");
    if (newPassword.length < 6) return setError("New Password must be at least 6 characters long.");
    if (newPassword !== confirmPassword) return setError("New Passwords do not match.");

    try {
      setLoading(true);
      await changePasswordAuth({ currentPassword, newPassword });
      setSuccess("Password updated successfully! Redirecting to dashboard...");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Change Password Required"
      subtitle={`First-time login detected for ${user?.email || "faculty member"}. Update your password.`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <PasswordInput
          label="Temporary Password"
          name="currentPassword"
          placeholder="Enter temporary password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <PasswordInput
          label="New Password"
          name="newPassword"
          placeholder="Create new password (min 6 chars)"
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
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold shadow-lg shadow-amber-500/25 transition duration-200 cursor-pointer text-sm"
        >
          {loading ? "Updating Password..." : "Update Password & Continue"}
        </button>
      </form>
    </AuthLayout>
  );
};

export default FacultyChangePassword;
