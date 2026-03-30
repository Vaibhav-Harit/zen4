import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Info } from 'lucide-react';

export default function TerminalOutput({ content, isThinking, onResolve }) {
  const [isCopied, setIsCopied] = useState(false);
  const [isContributing, setIsContributing] = useState(false);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className={`terminal-container rounded-xl overflow-hidden bg-[#0d1117] border border-gray-700 shadow-2xl flex flex-col h-full max-h-[650px] text-gray-100 transition-shadow duration-300 ${isThinking ? 'shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'shadow-lg'
      }`}>
      {/* macOS-style Header Bar */}
      <div className="flex justify-between items-center bg-[#161b22] px-4 py-3 border-b border-gray-700 relative flex-shrink-0">
        {/* Traffic Light Dots */}
        <div className="flex gap-2 z-10">
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

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 relative z-10 ${isCopied
              ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
              : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
        >
          {isCopied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Terminal Output Body with dynamic ReactMarkdown parsing */}
      <div className="terminal-output p-5 flex-1 overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap break-words [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-green-500/30 hover:[&::-webkit-scrollbar-thumb]:bg-green-500/50">
        {content ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : !inline && !match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language="text"
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code
                    className={className}
                    style={{
                      backgroundColor: '#2d2d2d',
                      color: '#e6e6e6',
                      padding: '0.2rem 0.4rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.9em'
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                );
              }
            }}
          >
            {content}
          </ReactMarkdown>
        ) : (
          <span className="text-gray-500 font-mono">snap.it // Neural Search Lab v1.0.0{"\n"}Ready for input.{"\n"}</span>
        )}

        {isThinking && (
          <div className="animate-pulse bg-green-400 w-2 h-5 inline-block ml-1 align-middle opacity-80" />
        )}
      </div>

      {/* Bottom Section (from Siya): Resolution Panel */}
      <div className="p-5 bg-gray-800/50 border-t border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0">

        <button
          onClick={() => onResolve && onResolve(isContributing)}
          className="px-6 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-green-400 to-blue-500 hover:scale-105 transition-transform duration-200 shadow-[0_0_15px_rgba(74,222,128,0.3)] active:scale-95 whitespace-nowrap"
        >
          Mark as Resolved! 🚀
        </button>

        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-300">
              Contribute to Global Knowledge Block
            </span>
            <div className="group relative flex items-center justify-center">
              <Info className="w-4 h-4 text-gray-400 hover:text-white cursor-help transition-colors" />
              <div className="absolute bottom-full mb-3 right-0 w-48 p-2 bg-gray-900 border border-gray-600 text-xs text-gray-300 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 text-center shadow-2xl z-20">
                Share this error and fix anonymously to help other developers.
                <div className="absolute top-full right-2 border-4 border-transparent border-t-gray-900" />
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsContributing(!isContributing)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900 ${isContributing ? 'bg-blue-500' : 'bg-gray-600'
              }`}
            role="switch"
            aria-checked={isContributing}
          >
            <span className="sr-only">Toggle Contribution</span>
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm ${isContributing ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
