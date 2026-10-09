"use client";

import SectionHeading from "../SectionHeading";
import Reveal from "../Reveal";
import { useLanguage } from "../LanguageProvider";
import { BOOKSY_PROFILE_URL, REVIEWS } from "../../lib/data";

export default function ReviewsSection() {
  const { t } = useLanguage();

  return (
    <section className="w-full border-t border-[#1B1B1E] bg-[#0E0E10] px-6 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1280px]">
        <Reveal>
          <SectionHeading
            overline={t.reviews.overline}
            title={t.reviews.title}
            subtitle={t.reviews.subtitle}
            align="center"
          />
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal key={r.name} delay={(i % 3) * 100}>
              <article className="atb-lift flex h-full flex-col rounded-2xl border border-[#232326] bg-[#111113] p-6 hover:border-[#C9A227]/50">
                <div className="flex items-center gap-1 text-[#C9A227]">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className="flex h-4 w-4 items-center justify-center">
                      <i className="ri-star-fill" />
                    </span>
                  ))}
                </div>
                <p dir="ltr" className="mt-4 flex-1 text-sm leading-relaxed text-[#D8D3C9]">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-[#232326] pt-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A227] text-sm font-semibold text-[#0B0B0C]">
                    {r.name[0]}
                  </span>
                  <div>
                    <p className="text-sm text-[#F5F2EC]">
                      {r.name}
                      <span className="text-[#8E897F]">
                        {" "}
                        · {r.service} {t.reviews.with} {r.staffer}
                      </span>
                    </p>
                    <p className="text-xs uppercase tracking-wider text-[#8E897F]">
                      {t.reviews.verified}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <a
            href={BOOKSY_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer items-center gap-2 text-sm uppercase tracking-[0.18em] text-[#C9A227] transition-colors hover:text-[#E0B93A]"
          >
            {t.reviews.readAll}
            <span className="flex h-4 w-4 items-center justify-center">
              <i className="ri-arrow-right-up-line" />
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
