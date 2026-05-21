export default function SomaticCoachLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAF6] px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 space-y-2">
          <div className="h-3 w-32 rounded-full bg-cream-300 animate-pulse" />
          <div className="h-10 w-64 rounded-xl bg-cream-200 animate-pulse" />
          <div className="h-4 w-96 max-w-full rounded-lg bg-cream-200 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] gap-5">
          <div className="h-80 rounded-3xl bg-white/70 border border-white/40 animate-pulse" />
          <div className="h-[420px] rounded-3xl bg-cream-200/80 animate-pulse" />
          <div className="h-80 rounded-3xl bg-white/70 border border-white/40 animate-pulse" />
        </div>
        <p className="text-center font-body text-sm text-[#9B9B8C] mt-8" role="status" aria-live="polite">
          Preparing your practice space…
        </p>
      </div>
    </div>
  )
}
