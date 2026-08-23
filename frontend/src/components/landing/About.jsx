import React from "react";
import { motion } from "framer-motion";

const About = () => {
  return (
    <section
      id="about"
      className="py-24 bg-[#0F172A] relative"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* LEFT - Image & Stats */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="rounded-[40px] overflow-hidden border border-slate-800 shadow-2xl bg-[#1E293B]/20 p-2.5">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900"
                alt="Students studying"
                className="w-full h-[520px] object-cover rounded-[30px]"
              />
            </div>

            {/* Stats Overlay widget */}
            <div className="absolute -bottom-8 left-6 right-6 md:left-10 md:right-auto glass-card rounded-3xl p-6 flex justify-around md:justify-start gap-10 shadow-2xl border border-slate-800">
              <div>
                <h3 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
                  10K+
                </h3>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
                  Students
                </p>
              </div>

              <div className="w-[1px] bg-slate-800 self-stretch"></div>

              <div>
                <h3 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
                  500+
                </h3>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
                  Faculty
                </p>
              </div>

              <div className="w-[1px] bg-slate-800 self-stretch"></div>

              <div>
                <h3 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
                  50+
                </h3>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-1">
                  Clubs
                </p>
              </div>
            </div>
          </motion.div>

          {/* RIGHT - Content & List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <span className="text-blue-500 font-bold uppercase tracking-widest text-xs">
                Why UniSphere
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-4 tracking-tight leading-[1.15]">
                A complete digital
                <br />
                campus ecosystem.
              </h2>
              <p className="text-slate-400 mt-6 leading-relaxed">
                UniSphere brings together students, faculty and administration on one modern platform to improve communication, collaboration and campus engagement.
              </p>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex gap-5">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-base font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">
                    Centralized Information
                  </h3>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                    Notes, announcements, assignments and schedules all organized in one beautiful dashboard.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-base font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">
                    Better Collaboration
                  </h3>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                    Connect students, study circles and faculty without relying on multiple external communication apps.
                  </p>
                </div>
              </div>

              <div className="flex gap-5">
                <div className="w-10 h-10 shrink-0 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-base font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">
                    Real-time Communication
                  </h3>
                  <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                    Receive instant browser updates about campus activities, events, and resources.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;