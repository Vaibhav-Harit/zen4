import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function PRModal({ prUrl, onClose }) {
  useEffect(() => {
    confetti({
      particleCount: 200,
      spread: 120,
      origin: { y: 0.5 },
      colors: ['#a855f7', '#3b82f6'] // Matching the snap.it theme
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-[#121212] p-8 rounded-2xl border border-white/10 text-center space-y-6 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold text-white">PR Created!</h2>
        <p className="text-gray-400">Your fix is ready for review on GitHub.</p>
        <a href={prUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 font-mono bg-blue-500/10 px-4 py-2 rounded-lg hover:bg-blue-500/20 transition-colors block break-all">
          {prUrl}
        </a>
        <button 
          onClick={onClose} 
          className="mt-6 w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
