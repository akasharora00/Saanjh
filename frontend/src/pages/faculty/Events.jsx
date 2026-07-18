import React, { useState, useEffect } from "react";
import { MapPin, Search, Filter, Plus, X, Download, FileText, Upload, Users, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllEvents, createEvent, deleteEvent, getRegisteredStudents } from "../../api/eventApi";
import { useAuth } from "../../context/AuthContext";

const PREDEFINED_CATEGORIES = [
  "Workshop", "Seminar", "Webinar", "Hackathon", "Competition", "Coding Contest",
  "Technical Talk", "Guest Lecture", "Placement Drive", "Training Session",
  "Industrial Visit", "Bootcamp", "Conference", "Sports Event", "Cultural Event",
  "Music Event", "Dance Event", "Stand-up Comedy", "Quiz Competition", "Debate",
  "Poster Presentation", "Project Exhibition", "Research Symposium", "Orientation",
  "Awareness Campaign", "Blood Donation Camp", "Health Camp", "Festival Celebration",
  "Alumni Meet", "Networking Event", "Career Fair"
];

const FacultyEvents = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [activeTab, setActiveTab] = useState("all"); // "all" | "my"
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Create/Edit Event Form States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [department, setDepartment] = useState("CSE");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [maxParticipants, setMaxParticipants] = useState("100");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");

  // Searchable Category suggest popup
  const [showCategorySuggests, setShowCategorySuggests] = useState(false);

  // File Upload states
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [posterProgress, setPosterProgress] = useState(0);

  const [circularFile, setCircularFile] = useState(null);
  const [circularProgress, setCircularProgress] = useState(0);

  // Participant details table states
  const [viewingRegistrants, setViewingRegistrants] = useState(null);
  const [registrants, setRegistrants] = useState([]);
  const [loadingRegistrants, setLoadingRegistrants] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAllEvents();
      setEvents(res.events || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch events. Please reload.");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchRegistrants = async (event) => {
    setViewingRegistrants(event);
    setLoadingRegistrants(true);
    try {
      const res = await getRegisteredStudents(event._id);
      setRegistrants(res.students || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load registrant roster.");
    } finally {
      setLoadingRegistrants(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(id);
      setSuccess("Event deleted successfully!");
      fetchEvents();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to delete event.");
    }
  };

  // Files Drag and Drop
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handlePosterDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    validateAndSetPoster(file);
  };

  const handleCircularDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    validateAndSetCircular(file);
  };

  const validateAndSetPoster = (file) => {
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPEG, PNG and WEBP image formats are supported for poster.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Maximum file size allowed is 5MB.");
      return;
    }
    setPosterFile(file);
    setPosterPreview(URL.createObjectURL(file));

    // Simulate progress load
    setPosterProgress(10);
    const interval = setInterval(() => {
      setPosterProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 30;
      });
    }, 100);
  };

  const validateAndSetCircular = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Only PDF documents are allowed for event circular.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Maximum file size allowed is 5MB.");
      return;
    }
    setCircularFile(file);

    // Simulate progress load
    setCircularProgress(10);
    const interval = setInterval(() => {
      setCircularProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 30;
      });
    }, 100);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) return setError("Title is required.");
    if (!category.trim()) return setError("Category is required.");
    if (!date) return setError("Date is required.");
    if (!time.trim()) return setError("Time is required.");
    if (!venue.trim()) return setError("Venue is required.");
    if (!deadline) return setError("Registration deadline is required.");
    if (!description.trim()) return setError("Description is required.");

    try {
      setCreateLoading(true);
      const data = new FormData();
      data.append("title", title);
      data.append("description", description);
      data.append("category", category);
      data.append("department", department);
      data.append("venue", venue);
      data.append("date", date);
      data.append("time", time);
      data.append("registrationDeadline", deadline);
      data.append("maxParticipants", maxParticipants);

      if (posterFile) {
        data.append("poster", posterFile);
      }
      if (circularFile) {
        data.append("circular", circularFile);
      }

      await createEvent(data);
      setSuccess("Event published successfully!");
      fetchEvents();
      setIsCreateOpen(false);
      resetForm();
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create event. Please verify parameters.");
    } finally {
      setCreateLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setDepartment("CSE");
    setDate("");
    setTime("");
    setVenue("");
    setMaxParticipants("100");
    setDeadline("");
    setDescription("");
    setPosterFile(null);
    setPosterPreview(null);
    setPosterProgress(0);
    setCircularFile(null);
    setCircularProgress(0);
  };

  const getFileUrl = (url) => {
    if (!url) return "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `http://localhost:5000/${url.replace(/\\/g, "/")}`;
  };

  // Filter list dynamically
  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.title?.toLowerCase().includes(search.toLowerCase()) ||
      ev.venue?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? ev.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const myEvents = filteredEvents.filter(
    (ev) => (ev.createdBy?._id || ev.createdBy || "") === user?._id
  );

  const displayedEvents = activeTab === "my" ? myEvents : filteredEvents;

  // Search suggestions category listing
  const categorySuggestions = PREDEFINED_CATEGORIES.filter((cat) =>
    cat.toLowerCase().includes(category.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100 font-sans relative">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Events Management Hub</h1>
          <p className="text-slate-400 mt-1 font-medium">Create events, manage publications, and access registrant details.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsCreateOpen(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-violet-650 hover:from-blue-500 hover:to-violet-500 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-500/20 text-sm flex items-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <Plus size={16} />
          Create Event
        </button>
      </div>

      {/* Success/Error Banners */}
      {success && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-550/20 text-emerald-400 p-4 rounded-2xl text-sm font-semibold animate-fadeIn">
          <CheckCircle2 size={18} className="shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-550/20 text-rose-400 p-4 rounded-2xl text-sm font-semibold animate-fadeIn">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-850 gap-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`pb-3 text-sm font-bold tracking-wide uppercase transition cursor-pointer relative ${
            activeTab === "all" ? "text-blue-400" : "text-slate-500 hover:text-slate-350"
          }`}
        >
          Browse All Events
          {activeTab === "all" && (
            <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-550"></motion.div>
          )}
        </button>
        <button
          onClick={() => setActiveTab("my")}
          className={`pb-3 text-sm font-bold tracking-wide uppercase transition cursor-pointer relative ${
            activeTab === "my" ? "text-blue-400" : "text-slate-500 hover:text-slate-350"
          }`}
        >
          My Publications
          {activeTab === "my" && (
            <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-550"></motion.div>
          )}
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-slate-900/60 border border-slate-850 rounded-3xl p-5 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search events by title or venue..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-955/50 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-slate-200 placeholder:text-slate-500 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition duration-200 text-sm font-semibold"
          />
        </div>

        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-2xl pl-4 pr-10 py-3 text-slate-300 outline-none focus:border-blue-500 transition text-sm font-semibold appearance-none cursor-pointer min-w-[150px]"
          >
            <option value="" className="bg-[#0F172A]">All Categories</option>
            {PREDEFINED_CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-[#0F172A]">{cat}</option>
            ))}
          </select>
          <Filter size={13} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="glass-card border border-slate-850 rounded-3xl p-6 bg-slate-900 space-y-4 animate-pulse h-80"></div>
          ))}
        </div>
      ) : displayedEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 border border-slate-850 rounded-[30px] p-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center text-2xl mb-4">
            📅
          </div>
          <h3 className="text-lg font-bold text-white">No publications found</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-xs text-center">There are no matching events listed in this directory category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedEvents.map((event) => {
            const isCreator = (event.createdBy?._id || event.createdBy || "") === user?._id;
            const remainingSeats = Math.max(0, event.maxParticipants - event.registeredStudents.length);

            return (
              <motion.div
                layout
                key={event._id}
                className="group bg-[#1E293B]/45 border border-slate-850 rounded-[28px] overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 shadow-sm"
              >
                {/* Poster Header */}
                <div className="relative h-44 overflow-hidden">
                  <img src={getFileUrl(event.poster)} alt={event.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent"></div>
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border backdrop-blur-md bg-blue-500/10 text-blue-400 border-blue-500/20">
                    {event.category}
                  </span>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">
                      <span>Dept: {event.department}</span>
                      <span>Seats: {remainingSeats} Left</span>
                    </div>

                    <h3 className="text-base font-bold text-white leading-snug group-hover:text-blue-400 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-3 font-semibold flex items-center gap-1">
                      <MapPin size={12} className="text-slate-500" />
                      {event.venue}
                    </p>
                  </div>

                  {/* Actions Area */}
                  <div className="space-y-2 mt-6 pt-4 border-t border-slate-850">
                    {event.circular && (
                      <a
                        href={getFileUrl(event.circular)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-350 border border-slate-700 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
                      >
                        <Download size={12} />
                        Download Circular
                      </a>
                    )}

                    {isCreator && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <button
                          onClick={() => handleFetchRegistrants(event)}
                          className="bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Users size={12} />
                          Roster
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="bg-rose-500/10 hover:bg-rose-600 hover:text-white border border-rose-500/20 text-rose-450 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* CREATE EVENT DRAWER / MODAL */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-850 rounded-[30px] p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsCreateOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-950 border border-slate-855 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X size={15} />
              </button>

              <h2 className="text-xl font-bold text-white tracking-tight mb-6">
                Publish Campus Event
              </h2>

              <form onSubmit={handleCreateSubmit} className="space-y-5">
                {/* Title */}
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Event Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-955/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 placeholder:text-slate-550 outline-none focus:border-blue-500 text-sm font-semibold"
                    placeholder="e.g. HackFest Coding Competition 2026"
                  />
                </div>

                {/* Category & Department */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category with Suggestions List */}
                  <div className="relative">
                    <label className="block mb-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</label>
                    <input
                      type="text"
                      required
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setShowCategorySuggests(true);
                      }}
                      onFocus={() => setShowCategorySuggests(true)}
                      onBlur={() => setTimeout(() => setShowCategorySuggests(false), 200)}
                      className="w-full bg-slate-955/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 placeholder:text-slate-550 outline-none focus:border-blue-500 text-sm font-semibold"
                      placeholder="Type or select category..."
                    />

                    {/* Predefined Suggestions Panel */}
                    <AnimatePresence>
                      {showCategorySuggests && categorySuggestions.length > 0 && (
                        <motion.ul
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute left-0 right-0 mt-1 max-h-40 overflow-y-auto bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-30 divide-y divide-slate-850"
                        >
                          {categorySuggestions.map((suggest) => (
                            <li
                              key={suggest}
                              onMouseDown={() => {
                                setCategory(suggest);
                                setShowCategorySuggests(false);
                              }}
                              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white cursor-pointer"
                            >
                              {suggest}
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Department select option list (CSE, BCA, Pharmacy, Nursing) */}
                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-250 outline-none focus:border-blue-500 text-xs font-semibold cursor-pointer"
                    >
                      <option value="CSE" className="bg-[#0F172A]">CSE</option>
                      <option value="BCA" className="bg-[#0F172A]">BCA</option>
                      <option value="Pharmacy" className="bg-[#0F172A]">Pharmacy</option>
                      <option value="Nursing" className="bg-[#0F172A]">Nursing</option>
                    </select>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-slate-955/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 outline-none focus:border-blue-500 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Time</label>
                    <input
                      type="text"
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-slate-955/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 placeholder:text-slate-550 outline-none focus:border-blue-500 text-sm font-semibold"
                      placeholder="e.g. 09:30 AM - 04:00 PM"
                    />
                  </div>
                </div>

                {/* Venue & Max Participants */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Venue / Location</label>
                    <input
                      type="text"
                      required
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      className="w-full bg-slate-955/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 placeholder:text-slate-550 outline-none focus:border-blue-500 text-sm font-semibold"
                      placeholder="e.g. CSE Block Room 202"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Max Participants</label>
                    <input
                      type="number"
                      required
                      value={maxParticipants}
                      onChange={(e) => setMaxParticipants(e.target.value)}
                      className="w-full bg-slate-955/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 outline-none focus:border-blue-500 text-sm font-semibold"
                    />
                  </div>
                </div>

                {/* Registration Deadline */}
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Registration Deadline</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-955/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 outline-none focus:border-blue-500 text-sm font-semibold"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block mb-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Event Details Description</label>
                  <textarea
                    required
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-955/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 placeholder:text-slate-550 outline-none focus:border-blue-500 text-sm font-semibold"
                    placeholder="Provide overview details, rules, topics covered..."
                  />
                </div>

                {/* Upload Fields (Poster & Circular) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Poster image upload box */}
                  <div>
                    <label className="block mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Event Poster (JPG, PNG, WEBP)</label>
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handlePosterDrop}
                      className="border-2 border-dashed border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center bg-slate-950/20 hover:border-blue-500/40 hover:bg-slate-900/10 transition cursor-pointer relative"
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => validateAndSetPoster(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      {posterPreview ? (
                        <div className="relative w-full h-24 rounded-lg overflow-hidden">
                          <img src={posterPreview} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPosterFile(null);
                              setPosterPreview(null);
                              setPosterProgress(0);
                            }}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black cursor-pointer"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-2">
                          <Upload size={18} className="text-slate-500" />
                          <span className="text-[10px] font-bold text-slate-300 mt-2">Drag or click to choose poster</span>
                          <span className="text-[9px] text-slate-500 mt-0.5">JPEG/PNG/WEBP under 5MB</span>
                        </div>
                      )}
                      {posterProgress > 0 && posterProgress < 100 && (
                        <div className="w-full bg-slate-850 h-1 rounded-full mt-2 overflow-hidden">
                          <div className="bg-blue-550 h-full transition-all duration-300" style={{ width: `${posterProgress}%` }}></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Circular PDF Upload Box */}
                  <div>
                    <label className="block mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Event Circular (PDF ONLY)</label>
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleCircularDrop}
                      className="border-2 border-dashed border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center bg-slate-950/20 hover:border-blue-500/40 hover:bg-slate-900/10 transition cursor-pointer relative"
                    >
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => validateAndSetCircular(e.target.files[0])}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      {circularFile ? (
                        <div className="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-850 w-full relative z-20">
                          <FileText size={18} className="text-blue-400" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-slate-200 truncate">{circularFile.name}</p>
                            <p className="text-[9px] text-slate-500">{(circularFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCircularFile(null);
                              setCircularProgress(0);
                            }}
                            className="w-5 h-5 rounded-full bg-slate-850 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center py-2">
                          <Upload size={18} className="text-slate-500" />
                          <span className="text-[10px] font-bold text-slate-300 mt-2">Drag or click to choose circular</span>
                          <span className="text-[9px] text-slate-500 mt-0.5">PDF format under 5MB</span>
                        </div>
                      )}
                      {circularProgress > 0 && circularProgress < 100 && (
                        <div className="w-full bg-slate-850 h-1 rounded-full mt-2 overflow-hidden">
                          <div className="bg-blue-550 h-full transition-all duration-300" style={{ width: `${circularProgress}%` }}></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-end pt-4 border-t border-slate-850 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-850 hover:bg-slate-900/60 text-slate-350 font-bold transition text-sm cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createLoading}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-655 hover:from-blue-500 hover:to-violet-500 text-white font-bold shadow-lg shadow-blue-500/15 transition-all text-sm cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {createLoading ? "Publishing..." : "Publish Event"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PARTICIPANTS ROSTER DRAWER */}
      <AnimatePresence>
        {viewingRegistrants && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-850 rounded-[30px] p-6 md:p-8 w-full max-w-4xl shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setViewingRegistrants(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-950 border border-slate-855 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X size={15} />
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Registered Roster</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{viewingRegistrants.title}</p>
                </div>
              </div>

              {/* Roster Table */}
              <div className="border border-slate-850 bg-slate-955/20 rounded-2xl overflow-hidden">
                {loadingRegistrants ? (
                  <div className="p-12 text-center text-slate-400 font-semibold animate-pulse">
                    Loading student list...
                  </div>
                ) : registrants.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 font-semibold">
                    No students have registered for this event yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs min-w-[600px]">
                      <thead>
                        <tr className="border-b border-slate-855 bg-slate-900/60 text-slate-400 font-bold uppercase tracking-wider">
                          <th className="p-4">Name</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Department</th>
                          <th className="p-4">Semester</th>
                          <th className="p-4">Phone</th>
                          <th className="p-4">Reg Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrants.map((reg, rIdx) => {
                          const student = reg.student || {};
                          return (
                            <tr key={rIdx} className="border-b border-slate-850/60 hover:bg-slate-800/20 text-slate-350 font-medium">
                              <td className="p-4 font-bold text-white">{student.name || "N/A"}</td>
                              <td className="p-4">{student.email || "N/A"}</td>
                              <td className="p-4">{student.department || "N/A"}</td>
                              <td className="p-4">{student.semester ? `${student.semester} Sem` : "N/A"}</td>
                              <td className="p-4">{student.phone || "N/A"}</td>
                              <td className="p-4">{reg.registeredAt ? new Date(reg.registeredAt).toLocaleDateString() : "N/A"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FacultyEvents;
