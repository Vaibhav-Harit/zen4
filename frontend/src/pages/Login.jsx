import { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch as Github, Zap } from "lucide-react";
import Spline from "@splinetool/react-spline";
import InteractiveBackground from "../components/InteractiveBackground";
import { useDemo } from "../context/DemoContext";
import toast from "react-hot-toast";

const LOGIN_SCENE_URL = "https://prod.spline.design/8otgvnkQ3Xpu-oz2/scene.splinecode";

export default function Login() {
  const [isLoading, setIsLoading] = useState(true);
  const { isDemoMode, setIsDemoMode } = useDemo();

  const handleGithubLogin = () => {
    // If in Demo Mode (e.g. they pressed Ctrl+Shift+D), redirect directly without OAuth.
    if (isDemoMode) {
        toast.success("Bypassing OAuth - Demo Mode Active");
        setTimeout(() => {
           window.location.href = `${window.location.origin}/auth/callback?code=demo`;
        }, 800);
        return;
    }

    const redirectUri = `${window.location.origin}/auth/callback`;
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID || "demo_client_id";
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  return (
    <InteractiveBackground>
      <section className="relative h-screen w-full overflow-hidden flex flex-col md:flex-row items-center justify-between px-6 lg:px-24">
        
        {/* Left Side: 3D Mascot Character */}
        <div className="absolute inset-x-0 top-0 h-1/2 md:relative md:h-full md:w-1/2 flex items-center justify-center pointer-events-none md:pointer-events-auto z-10">
          <motion.div 
             animate={{ y: [-15, 15, -15], rotate: [-1, 1, -1] }}
             transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
             className="w-full h-full max-h-[800px] flex items-center justify-center relative"
          >
             {isLoading && (
               <div className="absolute flex flex-col items-center gap-3">
                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
                 <p className="text-cyan-400 font-mono text-sm tracking-widest uppercase">Initializing Neural Matrix...</p>
               </div>
             )}
             <Spline
                 scene={LOGIN_SCENE_URL}
                 onLoad={() => setIsLoading(false)}
                 style={{ width: "100%", height: "100%", opacity: isLoading ? 0 : 1, transition: "opacity 1s ease-in-out" }}
             />
             
             {/* Global Floor Shadow overlay to hide Spline watermark anywhere on the bottom edge */}
             <div className="fixed bottom-0 left-0 w-full h-20 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/90 to-transparent pointer-events-none z-50" />
             <div className="absolute -bottom-10 w-2/3 h-8 bg-black/80 blur-2xl rounded-[100%] scale-x-150 z-40" />
          </motion.div>
        </div>

        {/* Right Side: Glassmorphism Login Card */}
        <div className="relative z-20 w-full md:w-1/2 flex justify-center mt-64 md:mt-0">
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="w-full max-w-md bg-[#0a0a0f]/40 backdrop-blur-2xl border border-white/5 shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)] rounded-3xl p-10 flex flex-col font-sans"
          >
            <motion.div 
               initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
               className="flex items-center gap-3 mb-2"
            >
               <Zap className="text-cyan-400 h-8 w-8" />
               <h1 className="text-5xl font-extrabold tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                 snap.it
               </h1>
            </motion.div>
            
            <motion.p 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
               className="text-gray-400 text-lg mb-10 font-medium"
            >
              The AI-Powered Debugger <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 font-semibold">for Elite Developers</span>
            </motion.p>
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.03, translateY: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGithubLogin}
              className="group relative w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#182449]/80 to-[#21325E]/80 border border-cyan-500/30 text-white py-4 px-6 rounded-xl font-bold tracking-wide overflow-hidden"
            >
              {/* Animated Button Glow on Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
              
              <Github className="h-6 w-6 text-cyan-50" />
              <span className="relative z-10 text-[1.1rem]">Login with GitHub</span>
            </motion.button>
            
            {/* Keyboard Hint */}
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="mt-6 text-center text-xs text-gray-500 font-mono tracking-widest"
            >
               &gt; SECURE NEURAL CONNECTION
            </motion.p>

          </motion.div>
        </div>
      </section>
    </InteractiveBackground>
  );
}
