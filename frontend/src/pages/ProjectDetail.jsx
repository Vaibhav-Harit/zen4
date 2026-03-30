import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { processStream } from "../utils/streamDecoder";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ContextFeeder from "../components/ContextFeeder";
import TerminalOutput from "../components/TerminalOutput";
import axiosInstance from "../api/axios";
import MySnaps from "../components/MySnaps";

export default function ProjectDetail() {
  const { id } = useParams();

  const [streamedResponse, setStreamedResponse] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [snaps, setSnaps] = useState([]);
  const [isLoadingSnaps, setIsLoadingSnaps] = useState(true);
  const [currentErrorLogs, setCurrentErrorLogs] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [prUrl, setPrUrl] = useState("");
  const [isPRModalOpen, setIsPRModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchSnaps = async () => {
      try {
        setIsLoadingSnaps(true);
        const { data } = await axiosInstance.get(`/api/projects/${id}/snaps/`);
        if (isMounted) setSnaps(data);
      } catch (error) {
        console.error("Failed to load snap history:", error);
      } finally {
        if (isMounted) setIsLoadingSnaps(false);
      }
    };
    if (id) {
      fetchSnaps();
    }
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleSnapIt = async ({ errorLogs, codeSnippet, screenshot }) => {
    setIsAnalyzing(true);
    setStreamedResponse("");
    setCurrentErrorLogs(errorLogs || "");
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

  const handleResolve = async (isGlobal) => {
    const toastId = toast.loading("Saving to Neural Memory...");
    try {
      await axiosInstance.post("/api/memory/memorize/", {
        project_id: id,
        error_text: currentErrorLogs,
        fixed_code: streamedResponse,
        is_global: isGlobal,
      });
      toast.success("Added to Neural Memory!", { id: toastId });
      // Re-fetch snaps so the new entry appears instantly
      const { data } = await axiosInstance.get(`/api/projects/${id}/snaps/`);
      setSnaps(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save to memory", { id: toastId });
    }
  };

  const handleCreatePR = async () => {
    setIsDeploying(true);
    const toastId = toast.loading("Creating PR on GitHub...");
    try {
      const { data } = await axiosInstance.post("/api/github/create-pr/", {
        project_id: id,
        fixed_code: streamedResponse,
        file_path: "src/App.js",
      });
      setPrUrl(data.pr_url);
      setIsPRModalOpen(true);
      toast.success("PR created successfully!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create PR", { id: toastId });
    } finally {
      setIsDeploying(false);
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
          <div className="flex flex-col gap-4 min-h-[500px]">
            <div className="flex-1">
              <TerminalOutput content={streamedResponse} isThinking={isAnalyzing} />
            </div>
            {streamedResponse && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 justify-end"
              >
                <button
                  onClick={() => handleResolve(false)}
                  className="px-4 py-2 bg-[#161b22] hover:bg-[#21262d] border border-white/10 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Save to Project Memory
                </button>
                <button
                  onClick={() => handleResolve(true)}
                  className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 text-sm font-semibold rounded-lg transition-all flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Save to Global Memory
                </button>
                <button
                  onClick={handleCreatePR}
                  disabled={isDeploying}
                  className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeploying ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-400" />
                  ) : (
                    <span>🚀</span>
                  )}
                  {isDeploying ? "Creating PR..." : "Auto-Create PR"}
                </button>
              </motion.div>
            )}
          </div>
        </div>

        <div className="mt-8">
          {isLoadingSnaps ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <MySnaps snaps={snaps} />
          )}
        </div>
      </motion.div>
    </div>
  );
}
