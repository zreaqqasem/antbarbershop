"use client";

import SectionHeading from "../SectionHeading";
import Reveal from "../Reveal";
import { useLanguage } from "../LanguageProvider";
import { BARBER_IMAGES, BOOKING_URL } from "../../lib/data";

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

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.barbers.items.map((b, i) => (
            <Reveal key={b.name} delay={(i % 3) * 100}>
              <article
                className="group atb-lift overflow-hidden rounded-2xl border border-[#232326] bg-[#111113]"
              >
                <div className="relative h-72 w-full overflow-hidden">
                  <img
                    src={BARBER_IMAGES[i]}
                    alt={b.name}
                    className="h-full w-full object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#111113] to-transparent" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-[family-name:var(--font-display)] text-2xl tracking-wide text-[#F5F2EC]">
                      {b.name}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-sm text-[#C9A227]">
                      <span className="flex h-4 w-4 items-center justify-center">
                        <i className="ri-star-fill" />
                      </span>
                      {b.rating}
                    </span>
                  </div>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#8E897F]">{b.role}</p>
                  <p className="mt-3 text-sm italic leading-relaxed text-[#A9A49A]">
                    &ldquo;{b.quote}&rdquo;
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {b.specialties.map((sp) => (
                      <span
                        key={sp}
                        className="rounded-full border border-[#2A2A2E] px-3 py-1 text-[11px] uppercase tracking-wider text-[#A9A49A]"
                      >
                        {sp}
                      </span>
                    ))}
                  </div>
                  <a
                    href={BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex w-full cursor-pointer items-center justify-center whitespace-nowrap rounded-full border border-[#3A3A3F] py-2.5 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#F5F2EC] transition-colors hover:border-[#C9A227] hover:text-[#C9A227]"
                  >
                    {t.barbers.bookWith} {b.name.split(" ")[0]}
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