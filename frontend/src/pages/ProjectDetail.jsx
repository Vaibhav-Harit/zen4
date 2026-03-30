import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { processStream } from "../utils/streamDecoder";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ContextFeeder from "../components/ContextFeeder";
import TerminalOutput from "../components/TerminalOutput";
import { useDemo } from "../context/DemoContext";
import PRModal from "../components/PRModal";
import confetti from "canvas-confetti";

export default function ProjectDetail() {
  const { id } = useParams();
  const { isDemoMode } = useDemo();

  const [streamedResponse, setStreamedResponse] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // PR Modal State
  const [showPRModal, setShowPRModal] = useState(false);
  const [prUrl, setPrUrl] = useState("");

  const handleCreatePR = async () => {
    if (isDemoMode) {
      const toastId = toast.loading("Creating PR...");
      setTimeout(() => {
        toast.dismiss(toastId);
        toast.success('PR created offline! 🚀');
        setPrUrl("https://github.com/zen3/snapit/pull/1");
        setShowPRModal(true); // Open Siya's PR Modal
      }, 2000);
      return;
    }

    const toastId = toast.loading("Creating PR...");
    try {
      const token = localStorage.getItem("snapit_access");
      // Placeholder for real API
      const response = await fetch("/api/pr/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ project_id: id })
      });
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setPrUrl(data.pr_url || "https://github.com/zen3/snapit/pull/real");
      setShowPRModal(true);
      toast.success('PR created successfully! 🚀', { id: toastId });
    } catch (e) {
      toast.error('Failed to create PR', { id: toastId });
    }
  };

  const handleSnapIt = async ({ errorLogs, codeSnippet, screenshot }) => {
    setIsAnalyzing(true);
    setStreamedResponse("");
    const toastId = toast.loading("Running Neural Search & OCR...");

    if (isDemoMode) {
      const mockMarkdown = `
# Neural Search Analysis Complete 🚀

Based on the provided context, I've identified the root cause of the crash.

## The Problem
The error occurs because the database connection drops unexpectedly before the transaction can successfully commit to the disk.

## The Fix
Use connection pooling and wrap your queries in a safe transaction block:

\`\`\`javascript
async function executeTransaction(pool, query) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(query);
    await client.query('COMMIT');
    return result.rows;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
\`\`\`

### Key Improvements:
- **Connection Safety**: Client is always released back to the pool.
- **Data Integrity**: ROLLBACK aborts changes if queries fail.
`;
      
      const words = mockMarkdown.split(" ");
      let index = 0;
      
      const intervalId = setInterval(() => {
        if (index < words.length) {
          // Append 3 words at a time as requested
          const chunk = words.slice(index, index + 3).join(" ") + " ";
          setStreamedResponse((prev) => prev + chunk);
          index += 3;
        } else {
          clearInterval(intervalId);
          setIsAnalyzing(false);
          confetti({
            particleCount: 150,
            spread: 85,
            origin: { y: 0.6 },
            colors: ['#a855f7', '#3b82f6']
          });
          toast.success("Snap complete!", { id: toastId });
        }
      }, 30);
      
      return; // Skip actual API call
    }

    try {
      const token = localStorage.getItem("snapit_access");

      // Build FormData for multipart upload (supports screenshot per Generality Contract)
      const formData = new FormData();
      formData.append("error_text", errorLogs || "");
      formData.append("code_snippet", codeSnippet || "");
      formData.append("project_id", id || "unknown");
      if (screenshot) {
        formData.append("screenshot", screenshot);
      }

      const response = await fetch("/api/errors/analyze/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set Content-Type manually — let browser set the boundary
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze");
      }

      await processStream(response, (chunk) => {
        setStreamedResponse((prev) => prev + chunk);
      });
      confetti({
        particleCount: 150,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#3b82f6']
      });
      toast.success("Snap complete!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Snap failed!", { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] py-12 px-6 flex flex-col flex-1 items-center text-white overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl"
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

        {/* 2-column grid: ContextFeeder (left) + TerminalOutput (right) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
          <ContextFeeder onSubmit={handleSnapIt} isAnalyzing={isAnalyzing} />
          <div className="min-h-[500px] flex flex-col gap-4">
            <TerminalOutput content={streamedResponse} isThinking={isAnalyzing} />
            
            {streamedResponse && (
              <button 
                onClick={handleCreatePR}
                className="self-end px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 rounded-lg text-white font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.4)] active:scale-95"
              >
                Create PR
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {showPRModal && (
        <PRModal prUrl={prUrl} onClose={() => setShowPRModal(false)} />
      )}
    </div>
  );
}
