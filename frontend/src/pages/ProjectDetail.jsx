import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { processStream } from "../utils/streamDecoder";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ContextFeeder from "../components/ContextFeeder";
import TerminalOutput from "../components/TerminalOutput";

export default function ProjectDetail() {
  const { id } = useParams();

  const [streamedResponse, setStreamedResponse] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSnapIt = async ({ errorLogs, codeSnippet, screenshot }) => {
    setIsAnalyzing(true);
    setStreamedResponse("");
    const toastId = toast.loading("Running Neural Search & OCR...");

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
          <div className="min-h-[500px]">
            <TerminalOutput content={streamedResponse} isThinking={isAnalyzing} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
