import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Tag, MapPin, Phone, FileText, Image, AlertCircle, CheckCircle } from "lucide-react";
import { createReport } from "../../api/lostFoundApi";
import { useAuth } from "../../context/AuthContext";
import InputField from "../../components/auth/InputField";

const ReportItem = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Query parameter defaults
  const typeParam = searchParams.get("type") === "found" ? "found" : "lost";
  const rolePrefix = user ? `/${user.role}` : "/student";

  const [type, setType] = useState(typeParam);
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // States
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = [
    "ID Card",
    "Wallet",
    "Keys",
    "Laptop",
    "Phone",
    "Earbuds",
    "Watch",
    "Books",
    "Notebook",
    "Calculator",
    "Water Bottle",
    "Clothes",
    "Others",
  ];

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 3) {
      setError("You can only upload a maximum of 3 images.");
      return;
    }

    const validatedFiles = [];
    const previews = [];

    files.forEach((file) => {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.mimetype || file.type)) {
        setError("Only JPEG, PNG and WEBP images are allowed.");
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size cannot exceed 5MB.");
        return;
      }

      validatedFiles.push(file);
      previews.push(URL.createObjectURL(file));
    });

    setImages((prev) => [...prev, ...validatedFiles]);
    setImagePreviews((prev) => [...prev, ...previews]);
    setError("");
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!itemName.trim()) return setError("Item Name is required.");
    if (!category) return setError("Please select a category.");
    if (!location.trim()) return setError("Location details are required.");
    if (!date) return setError("Report Date is required.");
    if (!description.trim()) return setError("Item description is required.");

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("type", type);
      formData.append("itemName", itemName);
      formData.append("category", category);
      formData.append("location", location);
      formData.append("date", date);
      formData.append("description", description);
      formData.append("phone", phone);

      images.forEach((img) => {
        formData.append("images", img);
      });

      await createReport(formData);
      setSuccess("Report created successfully! Redirecting...");
      setTimeout(() => {
        navigate(`${rolePrefix}/lost-found`);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100 font-sans max-w-2xl mx-auto pb-12">
      {/* Header Back Link */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(`${rolePrefix}/lost-found`)}
          className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition flex items-center justify-center cursor-pointer text-slate-400"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Report Item</h1>
          <p className="text-slate-400 text-xs">Fill in details about the lost or found item.</p>
        </div>
      </div>

      {/* Main card form */}
      <div className="glass-card border border-slate-800 rounded-[28px] p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-550/20 text-rose-455 p-4 rounded-xl text-xs font-semibold animate-fadeIn">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-550/20 text-emerald-400 p-4 rounded-xl text-xs font-semibold animate-fadeIn">
              <CheckCircle size={16} className="shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Report Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setType("lost")}
                className={`py-3 rounded-2xl text-xs font-bold transition border cursor-pointer ${
                  type === "lost"
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-md shadow-rose-500/5"
                    : "bg-slate-950/40 border-slate-800 text-slate-450 hover:text-slate-200"
                }`}
              >
                I Lost Something
              </button>
              <button
                type="button"
                onClick={() => setType("found")}
                className={`py-3 rounded-2xl text-xs font-bold transition border cursor-pointer ${
                  type === "found"
                    ? "bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-md shadow-blue-500/5"
                    : "bg-slate-950/40 border-slate-800 text-slate-450 hover:text-slate-200"
                }`}
              >
                I Found Something
              </button>
            </div>
          </div>

          {/* Item Name */}
          <InputField
            label="Item Name"
            type="text"
            icon={Tag}
            placeholder="e.g. Wallet, ID Card, iPhone 14"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />

          {/* Grid fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-3 text-slate-200 text-xs font-semibold outline-none focus:border-blue-500 cursor-pointer h-12"
              >
                <option value="" className="bg-[#0F172A]">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#0F172A]">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Date {type === "lost" ? "Lost" : "Found"}
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-3 text-slate-200 text-xs font-semibold outline-none focus:border-blue-500 h-12"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Location */}
            <InputField
              label={type === "lost" ? "Last Known Location" : "Location Found"}
              type="text"
              icon={MapPin}
              placeholder="e.g. Block C Cafeteria, Audi 2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            {/* Contact Phone */}
            <InputField
              label="Contact Phone"
              type="tel"
              icon={Phone}
              placeholder="e.g. +91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Item Description
            </label>
            <div className="relative">
              <FileText size={18} className="absolute left-4 top-4.5 text-slate-500" />
              <textarea
                rows="4"
                placeholder="Include features, color, brand, contents inside, or identification details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-slate-200 placeholder:text-slate-500 outline-none focus:border-blue-500 transition text-xs font-semibold leading-relaxed"
              ></textarea>
            </div>
          </div>

          {/* Image Uploader */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Upload Images (Max 3)
            </label>
            <div className="grid grid-cols-3 gap-4">
              {/* Previews */}
              {imagePreviews.map((preview, idx) => (
                <div key={idx} className="relative h-24 rounded-2xl border border-slate-800 overflow-hidden bg-slate-900 group">
                  <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer font-bold text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))}

              {/* Upload Trigger Card */}
              {images.length < 3 && (
                <label className="h-24 rounded-2xl border border-dashed border-slate-850 hover:border-blue-500/50 flex flex-col items-center justify-center text-slate-500 hover:text-blue-400 transition duration-300 cursor-pointer bg-slate-950/20">
                  <Image size={24} />
                  <span className="text-[10px] mt-2 font-bold uppercase tracking-wider">Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 justify-end pt-5 border-t border-slate-800">
            <button
              type="button"
              onClick={() => navigate(`${rolePrefix}/lost-found`)}
              className="px-5 py-3 rounded-2xl border border-slate-800 hover:bg-slate-800 text-slate-450 text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-650 text-white font-bold text-xs transition shadow-lg cursor-pointer disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportItem;
