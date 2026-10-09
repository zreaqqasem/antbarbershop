"use client";

import { useEffect, useRef } from "react";
import ClipperArt, { type ClipperPart } from "../ClipperArt";
import { useLanguage } from "../LanguageProvider";
import { BOOKING_URL, FADE_IMAGE } from "../../lib/data";
import { ease, lerp, prefersReducedMotion, seg, useScrollProgress } from "../scroll";

// Stage viewBox: wide enough for the exploded parts and their callouts.
const VB = { x: -450, y: -640, w: 900, h: 1360 };
const at = (x: number, y: number) => ({
  left: `${((x - VB.x) / VB.w) * 100}%`,
  top: `${((y - VB.y) / VB.h) * 100}%`,
});

// How far each part travels (SVG units) when fully exploded.
const SPREAD: Record<ClipperPart, number> = {
  guard: -300,
  cutter: -190,
  blade: -120,
  motor: -40,
  body: 150,
};

// Callout anchors at full explosion: part, side, y.
const CALLOUTS: { side: "left" | "right"; y: number }[] = [
  { side: "left", y: -520 },
  { side: "right", y: -375 },
  { side: "left", y: -150 },
  { side: "right", y: 250 },
];

export default function ClipperStory() {
  const { t } = useLanguage();
  const s = t.story;

  const section = useRef<HTMLElement | null>(null);
  const stage = useRef<HTMLDivElement | null>(null);
  const parts = useRef<Partial<Record<ClipperPart, SVGGElement | null>>>({});
  const heads = useRef<(HTMLDivElement | null)[]>([]);
  const callouts = useRef<(HTMLDivElement | null)[]>([]);
  const scene = useRef<HTMLDivElement | null>(null);
  const reveal = useRef<HTMLDivElement | null>(null);
  const mini = useRef<HTMLDivElement | null>(null);
  const cta = useRef<HTMLAnchorElement | null>(null);
  const hint = useRef<HTMLDivElement | null>(null);
  const bar = useRef<HTMLDivElement | null>(null);

  const apply = (p: number) => {
    const intro = ease(seg(p, 0, 0.14));
    const e = ease(seg(p, 0.18, 0.4)) - ease(seg(p, 0.56, 0.68));
    const out = seg(p, 0.66, 0.74);

    if (stage.current) {
      const rot = lerp(-28, 0, intro) + out * -60;
      const scale = lerp(0.7, 1, intro) - e * 0.08 - out * 0.3;
      stage.current.style.transform = `translateY(${(1 - intro) * 18}%) rotate(${rot}deg) scale(${scale})`;
      stage.current.style.opacity = String(Math.min(intro * 1.4, 1) * (1 - out));
    }
    for (const [name, el] of Object.entries(parts.current)) {
      el?.setAttribute("transform", `translate(0 ${SPREAD[name as ClipperPart] * e})`);
    }

    const windows = [
      1 - seg(p, 0.12, 0.18),
      seg(p, 0.2, 0.26) * (1 - seg(p, 0.56, 0.62)),
      seg(p, 0.72, 0.78) * (1 - seg(p, 0.88, 0.92)),
      seg(p, 0.9, 0.96),
    ];
    heads.current.forEach((el, i) => {
      if (!el) return;
      const o = windows[i];
      el.style.opacity = String(o);
      el.style.transform = `translateY(${(1 - o) * 24}px)`;
      el.style.visibility = o < 0.01 ? "hidden" : "visible";
    });

    callouts.current.forEach((el, i) => {
      if (!el) return;
      const o = seg(p, 0.3 + i * 0.04, 0.34 + i * 0.04) * (1 - seg(p, 0.52, 0.56));
      el.style.opacity = String(o);
      el.style.setProperty("--line", String(o));
    });

    const show = seg(p, 0.7, 0.77);
    const sweep = ease(seg(p, 0.76, 0.9));
    if (scene.current) {
      scene.current.style.opacity = String(show);
      scene.current.style.transform = `scale(${lerp(0.88, 1, ease(show))})`;
    }
    if (reveal.current) reveal.current.style.clipPath = `inset(0 ${(1 - sweep) * 100}% 0 0)`;
    if (mini.current) {
      mini.current.style.left = `${sweep * 100}%`;
      mini.current.style.opacity = String(seg(p, 0.75, 0.77) * (1 - seg(p, 0.9, 0.93)));
    }
    if (cta.current) {
      const o = seg(p, 0.92, 0.97);
      cta.current.style.opacity = String(o);
      cta.current.style.transform = `translateY(${(1 - o) * 16}px)`;
      cta.current.style.pointerEvents = o > 0.5 ? "auto" : "none";
    }
    if (hint.current) hint.current.style.opacity = String(1 - seg(p, 0, 0.05));
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
  };

  useScrollProgress(section, (p) => apply(prefersReducedMotion() ? 1 : p));

  // Re-apply after a language switch re-renders the text nodes.
  useEffect(() => {
    window.dispatchEvent(new Event("scroll"));
  }, [t]);

  return (
    <section
      ref={section}
      aria-label={s.introTitle}
      className="relative h-[520vh] w-full border-t border-[#1B1B1E] bg-[#08080A] motion-reduce:h-auto"
    >
      <div className="sticky top-0 flex h-[100svh] w-full flex-col items-center overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C9A227]/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#08080A_85%)]" />

        <div className="relative z-10 mt-24 grid w-full max-w-4xl px-6 text-center lg:mt-28">
          {[
            [s.introTitle, s.introSub],
            [s.explodeTitle, s.explodeSub],
            [s.fadeTitle, s.fadeSub],
            [s.endTitle, ""],
          ].map(([title, sub], i) => (
            <div
              key={i}
              ref={(el) => {
                heads.current[i] = el;
              }}
              className="col-start-1 row-start-1"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <h2 className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-wide text-[#F5F2EC] sm:text-6xl lg:text-7xl">
                {title}
              </h2>
              {sub && <p className="mt-4 text-sm uppercase tracking-[0.24em] text-[#C9A227]">{sub}</p>}
            </div>
          ))}
        </div>

        <div className="relative flex w-full flex-1 items-center justify-center">
          <div
            ref={stage}
            className="relative aspect-[900/1360] h-[min(72svh,130vw)] will-change-transform"
            style={{ opacity: 0 }}
          >
            <ClipperArt
              id="story"
              viewBox={`${VB.x} ${VB.y} ${VB.w} ${VB.h}`}
              className="absolute inset-0 h-full w-full drop-shadow-[0_40px_60px_rgba(0,0,0,0.6)]"
              partRef={(name, el) => {
                parts.current[name] = el;
              }}
            />
            {CALLOUTS.map((c, i) => {
              const right = c.side === "right";
              const pos = at(right ? 150 : -150, c.y);
              return (
                <div
                  key={i}
                  ref={(el) => {
                    callouts.current[i] = el;
                  }}
                  className={`absolute hidden -translate-y-1/2 items-center gap-3 md:flex ${right ? "" : "-translate-x-full flex-row-reverse"}`}
                  style={{ ...pos, opacity: 0 }}
                >
                  <span
                    className="block h-px w-16 origin-left bg-[#C9A227] lg:w-24"
                    style={{ transform: "scaleX(var(--line, 0))", transformOrigin: right ? "left" : "right" }}
                  />
                  <div className={`w-44 lg:w-52 ${right ? "text-left" : "text-right"}`}>
                    <p className="font-[family-name:var(--font-display)] text-xl tracking-wide text-[#F5F2EC] lg:text-2xl">
                      {s.callouts[i].title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-[#A9A49A] lg:text-sm">{s.callouts[i].text}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            ref={scene}
            className="absolute aspect-[4/5] w-[min(84vw,52svh)] overflow-hidden sm:aspect-[4/3] sm:w-[min(86vw,62svh*1.33,760px)] rounded-3xl border border-[#2A2A2E] shadow-[0_40px_120px_rgba(0,0,0,0.7)]"
            style={{ opacity: 0 }}
          >
            <img src={FADE_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover blur-[6px] grayscale" />
            <div className="absolute inset-0 bg-[#08080A]/40" />
            <div ref={reveal} className="absolute inset-0" style={{ clipPath: "inset(0 100% 0 0)" }}>
              <img src={FADE_IMAGE} alt={s.fadeTitle} className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div
              ref={mini}
              className="pointer-events-none absolute top-1/2 h-[64px] w-[200px] -translate-x-full -translate-y-1/2 sm:h-[80px] sm:w-[252px]"
              style={{ left: 0, opacity: 0 }}
            >
              <span className="absolute inset-y-0 right-0 w-px bg-[#F7E8AE] shadow-[0_0_24px_6px_rgba(247,215,116,0.6)]" />
              <div className="atb-buzz absolute inset-0">
                <ClipperArt
                  id="mini"
                  viewBox="-140 -330 280 880"
                  className="absolute left-1/2 top-1/2 h-[200px] w-[64px] -translate-x-1/2 -translate-y-1/2 rotate-90 sm:h-[252px] sm:w-[80px]"
                />
              </div>
            </div>
          </div>

          <a
            ref={cta}
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-[8svh] z-10 inline-flex items-center gap-2 rounded-full bg-[#C9A227] px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#0B0B0C] shadow-[0_20px_60px_rgba(201,162,39,0.35)] transition-colors hover:bg-[#E0B93A]"
            style={{ opacity: 0, pointerEvents: "none" }}
          >
            <i className="ri-calendar-line" />
            {t.book}
          </a>
        </div>

        <div
          ref={hint}
          className="absolute bottom-8 flex flex-col items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-[#8E897F]"
        >
          {s.scroll}
          <span className="block h-10 w-px animate-pulse bg-gradient-to-b from-[#C9A227] to-transparent" />
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-[#1B1B1E]">
          <div ref={bar} className="h-full origin-left bg-[#C9A227]" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  );
}
