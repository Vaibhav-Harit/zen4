import React, { useState, useRef } from 'react';
import { Camera, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContextFeeder({ onSubmit, isAnalyzing }) {
  const [errorLogs, setErrorLogs] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setScreenshot(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setScreenshot(file);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ errorLogs, codeSnippet, screenshot });
    }
  };

  return (
    <div className="bg-[#0a0f1c]/60 backdrop-blur-2xl border border-white/5 rounded-2xl p-6 flex flex-col gap-5 w-full h-full text-white shadow-[0_0_50px_-12px_rgba(0,0,0,0.8)] relative overflow-hidden group/container">
      {/* Subtle background glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-purple-500/5 opacity-0 group-hover/container:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Top Section: Drag & Drop Zone */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className={`relative flex flex-col items-center justify-center p-8 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden ${
          isDragging 
            ? 'bg-purple-500/10' 
            : 'hover:bg-white/5 bg-black/40'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {/* Animated Dashed Border */}
        <div className={`absolute inset-0 rounded-xl border-2 border-dashed transition-colors duration-300 ${isDragging ? 'border-purple-400' : 'border-cyan-500/30 group-hover:border-purple-500/50'}`} />
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Camera className={`w-12 h-12 mb-4 transition-colors duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] ${isDragging ? 'text-purple-400 scale-110' : 'text-cyan-400 group-hover:text-purple-400'}`} />
        {screenshot ? (
          <>
            <span className="text-sm font-medium text-green-400 drop-shadow-[0_0_5px_currentColor]">✓ {screenshot.name}</span>
            <span className="text-xs text-white/40 mt-1 font-mono">&gt;&gt; RE-INITIALIZE IMAGE</span>
          </>
        ) : (
          <>
            <span className="text-sm font-bold tracking-wide text-white/90">Drop screenshot for Nexus OCR</span>
            <span className="text-xs text-white/40 mt-2 font-mono uppercase tracking-widest">or click to browse files</span>
          </>
        )}
      </motion.div>

      {/* Middle Section: Text Inputs */}
      <div className="flex flex-col gap-4 flex-1">
        <label className="flex flex-col gap-2 group">
          <span className="text-xs uppercase tracking-widest font-semibold text-white/60 group-focus-within:text-cyan-400 transition-colors">&gt;&gt; Error Stack Trace</span>
          <textarea 
            value={errorLogs}
            onChange={(e) => setErrorLogs(e.target.value)}
            className="w-full bg-[#05080f] border border-white/5 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all resize-none h-28 font-mono placeholder-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] leading-relaxed"
            placeholder="[Paste error manifestation logs here...]"
          />
        </label>

        <label className="flex flex-col gap-2 group flex-1">
          <span className="text-xs uppercase tracking-widest font-semibold text-white/60 group-focus-within:text-purple-400 transition-colors">&gt;&gt; Defective Code Snippet</span>
          <textarea 
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            className="w-full flex-1 min-h-[140px] bg-[#05080f] border border-white/5 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none font-mono placeholder-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] leading-relaxed"
            placeholder="[Inject vulnerable code vector here...]"
          />
        </label>
      </div>

      {/* Bottom Section: Submit Button */}
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={isAnalyzing || (!errorLogs && !codeSnippet && !screenshot)}
        className="relative w-full flex items-center justify-center gap-3 py-4 mt-2 rounded-xl bg-gradient-to-r from-purple-600 to-[#06b6d4] font-black tracking-widest uppercase text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
        
        {isAnalyzing ? (
          <>
             <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin relative z-10" />
             <span className="relative z-10 transition-all">Synthesizing...</span>
          </>
        ) : (
          <>
             <Zap className="w-5 h-5 relative z-10 group-hover/btn:scale-110 group-hover/btn:text-yellow-300 transition-transform" />
             <span className="relative z-10">Snap it!</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
