import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function InteractiveBackground({ children }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative w-full h-full bg-[#0a0a0f] overflow-hidden text-white perspective-[1000px]">
      
      {/* Subtle ambient core glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-gradient-to-r from-purple-600/20 to-[#06b6d4]/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      {/* Parallax Background Particles Layer */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        animate={{
          x: mousePos.x * -1.5,
          y: mousePos.y * -1.5,
        }}
        transition={{ type: "spring", damping: 50, stiffness: 100 }}
      >
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
      </motion.div>

      {/* Perspective Grid Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[60%] overflow-hidden pointer-events-none z-0">
         <div className="absolute inset-0 w-full h-[200%] [transform-origin:bottom] [transform:perspective(500px)_rotateX(75deg)_translateY(-20%)]">
             <div className="absolute inset-0 border-t border-cyan-500/10 [backgroundImage:linear-gradient(to_right,rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px] animate-[grid-move_10s_linear_infinite]" />
         </div>
         {/* Fade gradient for the floor */}
         <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#0a0a0f]/80 to-[#0a0a0f]" />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes grid-move {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
      `}} />

      {/* Main Content Render */}
      <div className="relative z-10 w-full h-full flex flex-col">
          {children}
      </div>
    </div>
  );
}
