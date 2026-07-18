import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Core coordinates of cursor
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for outer ring trailing lag
  const springConfig = { damping: 35, stiffness: 350, mass: 0.45 };
  const ringX = useSpring(cursorX, springConfig);
  const ringY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const checkMobile = () => {
      const isTouch = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
      setIsMobile(isTouch);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (isMobile) return;

    const moveCursor = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const addHoverListeners = () => {
      const targets = document.querySelectorAll(
        "a, button, input, select, textarea, [role='button'], .glass-card, .group, input[type='checkbox']"
      );
      targets.forEach((target) => {
        target.addEventListener("mouseenter", () => setIsHovered(true));
        target.addEventListener("mouseleave", () => setIsHovered(false));
      });
    };

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    addHoverListeners();
    const scanInterval = setInterval(addHoverListeners, 1000);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      clearInterval(scanInterval);
    };
  }, [cursorX, cursorY, isMobile, isVisible]);

  if (isMobile || !isVisible) return null;

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovered ? 44 : 22,
          height: isHovered ? 44 : 22,
          borderColor: isHovered ? "rgba(139, 92, 246, 0.65)" : "rgba(59, 130, 246, 0.4)",
          backgroundColor: isHovered ? "rgba(139, 92, 246, 0.05)" : "rgba(59, 130, 246, 0)",
        }}
        className="fixed top-0 left-0 rounded-full border pointer-events-none z-9999"
        transition={{ type: "tween", ease: "backOut", duration: 0.2 }}
      />
      {/* Inner Glowing Center Dot */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? 1.4 : 1,
          backgroundColor: isHovered ? "#8B5CF6" : "#3B82F6",
        }}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full pointer-events-none z-9999 shadow-[0_0_8px_rgba(59,130,246,0.6)]"
        transition={{ type: "tween", duration: 0.1 }}
      />
    </>
  );
};

export default CustomCursor;
