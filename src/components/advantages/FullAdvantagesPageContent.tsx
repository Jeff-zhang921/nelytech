"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BatteryCharging,
  CircuitBoard,
  Cpu,
  Gauge,
  Layers3,
  PackageCheck,
  ShieldCheck,
  ThermometerSun,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useI18n } from "@/context/I18nContext";

type AdvantageKey =
  | "customController"
  | "lowTooling"
  | "multiColor"
  | "lowPower"
  | "flexiblePcba"
  | "longTermSupply"
  | "extremeDurability"
  | "qualityAssurance";

interface Advantage {
  index: string;
  key: AdvantageKey;
  icon: LucideIcon;
}

const advantages = [
  {
    index: "01",
    key: "customController",
    icon: Cpu,
  },
  {
    index: "02",
    key: "lowTooling",
    icon: Gauge,
  },
  {
    index: "03",
    key: "multiColor",
    icon: Layers3,
  },
  {
    index: "04",
    key: "lowPower",
    icon: BatteryCharging,
  },
  {
    index: "05",
    key: "flexiblePcba",
    icon: CircuitBoard,
  },
  {
    index: "06",
    key: "longTermSupply",
    icon: PackageCheck,
  },
  {
    index: "07",
    key: "extremeDurability",
    icon: ThermometerSun,
  },
  {
    index: "08",
    key: "qualityAssurance",
    icon: ShieldCheck,
  },
] as const satisfies readonly Advantage[];

export function FullAdvantagesPageContent() {
  const { language, t } = useI18n();

  useEffect(() => {
    document.title = t("fullAdvantagesPage.meta.title");

    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );

    description?.setAttribute("content", t("fullAdvantagesPage.meta.description"));
  }, [language, t]);

  return (
    <main className="relative isolate bg-transparent text-slate-900">
      <style>
        {`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(18px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in-up {
            animation: fade-in-up 760ms ease-out both;
          }
        `}
      </style>

      <div
        data-advantages-background
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-white"
      >
        <div
          data-advantages-background-image
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-65 grayscale contrast-125"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2400&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.76)_44%,rgba(255,255,255,0.5)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(14,116,144,0.12),transparent_30%),radial-gradient(circle_at_82%_20%,rgba(37,99,235,0.1),transparent_34%),linear-gradient(180deg,rgba(248,250,252,0.28),rgba(255,255,255,0.62)_48%,rgba(248,250,252,0.52))]" />
      </div>

      <div className="relative z-10">
        <section className="px-6 py-28 sm:px-8 lg:px-12 lg:py-36">
          <div className="mx-auto max-w-7xl">
            <div className="animate-fade-in-up max-w-5xl">
              <p className="text-xs font-semibold tracking-normal text-slate-400 uppercase">
                {t("fullAdvantagesPage.hero.eyebrow")}
              </p>
              <h1 className="mt-8 max-w-4xl text-5xl font-semibold tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
                {t("fullAdvantagesPage.hero.title")}
              </h1>
              <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-500 sm:text-xl sm:leading-9">
                {t("fullAdvantagesPage.hero.subtitle")}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white/45 px-6 py-24 backdrop-blur-sm sm:px-8 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-16 lg:grid-cols-[0.75fr_2fr] lg:gap-20">
              <div className="animate-fade-in-up lg:sticky lg:top-28 lg:self-start">
                <p className="text-xs font-semibold tracking-normal text-slate-400 uppercase">
                  {t("fullAdvantagesPage.section.eyebrow")}
                </p>
                <h2 className="mt-5 max-w-sm text-3xl font-semibold tracking-normal text-slate-950">
                  {t("fullAdvantagesPage.section.title")}
                </h2>
              </div>

              <div className="divide-y divide-slate-200">
                {advantages.map((advantage, index) => {
                  const Icon = advantage.icon;

                  return (
                    <article
                      key={advantage.key}
                      className="animate-fade-in-up relative grid gap-8 py-16 first:pt-0 last:pb-0 md:grid-cols-[0.5fr_1.5fr]"
                      style={{ animationDelay: `${index * 110}ms` }}
                    >
                      <div className="relative">
                        <span className="pointer-events-none absolute -top-8 left-0 text-8xl font-semibold leading-none tracking-normal text-slate-200/80 md:text-9xl">
                          {advantage.index}
                        </span>
                        <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-700 ring-1 ring-slate-200">
                          <Icon className="h-5 w-5" strokeWidth={1.7} />
                        </div>
                      </div>

                      <div className="relative z-10">
                        <h3 className="max-w-prose text-2xl font-semibold tracking-normal text-slate-950">
                          {t(`fullAdvantagesPage.points.${advantage.key}.title`)}
                        </h3>
                        <p className="mt-5 max-w-prose text-base leading-relaxed text-slate-500">
                          {t(`fullAdvantagesPage.points.${advantage.key}.description`)}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-7xl">
            <div className="animate-fade-in-up flex flex-col items-start justify-between gap-8 border-t border-slate-200 pt-12 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-semibold tracking-normal text-slate-400 uppercase">
                  {t("fullAdvantagesPage.cta.eyebrow")}
                </p>
                <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-normal text-slate-950">
                  {t("fullAdvantagesPage.cta.title")}
                </h2>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-3 text-sm font-medium text-white outline-none transition-all duration-300 hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-4"
                >
                  {t("fullAdvantagesPage.cta.buttonText")}
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.8}
                  />
                </Link>
                <Link
                  href="/#knowledge-hub"
                  className="group inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-7 py-3 text-sm font-medium text-slate-900 outline-none transition-all duration-300 hover:border-slate-950 hover:bg-slate-950 hover:text-white focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-4"
                >
                  {t("fullAdvantagesPage.cta.secondaryButtonText")}
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={1.8}
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
