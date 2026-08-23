import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <section className="py-20 bg-[#0F172A]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[40px] bg-gradient-to-tr from-blue-600 via-blue-600 to-violet-600 px-6 py-16 md:p-20 text-center border border-white/10 shadow-2xl shadow-blue-500/10"
        >
          {/* Decorative circles */}
          <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/5 blur-xl"></div>
          <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-white/5 blur-xl"></div>

          {/* Content */}
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1 bg-white/15 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-white/10">
              🚀 Join the Digital Campus Revolution
            </span>

            <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
              Ready to transform your
              <br />
              university experience?
            </h2>

            <p className="mt-6 text-base md:text-lg text-blue-100/90 leading-relaxed max-w-xl mx-auto">
              Join thousands of students and faculty already using <span className="font-bold text-white">UniSphere</span> to stay connected, organized and academic-ready.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="bg-white text-blue-650 hover:bg-slate-50 transition px-8 py-4 rounded-xl font-bold shadow-lg text-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Get Started Free
              </Link>

              <Link
                to="/login"
                className="border border-white/30 text-white hover:bg-white/10 transition px-8 py-4 rounded-xl font-bold text-sm hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                Login to Portal
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;