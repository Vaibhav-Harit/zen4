import { GitBranch as Github } from "lucide-react";

export default function ProjectCard({ project }) {
  return (
    <div className="glass-panel p-6 rounded-xl flex flex-col h-40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] cursor-pointer group">
      <div className="flex justify-between items-start mb-2">
        <span className="text-lg font-bold text-white truncate pr-2">
          {project.name}
        </span>
        {project.is_group ? (
          <span className="shrink-0 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-1 rounded-full text-xs font-semibold">
            Team
          </span>
        ) : (
          <span className="shrink-0 bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Personal
          </span>
        )}
      </div>

      <p className="text-gray-400 text-sm truncate">{project.repo_full_name}</p>

      <div className="mt-auto flex justify-end">
        <Github className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
      </div>
    </div>
  );
}
