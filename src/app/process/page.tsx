"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { useI18n } from "@/context/I18nContext";

type ProcessStageKey =
  | "consultation"
  | "prototyping"
  | "firmwarePcba"
  | "tooling"
  | "qaCertification"
  | "massProduction";

interface ProcessStage {
  number: string;
  key: ProcessStageKey;
  imageSrc: string;
}

const processStages = [
  {
    number: "01",
    key: "consultation",
    imageSrc: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1600",
  },
  {
    number: "02",
    key: "prototyping",
    imageSrc: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600",
  },
  {
    number: "03",
    key: "firmwarePcba",
    imageSrc: "https://images.unsplash.com/photo-1555617766-c94804975da3?q=80&w=1600",
  },
  {
    number: "04",
    key: "tooling",
    imageSrc: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=1600",
  },
  {
    number: "05",
    key: "qaCertification",
    imageSrc: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=1600",
  },
  {
    number: "06",
    key: "massProduction",
    imageSrc: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1600",
  },
] as const satisfies readonly ProcessStage[];

const pointKeys = ["first", "second", "third"] as const;

const stageViewport = { once: true, amount: 0.35 } as const;
const textTransition = {
  type: "spring",
  stiffness: 90,
  damping: 18,
  mass: 0.85,
} as const;
const imageTransition = {
  type: "spring",
  stiffness: 82,
  damping: 20,
  mass: 0.9,
} as const;

export default function ProcessPage() {
  const { language, t } = useI18n();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    document.title = t("processPage.meta.title");

    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );

    description?.setAttribute("content", t("processPage.meta.description"));
  }, [language, t]);

  return (
    <main className="relative isolate overflow-hidden bg-white text-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_8%,rgba(37,99,235,0.08),transparent_28%),radial-gradient(circle_at_85%_14%,rgba(14,165,233,0.07),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8fafc_42%,#ffffff_100%)]"
      />

      <section className="px-6 pb-24 pt-28 text-center sm:px-8 lg:px-12 lg:pb-32 lg:pt-40">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
            {t("processPage.hero.eyebrow")}
          </p>
          <div className="mx-auto mt-8 max-w-5xl">
            <h1 className="text-5xl font-semibold leading-[0.95] tracking-normal text-slate-950 sm:text-6xl lg:text-7xl xl:text-8xl">
              {t("processPage.hero.title")}
            </h1>
            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-600 lg:text-xl lg:leading-9">
              {t("processPage.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      <section
        aria-label={t("processPage.listAriaLabel")}
        className="px-6 sm:px-8 lg:px-12"
      >
        <div className="relative mx-auto max-w-7xl">
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-3 top-0 w-px bg-slate-200/80 lg:left-1/2"
          />

          {processStages.map((stage, index) => {
            const imageFirst = index % 2 === 1;
            const keyPrefix = `processPage.stages.${stage.key}`;

            return (
              <article
                key={stage.key}
                className="relative border-t border-slate-200/50 py-16 lg:py-20"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-3 top-16 z-20 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-blue-600 shadow-[0_0_0_8px_rgba(37,99,235,0.08)] lg:left-1/2 lg:top-20"
                />

                <div
                  className={[
                    "grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-16",
                  ].join(" ")}
                >
                  <motion.div
                    className={[
                      "relative lg:col-span-6",
                      imageFirst
                        ? "lg:col-start-1 lg:row-start-1"
                        : "lg:col-start-8 lg:row-start-1",
                    ].join(" ")}
                    initial={{ opacity: 0, y: 80, scale: 0.96 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={stageViewport}
                    transition={{ ...imageTransition, delay: 0.08 }}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/60">
                      <Image
                        src={stage.imageSrc}
                        alt={t(`${keyPrefix}.title`)}
                        unoptimized
                        fill
                        sizes="(max-width: 1024px) 100vw, 42vw"
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className={[
                      "relative z-10 lg:col-span-5",
                      imageFirst
                        ? "lg:col-start-7 lg:row-start-1"
                        : "lg:col-start-1 lg:row-start-1",
                    ].join(" ")}
                    initial={{ opacity: 0, y: 80 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={stageViewport}
                    transition={textTransition}
                  >
                    <div className="flex items-end gap-5">
                      <span className="text-8xl font-light leading-none tracking-normal text-slate-300 sm:text-9xl">
                        {stage.number}
                      </span>
                      <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
                        {t(`${keyPrefix}.label`)}
                      </p>
                    </div>

                    <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                      {t(`${keyPrefix}.title`)}
                    </h2>
                    <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                      {t(`${keyPrefix}.description`)}
                    </p>

                    <dl className="mt-7 grid grid-cols-1 gap-y-3 text-sm text-slate-600 sm:grid-cols-3 sm:gap-x-6">
                      {pointKeys.map((pointKey) => (
                        <div key={pointKey} className="flex items-center gap-3">
                          <dt className="h-px w-8 bg-slate-300" aria-hidden="true" />
                          <dd>{t(`${keyPrefix}.points.${pointKey}`)}</dd>
                        </div>
                      ))}
                    </dl>
                  </motion.div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-7xl border-t border-slate-200/60 pt-16">
          <div className="max-w-4xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
              {t("processPage.cta.eyebrow")}
            </p>
            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-normal text-slate-950 sm:text-4xl">
              {t("processPage.cta.title")}
            </h2>
            <Link
              href="/contact"
              className="group mt-10 inline-flex items-center gap-3 rounded-full border border-slate-300 bg-white px-8 py-3 text-sm font-medium text-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all duration-300 hover:bg-slate-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-4"
            >
              {t("processPage.cta.buttonText")}
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
