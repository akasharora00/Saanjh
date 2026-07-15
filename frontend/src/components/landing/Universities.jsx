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
    <section className="py-10 bg-slate-50/70 border-y border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400/80 mb-8">
          ⚡ Empowering Students across Top Universities & Colleges
        </p>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
          {universities.map((uni, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 opacity-60 hover:opacity-100 transition-all duration-300 transform hover:scale-105 cursor-default group"
            >
              <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center border border-slate-100 group-hover:shadow-md transition">
                <span className="text-lg">{uni.logo}</span>
              </div>
              <span className="font-semibold text-slate-700 text-sm md:text-base">
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
