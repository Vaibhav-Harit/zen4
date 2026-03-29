import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("snapit_access");

  if (token) {
    return children;
  }

  return <Navigate to="/login" replace />;
}
