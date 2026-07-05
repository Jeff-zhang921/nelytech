"use client";

import Image from "next/image";
import { useState } from "react";

import { useI18n } from "@/context/I18nContext";

interface Industry {
  translationKey: string;
  imageSrc: string;
  imageAlt: string;
}

const industries = [
  {
    translationKey: "industrial",
    imageSrc:
      "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Robotic manufacturing equipment working inside a modern industrial facility",
  },
  {
    translationKey: "automotive",
    imageSrc:
      "https://images.unsplash.com/photo-1668283764349-86c3f955d40a?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Modern car dashboard with a digital cockpit display",
  },
  {
    translationKey: "medical",
    imageSrc:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Clinical hospital room with patient monitoring equipment",
  },
  {
    translationKey: "smartHome",
    imageSrc:
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Smart home technology interface in a modern residential interior",
  },
  {
    translationKey: "consumerElectronics",
    imageSrc:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "Close-up of a modern smartphone display and consumer electronics hardware",
  },
] as const satisfies readonly Industry[];

export function IndustriesShowcase() {
  const { t } = useI18n();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndustry = industries[activeIndex];

  function showPreviousIndustry() {
    setActiveIndex((current) => (current === 0 ? industries.length - 1 : current - 1));
  }

  function showNextIndustry() {
    setActiveIndex((current) => (current + 1) % industries.length);
  }

  return (
    <section
      id="industries"
      aria-labelledby="industries-showcase-title"
      className="scroll-mt-32 overflow-hidden bg-[#1a365d] px-6 py-12 text-white sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="industries-showcase-title"
          className="text-center text-3xl font-semibold tracking-normal lg:text-4xl"
        >
          {t("industry.title")}
        </h2>

        <div className="mt-7 flex items-center gap-3 lg:gap-5">
          <ArrowButton
            label={t("industry.previousLabel")}
            direction="left"
            onClick={showPreviousIndustry}
          />

          <div
            role="tablist"
            aria-label={t("industry.title")}
            className="grid min-w-0 flex-1 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4"
          >
            {industries.map((industry, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={industry.translationKey}
                  type="button"
                  role="tab"
                  id={`industry-tab-${index}`}
                  aria-selected={isActive}
                  aria-controls="industry-panel"
                  onClick={() => setActiveIndex(index)}
                  className={[
                    "rounded-md px-2 py-2 text-center outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#f8d64e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a365d]",
                    isActive ? "text-[#f8d64e]" : "text-slate-300 hover:text-white",
                  ].join(" ")}
                >
                  <span className="block text-sm font-semibold leading-none">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-2 block text-sm font-semibold leading-5 lg:text-base">
                    {t(`industry.items.${industry.translationKey}.title`)}
                  </span>
                </button>
              );
            })}
          </div>

          <ArrowButton label={t("industry.nextLabel")} direction="right" onClick={showNextIndustry} />
        </div>

        <div
          id="industry-panel"
          role="tabpanel"
          aria-labelledby={`industry-tab-${activeIndex}`}
          className="relative mt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.44fr)] lg:items-center"
        >
          <div
            className="relative min-h-[260px] overflow-hidden rounded-sm bg-[#102747] shadow-2xl shadow-black/25 sm:min-h-[320px] lg:min-h-[350px]"
            style={{ position: "relative" }}
          >
            <Image
              key={activeIndustry.imageSrc}
              src={activeIndustry.imageSrc}
              alt={activeIndustry.imageAlt}
              unoptimized
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#102747]/55 via-[#102747]/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#102747]/80 to-transparent" />
          </div>

          <article className="relative z-10 -mt-8 rounded-l-2xl rounded-r-md bg-[#90e0ef] p-7 text-[#102747] shadow-2xl shadow-black/20 sm:p-8 lg:-ml-16 lg:mt-0 lg:min-h-[270px] lg:p-9">
            <p className="text-xs font-semibold tracking-[0.18em]">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(industries.length).padStart(2, "0")}
            </p>
            <h3 className="mt-4 text-3xl font-semibold leading-tight tracking-normal lg:text-[2rem]">
              {t(`industry.items.${activeIndustry.translationKey}.title`)}
            </h3>
            <p className="mt-4 text-base leading-7 text-[#163d63]">
              {t(`industry.items.${activeIndustry.translationKey}.description`)}
            </p>
            <span
              aria-hidden="true"
              className="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#102747]/25 text-[#102747]"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path
                  d="M5 12h13m-5-5 5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </article>
        </div>
      </div>
    </section>
  );
}

interface ArrowButtonProps {
  label: string;
  direction: "left" | "right";
  onClick: () => void;
}

function ArrowButton({ label, direction, onClick }: ArrowButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white outline-none transition-colors hover:border-[#f8d64e] hover:text-[#f8d64e] focus-visible:ring-2 focus-visible:ring-[#f8d64e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a365d] lg:h-11 lg:w-11"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        {direction === "left" ? (
          <path
            d="M19 12H6m5 5-5-5 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M5 12h13m-5-5 5 5-5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}
