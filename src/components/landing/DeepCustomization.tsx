"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useI18n } from "@/context/I18nContext";

interface CustomCapability {
  translationKey: string;
}

interface EngineeringOutcome {
  client: string;
  summary: string;
  actionLabel: string;
}

const customCapabilities = [
  {
    translationKey: "mechanical",
  },
  {
    translationKey: "optical",
  },
  {
    translationKey: "pcba",
  },
  {
    translationKey: "extremeEnvironments",
  },
  {
    translationKey: "emiShielding",
  },
  {
    translationKey: "lowNre",
  },
] as const satisfies readonly CustomCapability[];

const engineeringOutcomes = [
  {
    client: "Siemens",
    summary: "Ruggedized extreme-temperature PLC display module.",
    actionLabel: "View detail",
  },
  {
    client: "Medical Tier-1",
    summary: "Low-EMI compliance surgical touchscreen assembly.",
    actionLabel: "View detail",
  },
  {
    client: "Smart IoT",
    summary: "Ultra-thin battery-optimized controller board.",
    actionLabel: "View detail",
  },
] as const satisfies readonly EngineeringOutcome[];

export function DeepCustomization() {
  const { t } = useI18n();

  return (
    <section
      id="deep-customization"
      aria-labelledby="deep-customization-title"
      className="relative flex scroll-mt-28 items-center overflow-hidden bg-slate-50 px-6 py-12 sm:px-8 lg:min-h-[calc(100vh-6rem)] lg:px-12 lg:py-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_20%,rgba(37,99,235,0.1),transparent_32%),radial-gradient(circle_at_88%_72%,rgba(14,165,233,0.12),transparent_28%)]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <p className="mb-3 text-xs font-semibold tracking-[0.18em] text-blue-700 uppercase">
            {t("customEngineering.eyebrow")}
          </p>
          <h2
            id="deep-customization-title"
            className="mb-3 max-w-4xl text-3xl font-extrabold tracking-tight text-slate-900 lg:text-4xl"
          >
            {t("customEngineering.title")}
          </h2>
          <p className="mb-7 max-w-3xl text-base leading-7 text-slate-600">
            {t("customEngineering.subtitle")}
          </p>

          <div className="grid grid-cols-1 gap-x-7 gap-y-5 md:grid-cols-2">
            {customCapabilities.map((capability) => (
              <article key={capability.translationKey} className="flex gap-3">
                <CheckIcon />
                <div>
                  <h3 className="mb-1 text-sm font-bold tracking-normal text-slate-800">
                    {t(`customEngineering.capabilities.${capability.translationKey}.title`)}
                  </h3>
                  <p className="text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
                    {t(`customEngineering.capabilities.${capability.translationKey}.description`)}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8">
            <Link
              href="/process"
              className="group inline-flex items-center gap-4 rounded-full border border-slate-200/80 bg-white/85 px-8 py-4 text-base font-semibold text-slate-950 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur-md transition-all duration-500 ease-out hover:-translate-y-0.5 hover:border-slate-950 hover:bg-slate-950 hover:text-white hover:shadow-[0_24px_60px_rgba(15,23,42,0.18)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-4"
            >
              {t("customEngineering.viewProcessButton")}
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-white transition-all duration-500 group-hover:translate-x-1 group-hover:bg-white group-hover:text-slate-950">
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4"
                  strokeWidth={1.5}
                />
              </span>
            </Link>
          </div>
        </div>

        <aside className="flex flex-col justify-center lg:col-span-4">
          <div className="mb-10 flex items-end justify-between gap-5">
            <h3 className="max-w-52 text-sm font-bold tracking-normal text-slate-900 sm:text-base">
              {t("customEngineering.outcomes.title")}
            </h3>
            <Link
              href="/cases"
              className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors duration-300 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-4"
            >
              {t("customEngineering.viewAll")}
              <svg
                viewBox="0 0 20 20"
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 10h11M11 5l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

          <div className="space-y-10">
            {engineeringOutcomes.map((outcome, index) => (
              <article key={outcome.client} className="group/outcome">
                <div className="mb-4 flex items-baseline gap-5">
                  <span className="text-5xl font-light leading-none tracking-normal text-slate-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="text-base font-semibold leading-7 tracking-normal text-slate-950">
                    {outcome.client}
                    <span className="font-normal text-slate-500"> - {outcome.summary}</span>
                  </p>
                </div>

                <Link
                  href="/cases"
                  className="group inline-flex items-center gap-2 pl-[4.25rem] text-sm font-medium text-slate-500 transition-colors duration-300 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-4"
                >
                  {outcome.actionLabel}
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={1.5}
                  />
                </Link>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m4.5 10.5 3.3 3.3 7.7-8.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
