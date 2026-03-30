import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get("code");
  const [message] = useState("Authenticating with GitHub...");
  const hasRun = useRef(false);

  useEffect(() => {
    // Prevent React 18 strict mode from firing this twice
    if (hasRun.current) return;
    hasRun.current = true;

    if (!code) {
      navigate("/login");
      return;
    }

    fetch("/api/auth/github/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Authentication failed");
        }
        return data;
      })
      .then((data) => {
        localStorage.setItem("snapit_access", data.access);
        localStorage.setItem("snapit_refresh", data.refresh);
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Auth callback error:", error);
        // If tokens were already stored by a previous call, just go to dashboard
        if (localStorage.getItem("snapit_access")) {
          navigate("/dashboard");
        } else {
          navigate("/login");
        }
      });
  }, [code, navigate]);

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500" />
        <p className="animate-pulse text-lg font-medium">{message}</p>
      </div>
    </div>
  );
}
