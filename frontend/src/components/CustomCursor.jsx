import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor({ children }) {
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springX = useSpring(cursorX, { damping: 50, stiffness: 400, mass: 0.5 });
  const springY = useSpring(cursorY, { damping: 50, stiffness: 400, mass: 0.5 });
  
  // Slower spring for the trailing glow effect
  const trailX = useSpring(cursorX, { damping: 60, stiffness: 200, mass: 1 });
  const trailY = useSpring(cursorY, { damping: 60, stiffness: 200, mass: 1 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Check if hovering over magnetic targets (buttons, links with 'magnetic' class or just 'button')
      const target = e.target.closest("button, a, .magnetic");
      if (target) {
        setIsHovering(true);
        // Magnetic pull toward center of button
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // 50% pull to center
        cursorX.set(e.clientX + (centerX - e.clientX) * 0.3);
        cursorY.set(e.clientY + (centerY - e.clientY) * 0.3);
      } else {
        setIsHovering(false);
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Hide default cursor on desktop when this is active via CSS, mapped globally */}
      <style dangerouslySetInnerHTML={{__html: `
         @media (pointer:fine) {
             body { cursor: none !important; }
             a, button, input, select, textarea { cursor: none !important; }
         }
      `}}/>

      {/* Main Cursor Dot */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-cyan-400 rounded-full pointer-events-none z-[9999] shadow-[0_0_10px_#22d3ee] mix-blend-screen hidden md:block"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: isHovering ? 2 : 1 }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Trailing Glow effect */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 bg-purple-500/30 rounded-full blur-md pointer-events-none z-[9998] mix-blend-screen hidden md:block"
        style={{ x: trailX, y: trailY, translateX: "-50%", translateY: "-50%" }}
        animate={{ scale: isHovering ? 1.5 : 1, opacity: isHovering ? 0.8 : 0.4 }}
        transition={{ duration: 0.2 }}
      />
      
      {children}
    </>
  );
}
