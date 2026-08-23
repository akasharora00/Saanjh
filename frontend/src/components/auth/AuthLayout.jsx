import React from "react";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#0F172A] text-slate-100 font-sans relative overflow-hidden">
      {/* BACKGROUND ORBS */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none animate-pulse-glow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-violet-550/10 blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: "1.5s" }}></div>

      {/* LEFT PANEL */}
      <div className="hidden lg:flex relative overflow-hidden bg-slate-950/20 border-r border-slate-900">
        <div className="relative flex flex-col justify-between h-full w-full p-16 z-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0F172A] border border-slate-850/80 overflow-hidden flex items-center justify-center shadow-lg shadow-blue-500/10">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">UniSphere</h1>
          </div>

          {/* Core Branding */}
          <div className="my-auto py-12 space-y-8">
            <h2 className="text-5xl font-extrabold text-white leading-[1.15] tracking-tight">
              One platform.
              <br />
              Every campus need.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md">
              Notes, events, assignments and announcements — beautifully unified for the modern university experience.
            </p>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-2 gap-6 mt-14 max-w-md">
              <div className="glass-card rounded-[24px] border border-slate-800/80 p-6 hover:border-blue-500/20 transition-colors duration-300">
                <h3 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
                  15K+
                </h3>
                <p className="text-slate-400 text-sm font-semibold mt-1">Students</p>
              </div>

              <div className="glass-card rounded-[24px] border border-slate-800/80 p-6 hover:border-blue-500/20 transition-colors duration-300">
                <h3 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
                  800+
                </h3>
                <p className="text-slate-400 text-sm font-semibold mt-1">Faculty</p>
              </div>

              <div className="glass-card rounded-[24px] border border-slate-800/80 p-6 hover:border-blue-500/20 transition-colors duration-300">
                <h3 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
                  40K+
                </h3>
                <p className="text-slate-400 text-sm font-semibold mt-1">Notes Shared</p>
              </div>

              <div className="glass-card rounded-[24px] border border-slate-800/80 p-6 hover:border-blue-500/20 transition-colors duration-300">
                <h3 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
                  12
                </h3>
                <p className="text-slate-400 text-sm font-semibold mt-1">Campuses</p>
              </div>
            </div>
          </div>

          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} UniSphere Technologies.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL - FLOATING CARD */}
      <div className="flex items-center justify-center p-6 md:p-12 relative z-10">
        <div className="w-full max-w-lg glass-card rounded-[32px] border border-slate-800 p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Card inner subtle glow */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {title}
            </h1>
            <p className="text-slate-400 text-sm mt-2 mb-8">
              {subtitle}
            </p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;