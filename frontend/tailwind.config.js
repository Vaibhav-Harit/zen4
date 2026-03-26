/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        snap: {
          950: "#060914",
          900: "#0B1020",
          850: "#0A132A",
          800: "#0E1736",
          750: "#101B3F",
          700: "#182449",
          650: "#1A2A5A",
          600: "#21325E",
          500: "#2B3C73",
          400: "#5B6B9A",
          300: "#7C8DB8",
          200: "#A6B3DE",
          150: "#C2C8FF",
          100: "#D9DBFF",
          50: "#EEF0FF",
        },
        neon: {
          purple: "#A855F7",
          blue: "#38BDF8",
          cyan: "#22D3EE",
          fuchsia: "#E879F9",
        },
      },
      boxShadow: {
        neon:
          "0 0 0 1px rgba(168,85,247,0.15), 0 0 30px rgba(56,189,248,0.22), 0 0 80px rgba(168,85,247,0.16)",
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(70% 70% at 20% 20%, rgba(168,85,247,0.40) 0%, rgba(6,9,20,0) 60%), radial-gradient(60% 60% at 80% 10%, rgba(56,189,248,0.32) 0%, rgba(6,9,20,0) 55%), linear-gradient(180deg, rgba(6,9,20,1) 0%, rgba(11,16,32,1) 100%)",
      },
    },
  },
  plugins: [],
};

