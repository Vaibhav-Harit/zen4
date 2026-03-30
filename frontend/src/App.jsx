import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthCallback from "./pages/AuthCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail";

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
          <Route
            path="/project/:id"
            element={
              <ProtectedRoute>
                <ProjectDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
