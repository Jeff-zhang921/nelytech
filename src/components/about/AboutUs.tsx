"use client";

import { useEffect, useState } from "react";

import { useI18n } from "@/context/I18nContext";

const leadTimes = [
  { labelKey: "about.leadTimes.lcdPanelPrototype", duration: "2 Weeks" },
  { labelKey: "about.leadTimes.lcdModulePrototype", duration: "3 Weeks" },
  { labelKey: "about.leadTimes.mcuDesignPrototype", duration: "3-5 Weeks" },
  { labelKey: "about.leadTimes.lcdPanelMassProduction", duration: "3 Weeks" },
  { labelKey: "about.leadTimes.lcdModuleMassProduction", duration: "3-4 Weeks" },
] as const;

const marketShares = [
  { region: "Europe", percentage: "30%", widthClassName: "w-[30%]" },
  { region: "Asia", percentage: "20%", widthClassName: "w-[20%]" },
  { region: "North America", percentage: "20%", widthClassName: "w-[20%]" },
  { region: "South America", percentage: "20%", widthClassName: "w-[20%]" },
  { region: "Australia", percentage: "5%", widthClassName: "w-[5%]" },
  { region: "Africa", percentage: "5%", widthClassName: "w-[5%]" },
] as const;

export function AboutUs() {
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const animationFrameId = window.requestAnimationFrame(() => setMounted(true));

    return () => window.cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden text-slate-950">
      <div
        aria-hidden="true"
        className={[
          "pointer-events-none fixed inset-0 z-0 transition-opacity duration-[2000ms] ease-in-out",
          mounted ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-slate-50/85 backdrop-blur-sm" />
      </div>

      <div className="relative z-10 w-full">
        <section className="px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-sm font-semibold tracking-[0.22em] text-blue-700 uppercase">
              {t("about.eyebrow")}
            </p>
            <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-semibold leading-tight tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
              {t("about.heroTitle")}
            </h1>
            <p className="mx-auto mt-8 max-w-4xl text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
              {t("about.heroIntro")}
            </p>
          </div>
        </section>

        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-y-16 md:grid-cols-2 md:gap-x-20">
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-blue-700 uppercase">
                {t("about.engineeringEyebrow")}
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-normal text-slate-950 lg:text-5xl">
                {t("about.engineeringTitle")}
              </h2>
              <p className="mt-8 text-lg leading-8 text-slate-600">
                {t("about.engineeringText")}
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-blue-700 uppercase">
                {t("about.qcEyebrow")}
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-normal text-slate-950 lg:text-5xl">
                {t("about.qcTitle")}
              </h2>
              <p className="mt-8 text-lg leading-8 text-slate-600">
                {t("about.qcText")}
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-5xl">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold tracking-[0.18em] text-blue-700 uppercase">
                {t("about.leadTimesEyebrow")}
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-normal text-slate-950 lg:text-5xl">
                {t("about.leadTimesTitle")}
              </h2>
            </div>

            <ol className="mt-16 space-y-9">
              {leadTimes.map((item, index) => (
                <li key={item.labelKey} className="flex items-baseline gap-8">
                  <span className="w-14 shrink-0 text-4xl font-semibold tracking-normal text-blue-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                    <span className="text-xl font-semibold text-slate-900">
                      {t(item.labelKey)}
                    </span>
                    <span className="text-2xl font-semibold tracking-normal text-slate-500">
                      {item.duration}
                    </span>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-16 max-w-4xl text-2xl leading-10 text-slate-700">
              {t("about.fastTrack")}
            </p>
          </div>
        </section>

        <section className="px-6 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold tracking-[0.18em] text-blue-700 uppercase">
                {t("about.globalEyebrow")}
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-normal text-slate-950 lg:text-5xl">
                {t("about.globalTitle")}
              </h2>
            </div>

            <div className="mt-16 space-y-8">
              {marketShares.map((market) => (
                <div key={market.region}>
                  <div className="mb-3 flex items-center justify-between gap-6">
                    <span className="text-lg font-semibold text-slate-900">{market.region}</span>
                    <span className="text-lg font-semibold text-blue-700">{market.percentage}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100">
                    <div
                      className={`${market.widthClassName} h-full rounded-full bg-blue-600`}
                      aria-hidden="true"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
