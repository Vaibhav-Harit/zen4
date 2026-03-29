import { Toaster } from "react-hot-toast";

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
      </main>
    </>
  );
}

export default App;
