"use client";

import Link from "next/link";
import { useState } from "react";

import { useI18n } from "@/context/I18nContext";

interface DisplayGuide {
  translationKey: string;
}

const displayGuides = [
  {
    translationKey: "segment",
  },
  {
    translationKey: "characterGraphic",
  },
  {
    translationKey: "tftColor",
  },
  {
    translationKey: "pcbaIntegration",
  },
] as const satisfies readonly DisplayGuide[];

export function KnowledgeHub() {
  const { t } = useI18n();
  const [activeIndex, setActiveIndex] = useState(0);
  const activeGuide = displayGuides[activeIndex];
  const activeGuideKey = activeGuide.translationKey;
  const applications = splitApplications(
    t(`productGuide.items.${activeGuideKey}.applications`),
  );

  return (
    <section
      id="knowledge-hub"
      aria-labelledby="knowledge-hub-title"
      className="scroll-mt-32 bg-slate-50 px-6 py-14 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.16em] text-blue-700 uppercase">
            {t("productGuide.eyebrow")}
          </p>
          <h2
            id="knowledge-hub-title"
            className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl"
          >
            {t("productGuide.title")}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {t("productGuide.subtitle")}
          </p>
        </div>

        <div className="mt-9 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-[0.36fr_0.64fr]">
            <div
              role="tablist"
              aria-label={t("productGuide.title")}
              className="border-b border-slate-200 bg-slate-100/70 p-2 lg:border-b-0 lg:border-r"
            >
              {displayGuides.map((guide, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={guide.translationKey}
                    type="button"
                    role="tab"
                    id={`display-guide-tab-${index}`}
                    aria-selected={isActive}
                    aria-controls="display-guide-panel"
                    onClick={() => setActiveIndex(index)}
                    className={[
                      "flex w-full border-l-4 px-4 py-4 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                      isActive
                        ? "border-blue-600 bg-white text-slate-950"
                        : "border-transparent bg-slate-50/70 text-slate-600 hover:bg-white hover:text-slate-950",
                    ].join(" ")}
                  >
                    <span className="text-sm font-semibold leading-6">
                      {t(`productGuide.items.${guide.translationKey}.title`)}
                    </span>
                  </button>
                );
              })}
            </div>

            <article
              id="display-guide-panel"
              role="tabpanel"
              aria-labelledby={`display-guide-tab-${activeIndex}`}
              className="p-6 sm:p-8 lg:p-10"
            >
              <p className="text-sm font-semibold tracking-[0.16em] text-blue-700 uppercase">
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(displayGuides.length).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-normal text-slate-950">
                {t(`productGuide.items.${activeGuideKey}.title`)}
              </h3>

              <div className="mt-7 grid gap-6 md:grid-cols-2">
                <InfoBlock
                  title={t("productGuide.labels.whatItDoes")}
                  body={t(`productGuide.items.${activeGuideKey}.whatItDoes`)}
                />
                <InfoBlock
                  title={t("productGuide.labels.whyChooseIt")}
                  body={t(`productGuide.items.${activeGuideKey}.whyChooseIt`)}
                />
              </div>

              <div className="mt-8">
                <h4 className="text-sm font-semibold tracking-[0.14em] text-slate-950 uppercase">
                  {t("productGuide.labels.applications")}
                </h4>
                <div className="mt-4 flex flex-wrap gap-2">
                  {applications.map((application) => (
                    <span
                      key={application}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700"
                    >
                      {application}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-4 rounded-2xl bg-white px-6 py-6 text-center shadow-sm ring-1 ring-slate-200 sm:flex-row sm:text-left">
          <p className="text-base font-semibold text-slate-800">
            {t("productGuide.ctaLead")}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t("productGuide.ctaButton")}
          </Link>
        </div>
      </div>
    </section>
  );
}

function splitApplications(applications: string) {
  return applications
    .split(/[,、]/)
    .map((application) => application.trim())
    .filter(Boolean);
}

interface InfoBlockProps {
  title: string;
  body: string;
}

function InfoBlock({ title, body }: InfoBlockProps) {
  return (
    <div>
      <h4 className="text-sm font-semibold tracking-[0.14em] text-slate-950 uppercase">
        {title}
      </h4>
      <p className="mt-3 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}
