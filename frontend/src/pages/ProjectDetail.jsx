import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { processStream } from "../utils/streamDecoder";
import { motion } from "framer-motion";
import toast from 'react-hot-toast';

export default function ProjectDetail() {
  const { id } = useParams();

  const [errorLog, setErrorLog] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [streamedResponse, setStreamedResponse] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSnapIt = async () => {
    setIsAnalyzing(true);
    setStreamedResponse("");
    const toastId = toast.loading('Running Neural Search & OCR...');

    try {
      const token = localStorage.getItem("snapit_access");

      const response = await fetch("/api/errors/analyze/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          project_id: id,
          error_log: errorLog,
          code_snippet: codeSnippet,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze");
      }

      await processStream(response, (chunk) => {
        setStreamedResponse((prev) => prev + chunk);
      });
      toast.success('Snap complete!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Snap failed!', { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const mockHandleSnapIt = () => {
    setIsAnalyzing(true);
    setStreamedResponse("");
    const toastId = toast.loading('Running Neural Search & OCR...');

    const fakeMarkdown = `### Analysis Complete\nI reviewed the stack trace and the code snippet. The \`TypeError\` suggests that \`project_id\` is undefined during the initial render. \n\n### Suggested Fix\nWrap your fetching logic in a useEffect dependency check to ensure \`project_id\` is available before requesting:\n\n\`\`\`javascript\nuseEffect(() => {\n  if (!project_id) return;\n  fetchData(project_id);\n}, [project_id]);\n\`\`\`\n`;
    const tokens = fakeMarkdown.split(" ");
    let index = 0;

    const interval = setInterval(() => {
      if (index < tokens.length) {
        setStreamedResponse((prev) => prev + (index === 0 ? "" : " ") + tokens[index]);
        index++;
      } else {
        clearInterval(interval);
        setIsAnalyzing(false);
        toast.success('Snap complete!', { id: toastId });
      }
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#121212] py-12 px-6 flex flex-col flex-1 items-center text-white overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel w-full max-w-5xl p-8 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(168,85,247,0.1)]"
      >
        <div className="mb-6 border-b border-white/10 pb-6">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Project Debugger
          </h1>
          <p className="text-gray-400">
            Analyzing context for Project ID:{" "}
            <span className="text-white font-mono bg-white/10 px-2 py-1 rounded">
              {id}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="flex flex-col gap-3">
            <label className="text-gray-300 font-semibold uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded bg-purple-500"></span>
              Error Log
            </label>
            <textarea
              value={errorLog}
              onChange={(e) => setErrorLog(e.target.value)}
              className="h-64 bg-black/40 border border-white/10 rounded-xl p-5 text-gray-300 font-mono text-sm focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none shadow-inner"
              placeholder="Paste the error stack trace here..."
            />
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-gray-300 font-semibold uppercase tracking-wider text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded bg-blue-500"></span>
              Code Snippet
            </label>
            <textarea
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              className="h-64 bg-black/40 border border-white/10 rounded-xl p-5 text-gray-300 font-mono text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none shadow-inner"
              placeholder="Paste the relevant source code here..."
            />
          </div>
        </div>

        <div className="flex justify-end mb-8">
          <button
            onClick={mockHandleSnapIt}
            disabled={isAnalyzing || (!errorLog && !codeSnippet)}
            className="group relative px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Analyzing...
              </span>
            ) : (
              "Snap It"
            )}
            <div className="absolute inset-0 rounded-xl border border-white/40 group-hover:scale-105 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"></div>
          </button>
        </div>

        {streamedResponse && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-8 pt-8 border-t border-white/10 overflow-hidden"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
              <h3 className="text-xl font-bold text-white tracking-wide">
                AI Analysis Stream
              </h3>
            </div>
            <div className="bg-[#0D0D0D] border border-white/10 rounded-xl p-6 overflow-x-auto">
              <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                {streamedResponse}
              </pre>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
