import { Toaster } from "react-hot-toast";
import EmptyState from "./components/EmptyState";
import ProjectSkeleton from "./components/ProjectSkeleton";

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
      <main style={{ fontFamily: "Arial, sans-serif", padding: "2rem" }}>
        <h1>Django + Vite/React Stack</h1>
        <p>Frontend is running in Docker on port 5173.</p>

        {/* TEMPORARY: test UI — remove once project list / empty state routing is wired */}
        <div className="mx-auto mt-10 flex w-full max-w-md flex-col items-center gap-8">
          <ProjectSkeleton />
          <EmptyState />
        </div>
      </main>
    </>
  );
}

export default App;
