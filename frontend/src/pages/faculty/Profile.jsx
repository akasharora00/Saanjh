import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { updateProfile } from "../../api/authApi";
import { User, Mail, Folder, Phone, Shield, Camera, Pencil, CheckCircle2, AlertCircle, Save, X, Lock } from "lucide-react";
import { getAssetUrl } from "../../utils/url";


const Profile = () => {
  const { user, setUser } = useAuth();
  
  // Edit State toggler
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  // Password Update States
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setError("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setError("");
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        return setError("Only image files are allowed.");
      }
      setProfilePicFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError("");
    setSuccess("");
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
    });
    setPassword("");
    setConfirmPassword("");
    setProfilePicFile(null);
    setProfilePicPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim()) return setError("Name is required.");

    // Validate Password if filled
    if (password) {
      if (password.length < 6) {
        return setError("Password must be at least 6 characters.");
      }
      if (password !== confirmPassword) {
        return setError("Passwords do not match.");
      }
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("name", formData.name);
      data.append("phone", formData.phone);

      // Ensure backend enum validation passes by sending original safe values
      if (user?.department) {
        data.append("department", user.department);
      }

      if (password) {
        data.append("password", password);
      }

      if (profilePicFile) {
        data.append("profilePic", profilePicFile);
      }

      const res = await updateProfile(data);

      if (res && res.data && res.data.user) {
        setUser(res.data.user);
        setSuccess("Profile Updated Successfully");
        setIsEditing(false);
        setPassword("");
        setConfirmPassword("");
        setProfilePicFile(null);
        setProfilePicPreview(null);
      } else {
        throw new Error("Invalid response format from server.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentLabel = (code) => {
    if (code === "CSE") return "Computer Science Engineering (CSE)";
    if (code === "BCA") return "Bachelor of Computer Applications (BCA)";
    return code || "Not Configured";
  };

  const details = [
    { label: "Full Name", value: user?.name, icon: User },
    { label: "University Email", value: user?.email, icon: Mail },
    { label: "Role Profile", value: user?.role?.toUpperCase(), icon: Shield },
    { label: "Department", value: getDepartmentLabel(user?.department), icon: Folder },
    { label: "Employee ID", value: user?._id?.toUpperCase(), icon: Lock },
    { label: "Phone Number", value: user?.phone || "Not Set", icon: Phone },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn text-slate-100 font-sans">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">My Profile</h1>
          <p className="text-slate-400 mt-1">Manage your account information and academic details.</p>
        </div>
        <button
          onClick={handleEditToggle}
          className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/25 border border-blue-500/20 text-blue-400 px-5 py-2.5 rounded-2xl font-bold transition text-sm cursor-pointer shadow-sm"
        >
          {isEditing ? (
            <>
              <X size={15} />
              Cancel
            </>
          ) : (
            <>
              <Pencil size={15} />
              Edit Profile
            </>
          )}
        </button>
      </div>

      {/* Success/Error Alerts */}
      {success && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-550/20 text-emerald-400 p-4 rounded-2xl text-sm font-semibold animate-fadeIn">
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-550/20 text-rose-450 p-4 rounded-2xl text-sm font-semibold animate-fadeIn">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isEditing ? (
        /* Edit Profile Form View */
        <div className="glass-card border border-slate-850 rounded-[30px] p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Pic Upload */}
            <div className="flex flex-col items-center gap-4 pb-6 border-b border-slate-800">
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl bg-slate-900 border border-slate-800 text-slate-500 overflow-hidden flex items-center justify-center font-extrabold text-3xl shadow-inner select-none">
                  {profilePicPreview ? (
                    <img src={profilePicPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : user?.profilePic ? (
                    <img src={getAssetUrl(user.profilePic)} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.name ? user.name[0].toUpperCase() : "U"
                  )}
                </div>
                <label className="absolute inset-0 bg-black/50 text-white rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer z-10">
                  <Camera size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </label>
              </div>
              <span className="text-xs text-slate-500 font-semibold">Click avatar area to update picture</span>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-955/40 border border-slate-800 rounded-2xl px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition duration-200 text-sm font-semibold"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-955/40 border border-slate-800 rounded-2xl px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition duration-200 text-sm font-semibold"
                />
              </div>

              {/* Read-Only Academic Identity Lock Fields */}
              <div>
                <label className="block mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">🔒 Department</label>
                <div className="w-full bg-slate-950/30 border border-slate-850 rounded-2xl px-4 py-3 text-slate-450 text-sm font-semibold select-none flex items-center gap-2 cursor-not-allowed">
                  <span>{getDepartmentLabel(user?.department)}</span>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">🔒 University Email</label>
                <div className="w-full bg-slate-950/30 border border-slate-850 rounded-2xl px-4 py-3 text-slate-450 text-sm font-semibold select-none flex items-center gap-2 cursor-not-allowed">
                  <span>{user?.email}</span>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">🔒 Employee ID</label>
                <div className="w-full bg-slate-950/30 border border-slate-850 rounded-2xl px-4 py-3 text-slate-450 text-sm font-semibold select-none flex items-center gap-2 cursor-not-allowed">
                  <span>{user?._id?.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Change Password Sub-Form */}
            <div className="border-t border-slate-800 pt-6">
              <h3 className="text-sm font-bold text-white mb-4">Change Password</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-955/40 border border-slate-800 rounded-2xl px-4 py-3 text-slate-100 placeholder:text-slate-550 outline-none focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition duration-200 text-sm font-semibold"
                    placeholder="Enter new password (min 6 chars)"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-955/40 border border-slate-800 rounded-2xl px-4 py-3 text-slate-100 placeholder:text-slate-550 outline-none focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition duration-200 text-sm font-semibold"
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-slate-800">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/15 transition-all flex items-center gap-2 text-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Saving Profile...
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    Save Changes
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleEditToggle}
                className="border border-slate-850 hover:bg-slate-900/60 text-slate-350 px-6 py-3 rounded-2xl font-bold transition text-sm cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Read-only Profile View */
        <div className="glass-card border border-slate-850 rounded-[30px] p-6 md:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-850">
            {/* Avatar Icon */}
            <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center font-extrabold text-3xl shadow-inner select-none shrink-0 border border-blue-500/10">
              {user?.profilePic ? (
                <img src={getAssetUrl(user.profilePic)} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user?.name ? user.name[0].toUpperCase() : "U"
              )}
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-extrabold text-white tracking-tight">{user?.name || "Username"}</h2>
              <p className="text-sm font-semibold text-slate-400 uppercase mt-1 tracking-wider animate-pulse-glow">
                {user?.role} • {getDepartmentLabel(user?.department)}
              </p>
            </div>
          </div>

          {/* Profile Info Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {details.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="p-4 border border-slate-850 bg-slate-900/30 flex items-center gap-4 hover:border-slate-800 transition duration-300 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Icon size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                      {item.label}
                    </span>
                    <span className="text-sm font-bold text-slate-200 mt-1 block">
                      {item.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
