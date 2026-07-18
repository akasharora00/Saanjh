import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    icon: "📚",
    title: "Smart Notes",
    description: "Upload, organize and access PDF notes shared by students and faculty anytime.",
  },
  {
    icon: "📢",
    title: "Announcements",
    description: "Never miss important university updates, class circulars or critical notices.",
  },
  {
    icon: "📅",
    title: "Events Tracker",
    description: "Discover workshops, hackathons, seminars and club activities in one premium timeline.",
  },
  {
    icon: "📝",
    title: "Class Activities",
    description: "Track academic deadlines, tasks, and syllabus resources without stress.",
  },
];

const Features = () => {
  return (
    <section
      id="features"
      className="py-24 bg-gradient-to-b from-[#0F172A] to-slate-950/80 relative"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center relative z-10">
          <span className="text-blue-500 font-bold uppercase tracking-widest text-xs">
            Core Features
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mt-4 tracking-tight">
            Everything your campus needs.
          </h2>
          <p className="text-slate-400 mt-6 text-lg max-w-2xl mx-auto leading-relaxed">
            Designed for students, faculty and administrators to simplify academic logistics with one unified portal.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20 relative z-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group glass-card rounded-[24px] p-8 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2.5 border border-slate-800 hover:border-blue-500/30"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700/60 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:bg-blue-600/10 group-hover:border-blue-500/40 transition-all duration-300">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold mt-8 text-white group-hover:text-blue-400 transition-colors">
                {feature.title}
              </h3>

              <p className="text-slate-400 mt-4 leading-relaxed text-sm">
                {feature.description}
              </p>

              <button className="mt-6 text-blue-500 hover:text-blue-400 font-bold text-sm flex items-center gap-1 cursor-pointer">
                Learn More <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;