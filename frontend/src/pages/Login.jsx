import { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch as Github } from "lucide-react";
import Spline from "@splinetool/react-spline";

const LOGIN_SCENE_URL =
  "https://prod.spline.design/8otgvnkQ3Xpu-oz2/scene.splinecode";

export default function Login() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        {isLoading && (
          <div className="absolute inset-0 bg-[#121212] animate-pulse" />
        )}
        <Spline
          scene={LOGIN_SCENE_URL}
          onLoad={() => setIsLoading(false)}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      <div className="absolute inset-0 z-10 flex items-center justify-center w-full h-full bg-gradient-to-b from-transparent to-[#121212]/90">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-[#121212]/60 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl p-10 flex flex-col items-center text-center max-w-md w-full mx-4 z-20 font-sans"
        >
          <h1 className="text-6xl font-extrabold text-white">
  snap.it
</h1>
          <p className="text-gray-300 text-lg mb-8">
            The AI-Powered Debugger for Elite Developers.
          </p>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          >
            <Github className="h-5 w-5" />
            Login with GitHub
          </button>
        </motion.div>
      </div>
    </section>
  );
}

