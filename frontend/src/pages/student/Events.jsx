import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, Search, Filter, Compass, Users, Download, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { getAllEvents, registerForEvent, cancelRegistration } from "../../api/eventApi";
import { useAuth } from "../../context/AuthContext";
import { getAssetUrl } from "../../utils/url";


const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");

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

  const handleRegisterToggle = async (event) => {
    const isRegistered = event.registeredStudents.some(
      (reg) => (reg.student?._id || reg.student || "") === user?._id
    );

    try {
      if (isRegistered) {
        await cancelRegistration(event._id);
      } else {
        await registerForEvent(event._id);
      }
      // Refresh event list to get updated seats and state
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || "Registration action failed.");
    }
  };

  const getFileUrl = (url) => {
    if (!url) return "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600";
    return getAssetUrl(url);
  };

  // Filter lists dynamically - visible to ALL students
  const filteredEvents = events.filter((ev) => {
    const matchesSearch =
      ev.title?.toLowerCase().includes(search.toLowerCase()) ||
      ev.venue?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter ? ev.category === categoryFilter : true;
    const matchesDept = deptFilter ? ev.department === deptFilter : true;
    return matchesSearch && matchesCategory && matchesDept;
  });

  // Extract unique categories for filter options
  const categories = [...new Set(events.map((e) => e.category))].filter(Boolean);

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100 font-sans">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Campus Events</h1>
        <p className="text-slate-400 mt-1">Discover and register for university events across all departments.</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-550/20 text-rose-400 p-4 rounded-2xl text-sm font-semibold">
          <AlertCircle size={18} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
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

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Category */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-4 pr-10 py-3 text-slate-300 outline-none focus:border-blue-500 transition text-sm font-semibold appearance-none cursor-pointer sm:min-w-[140px]"
            >
              <option value="" className="bg-[#0F172A]">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-[#0F172A]">
                  {cat}
                </option>
              ))}
            </select>
            <Filter size={13} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>

          {/* Department - Strict Four Departments */}
          <div className="relative flex-1 sm:flex-none">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-4 pr-10 py-3 text-slate-300 outline-none focus:border-blue-500 transition text-sm font-semibold appearance-none cursor-pointer sm:min-w-[180px]"
            >
              <option value="" className="bg-[#0F172A]">All Departments</option>
              <option value="CSE" className="bg-[#0F172A]">CSE</option>
              <option value="BCA" className="bg-[#0F172A]">BCA</option>
              <option value="Pharmacy" className="bg-[#0F172A]">Pharmacy</option>
              <option value="Nursing" className="bg-[#0F172A]">Nursing</option>
            </select>
            <Compass size={13} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Events Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((skeleton) => (
            <div key={skeleton} className="glass-card border border-slate-850 rounded-3xl p-6 bg-slate-900 space-y-4 animate-pulse h-96">
              <div className="h-44 bg-slate-800 rounded-2xl"></div>
              <div className="h-6 bg-slate-800 rounded-lg w-3/4"></div>
              <div className="h-4 bg-slate-800 rounded-lg w-1/2"></div>
            </div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/40 border border-slate-850 rounded-[30px] p-8">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center text-2xl mb-4">
            📅
          </div>
          <h3 className="text-lg font-bold text-white">No events found</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-xs text-center">Try modifying your search tags or selected filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, idx) => {
            const isRegistered = event.registeredStudents.some(
              (reg) => (reg.student?._id || reg.student || "") === user?._id
            );
            const remainingSeats = Math.max(0, event.maxParticipants - event.registeredStudents.length);

            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                key={event._id}
                className="group bg-[#1E293B]/45 border border-slate-850 rounded-[28px] overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-blue-500/20 transition-all duration-300 h-full shadow-sm"
              >
                {/* Poster & Badges */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={getFileUrl(event.poster)}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  
                  {/* Float Category Badge */}
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border backdrop-blur-md bg-purple-500/10 text-purple-400 border-purple-500/20">
                    {event.category}
                  </span>

                  {/* Remaining Seats */}
                  <span className="absolute bottom-4 right-4 inline-flex items-center gap-1 bg-slate-950/60 backdrop-blur-md text-[10px] text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-xl font-bold">
                    <Users size={10} />
                    {remainingSeats} Seats Left
                  </span>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block mb-2">
                      Department: {event.department}
                    </span>
                    <h3 className="text-lg font-bold text-white leading-snug group-hover:text-blue-400 transition-colors duration-250">
                      {event.title}
                    </h3>

                    {/* Meta lists */}
                    <div className="space-y-2.5 mt-5 text-xs text-slate-400 font-semibold">
                      <div className="flex items-center gap-2.5">
                        <Calendar size={13} className="text-slate-550" />
                        <span>{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Clock size={13} className="text-slate-550" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <MapPin size={13} className="text-slate-550" />
                        <span>{event.venue}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3 mt-6">
                    {/* Circular PDF if exists */}
                    {event.circular && (
                      <a
                        href={getFileUrl(event.circular)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 py-3 rounded-2xl font-bold transition text-xs cursor-pointer"
                      >
                        <Download size={13} />
                        📄 Download Circular
                      </a>
                    )}

                    {/* Register button */}
                    {user?.role === "student" && (
                      <button
                        onClick={() => handleRegisterToggle(event)}
                        disabled={!isRegistered && remainingSeats <= 0}
                        className={`w-full py-3 rounded-2xl font-bold transition-all duration-200 text-sm cursor-pointer shadow-lg hover:scale-[1.01] active:scale-[0.99] ${
                          isRegistered
                            ? "bg-slate-800 text-emerald-400 border border-emerald-500/20 shadow-emerald-500/5"
                            : remainingSeats <= 0
                            ? "bg-slate-850 text-slate-500 border border-slate-800 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/10"
                        }`}
                      >
                        {isRegistered
                          ? "✓ Registered"
                          : remainingSeats <= 0
                          ? "Event Full"
                          : "Register For Event"}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Events;