import { useState } from "react";
import { uploadNote } from "../../api/noteApi";
import { FileText, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { DEPARTMENTS } from "../../constants/departments";

const UploadNotes = () => {
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    department: "",
    semester: "",
    description: "",
  });

  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    setError("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle File Selection
  const handleFileChange = (e) => {
    setError("");
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      return setError("Only PDF files are allowed.");
    }
    setPdf(file);
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validations
    if (!formData.title.trim()) return setError("Title is required.");
    if (!formData.subject.trim()) return setError("Subject is required.");
    if (!formData.department) return setError("Please select a department.");
    if (!formData.semester) return setError("Please select a semester.");
    if (!pdf) return setError("Please upload a PDF file.");

    try {
      setLoading(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("subject", formData.subject);
      data.append("department", formData.department);
      data.append("semester", formData.semester);
      data.append("description", formData.description);
      data.append("pdf", pdf);

      await uploadNote(data);

      setSuccess(true);
      setFormData({
        title: "",
        subject: "",
        department: "",
        semester: "",
        description: "",
      });
      setPdf(null);
      
      // Reset input element value
      const fileInput = document.getElementById("pdf-file-input");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto animate-fadeIn text-slate-100 font-sans">
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">Upload Lecture Notes</h1>
        <p className="text-slate-400 mt-1">Publish PDF note materials to student directories instantly.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card border border-slate-850 rounded-[30px] p-6 md:p-10 shadow-sm relative overflow-hidden"
      >
        {/* Banner Glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Alerts */}
          {error && (
            <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-550/20 text-rose-400 p-4 rounded-2xl text-sm font-semibold animate-fadeIn">
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-550/20 text-emerald-400 p-4 rounded-2xl text-sm font-semibold animate-fadeIn">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>Note uploaded and published successfully!</span>
            </div>
          )}

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Note Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Advanced Operating Systems Lecture 3"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-slate-955/50 border border-slate-800 rounded-2xl px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition duration-200 text-sm font-semibold"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Subject Name</label>
              <input
                type="text"
                name="subject"
                placeholder="e.g. Operating Systems"
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-slate-955/50 border border-slate-800 rounded-2xl px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition duration-200 text-sm font-semibold"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full bg-slate-955/40 border border-slate-800 rounded-2xl px-4 py-3 text-slate-200 outline-none focus:border-blue-500 transition duration-200 text-sm font-semibold cursor-pointer"
              >
                <option value="" className="bg-[#0F172A]">Select Department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.value} value={dept.value} className="bg-[#0F172A]">
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Semester */}
            <div>
              <label className="block mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Semester</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="w-full bg-slate-955/40 border border-slate-800 rounded-2xl px-4 py-3 text-slate-200 outline-none focus:border-blue-500 transition duration-200 text-sm font-semibold cursor-pointer"
              >
                <option value="" className="bg-[#0F172A]">Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem} className="bg-[#0F172A]">
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            {/* Layout alignment block */}
            <div className="hidden md:block"></div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Description (Optional)</label>
              <textarea
                name="description"
                rows="3"
                placeholder="Include key notes, reference chapters or deadlines..."
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-slate-955/50 border border-slate-800 rounded-2xl px-4 py-3 text-slate-100 placeholder:text-slate-500 outline-none focus:bg-slate-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition duration-200 text-sm font-semibold"
              />
            </div>

            {/* PDF Upload */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Upload PDF File</label>
              <div className="border-2 border-dashed border-slate-800 rounded-3xl p-6 flex flex-col items-center justify-center bg-slate-950/20 hover:bg-slate-900/20 hover:border-blue-500/40 transition-all duration-200 cursor-pointer relative group">
                <input
                  id="pdf-file-input"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-slate-450 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-500/10 group-hover:border-blue-500/20 transition-all duration-300">
                  {pdf ? <FileText size={22} className="text-blue-400" /> : <Upload size={22} />}
                </div>
                <span className="mt-4 text-sm font-bold text-slate-200">
                  {pdf ? pdf.name : "Select PDF Document"}
                </span>
                <span className="mt-1 text-xs text-slate-500 font-semibold">
                  {pdf ? `${(pdf.size / (1024 * 1024)).toFixed(2)} MB` : "File must be application/pdf"}
                </span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-650 hover:from-blue-500 hover:to-violet-500 text-white font-bold shadow-lg shadow-blue-500/25 transition duration-200 flex items-center justify-center gap-2 cursor-pointer text-sm disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Publishing Note...
              </>
            ) : (
              "Publish Note"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default UploadNotes;
