import Spline from '@splinetool/react-spline';

export default function Hero3D() {
  return (
    <div className="relative h-screen w-full flex flex-col md:flex-row items-center bg-[#121212] overflow-hidden">
      
      {/* Left Side: Text & Call to Action */}
      <div className="z-10 w-full md:w-1/2 p-10 flex flex-col justify-center">
        <h1 className="text-6xl font-bold text-white mb-4">
          Debug with <span className="text-[#8B5CF6]">snap.it</span>
        </h1>
        <p className="text-gray-300 text-xl mb-8">
          Your AI-powered assistant for catching errors before they break production.
        </p>
        <button className="px-8 py-3 rounded-xl text-white font-semibold border border-white/10 bg-white/5 backdrop-blur-md hover:border-[#8B5CF6] transition-all w-max">
          Start Debugging
        </button>
      </div>

      {/* Right Side: Your 3D Robot */}
      {/* On mobile, this sits behind the text. On desktop, it takes the right half. */}
      <div className="absolute inset-0 md:relative md:w-1/2 h-full z-0">
        <Spline scene="https://prod.spline.design/8otgvnkQ3Xpu-oz2/scene.splinecode" />
      </div>

    </div>
  );
}