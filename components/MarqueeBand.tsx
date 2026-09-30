const ITEMS = [
  "Precision Fades",
  "Beard Sculpting",
  "Hot Towel Shave",
  "Sharp Line Ups",
  "Scissor Work",
  "Grey Blending",
  "Kids Cuts",
  "Walk-Ins Welcome",
];

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <div key={item} className="flex items-center">
          <span className="px-8 font-[family-name:var(--font-display)] text-2xl uppercase tracking-[0.22em] text-[#0B0B0C] lg:text-3xl">
            {item}
          </span>
          <span className="flex h-6 w-6 items-center justify-center text-[#0B0B0C]">
            <i className="ri-scissors-2-line text-xl" />
          </span>
        </div>
      ))}
    </div>
  );
}

export default function MarqueeBand() {
  return (
    <div className="atb-marquee-wrap relative w-full overflow-hidden border-y border-[#C9A227] bg-[#C9A227] py-4">
      <div className="atb-marquee-track flex w-max">
        <Row />
        <Row />
      </div>
    </div>
  );
}