export default function BarberPole({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <span className="h-3 w-7 rounded-full border border-[#3A3A3F] bg-gradient-to-b from-[#3A3A3F] to-[#1B1B1E]" />
      <div className="relative mt-1 w-7 overflow-hidden rounded-full border border-[#2E2E33] bg-[#0B0B0C] p-[3px] shadow-[0_18px_40px_rgba(0,0,0,0.55)]">
        <div className="atb-pole-stripes h-40 w-full rounded-full" />
        <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-black/50 via-transparent to-white/10" />
      </div>
      <span className="mt-1 h-3 w-7 rounded-full border border-[#3A3A3F] bg-gradient-to-b from-[#1B1B1E] to-[#3A3A3F]" />
    </div>
  );
}