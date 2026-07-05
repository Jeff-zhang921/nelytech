"use client";

import Image from "next/image";

import { useI18n } from "@/context/I18nContext";

export interface HeroProps {
  eyebrow?: string;
  title?: string;
  intro?: string;
}

export function Hero({ eyebrow, title, intro }: HeroProps) {
  const { t } = useI18n();

  return (
    <section
      id="about-us"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[76svh] scroll-mt-32 overflow-hidden bg-slate-950 text-white"
      style={{ position: "relative" }}
    >
      <Image
        src="/images/lcd-lcm-hero.png"
        alt="LCD and LCM display modules on an electronics engineering bench"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-20 object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-slate-950/72" />

      <div className="mx-auto flex w-full max-w-7xl items-center px-6 py-16 sm:px-8 sm:py-20 lg:px-12">
        <div className="max-w-4xl">
          <p className="mb-5 text-sm font-semibold tracking-[0.28em] text-teal-200 uppercase">
            {eyebrow ?? t("hero.eyebrow")}
          </p>
          <h1
            id="hero-title"
            className="max-w-3xl text-6xl font-semibold leading-none tracking-normal text-white sm:text-7xl lg:text-8xl"
          >
            {title ?? t("hero.title")}
          </h1>
          <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-100 sm:text-xl sm:leading-9">
            {intro ?? t("hero.intro")}
          </p>
        </div>
      </div>
    </section>
  );
}
