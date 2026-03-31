import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthCallback from "./pages/AuthCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail";
import { DemoProvider } from "./context/DemoContext";
import CustomCursor from "./components/CustomCursor";
import TestView from "./pages/TestView"; 
import NotFound from "./pages/NotFound";

function App() {
  if (!import.meta.env.VITE_GITHUB_CLIENT_ID) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "#b91c1c",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <span style={{ fontSize: "4rem" }}>⛔</span>
        <h1
          style={{
            color: "#fff",
            fontSize: "2.5rem",
            fontWeight: 900,
            marginTop: "1rem",
            letterSpacing: "-0.02em",
          }}
        >
          CRITICAL: MISSING VITE_GITHUB_CLIENT_ID in .env!
        </h1>
        <p style={{ color: "#fecaca", fontSize: "1.25rem", marginTop: "1rem" }}>
          Create a <code style={{ background: "#991b1b", padding: "0.2em 0.5em", borderRadius: "4px" }}>.env</code> file
          in <strong>frontend/</strong> and set <strong>VITE_GITHUB_CLIENT_ID</strong> before running the app.
        </p>
      </div>
    );
  }

  return (
    <DemoProvider>
      <CustomCursor>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "rgba(10, 15, 28, 0.8)",
              backdropFilter: "blur(12px)",
              color: "#fff",
              border: "1px solid rgba(6, 182, 212, 0.2)",
              boxShadow: "0 0 20px rgba(168, 85, 247, 0.2)"
            },
          }}
        />
        <BrowserRouter>
        <Routes>
          {/* Main Production Routes */}
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
          <Route
            path="/project/:id"
            element={
              <ProtectedRoute>
                <ProjectDetail />
              </ProtectedRoute>
            }
          />
          
          {/* UI Test Harness Paths */}
          <Route path="/test" element={<TestView />} />
          
          {/* Fallback routing */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </CustomCursor>
    </DemoProvider>
  );
}

export default App;
