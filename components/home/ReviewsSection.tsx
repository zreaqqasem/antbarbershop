"use client";

import { useMemo, useState } from "react";
import SectionHeading from "../SectionHeading";
import Reveal from "../Reveal";
import { useLanguage } from "../LanguageProvider";
import { BARBERS, BOOKSY_PROFILE_URL, REVIEW_DATA } from "../../lib/data";

const PAGE = 9;
const LONG = 260;

type Review = (typeof REVIEW_DATA.reviews)[number];

function Stars({ rating, size = "h-4 w-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex items-center gap-0.5 text-[#C9A227]">
      {Array.from({ length: 5 }).map((_, j) => (
        <span key={j} className={`flex ${size} items-center justify-center`}>
          <i className={j < rating ? "ri-star-fill" : "ri-star-line"} />
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ r, locale }: { r: Review; locale: string }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const long = r.text.length > LONG;
  const date = new Date(`${r.date}T12:00:00`).toLocaleDateString(locale, {
    month: "short",
    year: "numeric",
  });

  return (
    <article className="atb-lift flex h-full flex-col rounded-2xl border border-[#232326] bg-[#111113] p-6 hover:border-[#C9A227]/50">
      <div className="flex items-center justify-between gap-3">
        <Stars rating={r.rating} />
        <span className="text-xs text-[#7C776E]">{date}</span>
      </div>
      <p dir="auto" className="mt-4 flex-1 text-sm leading-relaxed text-[#D8D3C9]">
        &ldquo;{long && !open ? `${r.text.slice(0, LONG).trimEnd()}…` : r.text}&rdquo;
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="mt-2 cursor-pointer self-start text-xs uppercase tracking-[0.16em] text-[#C9A227] hover:text-[#E0B93A]"
        >
          {open ? t.reviews.readLess : t.reviews.readMore}
        </button>
      )}
      <div className="mt-5 flex items-center gap-3 border-t border-[#232326] pt-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C9A227] text-sm font-semibold text-[#0B0B0C]">
          {r.name[0]}
        </span>
        <div className="min-w-0">
          <p className="text-sm text-[#F5F2EC]">
            {r.name}
            <span className="text-[#8E897F]">
              {" "}
              · {r.service} {t.reviews.with} {r.staffer}
            </span>
          </p>
          <p className="text-xs uppercase tracking-wider text-[#8E897F]">{t.reviews.verified}</p>
        </div>
      </div>
    </article>
  );
}

export default function ReviewsSection() {
  const { t } = useLanguage();
  const [barber, setBarber] = useState<string | null>(null);
  const [shown, setShown] = useState(PAGE);
  const { count, average, breakdown, byBarber, reviews } = REVIEW_DATA;

  const filtered = useMemo(
    () => (barber ? reviews.filter((r) => r.staffer === barber) : reviews),
    [barber, reviews],
  );
  const visible = filtered.slice(0, shown);

  const pick = (name: string | null) => {
    setBarber(name);
    setShown(PAGE);
  };

  const chip = (active: boolean) =>
    `cursor-pointer whitespace-nowrap rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.16em] transition-colors ${
      active
        ? "border-[#C9A227] bg-[#C9A227] text-[#0B0B0C]"
        : "border-[#2A2A2E] text-[#A9A49A] hover:border-[#C9A227] hover:text-[#C9A227]"
    }`;

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

        <Reveal className="mx-auto mt-10 grid max-w-3xl items-center gap-8 rounded-2xl border border-[#232326] bg-[#111113] p-6 sm:grid-cols-[auto_1fr] lg:p-8">
          <div className="text-center">
            <p className="font-[family-name:var(--font-display)] text-6xl text-[#C9A227]">
              {average.toFixed(2)}
            </p>
            <div className="mt-2 flex justify-center">
              <Stars rating={5} />
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[#8E897F]">
              {count} {t.reviews.reviewsWord}
            </p>
          </div>
          <ul className="space-y-2">
            {["5", "4", "3", "2", "1"].map((k) => {
              const n = breakdown[k] ?? 0;
              return (
                <li key={k} className="flex items-center gap-3 text-sm">
                  <span className="w-3 text-[#A9A49A]">{k}</span>
                  <i className="ri-star-fill text-xs text-[#C9A227]" />
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-[#232326]">
                    <span
                      className="block h-full rounded-full bg-[#C9A227]"
                      style={{ width: `${(n / count) * 100}%` }}
                    />
                  </span>
                  <span className="w-8 text-end text-[#8E897F]">{n}</span>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          <button type="button" className={chip(barber === null)} onClick={() => pick(null)}>
            {t.reviews.all}
          </button>
          {BARBERS.map((b) => (
            <button
              key={b.name}
              type="button"
              className={chip(barber === b.name)}
              onClick={() => pick(b.name)}
            >
              {b.name} · {byBarber[b.name]?.count ?? 0}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((r) => (
            <ReviewCard key={`${r.date}-${r.name}-${r.text.slice(0, 24)}`} r={r} locale={t.reviews.locale} />
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-xs uppercase tracking-[0.16em] text-[#7C776E]">
            {t.reviews.showing} {visible.length} {t.reviews.of} {filtered.length}
          </p>
          {shown < filtered.length && (
            <button
              type="button"
              onClick={() => setShown((s) => s + PAGE)}
              className="cursor-pointer rounded-full border border-[#3A3A3F] px-7 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-[#F5F2EC] transition-colors hover:border-[#C9A227] hover:text-[#C9A227]"
            >
              {t.reviews.showMore}
            </button>
          )}
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
        </div>
      </div>
    </section>
  );
}
