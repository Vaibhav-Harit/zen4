import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthCallback from "./AuthCallback";
import EmptyState from "./components/EmptyState";
import ProjectSkeleton from "./components/ProjectSkeleton";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

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
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/" element={<Dashboard />} />
          
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
