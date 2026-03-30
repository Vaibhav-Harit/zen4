import React from 'react';
import { Archive, Lock, CheckCircle2 } from 'lucide-react';

export default function MySnaps({ snaps = [] }) {
  return (
    <div className="glass-panel w-full sm:w-80 h-full max-h-[700px] flex flex-col rounded-xl border border-white/10 overflow-hidden bg-black/40 backdrop-blur-md shadow-2xl">
      {/* Vault Header */}
      <div className="flex items-center gap-3 p-5 border-b border-white/10 bg-white/5">
        <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
          <Archive className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-white tracking-wide drop-shadow-md">My Snaps Vault</h2>
          <span className="text-[10px] uppercase tracking-widest text-purple-300/70 font-bold">Encrypted Archive</span>
        </div>
      </div>

      {/* History List with Futuristic Scrollbar */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-purple-500/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-purple-500/60 transition-colors pr-2">
        {snaps.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 h-full text-center p-8 opacity-70">
            <Lock className="w-12 h-12 text-gray-600 mb-4 animate-pulse" />
            <p className="text-sm font-semibold text-gray-300">Your vault is completely empty.</p>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">Snap your first bug or error trace to permanently lock it into your history.</p>
          </div>
        ) : (
          snaps.map((snap, index) => (
            <div 
              key={snap.id || index}
              className="group relative p-4 rounded-xl border border-white/5 bg-white/5 cursor-pointer transition-all duration-300 hover:border-purple-500/50 hover:bg-purple-900/20 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-mono text-gray-500 bg-black/30 px-2 py-0.5 rounded ring-1 ring-white/10">#{snap.id || `SNAP-${1024 + index}`}</span>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[9px] font-bold text-green-400 uppercase tracking-widest shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                  <CheckCircle2 className="w-3 h-3" />
                  Resolved
                </span>
              </div>
              
              <p className="text-sm text-gray-300 font-medium line-clamp-2 leading-relaxed group-hover:text-white transition-colors duration-300">
                {snap.error_text || "Warning: Invalid configuration detected in module boundaries during rendering pipeline."}
              </p>
              
              {/* Subtle bottom accent line that fills on hover */}
              <div className="absolute left-0 bottom-0 w-0 h-[2px] bg-gradient-to-r from-purple-500 to-blue-500 group-hover:w-full transition-all duration-500 ease-out opacity-0 group-hover:opacity-100" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
