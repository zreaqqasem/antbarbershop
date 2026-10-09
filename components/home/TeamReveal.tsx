"use client";

import { useRef } from "react";
import { useLanguage } from "../LanguageProvider";
import { TEAM_IMAGE } from "../../lib/data";
import { ease, lerp, prefersReducedMotion, seg, useScrollProgress } from "../scroll";

// The team photo starts as an inset card and grows to fill the screen, then the
// headline rises over it.
export default function TeamReveal() {
  const { t } = useLanguage();
  const section = useRef<HTMLElement | null>(null);
  const frame = useRef<HTMLDivElement | null>(null);
  const photo = useRef<HTMLImageElement | null>(null);
  const copy = useRef<HTMLDivElement | null>(null);

  useScrollProgress(section, (raw) => {
    const p = prefersReducedMotion() ? 1 : raw;
    const grow = ease(seg(p, 0.05, 0.6));
    if (frame.current) {
      const inset = lerp(14, 0, grow);
      const radius = lerp(36, 0, grow);
      frame.current.style.clipPath = `inset(${inset}% ${inset * 1.4}% ${inset}% ${inset * 1.4}% round ${radius}px)`;
    }
    if (photo.current) photo.current.style.transform = `scale(${lerp(1.25, 1, grow)})`;
    if (copy.current) {
      const o = seg(p, 0.55, 0.8);
      copy.current.style.opacity = String(o);
      copy.current.style.transform = `translateY(${(1 - o) * 40}px)`;
    }
  });

  return (
    <section ref={section} className="relative h-[260vh] w-full bg-[#0E0E10] motion-reduce:h-auto">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <div
          ref={frame}
          className="absolute inset-0 will-change-[clip-path]"
          style={{ clipPath: "inset(14% 19.6% 14% 19.6% round 36px)" }}
        >
          <img
            ref={photo}
            src={TEAM_IMAGE}
            alt={t.team.title}
            className="h-full w-full object-cover will-change-transform"
            style={{ transform: "scale(1.25)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/30 to-transparent" />
        </div>
        <div
          ref={copy}
          className="absolute inset-x-0 bottom-[12svh] px-6 text-center"
          style={{ opacity: 0 }}
        >
          <h2 className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-wide text-[#F5F2EC] sm:text-7xl">
            {t.team.title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[#D8D3C9]">{t.team.sub}</p>
        </div>
      </div>
    </section>
  );
}
