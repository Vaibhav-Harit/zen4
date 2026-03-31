import React from "react";
import { LayoutDashboard, History, Settings, LogOut, Code2, Bot } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

export default function SidebarLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("snapit_access");
    localStorage.removeItem("snapit_refresh");
    navigate("/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Recent Snaps", path: "/history", icon: <History size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen w-full bg-[#0a0a0f] text-white overflow-hidden relative selection:bg-cyan-500/30">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-600/10 blur-[150px] pointer-events-none rounded-full" />

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-72 h-full bg-white/5 backdrop-blur-3xl border-r border-white/10 hidden md:flex flex-col relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.5)]"
      >
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-tight drop-shadow-sm">
             <Code2 className="text-cyan-400" size={32} />
             snap.it
          </div>
          <p className="text-xs font-mono text-gray-500 mt-2 uppercase tracking-widest pl-11">Neural Debugger</p>
        </div>

        <nav className="flex flex-col flex-1 px-4 mt-8">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.05)" }}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-colors duration-300 relative group overflow-hidden ${
                    isActive ? "text-cyan-400 bg-white/10 font-medium" : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => navigate(item.path)}
                >
                   {isActive && (
                     <motion.div layoutId="sidebar-active" className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                   )}
                   <span className={`relative z-10 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"}`}>
                     {item.icon}
                   </span>
                   <span className="relative z-10">{item.name}</span>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-auto mb-8">
              {/* Floating Mini Mascot */}
              <div className="flex justify-center mb-8 pointer-events-none">
                 <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                 >
                    <Bot size={32} className="text-white drop-shadow-md" />
                 </motion.div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center gap-4 px-4 py-3 text-red-400/80 hover:text-red-400 rounded-xl cursor-pointer transition-colors"
              >
                <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium">Terminate Session</span>
              </motion.button>
          </div>
        </nav>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto relative z-10">
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5, delay: 0.2 }}
           className="h-full"
        >
           {children}
        </motion.div>
      </main>
    </div>
  );
}
