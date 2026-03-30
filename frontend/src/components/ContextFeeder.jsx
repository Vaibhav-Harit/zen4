import React, { useState, useRef } from 'react';
import { Camera, Zap } from 'lucide-react';

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
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 flex flex-col gap-4 w-full h-full text-white">
      {/* Top Section: Drag & Drop Zone */}
      <div 
        className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer group ${
          isDragging 
            ? 'border-purple-500 bg-purple-500/10 scale-[1.02]' 
            : 'border-white/20 hover:border-purple-400 hover:bg-white/5'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Camera className={`w-10 h-10 mb-3 transition-colors duration-300 ${isDragging ? 'text-purple-400' : 'text-white/60 group-hover:text-purple-400'}`} />
        {screenshot ? (
          <>
            <span className="text-sm font-medium text-green-400">✓ {screenshot.name}</span>
            <span className="text-xs text-white/40 mt-1">Click to change</span>
          </>
        ) : (
          <>
            <span className="text-sm font-medium text-white/90">Drop screenshot for Vision OCR</span>
            <span className="text-xs text-white/40 mt-1">or click to browse files</span>
          </>
        )}
      </div>

      {/* Middle Section: Text Inputs */}
      <div className="flex flex-col gap-4 flex-1 mt-2">
        <label className="flex flex-col gap-2 group">
          <span className="text-sm font-semibold text-white/80 group-focus-within:text-purple-400 transition-colors">Error Logs</span>
          <textarea 
            value={errorLogs}
            onChange={(e) => setErrorLogs(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white/90 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none h-28 font-mono placeholder-white/20"
            placeholder="Paste your error logs here..."
          />
        </label>

        <label className="flex flex-col gap-2 group flex-1">
          <span className="text-sm font-semibold text-white/80 group-focus-within:text-blue-400 transition-colors">Code Snippet</span>
          <textarea 
            value={codeSnippet}
            onChange={(e) => setCodeSnippet(e.target.value)}
            className="w-full flex-1 min-h-[120px] bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none font-mono placeholder-white/20"
            placeholder="Paste the relevant code snippet here..."
          />
        </label>
      </div>

      {/* Bottom Section: Submit Button */}
      <button 
        onClick={handleSubmit}
        disabled={isAnalyzing || (!errorLogs && !codeSnippet && !screenshot)}
        className="relative w-full flex items-center justify-center gap-2 py-4 mt-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 font-bold text-lg text-white shadow-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_-3px_rgba(168,85,247,0.7)] hover:scale-[1.02] active:scale-[0.98] group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isAnalyzing ? (
          <>
            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin relative z-10" />
            <span className="relative z-10 tracking-wide">Analyzing...</span>
          </>
        ) : (
          <>
            <Zap className="w-5 h-5 group-hover:animate-pulse group-hover:text-yellow-300 transition-colors duration-300 relative z-10" />
            <span className="relative z-10 tracking-wide">Snap it!</span>
          </>
        )}
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      </button>
    </div>
  );
}
