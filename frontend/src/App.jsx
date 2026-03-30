import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthCallback from "./pages/AuthCallback";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail";
import { DemoProvider } from "./context/DemoContext";

import TestView from "./pages/TestView"; 
import NotFound from "./pages/NotFound";

function App() {
  return (
    <DemoProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#333",
            color: "#fff",
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
    </DemoProvider>
  );
}

export default App;
