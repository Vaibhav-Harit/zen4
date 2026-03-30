import React, { useState } from 'react';
import { Info } from 'lucide-react';

export default function TerminalOutput({ onResolve }) {
  const [isContributing, setIsContributing] = useState(false);

  // Fake error trace for the mock terminal window
  const fakeTrace = `[14:40:22] Starting Snap-it Neural Analysis...
[14:40:23] Parsing context blocks...
[14:40:24] ERROR DETECTED:
Traceback (most recent call last):
  File "manage.py", line 22, in <module>
    execute_from_command_line(sys.argv)
  File "django/core/management/__init__.py", line 446, in execute_from_command_line
    utility.execute()
django.db.utils.IntegrityError: duplicate key value violates unique constraint "auth_user_username_key"
DETAIL:  Key (username)=(admin) already exists.

[14:40:25] Snap-it AI Engine suggests: This commonly occurs when attempting to create a user that already exists. Wrap the creation logic with get_or_create() or catch the IntegrityError exception during the POST request handling.`;

  return (
    <div className="flex flex-col w-full bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-2xl h-full max-h-[650px]">
      
      {/* Top Section: Fake Terminal Logs */}
      <div className="flex-1 flex flex-col bg-[#0d1117] overflow-hidden">
        {/* Fake Mac Header */}
        <div className="bg-[#161b22] px-4 py-3 flex items-center border-b border-gray-700 relative flex-shrink-0">
          <div className="flex gap-2 z-10">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-inner"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-inner"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-inner"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-gray-400 text-sm font-semibold tracking-wide">
              Neural Search Lab Preview
            </span>
          </div>
        </div>

        {/* Fake Logs */}
        <div className="p-6 flex-1 overflow-y-auto font-mono text-sm text-green-400 whitespace-pre-wrap break-words leading-relaxed [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-green-500/30 hover:[&::-webkit-scrollbar-thumb]:bg-green-500/50">
          {fakeTrace}
          <div className="animate-pulse bg-green-400 w-2 h-5 inline-block ml-1 align-middle opacity-80" />
        </div>
      </div>

      {/* Bottom Section: Resolution Panel */}
      <div className="p-5 bg-gray-800/50 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">
        
        {/* Primary Action Button */}
        <button
          onClick={() => onResolve && onResolve(isContributing)}
          className="px-6 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-green-400 to-blue-500 hover:scale-105 transition-transform duration-200 shadow-[0_0_15px_rgba(74,222,128,0.3)] active:scale-95 whitespace-nowrap"
        >
          Mark as Resolved! 🚀
        </button>

        {/* Contribution Toggle Area */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-300">
              Contribute to Global Knowledge Block
            </span>
            <div className="group relative flex items-center justify-center">
              <Info className="w-4 h-4 text-gray-400 hover:text-white cursor-help transition-colors" />
              
              {/* Hover Tooltip */}
              <div className="absolute bottom-full mb-3 right-0 w-48 p-2 bg-gray-900 border border-gray-600 text-xs text-gray-300 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-center shadow-2xl z-20">
                Share this error and fix anonymously to help other developers.
                <div className="absolute top-full right-2 border-4 border-transparent border-t-gray-900" />
              </div>
            </div>
          </div>

          {/* Toggle Switch */}
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
    </div>
  );
}
