"use client";

import { useEffect, useRef, type RefObject } from "react";

export const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b);

// Maps p from [a, b] onto [0, 1].
export const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

export const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Calls `onProgress` every frame while the value is moving.
 *
 * "pinned": 0 when the element's top reaches the viewport top, 1 when its bottom
 * reaches the viewport bottom — for tall sections with a sticky child.
 * "pass": 0 when the element enters at the bottom, 1 when it leaves at the top.
 *
 * The reported value eases toward the scroll position rather than tracking it
 * exactly, which hides wheel steps and makes the motion glide. Updates are
 * written straight to the DOM by the callback, so scrolling never re-renders.
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  onProgress: (p: number) => void,
  mode: "pinned" | "pass" = "pinned",
  stiffness = 9,
) {
  const cb = useRef(onProgress);
  cb.current = onProgress;

  useEffect(() => {
    let raf = 0;
    let target = 0;
    let current = 0;
    let last = 0;

    const measure = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      target =
        mode === "pinned"
          ? r.height > vh
            ? clamp(-r.top / (r.height - vh))
            : 0
          : clamp((vh - r.top) / (vh + r.height));
    };
    const tick = (now: number) => {
      raf = 0;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
      last = now;
      current += (target - current) * (1 - Math.exp(-dt * stiffness));
      if (Math.abs(target - current) < 0.0002) current = target;
      cb.current(current);
      if (current !== target) raf = requestAnimationFrame(tick);
      else last = 0;
    };
    const schedule = () => {
      measure();
      if (!raf) raf = requestAnimationFrame(tick);
    };

    measure();
    current = target;
    cb.current(current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref, mode, stiffness]);
}
