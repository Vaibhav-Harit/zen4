import { useEffect } from "react";
import toast from "react-hot-toast";

/** Placeholder until backend OAuth exchange is wired up. */
async function simulateLoginSuccess() {
  await Promise.resolve();
}

function AuthCallback() {
  useEffect(() => {
    async function authenticate() {
      try {
        // TODO: Parse OAuth `code` / `state` from the URL (or hash).
        // TODO: POST to your backend to exchange the code for a session or JWT.
        // TODO: Store tokens securely and redirect to the app dashboard.

        await simulateLoginSuccess();

        toast.success("Welcome to snap.it!");
      } catch {
        toast.error("Login Failed");
      }
    }

    authenticate();
  }, []);

  return null;
}

export default AuthCallback;
