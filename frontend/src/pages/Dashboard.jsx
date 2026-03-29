import React from "react";
import {
  LayoutDashboard,
  History,
  Settings,
  LogOut,
} from "lucide-react";
import ProjectCard from "../components/ProjectCard";

const mockProjects = [
  {
    id: 1,
    name: "snapit-core",
    repo_full_name: "user/snapit-core",
    is_group: false,
  },
  {
    id: 2,
    name: "frontend-ui",
    repo_full_name: "user/frontend-ui",
    is_group: true,
  },
  {
    id: 3,
    name: "django-api",
    repo_full_name: "user/django-api",
    is_group: false,
  },
];

export default function Dashboard() {
  return (
    <div className="flex h-screen w-full bg-[#121212] text-white overflow-hidden">
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
            className="mt-auto gap-3 flex items-center hover:text-[#8B5CF6] transition-colors cursor-pointer text-left"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8 h-full overflow-y-auto">
        <h2 className="text-3xl font-bold mb-8 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
          Your Repositories
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </main>
    </div>
  );
}
