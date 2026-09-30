"use client";

import SectionHeading from "../SectionHeading";
import Reveal from "../Reveal";
import { useLanguage } from "../LanguageProvider";

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
          {t.reviews.items.map((r, i) => (
            <Reveal key={r.name} delay={(i % 3) * 100}>
              <article className="atb-lift h-full rounded-2xl border border-[#232326] bg-[#111113] p-6 hover:border-[#C9A227]/50">
                <div className="flex items-center gap-1 text-[#C9A227]">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className="flex h-4 w-4 items-center justify-center">
                      <i className={j < r.rating ? "ri-star-fill" : "ri-star-line"} />
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#D8D3C9]">&ldquo;{r.text}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3 border-t border-[#232326] pt-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A227] text-sm font-semibold text-[#0B0B0C]">
                    {r.initials}
                  </span>
                  <div>
                    <p className="text-sm text-[#F5F2EC]">{r.name}</p>
                    <p className="text-xs uppercase tracking-wider text-[#8E897F]">{r.source}</p>
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