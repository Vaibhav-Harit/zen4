import React from 'react';

export default function TerminalOutput({ content, isThinking }) {
  return (
    <div 
      className={`bg-[#0d1117] rounded-xl border border-white/10 flex flex-col min-h-[500px] h-full overflow-hidden transition-shadow duration-300 ${
        isThinking ? 'shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'shadow-lg'
      }`}
    >
      {/* Header Bar */}
      <div className="bg-[#161b22] px-4 py-3 flex items-center border-b border-white/10 relative">
        {/* Mac OS Control Dots */}
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-inner"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-inner"></div>
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-inner"></div>
        </div>
        
        {/* Centered Title */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-gray-400 text-sm font-semibold tracking-wide">
            Neural Search Lab
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 overflow-y-auto font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
        {content}
        {isThinking && (
          <div className="animate-pulse bg-green-400 w-2 h-5 inline-block ml-1 align-middle opacity-80" />
        )}
      </div>
    </div>
  );
}
