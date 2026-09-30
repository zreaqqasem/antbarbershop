"use client";

import CountUp from "../CountUp";
import Reveal from "../Reveal";
import { useLanguage } from "../LanguageProvider";

export default function StatsStrip() {
  const { t } = useLanguage();

  return (
    <section className="relative w-full overflow-hidden border-t border-[#1B1B1E] bg-[#0E0E10] px-6 py-16 lg:px-10">
      <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-[#C9A227]/10 blur-3xl atb-blob" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-72 w-72 rounded-full bg-[#C9A227]/[0.07] blur-3xl atb-blob" />
      <div className="relative mx-auto grid max-w-[1280px] grid-cols-2 gap-8 lg:grid-cols-4">
        {t.stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 90} className="text-center">
            <p className="font-[family-name:var(--font-display)] text-5xl tracking-wide text-[#C9A227] lg:text-6xl">
              <CountUp to={s.value} decimals={s.decimals} />
              {s.suffix}
            </p>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#8E897F]">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}