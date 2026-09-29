import React from "react";
import { useAuth } from "../../context/AuthContext";
import { BookOpen, Users, Calendar, Upload, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const FacultyDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Notes Uploaded",
      value: "18 Notes",
      icon: BookOpen,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Students Reached",
      value: "420+ Students",
      icon: Users,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Department",
      value: user?.department || "CSE",
      icon: MessageSquare,
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "Faculty Role",
      value: "Professor",
      icon: Calendar,
      color: "from-violet-500 to-fuchsia-500",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100 font-sans">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-[24px] sm:rounded-[30px] bg-gradient-to-tr from-blue-700 via-blue-600 to-violet-650 text-white p-6 sm:p-8 md:p-12 shadow-xl shadow-blue-500/10 border border-white/10"
      >
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="max-w-md">
            <span className="inline-flex bg-white/15 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3 sm:mb-5 border border-white/10">
              Faculty Portal
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">{user?.name || "Professor"}</span> 👋
            </h1>
            <p className="mt-4 text-blue-100/90 text-sm leading-relaxed">
              Upload study guides, organize your program syllabus notes, and manage class alerts for students.
            </p>
          </div>

          <Link
            to="/faculty/upload-notes"
            className="shrink-0 bg-white text-blue-650 hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 px-6 py-3.5 rounded-2xl font-bold shadow-lg flex items-center gap-2 text-sm cursor-pointer"
          >
            <Upload size={16} />
            Upload New Note
          </Link>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              key={idx}
              className="group relative overflow-hidden glass-card rounded-[24px] border border-slate-800 p-6 shadow-md hover:border-blue-500/20 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {stat.title}
                </span>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition duration-300`}>
                  <Icon size={18} />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-white mt-4">
                {stat.value}
              </h3>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Tips */}
      <div className="glass-card border border-slate-850 rounded-[28px] p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-white tracking-tight mb-6">
          Faculty Best Practices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 border border-slate-800/80 rounded-2xl bg-slate-900/40 hover:border-blue-500/10 transition duration-300">
            <h4 className="font-bold text-white text-sm">Organize by Semester</h4>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Always select the correct semester filter so students can locate materials quickly during revisions.
            </p>
          </div>
          <div className="p-5 border border-slate-800/80 rounded-2xl bg-slate-900/40 hover:border-blue-500/10 transition duration-300">
            <h4 className="font-bold text-white text-sm">Clear Note Titles</h4>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Include specific topic codes or lecture dates in note headers for clarity.
            </p>
          </div>
          <div className="p-5 border border-slate-800/80 rounded-2xl bg-slate-900/40 hover:border-blue-500/10 transition duration-300">
            <h4 className="font-bold text-white text-sm">PDF Format</h4>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              Ensure files are compressed and in PDF format to facilitate easy mobile viewing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;