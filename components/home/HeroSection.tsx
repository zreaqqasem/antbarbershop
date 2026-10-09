"use client";

import Link from "next/link";
import { useRef } from "react";
import PriceBoard from "../PriceBoard";
import BarberPole from "../BarberPole";
import { useLanguage } from "../LanguageProvider";
import { HERO_IMAGE, BOOKING_URL } from "../../lib/data";
import { prefersReducedMotion, useScrollProgress } from "../scroll";

export default function HeroSection() {
  const { t } = useLanguage();
  const section = useRef<HTMLElement | null>(null);
  const bg = useRef<HTMLDivElement | null>(null);
  const content = useRef<HTMLDivElement | null>(null);

  // Background drifts slower than the page; the content lifts and fades as it leaves.
  useScrollProgress(
    section,
    (p) => {
      if (prefersReducedMotion()) return;
      const q = Math.max(0, (p - 0.5) * 2);
      if (bg.current) bg.current.style.transform = `translate3d(0, ${q * 30}%, 0) scale(${1.08 + q * 0.12})`;
      if (content.current) {
        content.current.style.transform = `translate3d(0, ${q * -80}px, 0)`;
        content.current.style.opacity = String(1 - q * 1.1);
      }
    },
    "pass",
  );

  return (
    <section ref={section} id="top" className="relative min-h-[100svh] w-full overflow-hidden pt-[72px]">
      <div
        ref={bg}
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        style={{ backgroundImage: `url('${HERO_IMAGE}')`, transform: "scale(1.08)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0C] via-[#0B0B0C]/90 to-[#0B0B0C]/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-[#0B0B0C]/10 to-[#0B0B0C]/70" />

      <div className="pointer-events-none absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-[#C9A227]/10 blur-3xl atb-blob" />
      <div className="pointer-events-none absolute bottom-10 right-1/4 h-72 w-72 rounded-full bg-[#C9A227]/[0.08] blur-3xl atb-blob" />

      <div
        ref={content}
        className="relative mx-auto flex w-full max-w-[1280px] flex-col gap-12 px-6 py-16 lg:flex-row lg:items-center lg:gap-16 lg:px-10 lg:py-24">
        <div className="flex-1">
          <span className="atb-rise inline-flex items-center gap-2 rounded-full border border-[#2A2A2E] px-4 py-1.5 text-[11px] uppercase tracking-[0.28em] text-[#C9A227]">
            <span className="flex h-4 w-4 items-center justify-center">
              <i className="ri-map-pin-line" />
            </span>
            {t.hero.badge}
          </span>
          <h1
            className="atb-rise mt-6 font-[family-name:var(--font-display)] text-6xl leading-[0.92] tracking-wide text-[#F5F2EC] lg:text-8xl"
            style={{ animationDelay: "120ms" }}
          >
            {t.hero.titleA}
            <br />
            {t.hero.titleB}
          </h1>
          <p
            className="atb-rise mt-3 font-[family-name:var(--font-arabic)] text-3xl text-[#C9A227]"
            style={{ animationDelay: "220ms" }}
          >
            {t.hero.accent}
          </p>
          <p
            className="atb-rise mt-6 max-w-lg text-base leading-relaxed text-[#A9A49A]"
            style={{ animationDelay: "300ms" }}
          >
            {t.hero.lead}
          </p>
          <div className="atb-rise mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: "380ms" }}>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn relative inline-flex cursor-pointer items-center gap-2 overflow-hidden whitespace-nowrap rounded-full bg-[#C9A227] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-[#0B0B0C] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-[#E0B93A]"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
              <span className="flex h-4 w-4 items-center justify-center">
                <i className="ri-calendar-line" />
              </span>
              {t.hero.book}
            </a>
            <Link
              href="/#services"
              className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border border-[#3A3A3F] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-[#F5F2EC] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#C9A227] hover:text-[#C9A227]"
            >
              <span className="flex h-4 w-4 items-center justify-center">
                <i className="ri-scissors-cut-line" />
              </span>
              {t.hero.see}
            </Link>
          </div>
          <div
            className="atb-rise mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-[#8E897F]"
            style={{ animationDelay: "460ms" }}
          >
            <span className="inline-flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center text-[#C9A227]">
                <i className="ri-star-fill" />
              </span>
              {t.hero.reviews}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center text-[#C9A227]">
                <i className="ri-time-line" />
              </span>
              {t.hero.hours}
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="flex h-4 w-4 items-center justify-center text-[#C9A227]">
                <i className="ri-translate-2" />
              </span>
              {t.hero.langs}
            </span>
          </div>
        </div>

        <div className="atb-rise relative w-full lg:w-[440px]" style={{ animationDelay: "300ms" }}>
          <div className="pointer-events-none absolute -left-12 top-6 hidden lg:block">
            <div className="relative atb-float">
              <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#C9A227]/40 atb-ring" />
              <BarberPole />
            </div>
          </div>
          <div className="pointer-events-none absolute -right-5 -top-7 hidden h-24 w-24 lg:block">
            <span className="absolute inset-0 rounded-full border border-dashed border-[#C9A227]/50 atb-spin-slow" />
            <span className="absolute inset-0 flex items-center justify-center text-[#C9A227]">
              <i className="ri-scissors-2-line text-2xl atb-snip" />
            </span>
          </div>
          <div className="atb-float-soft">
            <PriceBoard
              title={t.board.title}
              subtitle={t.board.subtitle}
              rows={t.board.rows}
              footer={t.board.footer}
            />
          </div>
        </div>
      </div>
    </section>
  );
}