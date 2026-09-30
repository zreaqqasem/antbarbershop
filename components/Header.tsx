"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "./LanguageProvider";
import { LANG_LABELS, LANG_ORDER } from "../lib/i18n";
import { BOOKING_URL } from "../lib/data";

const NAV_HREFS = ["/#top", "/#services", "/#barbers", "/#gallery", "/#visit"];

export default function Header() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLabels = [t.nav.home, t.nav.services, t.nav.barbers, t.nav.gallery, t.nav.visit];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-[#232326] bg-[#0B0B0C]/95 backdrop-blur-md"
          : "bg-gradient-to-b from-[#0B0B0C]/90 to-transparent"
      }`}
    >
      <div className="flex h-[72px] w-full items-center justify-between px-6 lg:px-10">
        <Link href="/#top" className="flex cursor-pointer items-baseline gap-2.5">
          <span className="font-[family-name:var(--font-display)] text-xl tracking-[0.18em] text-[#F5F2EC]">
            A&T BARBERSHOP
          </span>
          <span className="hidden font-[family-name:var(--font-arabic)] text-base text-[#C9A227] sm:inline">
            حلاق عربي
          </span>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {navLabels.map((label, i) => (
            <Link
              key={label}
              href={NAV_HREFS[i]}
              className="group/nav relative cursor-pointer text-[13px] uppercase tracking-[0.18em] text-[#A9A49A] transition-colors hover:text-[#F5F2EC]"
            >
              {label}
              <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-[#C9A227] transition-all duration-300 group-hover/nav:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center rounded-full border border-[#2A2A2E] p-1 md:flex">
            {LANG_ORDER.map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`cursor-pointer rounded-full px-3 py-1 text-[11px] tracking-widest transition-colors ${
                  lang === code
                    ? "bg-[#C9A227] text-[#0B0B0C]"
                    : "text-[#A9A49A] hover:text-[#F5F2EC]"
                }`}
              >
                {LANG_LABELS[code]}
              </button>
            ))}
          </div>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden cursor-pointer items-center whitespace-nowrap rounded-full bg-[#C9A227] px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#0B0B0C] transition-colors hover:bg-[#E0B93A] sm:inline-flex"
          >
            {t.book}
          </a>
          <button
            aria-label="Menu"
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#2A2A2E] text-[#F5F2EC] lg:hidden"
          >
            <i className={open ? "ri-close-line text-xl" : "ri-menu-line text-xl"} />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[#232326] bg-[#0B0B0C] px-6 py-4 lg:hidden">
          {navLabels.map((label, i) => (
            <Link
              key={label}
              href={NAV_HREFS[i]}
              onClick={() => setOpen(false)}
              className="block cursor-pointer py-3 text-sm uppercase tracking-[0.18em] text-[#A9A49A] hover:text-[#F5F2EC]"
            >
              {label}
            </Link>
          ))}
          <div className="mt-3 flex items-center gap-2">
            {LANG_ORDER.map((code) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                className={`cursor-pointer rounded-full border px-4 py-1.5 text-[11px] tracking-widest ${
                  lang === code
                    ? "border-[#C9A227] bg-[#C9A227] text-[#0B0B0C]"
                    : "border-[#2A2A2E] text-[#A9A49A]"
                }`}
              >
                {LANG_LABELS[code]}
              </button>
            ))}
          </div>
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-4 block cursor-pointer rounded-full bg-[#C9A227] py-3 text-center text-sm font-semibold uppercase tracking-[0.18em] text-[#0B0B0C]"
          >
            {t.book}
          </a>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-[2px]">
        <div
          className="h-full bg-gradient-to-r from-[#C9A227] to-[#E0B93A]"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </header>
  );
}