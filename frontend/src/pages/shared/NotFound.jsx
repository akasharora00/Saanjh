import React from "react";
import { Link } from "react-router-dom";
import { Compass, Home } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center relative z-10 glass-card rounded-[32px] border border-slate-800 p-10 md:p-14 max-w-lg shadow-2xl flex flex-col items-center"
      >
        <div className="w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-450 flex items-center justify-center mb-8 animate-bounce">
          <Compass size={40} className="stroke-[1.5]" />
        </div>

        <h1 className="text-7xl font-extrabold text-white tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-white mt-4 tracking-tight">Lost in Transit</h2>
        <p className="text-slate-400 mt-4 leading-relaxed text-sm max-w-xs">
          The page you are looking for does not exist or has been moved to another coordinate.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-650 hover:from-blue-500 hover:to-violet-500 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/15 transition-all duration-200 text-sm hover:scale-[1.01] active:scale-[0.99]"
        >
          <Home size={15} />
          Go Back Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;