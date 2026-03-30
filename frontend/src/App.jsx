import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthCallback from "./pages/AuthCallback";
import EmptyState from "./components/EmptyState";
import ProjectCard from "./components/ProjectCard";
import ProjectSkeleton from "./components/ProjectSkeleton";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail"; // Added for routing
import TerminalOutput from "./components/TerminalOutput"; // So user can preview it!

// Placeholder markdown for previewing TerminalOutput
const sampleMarkdown = `
## Neural Search Result
Here is the extracted code:
\`\`\`javascript
function helloWorld() {
  console.log("Hello from snap.it!");
}
helloWorld();
\`\`\`
`;

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#ffffff",
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          {/* New Route for testing the Project UI Components */}
          <Route path="/project" element={
            <div className="bg-[#060914] min-h-screen text-white">
              <ProjectDetail />
              {/* Added TerminalOutput here to let you test the Smart Copy button! */}
              <div className="p-8 max-w-4xl mx-auto">
                <h2 className="text-xl font-bold mb-4 text-gray-300">Terminal Output Preview:</h2>
                <TerminalOutput content={sampleMarkdown} />
              </div>
            </div>
          } />

          {/* TEMPORARY: test UI — remove once project list / empty state routing is wired */}
          <Route
            path="/dev"
            element={
              <main style={{ fontFamily: "Arial, sans-serif", padding: "2rem" }}>
                <h1>Django + Vite/React Stack</h1>
                <p>Frontend is running in Docker on port 5173.</p>
                <div className="mx-auto mt-10 flex w-full max-w-md flex-col items-center gap-8">
                  <ProjectSkeleton />
                  <EmptyState />
                </div>
              </main>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
