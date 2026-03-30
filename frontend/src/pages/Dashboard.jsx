import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  History,
  Settings,
  LogOut,
} from "lucide-react";
import ContextFeeder from "../components/ContextFeeder";
import TerminalOutput from "../components/TerminalOutput";
import ProjectCard from "../components/ProjectCard";
import toast from "react-hot-toast";
import axiosInstance from "../api/axios";
import { useNavigate } from "react-router-dom";

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
        // Fall back to empty list – user see an empty state
      })
      .finally(() => setIsLoadingProjects(false));
  }, []);

  const handleSnapSubmit = async ({ errorLogs, codeSnippet, screenshot }) => {
    setIsAnalyzing(true);
    setTerminalContent("");
    const toastId = toast.loading("Running Neural Search & OCR...");

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
        throw new Error(`Analysis failed with status ${response.status}`);
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
            // Skip non-JSON chunks
          }
        }
      }

      toast.success("Snap complete!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Snap failed! " + error.message, { id: toastId });
      setTerminalContent(
        (prev) => prev + `\n\n❌ Error: ${error.message}\n`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("snapit_access");
    localStorage.removeItem("snapit_refresh");
    navigate("/login");
  };

  return (
    <div className="flex h-screen w-full bg-[#121212] text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 h-full border-r border-white/10 p-6 hidden md:flex flex-col relative z-20">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-8">
          snap.it
        </div>

        <nav className="flex flex-col flex-1">
          <div className="flex flex-col gap-1">
            <div className="hover:text-[#8B5CF6] transition-colors gap-3 flex items-center mb-4 cursor-pointer">
              <LayoutDashboard className="h-5 w-5 shrink-0" />
              Dashboard
            </div>
            <div className="hover:text-[#8B5CF6] transition-colors gap-3 flex items-center mb-4 cursor-pointer">
              <History className="h-5 w-5 shrink-0" />
              Recent Snaps
            </div>
            <div className="hover:text-[#8B5CF6] transition-colors gap-3 flex items-center mb-4 cursor-pointer">
              <Settings className="h-5 w-5 shrink-0" />
              Settings
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-auto gap-3 flex items-center hover:text-[#8B5CF6] transition-colors cursor-pointer text-left"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 h-full overflow-y-auto">
        {/* Snap Analysis Panel */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-12 items-stretch">
          <ContextFeeder onSubmit={handleSnapSubmit} isAnalyzing={isAnalyzing} />
          <div className="flex flex-col gap-0 min-h-[500px]">
            <TerminalOutput
              content={terminalContent}
              isThinking={isAnalyzing}
              onResolve={(isContributing) => {
                toast.success(
                  isContributing
                    ? "Marked resolved & shared globally! 🌍"
                    : "Marked as resolved! ✅"
                );
              }}
            />
          </div>
        </div>

        {/* Projects */}
        <h2 className="text-3xl font-bold mb-8 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          Your Repositories
        </h2>

        {isLoadingProjects ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No repositories found.</p>
            <p className="text-sm mt-2">
              Login with GitHub to sync your repos, or use the Snap panel above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} onClick={() => navigate(`/project/${project.id}`)}>
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}