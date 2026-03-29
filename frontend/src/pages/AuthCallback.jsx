import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../api/axios.js";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get("code");
  const [message] = useState("Authenticating with GitHub...");

  useEffect(() => {
    if (!code) {
      navigate("/login");
      return;
    }

    axios
      .post("/api/auth/github/", { code })
      .then((response) => {
        localStorage.setItem("snapit_access", response.data.access);
        localStorage.setItem("snapit_refresh", response.data.refresh);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error(error);
        navigate("/login");
      });
  }, [code, navigate]);

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
      <p className="animate-pulse text-lg font-medium">{message}</p>
    </div>
  );
}
