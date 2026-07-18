import React from "react";
import { useAuth } from "../../context/AuthContext";
import { GraduationCap, BookOpen, Calendar, Clock, Award } from "lucide-react";
import { motion } from "framer-motion";

const StudentDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Current Semester",
      value: user?.semester ? `Semester ${user.semester}` : "N/A",
      icon: GraduationCap,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Available Notes",
      value: "140+",
      icon: BookOpen,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Active Events",
      value: "6 Events",
      icon: Calendar,
      color: "from-violet-500 to-fuchsia-500",
    },
    {
      title: "Academic Attendance",
      value: "84%",
      icon: Clock,
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const updates = [
    {
      title: "End Term Exam Dates Released",
      description: "Exams start from Dec 10, 2026. Collect your admit cards before Dec 5.",
      time: "2 hours ago",
    },
    {
      title: "National Level Hackathon 2026",
      description: "HackFest registrations are open. Submit your abstract by Nov 25.",
      time: "1 day ago",
    },
    {
      title: "Holiday Announcement",
      description: "College campus will remain closed on Friday for national holiday.",
      time: "2 days ago",
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn text-slate-100">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-[30px] bg-gradient-to-tr from-blue-700 via-blue-600 to-violet-600 text-white p-8 md:p-12 shadow-xl shadow-blue-500/10 border border-white/10"
      >
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex bg-white/15 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 border border-white/10">
            Student Portal
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Welcome back, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">{user?.name || "Student"}</span> 👋
          </h1>
          <p className="mt-4 text-blue-100/90 text-sm md:text-base leading-relaxed max-w-md">
            Check your notes, monitor your semester course progress, and stay updated with the latest campus events.
          </p>
        </div>
      </motion.div>

      {/* Stats Cards Grid */}
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

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Announcements */}
        <div className="lg:col-span-2 glass-card border border-slate-850 rounded-[28px] p-6 md:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Campus Announcements
            </h2>
            <span className="text-xs font-bold text-blue-400 cursor-pointer hover:text-blue-300 transition-colors uppercase tracking-wider">
              View All
            </span>
          </div>

          <div className="space-y-4">
            {updates.map((item, idx) => (
              <div
                key={idx}
                className="flex gap-4 p-4 rounded-2xl hover:bg-slate-900/40 border border-transparent hover:border-slate-800/60 transition-all duration-200"
              >
                <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-900 border border-slate-800 text-blue-400 flex items-center justify-center text-lg">
                  📢
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm md:text-base leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-slate-400 text-xs md:text-sm mt-1 leading-relaxed">
                    {item.description}
                  </p>
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block mt-2">
                    {item.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links / Resources */}
        <div className="glass-card border border-slate-850 rounded-[28px] p-6 md:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight mb-6">
              Helpful Resources
            </h2>

            <div className="space-y-4">
              <div className="group flex items-center justify-between p-4 border border-slate-800/80 rounded-2xl hover:bg-slate-900/40 hover:border-blue-500/20 transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-500 flex items-center justify-center">
                    <Award size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Syllabus PDF</h4>
                    <p className="text-xs text-slate-400">Download course syllabus</p>
                  </div>
                </div>
                <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition duration-200 font-bold">
                  →
                </span>
              </div>

              <div className="group flex items-center justify-between p-4 border border-slate-800/80 rounded-2xl hover:bg-slate-900/40 hover:border-blue-500/20 transition cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-550 flex items-center justify-center">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Academic Calendar</h4>
                    <p className="text-xs text-slate-400">View schedules & holidays</p>
                  </div>
                </div>
                <span className="text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition duration-200 font-bold">
                  →
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;