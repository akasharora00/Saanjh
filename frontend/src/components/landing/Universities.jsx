import React from "react";

const universities = [
  { name: "Chitkara University", logo: "🏫" },
  { name: "IIT Delhi", logo: "🎓" },
  { name: "BITS Pilani", logo: "🏛️" },
  { name: "Delhi University", logo: "🏫" },
  { name: "Amity University", logo: "🎓" },
  { name: "Thapar Institute", logo: "🏛️" },
  { name: "LPU", logo: "🏫" },
  { name: "PEC Chandigarh", logo: "🎓" },
];

const Universities = () => {
  return (
    <section className="py-12 bg-slate-950/20 border-y border-slate-800/50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">
          ⚡ Empowering Students across Top Universities & Colleges
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
          {universities.map((uni, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 opacity-50 hover:opacity-90 hover:scale-105 transition-all duration-300 cursor-default group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-750 flex items-center justify-center shadow-md group-hover:border-blue-500/50 group-hover:shadow-blue-500/10 transition-all duration-300">
                <span className="text-lg">{uni.logo}</span>
              </div>
              <span className="font-bold text-slate-300 group-hover:text-white text-sm tracking-wide">
                {uni.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Universities;
