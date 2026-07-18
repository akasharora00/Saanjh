import React from "react";

const FloatingBackground = () => {
  const elements = [
    { icon: "🎓", style: "top-[15%] left-[8%] animate-float-slow-1 text-3xl", opacity: "opacity-[0.05]" },
    { icon: "📚", style: "top-[25%] right-[10%] animate-float-slow-2 text-4xl", opacity: "opacity-[0.04]" },
    { icon: "⚛️", style: "bottom-[20%] left-[12%] animate-float-slow-3 text-3xl", opacity: "opacity-[0.05]" },
    { icon: "</>", style: "bottom-[30%] right-[15%] animate-float-slow-1 text-2xl font-mono text-purple-400", opacity: "opacity-[0.06]" },
    { icon: "📓", style: "top-[45%] left-[22%] animate-float-slow-2 text-3xl", opacity: "opacity-[0.04]" },
    { icon: "✏️", style: "top-[65%] right-[25%] animate-float-slow-3 text-2xl", opacity: "opacity-[0.05]" },
    { icon: "🖥️", style: "top-[8%] right-[30%] animate-float-slow-1 text-4xl", opacity: "opacity-[0.03]" },
    { icon: "01", style: "bottom-[10%] right-[40%] animate-float-slow-2 text-xl font-bold font-mono text-blue-400", opacity: "opacity-[0.05]" },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {elements.map((el, idx) => (
        <span
          key={idx}
          className={`absolute pointer-events-none select-none blur-[0.5px] transform-gpu ${el.style} ${el.opacity}`}
        >
          {el.icon}
        </span>
      ))}
    </div>
  );
};

export default FloatingBackground;
