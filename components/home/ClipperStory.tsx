"use client";

import { useEffect, useRef } from "react";
import { useLanguage } from "../LanguageProvider";
import { BOOKING_URL, FADE_IMAGE } from "../../lib/data";
import { clamp, ease, lerp, prefersReducedMotion, seg } from "../scroll";
import type { ClipperScene, Part } from "../clipper3d";

// The model sits 2 units low in its own space; this recentres it.
const ROOT_Y = 2;
const TIP = 11.3 + ROOT_Y;
const LENGTH = TIP + 15.4 - ROOT_Y;
const SPREAD_TOP = 7.5;
const SPREAD_BOTTOM = 4.6;

// Callout anchors in each part's local space, and which side the label sits on.
const ANCHORS: { part: Part; at: [number, number, number]; side: "left" | "right" }[] = [
  { part: "guard", at: [-3.5, 11, 0], side: "left" },
  { part: "cutter", at: [2.8, 10.2, 0.5], side: "right" },
  { part: "motor", at: [-1.3, 5.2, 0], side: "left" },
  { part: "body", at: [2.4, -2, 0], side: "right" },
];

export default function ClipperStory() {
  const { t } = useLanguage();
  const s = t.story;

  const section = useRef<HTMLElement | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const heads = useRef<(HTMLDivElement | null)[]>([]);
  const callouts = useRef<(HTMLDivElement | null)[]>([]);
  const scene = useRef<HTMLDivElement | null>(null);
  const reveal = useRef<HTMLDivElement | null>(null);
  const edge = useRef<HTMLSpanElement | null>(null);
  const cta = useRef<HTMLAnchorElement | null>(null);
  const hint = useRef<HTMLDivElement | null>(null);
  const bar = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = section.current;
    const cv = canvas.current;
    if (!el || !cv) return;

    let three: ClipperScene | null = null;
    let disposed = false;
    let raf = 0;
    let visible = false;
    let target = 0;
    let current = 0;
    let last = 0;
    const reduced = prefersReducedMotion();

    const measure = () => {
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      target = reduced ? 0.14 : span > 0 ? clamp(-r.top / span) : 0;
    };

    const frame = (now: number) => {
      raf = 0;
      if (disposed) return;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      // Critically damped follow: the scene glides to the scroll position instead of snapping.
      current += (target - current) * (1 - Math.exp(-dt * 7));
      if (Math.abs(target - current) < 0.0002) current = target;
      draw(current, now / 1000);
      if (visible && !reduced) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const draw = (p: number, time: number) => {
      const intro = ease(seg(p, 0, 0.14));
      const e = ease(seg(p, 0.18, 0.4)) - ease(seg(p, 0.56, 0.68));
      const turn = ease(seg(p, 0.64, 0.76));
      const sweep = ease(seg(p, 0.77, 0.9));
      const exit = ease(seg(p, 0.9, 0.98));

      const W = cv.clientWidth;
      const H = cv.clientHeight;

      // Photo card geometry drives where the clipper cuts.
      const show = seg(p, 0.68, 0.76);
      if (scene.current) {
        scene.current.style.opacity = String(show);
        scene.current.style.transform = `scale(${lerp(0.9, 1, ease(show))})`;
      }
      const photo = scene.current?.getBoundingClientRect();
      const canvasBox = cv.getBoundingClientRect();
      const pL = photo ? photo.left - canvasBox.left : W * 0.2;
      const pW = photo ? photo.width : W * 0.6;
      const pCy = photo ? photo.top - canvasBox.top + photo.height * 0.5 : H * 0.55;

      if (three) {
        const upp = three.unitsPerPx();
        const toX = (px: number) => (px - W / 2) * upp;
        const toY = (px: number) => -(px - H / 2) * upp;
        // Fit the model (taller once exploded) into the space under the headline.
        const top = TIP + SPREAD_TOP * e;
        const bottom = -(LENGTH - TIP) - SPREAD_BOTTOM * e;
        // Measured from the tallest headline so long translations still clear it.
        const headWrap = heads.current[0]?.parentElement;
        const headBottom = (headWrap ? headWrap.getBoundingClientRect().bottom - canvasBox.top : H * 0.25) + 52;
        const room = H - headBottom - H * 0.05;
        const fit = Math.min((room * upp) / (top - bottom), (W * 0.9 * upp) / 16);

        // Showcase pose: rises in from below with a turn, then opens up.
        const showScale = lerp(0.6, 1, intro) * fit;
        const showY = toY(headBottom + room / 2) - ((top + bottom) / 2) * showScale + (1 - intro) * -8;
        const rotY = lerp(-2.4, 0.42, intro) - e * 0.22 + Math.sin(time * 0.6) * 0.05 * (1 - turn);
        const rotX = lerp(0.6, 0.1, intro) + e * 0.12 + Math.sin(time * 0.45) * 0.025;

        // Sweep pose: lying flat, blade first, travelling across the photo.
        const sweepScale = Math.min((pW * 0.55 * upp) / LENGTH, showScale || 1);
        const tipPx = pL + pW * sweep + exit * (W - pL + LENGTH / upp);
        const buzz = sweep > 0 && sweep < 1 ? Math.sin(time * 140) * 0.04 : 0;

        const scale = lerp(showScale, sweepScale, turn);
        three.pivot.scale.setScalar(scale);
        three.pivot.rotation.set(
          lerp(rotX, 0.18, turn),
          lerp(rotY, 0.12, turn),
          lerp(lerp(0.3, 0, intro), -Math.PI / 2, turn),
        );
        three.pivot.position.set(
          lerp(0, toX(tipPx) - TIP * sweepScale, turn),
          lerp(showY, toY(pCy) + buzz, turn),
          0,
        );
        three.pivot.children[0].position.y = ROOT_Y;
        three.explode(e);
        cv.style.opacity = String(Math.min(intro * 1.6, 1));
        three.render();

        callouts.current.forEach((c, i) => {
          if (!c) return;
          const a = ANCHORS[i];
          const o = seg(p, 0.29 + i * 0.035, 0.33 + i * 0.035) * (1 - seg(p, 0.52, 0.56));
          const pt = three!.project(a.part, ...a.at);
          c.style.opacity = String(o);
          c.style.transform = `translate3d(${pt.x}px, ${pt.y}px, 0) translate(${a.side === "left" ? "-100%" : "0"}, -50%)`;
          c.style.setProperty("--line", String(o));
        });

        // The reveal edge follows the blade tip as it actually renders.
        const tip = three.project("blade", 0, 11.3, 0).x;
        const cut = clamp((tip - pL) / pW);
        if (reveal.current) reveal.current.style.clipPath = `inset(0 ${(1 - (turn >= 1 ? cut : 0)) * 100}% 0 0)`;
        if (edge.current) {
          edge.current.style.left = `${cut * 100}%`;
          edge.current.style.opacity = String(sweep > 0 && sweep < 1 ? 1 : 0);
        }
      }

      const windows = [
        1 - seg(p, 0.12, 0.18),
        seg(p, 0.2, 0.26) * (1 - seg(p, 0.56, 0.62)),
        seg(p, 0.72, 0.78) * (1 - seg(p, 0.88, 0.92)),
        seg(p, 0.9, 0.96),
      ];
      heads.current.forEach((h, i) => {
        if (!h) return;
        const o = windows[i];
        h.style.opacity = String(o);
        h.style.transform = `translate3d(0, ${(1 - o) * 24}px, 0)`;
        h.style.visibility = o < 0.01 ? "hidden" : "visible";
      });
      if (cta.current) {
        const o = seg(p, 0.92, 0.97);
        cta.current.style.opacity = String(o);
        cta.current.style.transform = `translate3d(0, ${(1 - o) * 16}px, 0)`;
        cta.current.style.pointerEvents = o > 0.5 ? "auto" : "none";
      }
      if (hint.current) hint.current.style.opacity = String(1 - seg(p, 0, 0.05));
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };

    const onScroll = () => {
      measure();
      kick();
    };
    const onResize = () => {
      three?.resize();
      onScroll();
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        last = 0;
        onScroll();
      }
    });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    measure();
    current = target;
    draw(current, 0);

    import("../clipper3d")
      .then(({ createClipperScene }) => {
        if (disposed) return;
        three = createClipperScene(cv);
        draw(current, performance.now() / 1000);
        kick();
      })
      .catch(() => {
        cv.style.display = "none";
      });

    return () => {
      disposed = true;
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      three?.dispose();
    };
  }, []);

  return (
    <section
      ref={section}
      aria-label={s.introTitle}
      className="relative h-[560vh] w-full border-t border-[#1B1B1E] bg-[#08080A] motion-reduce:h-auto"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-[58%] h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,162,39,0.16),transparent_62%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#08080A] to-transparent" />

        <div className="relative z-20 mx-auto mt-24 grid w-full max-w-4xl px-6 text-center lg:mt-28">
          {[
            [s.introTitle, s.introSub],
            [s.explodeTitle, s.explodeSub],
            [s.fadeTitle, s.fadeSub],
            [s.endTitle, ""],
          ].map(([title, sub], i) => (
            <div
              key={i}
              ref={(h) => {
                heads.current[i] = h;
              }}
              className="col-start-1 row-start-1 will-change-transform"
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <h2 className="font-[family-name:var(--font-display)] text-5xl leading-none tracking-wide text-[#F5F2EC] sm:text-6xl lg:text-7xl">
                {title}
              </h2>
              {sub && <p className="mt-4 text-sm uppercase tracking-[0.24em] text-[#C9A227]">{sub}</p>}
            </div>
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-0 top-[30%] flex items-center justify-center sm:top-[32%]">
          <div
            ref={scene}
            className="relative aspect-[4/5] w-[min(84vw,50svh)] overflow-hidden rounded-3xl border border-[#2A2A2E] shadow-[0_40px_120px_rgba(0,0,0,0.7)] will-change-transform sm:aspect-[4/3] sm:w-[min(80vw,56svh*1.33,760px)]"
            style={{ opacity: 0 }}
          >
            <img src={FADE_IMAGE} alt="" className="absolute inset-0 h-full w-full scale-105 object-cover blur-[6px] grayscale" />
            <div className="absolute inset-0 bg-[#08080A]/45" />
            <div ref={reveal} className="absolute inset-0" style={{ clipPath: "inset(0 100% 0 0)" }}>
              <img src={FADE_IMAGE} alt={s.fadeTitle} className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <span
              ref={edge}
              className="absolute inset-y-0 w-px bg-[#F7E8AE] opacity-0 shadow-[0_0_28px_8px_rgba(247,215,116,0.55)]"
            />
          </div>
        </div>

        <canvas
          ref={canvas}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
          style={{ opacity: 0 }}
        />

        {ANCHORS.map((a, i) => (
          <div
            key={i}
            ref={(c) => {
              callouts.current[i] = c;
            }}
            className="pointer-events-none absolute left-0 top-0 z-20 hidden items-center gap-3 will-change-transform md:flex"
            style={{ opacity: 0 }}
          >
            <span
              className="block h-px w-16 bg-[#C9A227] lg:w-24"
              style={{ transform: "scaleX(var(--line, 0))", transformOrigin: a.side === "left" ? "right" : "left" }}
            />
            <span className={`h-2 w-2 shrink-0 rounded-full ${a.side === "left" ? "order-last" : "-order-1"} bg-[#C9A227] shadow-[0_0_12px_rgba(247,215,116,0.8)]`} />
            <div className={`w-44 lg:w-52 ${a.side === "left" ? "-order-2 text-right" : "text-left"}`}>
              <p className="font-[family-name:var(--font-display)] text-xl tracking-wide text-[#F5F2EC] lg:text-2xl">
                {s.callouts[i].title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#A9A49A] lg:text-sm">{s.callouts[i].text}</p>
            </div>
          </div>
        ))}

        <div className="absolute inset-x-0 bottom-[7svh] z-20 flex justify-center">
          <a
            ref={cta}
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#C9A227] px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#0B0B0C] shadow-[0_20px_60px_rgba(201,162,39,0.35)] transition-colors hover:bg-[#E0B93A]"
            style={{ opacity: 0, pointerEvents: "none" }}
          >
            <i className="ri-calendar-line" />
            {t.book}
          </a>
        </div>

        <div
          ref={hint}
          className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-[#8E897F]"
        >
          {s.scroll}
          <span className="block h-10 w-px animate-pulse bg-gradient-to-b from-[#C9A227] to-transparent" />
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 h-px bg-[#1B1B1E]">
          <div ref={bar} className="h-full origin-left bg-[#C9A227]" style={{ transform: "scaleX(0)" }} />
        </div>
      </div>
    </section>
  );
}
