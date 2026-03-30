import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-center p-4 selection:bg-purple-500/30">
      
      {/* Visual Glitch/Warning Background Wrapper */}
      <div className="relative flex flex-col items-center z-10">
        
        {/* Massive Glowing Header */}
        <h1 className="text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-indigo-600 drop-shadow-[0_0_25px_rgba(168,85,247,0.6)] animate-pulse tracking-tighter mb-2">
          404
        </h1>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* Sleek Subtitle */}
        <div className="flex items-center gap-3 text-gray-400 mt-6">
          <AlertTriangle className="w-6 h-6 text-yellow-500/80" />
          <p className="text-xl md:text-2xl font-medium tracking-wide">
            This repository is lost to the void.
          </p>
        </div>

        <p className="text-gray-500 mt-4 max-w-sm leading-relaxed mb-10 text-sm">
          The endpoint or page you're trying to reach doesn't exist. It might have been deleted, moved, or never existed in this branch.
        </p>

        {/* Action Button */}
        <button
          onClick={() => navigate('/')}
          className="group relative px-8 py-4 bg-gray-900/50 backdrop-blur border-2 border-purple-500/60 text-purple-300 font-bold rounded-xl overflow-hidden shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-300 active:scale-95"
        >
          {/* Hover Glow Background */}
          <div className="absolute inset-0 bg-purple-500/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          <span className="relative flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Base
          </span>
        </button>

      </div>
    </div>
  );
}
