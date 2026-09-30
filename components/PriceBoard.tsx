type Row = { label: string; price: string };

export default function PriceBoard({
  title,
  subtitle,
  rows,
  footer,
  className,
}: {
  title: string;
  subtitle?: string;
  rows: Row[];
  footer?: string[];
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[#2E2E33] bg-[#101012]/90 p-3 shadow-[0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-md ${
        className || ""
      }`}
    >
      <div className="rounded-xl border border-[#2A2A2E] bg-gradient-to-b from-[#161618] to-[#0E0E10] p-6">
        <div className="text-center">
          <p className="font-[family-name:var(--font-display)] text-2xl tracking-[0.14em] text-[#F5F2EC]">
            {title}
          </p>
          {subtitle && (
            <p className="mt-1 font-[family-name:var(--font-arabic)] text-base text-[#C9A227]">
              {subtitle}
            </p>
          )}
        </div>
        <div className="my-5 h-px bg-[#2A2A2E]" />
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r.label} className="flex items-baseline gap-3">
              <span className="font-[family-name:var(--font-display)] text-lg uppercase tracking-wide text-[#EDE9E1]">
                {r.label}
              </span>
              <span className="flex-1 border-b border-dotted border-[#3A3A3F]" />
              <span className="font-[family-name:var(--font-display)] text-lg text-[#C9A227]">
                ${r.price}
              </span>
            </li>
          ))}
        </ul>
        {footer && footer.length > 0 && (
          <>
            <div className="my-5 h-px bg-[#2A2A2E]" />
            <div className="space-y-1 text-center">
              {footer.map((f) => (
                <p key={f} className="text-sm tracking-wide text-[#A9A49A]">
                  {f}
                </p>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}