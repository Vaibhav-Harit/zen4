import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Info, Copy, Check, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TerminalOutput({ content, isThinking, onResolve }) {
  const [isCopied, setIsCopied] = useState(false);
  const [isContributing, setIsContributing] = useState(false);
  const [readyText, setReadyText] = useState("");
  const fullReadyText = "System Online. Ready for semantic vector analysis.";

  useEffect(() => {
    if (content) return;
    let index = 0;
    const interval = setInterval(() => {
      setReadyText(fullReadyText.slice(0, index));
      index++;
      if (index > fullReadyText.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [content]);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-[#0a0a0f] border border-white/10 shadow-[0_0_40px_-10px_rgba(0,0,0,0.8)] flex flex-col h-full max-h-[650px] text-gray-100 transition-all duration-500 ${isThinking ? 'shadow-[0_0_50px_rgba(6,182,212,0.2)] border-cyan-500/30' : ''}`}>
      
      {/* Scanline Animation Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,_3px_100%]" style={{ mixBlendMode: 'overlay' }} />
      <style dangerouslySetInnerHTML={{__html:`
         @keyframes scanline {
           0% { transform: translateY(-100%); }
           100% { transform: translateY(100vh); }
         }
         .terminal-scanline {
           position: absolute; top: 0; left: 0; right: 0; bottom: 0;
           background: linear-gradient(to bottom, transparent, rgba(6,182,212,0.4), transparent);
           height: 10px; opacity: 0.1; animation: scanline 6s linear infinite; pointer-events: none; z-index: 10;
         }
      `}}/>
      <div className="terminal-scanline" />

      {/* macOS-style Header Bar */}
      <div className="flex justify-between items-center bg-[#101524]/90 backdrop-blur-md px-4 py-3 border-b border-white/5 relative flex-shrink-0 z-20">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm shadow-[#ff5f56]/50" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm shadow-[#ffbd2e]/50" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm shadow-[#27c93f]/50" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-gray-400 text-xs font-mono uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/5 shadow-inner">
             Neural_Search_Lab v2.1
          </span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors relative ${isCopied ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'}`}
        >
          {isCopied ? <><Check size={14} /><span>Copied</span></> : <><Copy size={14} /><span>Copy Log</span></>}
        </motion.button>
      </div>

      {/* Terminal Output Body */}
      <div className="p-6 flex-1 overflow-y-auto font-mono text-sm leading-relaxed whitespace-pre-wrap break-words relative z-20 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-[#05080f] [&::-webkit-scrollbar-thumb]:bg-cyan-500/30 hover:[&::-webkit-scrollbar-thumb]:bg-cyan-500/50">
        {content ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <div className="my-4 rounded-xl overflow-hidden shadow-2xl border border-white/10">
                    <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" customStyle={{ margin: 0, padding: '1.5rem', background: '#0a0a0f' }} {...props}>
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                ) : !inline && !match ? (
                  <div className="my-4 rounded-xl overflow-hidden shadow-2xl border border-white/10">
                    <SyntaxHighlighter style={vscDarkPlus} language="text" PreTag="div" customStyle={{ margin: 0, padding: '1.5rem', background: '#0a0a0f' }} {...props}>
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className="bg-cyan-900/40 text-cyan-100 px-2 py-0.5 rounded-md text-[0.9em] border border-cyan-500/20" {...props}>{children}</code>
                );
              }
            }}
          >
            {content}
          </ReactMarkdown>
        ) : (
          <div className="text-cyan-500/80 font-mono tracking-wide mt-2">
            <span className="text-purple-400">root@snap.it</span>:<span className="text-blue-400">~</span>$ {readyText}
            {!isThinking && <span className="animate-pulse bg-cyan-400 w-2 h-4 inline-block ml-1 align-middle" />}
          </div>
        )}

        {isThinking && (
          <div className="flex items-center gap-2 mt-4 text-cyan-400 font-mono text-xs uppercase tracking-widest">
            <div className="animate-spin w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full" />
            Generating fix vectors...
          </div>
        )}
      </div>

      {/* Resolution Panel */}
      <div className="p-4 bg-[#101524]/80 backdrop-blur-xl border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 flex-shrink-0 relative z-20">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onResolve && onResolve(isContributing)}
          className="group px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex items-center gap-2 uppercase tracking-wider text-sm w-full sm:w-auto overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Rocket size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
          Mark as Resolved
        </motion.button>

        <div className="flex items-center gap-4 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-200">
               Global Knowledge Block
            </span>
            <div className="group relative">
              <Info className="w-4 h-4 text-cyan-500/50 hover:text-cyan-400 cursor-help" />
              <div className="absolute bottom-full mb-2 right-0 w-48 p-3 bg-black border border-white/10 text-xs text-gray-300 rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl z-30 font-sans normal-case tracking-normal">
                Share this diagnostic snapshot securely to build hive intelligence.
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsContributing(!isContributing)}
            className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${isContributing ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : 'bg-gray-700'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isContributing ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
