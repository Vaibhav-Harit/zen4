import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MySnaps from '../components/MySnaps';
import TerminalOutput from '../components/TerminalOutput';
import PRModal from '../components/PRModal'; 

const mockSnaps = [
  {
    id: 'SNAP-2041',
    error_text: 'OperationalError: connection to server at "127.0.0.1", port 5433 failed: Connection refused',
    resolved: true,
  },
  {
    id: 'SNAP-2042',
    error_text: "TypeError: Cannot read properties of undefined (reading 'project_id')",
    resolved: true,
  },
  {
    id: 'SNAP-2043',
    error_text: 'django.db.utils.IntegrityError: duplicate key value violates unique constraint "auth_user_username_key"',
    resolved: true,
  }
];

export default function TestView() {
  const [snapsData, setSnapsData] = useState(mockSnaps);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSnaps = () => {
    setSnapsData(prev => prev.length === 0 ? mockSnaps : []);
  };

  const handleResolution = (isContributing) => {
    alert(`Bug Squashed! 🚀\nShared to Global Knowledge Block: ${isContributing}`);
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex p-8 gap-8 font-sans overflow-hidden">
      {/* Main Workspace (Left) */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative h-full">
        
        {/* Decorative ambient background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Terminal Output with Resolution Panel built-in */}
        <div className="w-full h-full flex flex-col gap-6 z-10 p-4">
          <TerminalOutput onResolve={handleResolution} />

          {/* Test Buttons Row */}
          <div className="flex justify-center mt-auto gap-4 flex-wrap">
            <button 
              onClick={toggleSnaps}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 transition-colors font-bold shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95 duration-200"
            >
              {snapsData.length === 0 ? 'Inject Mock Snaps' : 'Purge Vault (Empty State)'}
            </button>

            {/* Simulated PR Creation Button */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 rounded-xl border border-white/20 bg-gray-800 hover:bg-gray-700 hover:border-white/40 transition-colors font-bold shadow-lg active:scale-95 duration-200"
            >
              Simulate PR Creation 🚀
            </button>
            
            {/* Fast-Track 404 Routing Button */}
            <button 
              onClick={() => navigate('/broken-link-test')}
              className="px-6 py-3 rounded-xl border-2 border-dashed border-red-500/40 bg-red-900/20 text-red-300 hover:bg-red-500/30 hover:border-red-400 font-bold shadow-lg active:scale-95 duration-200"
            >
              Test 404 Page 🛸
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Navigation Area (Right) */}
      <div className="w-80 h-full flex-shrink-0 hidden md:block">
        <MySnaps snaps={snapsData} />
      </div>

      {/* Render the PRModal */}
      <PRModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        prUrl="https://github.com/snap-it/demo/pull/1" 
      />
    </div>
  );
}
