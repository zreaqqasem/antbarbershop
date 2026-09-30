"use client";

import SectionHeading from "../SectionHeading";
import Reveal from "../Reveal";
import { useLanguage } from "../LanguageProvider";
import { SERVICE_IMAGES } from "../../lib/data";

export default function CutsGallery() {
  const { t } = useLanguage();

  return (
    <section
      id="gallery"
      className="scroll-mt-24 w-full border-t border-[#1B1B1E] bg-[#0B0B0C] px-6 py-20 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-[1280px]">
        <Reveal>
          <SectionHeading
            overline={t.gallery.overline}
            title={t.gallery.title}
            subtitle={t.gallery.subtitle}
            align="center"
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {t.gallery.items.map((title, i) => (
            <Reveal key={title} delay={(i % 3) * 100}>
            <figure
              className="group atb-lift relative aspect-square overflow-hidden rounded-2xl border border-[#232326]"
            >
              <img
                src={SERVICE_IMAGES[i]}
                alt={title}
                className="h-full w-full object-top transition-transform duration-700 group-hover:scale-110"
              />
              <span className="pointer-events-none absolute inset-0 bg-[#C9A227]/0 transition-colors duration-500 group-hover:bg-[#C9A227]/10" />
              <figcaption className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center justify-between bg-gradient-to-t from-[#0B0B0C] to-transparent p-5 text-sm tracking-wide text-[#F5F2EC] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {title}
                <span className="flex h-4 w-4 items-center justify-center text-[#C9A227]">
                  <i className="ri-arrow-right-up-line" />
                </span>
              </figcaption>
            </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}