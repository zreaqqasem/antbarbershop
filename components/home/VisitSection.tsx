"use client";

import SectionHeading from "../SectionHeading";
import Reveal from "../Reveal";
import { useLanguage } from "../LanguageProvider";
import { MAP_EMBED, MAPS_URL, PHONE_TEL } from "../../lib/data";

export default function VisitSection() {
  const { t } = useLanguage();
  const v = t.visit;

  const cards = [
    { icon: "ri-map-pin-line", label: v.address, value: v.addressValue },
    { icon: "ri-phone-line", label: v.phone, value: v.phoneValue },
    { icon: "ri-time-line", label: v.today, value: v.todayValue },
    { icon: "ri-translate-2", label: v.languages, value: v.languagesValue },
  ];

  return (
    <section
      id="visit"
      className="scroll-mt-24 w-full border-t border-[#1B1B1E] bg-[#0B0B0C] px-6 py-20 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <Reveal>
            <SectionHeading overline={v.overline} title={v.title} subtitle={v.subtitle} />
          </Reveal>
          <Reveal delay={120}>
            <a
              href={PHONE_TEL}
              className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full bg-[#C9A227] px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.18em] text-[#0B0B0C] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#E0B93A]"
            >
              <span className="flex h-4 w-4 items-center justify-center">
                <i className="ri-phone-line" />
              </span>
              {v.phoneValue}
            </a>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Reveal className="overflow-hidden rounded-2xl border border-[#232326]">
            <iframe
              title="A&T Barbershop location"
              src={MAP_EMBED}
              className="h-[440px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>

          <div className="grid gap-6">
            <Reveal delay={100} className="rounded-2xl border border-[#232326] bg-[#111113] p-6 atb-lift">
              <div className="grid gap-6 sm:grid-cols-2">
                {cards.map((c) => (
                  <div key={c.label} className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#2A2A2E] text-[#C9A227]">
                      <i className={c.icon} />
                    </span>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[#8E897F]">
                        {c.label}
                      </p>
                      <p className="mt-1 text-sm text-[#E4E0D8]">{c.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={200} className="rounded-2xl border border-[#232326] bg-[#111113] p-6 atb-lift">
              <p className="font-[family-name:var(--font-display)] text-xl tracking-wide text-[#F5F2EC]">
                {v.hoursTitle}
              </p>
              <ul className="mt-4 space-y-2">
                {v.hours.map((h) => (
                  <li key={h.day} className="flex justify-between gap-4 text-sm">
                    <span className="text-[#8E897F]">{h.day}</span>
                    <span className="text-[#C4BFB5]">{h.time}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={260}>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-[#3A3A3F] py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#F5F2EC] transition-colors hover:border-[#C9A227] hover:text-[#C9A227]"
              >
                <span className="flex h-4 w-4 items-center justify-center">
                  <i className="ri-map-2-line" />
                </span>
                {v.directions}
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}