"use client";

import Link from "next/link";
import SectionHeading from "../SectionHeading";
import Reveal from "../Reveal";
import { useLanguage } from "../LanguageProvider";
import { SERVICE_IMAGES, BOOKING_URL } from "../../lib/data";

export default function ServicesPreview() {
  const { t } = useLanguage();

  return (
    <section
      id="services"
      className="scroll-mt-24 w-full border-t border-[#1B1B1E] bg-[#0B0B0C] px-6 py-20 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionHeading
              overline={t.services.overline}
              title={t.services.title}
              subtitle={t.services.subtitle}
            />
          </Reveal>
          <Reveal delay={120}>
            <Link
              href="/#visit"
              className="inline-flex cursor-pointer items-center gap-2 whitespace-nowrap text-sm uppercase tracking-[0.18em] text-[#C9A227] transition-colors hover:text-[#E0B93A]"
            >
              {t.services.cta}
              <span className="flex h-4 w-4 items-center justify-center">
                <i className="ri-arrow-right-line" />
              </span>
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.services.items.map((s, i) => (
            <Reveal key={s.name} delay={(i % 3) * 100}>
              <article
                className="group atb-lift overflow-hidden rounded-2xl border border-[#232326] bg-[#111113] hover:border-[#C9A227]/60"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <img
                    src={SERVICE_IMAGES[i]}
                    alt={s.name}
                    className="h-full w-full object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute right-4 top-4 rounded-full bg-[#0B0B0C]/80 px-3 py-1 font-[family-name:var(--font-display)] text-base text-[#C9A227] backdrop-blur">
                    {s.price}
                  </span>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-[#F5F2EC]">
                      {s.name}
                    </h3>
                    <span className="whitespace-nowrap text-xs uppercase tracking-widest text-[#8E897F]">
                      {s.duration}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-[#A9A49A]">{s.desc}</p>
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex cursor-pointer items-center gap-2 text-[13px] uppercase tracking-[0.18em] text-[#F5F2EC] transition-colors group-hover:text-[#C9A227]"
                  >
                    <span className="flex h-4 w-4 items-center justify-center">
                      <i className="ri-calendar-line" />
                    </span>
                    {t.services.bookNow}
                  </a>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}