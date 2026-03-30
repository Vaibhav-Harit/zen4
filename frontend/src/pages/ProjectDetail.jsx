import React from 'react';
import toast from 'react-hot-toast';

const ProjectDetail = () => {
  const handleSnapIt = async () => {
    // Function ke shuru mein toast.loading trigger karein aur uska ID save karein
    const toastId = toast.loading('Running Neural Search & OCR...');

    try {
      // Simulate an async API request/stream process using a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Jab request/stream finish ho jaye, loading toast ko dismiss karein aur success dikhayein
      toast.success('Snap complete!', { id: toastId });
    } catch (error) {
      // Agar request fail ho toh error toast dikhayein
      toast.error('Snap failed!', { id: toastId });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] bg-[#060914] text-white p-8 rounded-xl border border-gray-800 m-8">
      <h1 className="text-3xl font-bold mb-4">Project Workspace</h1>
      <p className="text-gray-400 mb-8 max-w-lg text-center">
        Aapko 'handleSnapIt' function test karna hai toh niche button par click karehin. Yeh ek simulate karega Neural Search processing ko.
      </p>

      {/* Trigger for the mock OCR and Neural Search action */}
      <button
        onClick={handleSnapIt}
        className="px-6 py-3 bg-[#8B5CF6] hover:bg-purple-500 transition-colors text-white font-semibold flex items-center gap-2 rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.5)] active:scale-95 duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Snap It!
      </button>
    </div>
  );
};

export default ProjectDetail;
