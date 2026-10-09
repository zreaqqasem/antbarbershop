"use client";

import Link from "next/link";
import { useLanguage } from "./LanguageProvider";
import { INSTAGRAM_URL, MAPS_URL, PHONE_TEL } from "../lib/data";

const HREFS = ["/#services", "/#barbers", "/#gallery", "/#visit"];

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-[#232326] bg-[#08080A] px-6 pb-8 pt-16 lg:px-10">
      <div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-[family-name:var(--font-display)] text-2xl tracking-[0.16em] text-[#F5F2EC]">
            A&T BARBERSHOP
          </p>
          <p className="mt-1 font-[family-name:var(--font-arabic)] text-lg text-[#C9A227]">
            حلاق عربي
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#8E897F]">{t.footer.tagline}</p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#C9A227]">{t.footer.explore}</p>
          <ul className="mt-5 space-y-3">
            {t.footer.links.map((label, i) => (
              <li key={label}>
                <Link
                  href={HREFS[i]}
                  className="cursor-pointer text-sm text-[#A9A49A] transition-colors hover:text-[#F5F2EC]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#C9A227]">
            {t.footer.hoursTitle}
          </p>
          <ul className="mt-5 space-y-2">
            {t.visit.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4 text-sm text-[#8E897F]">
                <span>{h.day}</span>
                <span className="text-[#C4BFB5]">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-[#C9A227]">{t.footer.findTitle}</p>
          <ul className="mt-5 space-y-3 text-sm text-[#A9A49A]">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-4 w-4 items-center justify-center text-[#C9A227]">
                <i className="ri-map-pin-line" />
              </span>
              {t.visit.addressValue}
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-4 w-4 items-center justify-center text-[#C9A227]">
                <i className="ri-phone-line" />
              </span>
              <a href={PHONE_TEL} className="transition-colors hover:text-[#F5F2EC]">
                {t.visit.phoneValue}
              </a>
            </li>
          </ul>
          <div className="mt-5 flex items-center gap-3">
            {[
              { href: INSTAGRAM_URL, icon: "ri-instagram-line", label: "Instagram" },
              { href: PHONE_TEL, icon: "ri-phone-line", label: "Call" },
              { href: MAPS_URL, icon: "ri-map-pin-line", label: "Google Maps" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[#2A2A2E] text-[#A9A49A] transition-colors hover:border-[#C9A227] hover:text-[#C9A227]"
              >
                <i className={s.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1280px] flex-col items-center justify-between gap-3 border-t border-[#1B1B1E] pt-6 text-xs text-[#7C776E] sm:flex-row">
        <p>{t.footer.rights}</p>
        <p>{t.footer.langs}</p>
      </div>
    </footer>
  );
}