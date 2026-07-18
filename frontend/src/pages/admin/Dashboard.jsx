import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Users, GraduationCap, FileText, Settings, ShieldAlert, CheckSquare } from "lucide-react";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const { user } = useAuth();

  const stats = [
    {
      title: "Total Students",
      value: "12,480",
      icon: GraduationCap,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Active Faculty",
      value: "540 Members",
      icon: Users,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Published Notes",
      value: "2,840 PDFs",
      icon: FileText,
      color: "from-emerald-500 to-teal-500",
    },
    {
      title: "System Config",
      value: "Online ✅",
      icon: Settings,
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
        className="relative overflow-hidden rounded-[30px] bg-gradient-to-tr from-blue-700 via-blue-600 to-violet-650 text-white p-8 md:p-12 shadow-xl shadow-blue-500/10 border border-white/10"
      >
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <span className="inline-flex bg-white/15 text-white text-[10px] font-extrabold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5 border border-white/10">
            Admin Console
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            System Dashboard, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">{user?.name || "Administrator"}</span> 🛡️
          </h1>
          <p className="mt-4 text-blue-100/90 text-sm max-w-md">
            Manage academic users, inspect platform notes uploads, and customize overall parameters.
          </p>
        </div>
      </motion.div>

      {/* Stats Cards */}
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

      {/* Admin Panel Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* System Logs / Alerts */}
        <div className="glass-card border border-slate-850 rounded-[28px] p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-2.5 mb-6">
            <ShieldAlert className="text-blue-500 animate-pulse" size={22} />
            <h2 className="text-xl font-bold text-white tracking-tight">
              System Audit Flags
            </h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 border border-slate-800/80 rounded-2xl flex items-center justify-between hover:bg-slate-900/40 hover:border-blue-500/10 transition duration-200">
              <span className="text-sm text-slate-350 font-semibold">Database backup completed</span>
              <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">Success</span>
            </div>
            <div className="p-4 border border-slate-800/80 rounded-2xl flex items-center justify-between hover:bg-slate-900/40 hover:border-blue-500/10 transition duration-200">
              <span className="text-sm text-slate-350 font-semibold">JWT session validation cycles verified</span>
              <span className="text-[10px] font-extrabold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">Verified</span>
            </div>
          </div>
        </div>

        {/* Action checklist */}
        <div className="glass-card border border-slate-850 rounded-[28px] p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-2.5 mb-6">
            <CheckSquare className="text-blue-500" size={22} />
            <h2 className="text-xl font-bold text-white tracking-tight">
              Admin Priorities
            </h2>
          </div>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-slate-300 text-sm font-semibold">
              <span className="w-5 h-5 rounded-full border border-blue-550/30 bg-blue-500/10 flex items-center justify-center text-xs font-bold text-blue-400 shrink-0">✓</span>
              Verify notes storage allocation limits.
            </li>
            <li className="flex items-center gap-3 text-slate-300 text-sm font-semibold">
              <span className="w-5 h-5 rounded-full border border-blue-550/30 bg-blue-500/10 flex items-center justify-center text-xs font-bold text-blue-400 shrink-0">✓</span>
              Review registration department metrics.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;