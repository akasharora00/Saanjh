import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="bg-[#0F172A] py-16 md:py-24 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-blue-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse-glow"></div>
      <div className="absolute bottom-10 -right-40 w-96 h-96 bg-violet-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse-glow" style={{ animationDelay: "1s" }}></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-blue-550 animate-ping"></span>
            Now live at 12+ campuses
          </span>

          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mt-8">
            Connecting Campus,
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              Empowering Every Student.
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl mt-8 leading-relaxed max-w-lg">
            Replace fragmented WhatsApp groups, scattered PDFs, and broken ERP portals with one unified, premium portal built for modern university life.
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 transition-all duration-300 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 text-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Get Started Free →
            </Link>

            <button className="border border-slate-700/80 hover:bg-slate-800/80 transition-all text-slate-200 px-8 py-4 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
              Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Right Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex justify-center lg:justify-end"
        >
          {/* Main Image Frame */}
          <div className="rounded-[40px] bg-gradient-to-tr from-blue-500/20 to-violet-600/20 p-2.5 shadow-2xl shadow-blue-900/10">
            <div className="overflow-hidden rounded-[30px] border border-white/5 relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900"
                alt="students studying together"
                className="w-full max-w-[480px] h-[400px] md:h-[480px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 to-transparent"></div>
            </div>
          </div>

          {/* Floating Announcement Widget */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute -top-6 right-0 md:-right-6 glass-card rounded-2xl px-5 py-4 flex items-center gap-4 shadow-xl pointer-events-none"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/35 flex items-center justify-center text-blue-400 text-lg">
              📢
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">New Announcement</h3>
              <p className="text-slate-400 text-xs mt-0.5">Exam timetable released</p>
            </div>
          </motion.div>

          {/* Floating Submission Success Widget */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-6 left-0 md:-left-6 glass-card rounded-2xl px-5 py-4 flex items-center gap-4 shadow-xl pointer-events-none"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/35 flex items-center justify-center text-emerald-400 text-lg">
              ✓
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Assignment Submitted</h3>
              <p className="text-slate-400 text-xs mt-0.5">CS302 • Just now</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;