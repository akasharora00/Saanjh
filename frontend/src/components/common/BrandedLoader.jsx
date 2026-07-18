import React from "react";

const BrandedLoader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Decorative blurred background shapes */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="relative flex flex-col items-center z-10">
        {/* Glowing pulsing logo ring */}
        <div className="relative flex items-center justify-center w-24 h-24 rounded-3xl bg-slate-900 border border-violet-500/20 shadow-2xl">
          <span className="text-white text-5xl font-bold animate-pulse">⌘</span>
          {/* Rotating gradient ring */}
          <div className="absolute inset-0 rounded-3xl border border-transparent border-t-violet-500 border-r-violet-500 animate-spin [animation-duration:1.5s]"></div>
        </div>

        {/* Text indicators */}
        <h2 className="mt-8 text-xl font-bold text-white tracking-wider animate-pulse">
          Saanjh
        </h2>
        <p className="mt-2 text-sm text-slate-400 font-medium">
          Loading your campus experience...
        </p>
      </div>
    </div>
  );
};

export default BrandedLoader;
