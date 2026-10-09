"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import SectionHeading from "../SectionHeading";
import Reveal from "../Reveal";
import { useLanguage } from "../LanguageProvider";
import { GALLERY_IMAGES } from "../../lib/data";
import { prefersReducedMotion, useScrollProgress } from "../scroll";

const ROWS = [0, 1].map((r) => GALLERY_IMAGES.map((src, i) => ({ src, i })).filter(({ i }) => i % 2 === r));

export default function CutsGallery() {
  const { t } = useLanguage();
  const section = useRef<HTMLElement | null>(null);
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  const [open, setOpen] = useState<number | null>(null);

  // Rows drift in opposite directions as the section passes through the viewport.
  useScrollProgress(
    section,
    (p) => {
      if (prefersReducedMotion()) return;
      rows.current.forEach((el, r) => {
        if (!el) return;
        const travel = Math.max(el.scrollWidth - window.innerWidth, 0);
        const x = r === 0 ? -travel * p : -travel * (1 - p);
        el.style.transform = `translate3d(${x}px, 0, 0)`;
      });
    },
    "pass",
  );

  const caption = (i: number) => t.gallery.items[i] ?? "A&T Barbershop";
  const step = useCallback(
    (d: number) => setOpen((o) => (o === null ? o : (o + d + GALLERY_IMAGES.length) % GALLERY_IMAGES.length)),
    [],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, step]);

  return (
    <section
      ref={section}
      id="gallery"
      className="scroll-mt-24 w-full overflow-hidden border-t border-[#1B1B1E] bg-[#0B0B0C] py-20 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-10">
        <Reveal>
          <SectionHeading
            overline={t.gallery.overline}
            title={t.gallery.title}
            subtitle={t.gallery.subtitle}
            align="center"
          />
        </Reveal>
        <p className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-[#7C776E]">{t.gallery.hint}</p>
      </div>

      <div dir="ltr" className="mt-12 space-y-4 motion-reduce:overflow-x-auto">
        {ROWS.map((row, r) => (
          <div
            key={r}
            ref={(el) => {
              rows.current[r] = el;
            }}
            className="flex w-max gap-4 px-4 will-change-transform"
          >
            {row.map(({ src, i }) => (
              <button
                key={src}
                type="button"
                onClick={() => setOpen(i)}
                className="group relative aspect-[4/5] w-[220px] shrink-0 cursor-zoom-in overflow-hidden rounded-2xl border border-[#232326] sm:w-[300px]"
              >
                <img
                  src={src}
                  alt={caption(i)}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span className="pointer-events-none absolute inset-0 bg-[#C9A227]/0 transition-colors duration-500 group-hover:bg-[#C9A227]/10" />
                {t.gallery.items[i] && (
                  <span className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-[#0B0B0C] to-transparent p-4 text-left text-sm tracking-wide text-[#F5F2EC] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    {t.gallery.items[i]}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={caption(open)}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050506]/95 p-4 backdrop-blur-sm"
          onClick={() => setOpen(null)}
        >
          <figure className="relative max-h-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={GALLERY_IMAGES[open]}
              alt={caption(open)}
              className="max-h-[82svh] w-auto max-w-[92vw] rounded-2xl object-contain"
            />
            <figcaption className="mt-3 text-center text-sm tracking-wide text-[#D8D3C9]">
              {caption(open)} · {open + 1} / {GALLERY_IMAGES.length}
            </figcaption>
          </figure>
          {[
            { label: t.gallery.prev, icon: "ri-arrow-left-s-line", d: -1, pos: "left-3 sm:left-6" },
            { label: t.gallery.next, icon: "ri-arrow-right-s-line", d: 1, pos: "right-3 sm:right-6" },
          ].map((b) => (
            <button
              key={b.d}
              type="button"
              aria-label={b.label}
              onClick={(e) => {
                e.stopPropagation();
                step(b.d);
              }}
              className={`absolute top-1/2 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-[#3A3A3F] bg-[#0B0B0C]/70 text-2xl text-[#F5F2EC] hover:border-[#C9A227] hover:text-[#C9A227] ${b.pos}`}
            >
              <i className={b.icon} />
            </button>
          ))}
          <button
            type="button"
            aria-label={t.gallery.close}
            onClick={() => setOpen(null)}
            className="absolute right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#3A3A3F] text-xl text-[#F5F2EC] hover:border-[#C9A227] hover:text-[#C9A227]"
          >
            <i className="ri-close-line" />
          </button>
        </div>
      )}
    </section>
  );
}
