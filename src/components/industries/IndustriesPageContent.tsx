"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Car,
  Factory,
  HeartPulse,
  Home,
  RadioTower,
  type LucideIcon,
} from "lucide-react";

import { useI18n } from "@/context/I18nContext";

type IndustryKey =
  | "industrialAutomation"
  | "medicalHealthcare"
  | "smartHomeIot"
  | "automotiveMarine"
  | "telecomInfrastructure";

interface IndustryProfile {
  number: string;
  key: IndustryKey;
  Icon: LucideIcon;
  imageSrc: string;
  imagePosition: string;
}

const industries = [
  {
    number: "01",
    key: "industrialAutomation",
    Icon: Factory,
    imageSrc:
      "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1600&q=80",
    imagePosition: "center",
  },
  {
    number: "02",
    key: "medicalHealthcare",
    Icon: HeartPulse,
    imageSrc:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80",
    imagePosition: "center",
  },
  {
    number: "03",
    key: "smartHomeIot",
    Icon: Home,
    imageSrc:
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1600&q=80",
    imagePosition: "center",
  },
  {
    number: "04",
    key: "automotiveMarine",
    Icon: Car,
    imageSrc:
      "https://images.unsplash.com/photo-1668283764349-86c3f955d40a?auto=format&fit=crop&w=1600&q=80",
    imagePosition: "center",
  },
  {
    number: "05",
    key: "telecomInfrastructure",
    Icon: RadioTower,
    imageSrc:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80",
    imagePosition: "center",
  },
] as const satisfies readonly IndustryProfile[];

const paragraphKeys = ["first", "second", "third"] as const;
const signalKeys = ["first", "second", "third", "fourth"] as const;

export function IndustriesPageContent() {
  const { language, t } = useI18n();

  useEffect(() => {
    document.title = t("industriesPage.meta.title");

    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );

    description?.setAttribute("content", t("industriesPage.meta.description"));
  }, [language, t]);

  return (
    <main className="bg-white text-slate-900">
      <section className="px-6 pb-20 pt-28 sm:px-8 lg:px-12 lg:pb-28 lg:pt-36">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
            {t("industriesPage.hero.eyebrow")}
          </p>
          <div className="mt-8 max-w-5xl">
            <h1 className="text-5xl font-semibold leading-[0.95] tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
              {t("industriesPage.hero.title")}
            </h1>
            <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-500 lg:text-xl lg:leading-9">
              {t("industriesPage.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      <section aria-label={t("industriesPage.listAriaLabel")} className="px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {industries.map((industry, index) => {
            const Icon = industry.Icon;
            const isReversed = index % 2 === 1;
            const keyPrefix = `industriesPage.items.${industry.key}`;

            return (
              <article
                key={industry.key}
                className="border-t border-slate-200/60 py-20 lg:py-28"
              >
                <div
                  className={[
                    "grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start lg:gap-16",
                    isReversed ? "lg:[&>*:first-child]:col-start-8" : "",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "lg:col-span-5",
                      isReversed ? "lg:col-start-8 lg:row-start-1" : "",
                    ].join(" ")}
                  >
                    <div className="relative min-h-[340px] lg:min-h-[440px]">
                      <div
                        aria-hidden="true"
                        className={[
                          "pointer-events-none absolute top-14 h-[240px] w-[115%] max-w-[560px] overflow-hidden opacity-70 saturate-0 sm:h-[300px] lg:top-20 lg:h-[340px]",
                          isReversed ? "right-0 lg:right-auto lg:left-[-8%]" : "left-0",
                        ].join(" ")}
                        style={{
                          WebkitMaskImage:
                            "radial-gradient(ellipse at center, black 42%, rgba(0,0,0,0.72) 58%, transparent 78%)",
                          maskImage:
                            "radial-gradient(ellipse at center, black 42%, rgba(0,0,0,0.72) 58%, transparent 78%)",
                        }}
                      >
                        <Image
                          src={industry.imageSrc}
                          alt=""
                          unoptimized
                          fill
                          sizes="(max-width: 1024px) 90vw, 42vw"
                          className="object-cover grayscale"
                          style={{ objectPosition: industry.imagePosition }}
                        />
                        <div className="absolute inset-0 bg-white/45 backdrop-blur-[2px]" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/55" />
                      </div>

                      <div className="relative z-10 flex items-end gap-6 pt-4">
                        <span className="text-8xl font-light leading-none tracking-normal text-slate-200 sm:text-9xl">
                          {industry.number}
                        </span>
                        <Icon
                          aria-hidden="true"
                          className="mb-3 h-14 w-14 text-blue-600 sm:h-16 sm:w-16"
                          strokeWidth={1}
                        />
                      </div>
                      <p className="relative z-10 mt-8 max-w-sm text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                        {t(`${keyPrefix}.eyebrow`)}
                      </p>
                    </div>
                  </div>

                  <div
                    className={[
                      "lg:col-span-7",
                      isReversed ? "lg:col-start-1 lg:row-start-1" : "",
                    ].join(" ")}
                  >
                    <h2 className="text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                      {t(`${keyPrefix}.title`)}
                    </h2>
                    <div className="mt-8 space-y-5 text-base leading-8 text-slate-500">
                      {paragraphKeys.map((paragraphKey) => (
                        <p key={paragraphKey}>
                          {t(`${keyPrefix}.paragraphs.${paragraphKey}`)}
                        </p>
                      ))}
                    </div>
                    <dl className="mt-10 grid grid-cols-1 gap-y-3 text-sm text-slate-500 sm:grid-cols-2 sm:gap-x-8">
                      {signalKeys.map((signalKey) => (
                        <div key={signalKey} className="flex items-center gap-3">
                          <dt className="h-px w-8 bg-slate-300" aria-hidden="true" />
                          <dd>{t(`${keyPrefix}.signals.${signalKey}`)}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-7xl border-t border-slate-200/60 pt-16">
          <div className="max-w-4xl">
            <p className="text-3xl font-semibold leading-tight tracking-normal text-slate-950 sm:text-4xl">
              {t("industriesPage.cta.title")}
            </p>
            <Link
              href="/contact"
              className="group mt-10 inline-flex items-center gap-3 rounded-full border border-slate-300 px-8 py-3 text-sm font-medium text-slate-900 transition-all duration-300 hover:bg-slate-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-4"
            >
              {t("industriesPage.cta.buttonText")}
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
