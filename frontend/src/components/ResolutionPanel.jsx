import React, { useState } from 'react';
import { Info } from 'lucide-react';

export default function ResolutionPanel({ onResolve }) {
  const [isContributing, setIsContributing] = useState(false);

  return (
    <div className="mt-4 p-5 rounded-xl bg-gray-800/50 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-sm shadow-xl">
      
      {/* Primary Action Button */}
      <button
        onClick={() => onResolve && onResolve(isContributing)}
        className="px-6 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-green-400 to-blue-500 hover:scale-105 transition-transform duration-200 shadow-[0_0_15px_rgba(74,222,128,0.3)] active:scale-95 whitespace-nowrap"
      >
        Mark as Resolved! 🚀
      </button>

      {/* Contribution Toggle Area */}
      <div className="flex items-center gap-3 bg-gray-900/40 p-3 rounded-lg border border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-300">
            Contribute to Global Knowledge Block
          </span>
          <div className="group relative flex items-center justify-center">
            <Info className="w-4 h-4 text-gray-400 hover:text-white cursor-help transition-colors" />
            
            {/* Tooltip */}
            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 p-2 bg-gray-900 border border-white/10 text-xs text-gray-300 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-center shadow-2xl z-20">
              Share this error and fix anonymously to help other developers.
              
              {/* Tooltip Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
            </div>
          </div>
        </div>

        {/* Custom Tailwind Toggle Switch */}
        <button
          onClick={() => setIsContributing(!isContributing)}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 ${
            isContributing ? 'bg-blue-500' : 'bg-gray-600'
          }`}
          role="switch"
          aria-checked={isContributing}
        >
          <span className="sr-only">Toggle Contribution</span>
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm ${
              isContributing ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
