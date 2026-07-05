"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

  return (
    <section
      id="industries"
      aria-labelledby="industries-showcase-title"
      className="scroll-mt-28 overflow-hidden bg-[#1a365d] px-6 py-8 text-white sm:px-8 lg:px-12 lg:py-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#90e0ef] uppercase">
            {t("industry.eyebrow")}
          </p>
          <h2
            id="industries-showcase-title"
            className="mt-3 text-2xl font-semibold tracking-normal lg:text-3xl"
          >
            {t("industry.title")}
          </h2>
          <p className="mt-3 text-sm leading-6 text-blue-100/75">
            {t("industry.subtitle")}
          </p>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {industries.map((industry, index) => (
            <article
              key={industry.translationKey}
              className="group overflow-hidden rounded-xl bg-white/[0.06] ring-1 ring-white/10 backdrop-blur-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:bg-white/[0.09] hover:shadow-xl hover:shadow-black/20"
            >
              <div className="relative h-24 overflow-hidden bg-[#102747] lg:h-28">
                <Image
                  src={industry.imageSrc}
                  alt={industry.imageAlt}
                  unoptimized
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  className="object-cover grayscale-[15%] transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#102747]/80 via-[#102747]/20 to-transparent" />
                <span className="absolute bottom-2.5 left-3.5 text-[11px] font-semibold tracking-[0.18em] text-[#f8d64e]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="p-4">
                <h3 className="text-sm font-semibold leading-5 text-white">
                  {t(`industry.items.${industry.translationKey}.title`)}
                </h3>
                <p className="mt-2 line-clamp-4 text-xs leading-5 text-blue-100/70">
                  {t(`industry.items.${industry.translationKey}.description`)}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/industries"
            className="group inline-flex items-center justify-center gap-3 rounded-full border border-white/25 bg-white/5 px-7 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-all duration-500 ease-out hover:border-white hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f8d64e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a365d]"
          >
            {t("industry.viewAll")}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
