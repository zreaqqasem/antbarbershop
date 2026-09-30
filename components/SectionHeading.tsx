export default function SectionHeading({
  overline,
  title,
  subtitle,
  align = "left",
}: {
  overline?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  const centered = align === "center";
  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {overline && (
        <span
          className={`inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-[#C9A227] ${
            centered ? "justify-center" : ""
          }`}
        >
          <span className="h-px w-8 bg-[#C9A227]" />
          {overline}
        </span>
      )}
      <h2 className="mt-4 font-[family-name:var(--font-display)] text-4xl leading-[1.05] tracking-wide text-[#F5F2EC] lg:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-[#A9A49A]">{subtitle}</p>
      )}
    </div>
  );
}