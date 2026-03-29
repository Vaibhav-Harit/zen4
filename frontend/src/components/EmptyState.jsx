import { Folder } from "lucide-react";

function EmptyState() {
  return (
    <div className="flex min-h-[min(60vh,320px)] flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <Folder
        className="h-24 w-24 text-slate-300"
        strokeWidth={1.15}
        aria-hidden
      />
      <p className="text-lg font-medium tracking-tight text-slate-600">
        No Repositories Found
      </p>
      <button
        type="button"
        className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-7 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_-4px_rgba(147,51,234,0.65)] ring-1 ring-purple-400/35 transition hover:from-violet-500 hover:to-purple-500 hover:shadow-[0_0_32px_-2px_rgba(168,85,247,0.75)] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2"
      >
        Sync GitHub
      </button>
    </div>
  );
}

export default EmptyState;
