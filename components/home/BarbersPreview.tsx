"use client";

import SectionHeading from "../SectionHeading";
import Reveal from "../Reveal";
import { useLanguage } from "../LanguageProvider";
import { BARBERS, BOOKING_URL, REVIEW_DATA } from "../../lib/data";

export default function BarbersPreview() {
  const { t } = useLanguage();

  return (
    <section
      id="barbers"
      className="scroll-mt-24 w-full border-t border-[#1B1B1E] bg-[#0E0E10] px-6 py-20 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px]">
        <Reveal>
          <SectionHeading
            overline={t.barbers.overline}
            title={t.barbers.title}
            subtitle={t.barbers.subtitle}
            align="center"
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BARBERS.map((b, i) => (
            <Reveal key={b.name} delay={(i % 4) * 100}>
              <article className="group atb-lift flex h-full flex-col overflow-hidden rounded-2xl border border-[#232326] bg-[#111113]">
                <div className="relative h-80 w-full overflow-hidden">
                  <img
                    src={b.image}
                    alt={b.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#111113] to-transparent" />
                  {b.owner && (
                    <span className="absolute left-4 top-4 rounded-full bg-[#C9A227] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0B0B0C]">
                      {t.barbers.owner}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-[#F5F2EC]">
                      {b.name}
                    </h3>
                    {REVIEW_DATA.byBarber[b.name] && (
                      <span className="inline-flex items-center gap-1 whitespace-nowrap text-sm text-[#C9A227]">
                        <i className="ri-star-fill" />
                        {REVIEW_DATA.byBarber[b.name].average.toFixed(1)}
                        <span className="text-xs text-[#8E897F]">
                          ({REVIEW_DATA.byBarber[b.name].count})
                        </span>
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#8E897F]">
                    {b.owner ? `${t.barbers.owner} · ${t.barbers.barber}` : t.barbers.barber}
                  </p>
                  {b.quote && (
                    <p className="mt-3 text-sm italic leading-relaxed text-[#A9A49A]">
                      &ldquo;{b.quote}&rdquo;
                    </p>
                  )}
                  <div className="mt-auto pt-5">
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-full border border-[#3A3A3F] py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#F5F2EC] transition-colors hover:border-[#C9A227] hover:text-[#C9A227]"
                  >
                    {t.barbers.bookWith} {b.name}
                  </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
