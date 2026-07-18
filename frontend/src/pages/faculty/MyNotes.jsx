import { useEffect, useState, useCallback } from "react";
import { getAllNotes, deleteNote, updateNote } from "../../api/noteApi";
import { useAuth } from "../../context/AuthContext";
import { Search, Filter, Trash2, Calendar, BookOpen, Inbox, ExternalLink, Pencil, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DEPARTMENTS } from "../../constants/departments";

const MyNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Search & Filter States
  const [search, setSearch] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");

  // Edit Modal States
  const [editingNote, setEditingNote] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    subject: "",
    department: "",
    semester: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");

  const fetchMyNotes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllNotes();
      // Filter notes uploaded by the current logged-in faculty user
      const allNotes = data.notes || [];
      const myUploadedNotes = allNotes.filter(
        (note) => note.uploadedBy?._id === user?._id || note.uploadedBy === user?._id
      );
      setNotes(myUploadedNotes);
    } catch (error) {
      console.error("Failed to load notes:", error);
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => {
    fetchMyNotes();
  }, [fetchMyNotes]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      setDeletingId(id);
      await deleteNote(id);
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    } catch (error) {
      alert("Failed to delete note. Please try again.");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (note) => {
    setEditError("");
    setEditingNote(note);
    setEditFormData({
      title: note.title,
      subject: note.subject,
      department: note.department,
      semester: String(note.semester),
      description: note.description || "",
    });
  };

  const handleEditChange = (e) => {
    setEditError("");
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError("");

    // Validations
    if (!editFormData.title.trim()) return setEditError("Title is required.");
    if (!editFormData.subject.trim()) return setEditError("Subject is required.");
    if (!editFormData.department) return setEditError("Please select a department.");
    if (!editFormData.semester) return setEditError("Please select a semester.");

    try {
      setSaving(true);
      const payload = {
        title: editFormData.title,
        subject: editFormData.subject,
        department: editFormData.department,
        semester: Number(editFormData.semester),
        description: editFormData.description,
      };

      await updateNote(editingNote._id, payload);
      
      // Update local state dynamically
      setNotes((prevNotes) =>
        prevNotes.map((n) => (n._id === editingNote._id ? { ...n, ...payload } : n))
      );
      
      setEditingNote(null);
    } catch (err) {
      console.error(err);
      setEditError(err.response?.data?.message || "Failed to update note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Filter notes locally
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title?.toLowerCase().includes(search.toLowerCase()) ||
      note.subject?.toLowerCase().includes(search.toLowerCase());
    
    const matchesSemester = semesterFilter
      ? String(note.semester) === semesterFilter
      : true;

    return matchesSearch && matchesSemester;
  });

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100 font-sans relative">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">My Publications</h1>
          <p className="text-slate-400 mt-1">Manage, edit and track note PDFs uploaded by you.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/60 border border-slate-850 rounded-3xl p-5 shadow-sm space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by title or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-955/50 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-slate-200 placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition duration-200 text-sm font-semibold"
          />
        </div>

        {/* Semester Filter */}
        <div className="relative">
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-2xl pl-4 pr-10 py-3 text-slate-300 outline-none focus:border-blue-500 transition text-sm font-semibold appearance-none cursor-pointer min-w-[160px]"
          >
            <option value="" className="bg-[#0F172A]">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem} className="bg-[#0F172A]">
                Semester {sem}
              </option>
            ))}
          </select>
          <Filter size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* My Notes Grid (2 cards per row on desktop) */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((s) => (
            <div key={s} className="glass-card border border-slate-850 rounded-3xl p-6 bg-slate-900 space-y-4 animate-pulse">
              <div className="h-6 bg-slate-800 rounded-lg w-2/3"></div>
              <div className="h-4 bg-slate-850 rounded-lg w-1/3"></div>
              <div className="flex gap-4 pt-4">
                <div className="h-10 bg-slate-850 rounded-xl flex-1"></div>
                <div className="h-10 bg-slate-855 rounded-xl w-24"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 bg-slate-900/40 border border-slate-855 rounded-[30px] p-8 shadow-sm">
          <div className="w-20 h-20 rounded-3xl bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-500 mb-6">
            <Inbox size={40} className="stroke-[1.5]" />
          </div>
          <h3 className="text-xl font-bold text-white">No notes uploaded</h3>
          <p className="text-slate-500 text-sm text-center mt-2 max-w-sm">
            You haven't uploaded any notes matching the filters yet. Click "Upload Notes" in the sidebar to publish your first set.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredNotes.map((note) => {
            const formattedDate = note.createdAt
              ? new Date(note.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Recently";

            return (
              <motion.div
                layout
                key={note._id}
                className="group relative bg-[#1E293B]/45 border border-slate-850 rounded-[28px] p-6 shadow-sm hover:shadow-xl hover:border-blue-500/20 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-block bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider">
                      Sem {note.semester}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                      <Calendar size={13} className="text-slate-550" />
                      {formattedDate}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white leading-snug group-hover:text-blue-400 transition-colors">
                    {note.title}
                  </h3>

                  <div className="flex items-center gap-2 text-slate-350 text-sm mt-3 font-semibold">
                    <BookOpen size={14} className="text-slate-500" />
                    <span>{note.subject}</span>
                  </div>

                  {note.description && (
                    <p className="mt-3 text-slate-400 text-xs md:text-sm italic leading-relaxed line-clamp-2">
                      "{note.description}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-855">
                  <a
                    href={`http://localhost:5000/${note.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 border border-slate-800 hover:bg-slate-900/60 hover:border-slate-750 text-slate-300 py-3 rounded-2xl font-bold transition text-sm cursor-pointer"
                  >
                    <ExternalLink size={15} />
                    View PDF
                  </a>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleEditClick(note)}
                    className="p-3.5 rounded-2xl border border-slate-800 hover:border-blue-550/40 hover:bg-blue-500/10 text-slate-400 hover:text-blue-400 transition duration-200 cursor-pointer"
                    title="Edit Note Details"
                  >
                    <Pencil size={15} />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(note._id)}
                    disabled={deletingId === note._id}
                    className="p-3.5 rounded-2xl border border-rose-900/30 bg-rose-500/10 hover:bg-rose-600 hover:text-white text-rose-400 transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete Note"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Edit Modal Dialog overlay */}
      <AnimatePresence>
        {editingNote && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-850 rounded-[30px] p-6 md:p-8 w-full max-w-xl shadow-2xl relative"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-850 mb-6">
                <h2 className="text-xl font-bold text-white tracking-tight">Edit Note Details</h2>
                <button
                  onClick={() => setEditingNote(null)}
                  className="w-8 h-8 rounded-full bg-slate-950 border border-slate-850 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleEditSubmit} className="space-y-4">
                {editError && (
                  <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-550/20 text-rose-455 p-3.5 rounded-2xl text-sm font-semibold">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{editError}</span>
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Note Title</label>
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleEditChange}
                    className="w-full bg-slate-955/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder:text-slate-500 outline-none focus:border-blue-500 text-sm font-semibold"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Subject Name</label>
                  <input
                    type="text"
                    name="subject"
                    value={editFormData.subject}
                    onChange={handleEditChange}
                    className="w-full bg-slate-955/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder:text-slate-500 outline-none focus:border-blue-500 text-sm font-semibold"
                  />
                </div>

                {/* Department & Semester Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Department</label>
                    <select
                      name="department"
                      value={editFormData.department}
                      onChange={handleEditChange}
                      className="w-full bg-slate-955/40 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-blue-500 transition duration-200 text-xs font-semibold cursor-pointer"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept.value} value={dept.value} className="bg-[#0F172A]">
                          {dept.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Semester</label>
                    <select
                      name="semester"
                      value={editFormData.semester}
                      onChange={handleEditChange}
                      className="w-full bg-slate-955/40 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-200 outline-none focus:border-blue-500 transition duration-200 text-xs font-semibold cursor-pointer"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem} className="bg-[#0F172A]">
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    value={editFormData.description}
                    onChange={handleEditChange}
                    className="w-full bg-slate-955/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder:text-slate-500 outline-none focus:border-blue-500 text-sm font-semibold"
                  />
                </div>

                {/* Actions Footer */}
                <div className="flex gap-4 justify-end pt-4 border-t border-slate-850 mt-6">
                  <button
                    type="button"
                    onClick={() => setEditingNote(null)}
                    className="px-5 py-2.5 rounded-xl border border-slate-850 hover:bg-slate-900/60 text-slate-350 font-bold transition text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-650 hover:from-blue-500 hover:to-violet-500 text-white font-bold shadow-lg shadow-blue-500/15 transition-all text-sm cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyNotes;
