import React, { useState, useEffect } from "react";
import ContextFeeder from "../components/ContextFeeder";
import TerminalOutput from "../components/TerminalOutput";
import ProjectCard from "../components/ProjectCard";
import SidebarLayout from "../components/SidebarLayout";
import toast from "react-hot-toast";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();
  const [terminalContent, setTerminalContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  // Fetch real projects from API on mount
  useEffect(() => {
    axiosInstance
      .get("/api/projects/me/")
      .then(({ data }) => setProjects(data))
      .catch((err) => {
         console.error("Failed to load projects:", err);
      })
      .finally(() => setIsLoadingProjects(false));
  }, []);

  const handleSnapSubmit = async ({ errorLogs, codeSnippet, screenshot }) => {
    setIsAnalyzing(true);
    setTerminalContent("");
    const toastId = toast.loading("Executing Neural Search & RAG DB OCR...", {
        style: { background: "rgba(30, 41, 59, 0.8)", backdropFilter: "blur(10px)", color: "#fff", border: "1px solid rgba(6, 182, 212, 0.2)" }
    });

    try {
      const token = localStorage.getItem("snapit_access");

      const formData = new FormData();
      formData.append("error_text", errorLogs || "");
      formData.append("code_snippet", codeSnippet || "");
      formData.append("project_id", "dashboard");
      if (screenshot) {
        formData.append("screenshot", screenshot);
      }

      const response = await fetch("/api/errors/analyze/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Analysis failed. Server Status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const pieces = chunk.split("\n\n").filter((s) => s !== "");

        for (const piece of pieces) {
          const jsonText = piece.startsWith("data: ")
            ? piece.slice("data: ".length)
            : piece;
          try {
            const parsed = JSON.parse(jsonText);
            setTerminalContent((prev) => prev + (parsed.chunk || ""));
          } catch {
            // Processing chunks
          }
        }
      }

      toast.success("Synthesis Complete", { id: toastId, style: { background: "rgba(16, 185, 129, 0.2)", backdropFilter: "blur(10px)", color: "#fff", border: "1px solid rgba(16, 185, 129, 0.5)" } });
    } catch (error) {
      toast.error("Neural Matrix Failed: " + error.message, { id: toastId, style: { background: "rgba(239, 68, 68, 0.2)", backdropFilter: "blur(10px)", color: "#fff", border: "1px solid rgba(239, 68, 68, 0.5)" } });
      setTerminalContent(
        (prev) => prev + `\n\n❌ Critical System Error: ${error.message}\n`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <SidebarLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-12 pb-24">
        {/* Header Sequence */}
        <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex items-center justify-between"
        >
           <div>
              <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-500 tracking-tight">Main Command <span className="text-cyan-400 font-light">/ Dashboard</span></h2>
              <p className="text-gray-400 font-mono text-sm mt-2 uppercase tracking-widest drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]">Deploy snapshots for instant resolution.</p>
           </div>
        </motion.div>

        {/* Neural Analysis Panel Split */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch">
          <ContextFeeder onSubmit={handleSnapSubmit} isAnalyzing={isAnalyzing} />
          <div className="flex flex-col gap-0 min-h-[500px]">
            <TerminalOutput
              content={terminalContent}
              isThinking={isAnalyzing}
              onResolve={(isContributing) => {
                toast.success(
                  isContributing
                    ? "Stored & shared to Global Knowledge Vector DB! 🌍"
                    : "Thread marked resolved. ✅",
                    { style: { background: "rgba(30, 41, 59, 0.8)", border: "1px solid #10b981", color: "#fff" } }
                );
              }}
            />
          </div>
        </div>

        {/* Repositories */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold mb-6 text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.3)] border-b border-white/10 pb-4">
              Linked Repositories
            </h2>

            {isLoadingProjects ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-[spin_2s_linear_infinite] rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400 drop-shadow-[0_0_10px_#22d3ee]" />
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-24 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner">
                <p className="text-xl font-medium text-gray-300">No Git vectors initialized.</p>
                <p className="text-md mt-3 text-cyan-400 font-mono">
                  &gt; Awaiting sync protocol completion...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, idx) => (
                  <motion.div 
                     key={project.id} 
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     transition={{ delay: idx * 0.1 }}
                     whileHover={{ y: -5, shadow: "0 20px 25px -5px rgba(168, 85, 247, 0.2)" }}
                     onClick={() => navigate(`/project/${project.id}`)}
                     className="cursor-pointer"
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </div>
            )}
        </motion.div>
      </div>
    </SidebarLayout>
  );
}