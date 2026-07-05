"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useI18n } from "@/context/I18nContext";

const displayGuides = [
  { translationKey: "segment" },
  { translationKey: "characterGraphic" },
  { translationKey: "tftColor" },
  { translationKey: "pcbaIntegration" },
] as const;

type GuideKey = (typeof displayGuides)[number]["translationKey"];
type DetailSectionKey = "technicalSpecs" | "features" | "applications";

type ProductGuideDetails = Record<
  GuideKey,
  Record<DetailSectionKey, readonly string[]>
>;

const detailLabels: Record<DetailSectionKey, string> = {
  technicalSpecs: "Technical specs",
  features: "Key features",
  applications: "Best-fit applications",
};

const productGuideDetails = {
  segment: {
    technicalSpecs: [
      "TN, HTN, STN, FSTN, and VA monochrome glass options.",
      "Positive or negative display modes with static, 1/2, 1/3, and 1/4 duty drive.",
      "Custom icons, legends, battery indicators, seven-segment digits, and viewing windows.",
      "Low-voltage driving options suitable for battery-powered embedded devices.",
    ],
    features: [
      "Lowest unit cost for fixed information displays.",
      "Excellent readability in sunlight or simple backlit environments.",
      "Long lifecycle availability with stable tooling and repeatable optical quality.",
      "Custom pin layouts, zebra connectors, FPC tails, and edge-seal options.",
    ],
    applications: [
      "Utility meters, thermostats, electronic scales, calculators, timers, and handheld instruments.",
      "Products that show fixed numbers, symbols, status icons, or simple operating modes.",
      "High-volume devices where power consumption and cost control are the primary constraints.",
    ],
  },
  characterGraphic: {
    technicalSpecs: [
      "Standard character formats such as 8x2, 16x2, 20x4, and custom character maps.",
      "Graphic formats such as 128x64, 192x64, 240x128, and custom matrix resolutions.",
      "COB, COG, and custom module assemblies with integrated controllers.",
      "SPI, I2C, 6800, 8080, and parallel interface options depending on controller selection.",
    ],
    features: [
      "Clear monochrome UI without the cost and power draw of full-color TFT.",
      "Supports menus, alarm states, simple charts, icons, and multilingual text layouts.",
      "Reliable for industrial products that require long-term supply consistency.",
      "Backlight color, polarizer, viewing angle, and connector position can be tailored.",
    ],
    applications: [
      "Factory automation panels, test equipment, printers, UPS systems, and basic medical monitors.",
      "Products that need dynamic text or simple graphics but not rich color interfaces.",
      "Control devices where rugged readability matters more than visual complexity.",
    ],
  },
  tftColor: {
    technicalSpecs: [
      "Common TFT sizes from compact 2.4-inch modules through larger HMI-class displays.",
      "TN and IPS panel options with RGB, SPI, MCU, LVDS, or MIPI interface support.",
      "Optional capacitive or resistive touch integration with cover lens customization.",
      "High-brightness backlights, wide-temperature components, and optical bonding options.",
    ],
    features: [
      "Full-color interface for image-rich dashboards, guided workflows, and modern product UX.",
      "Supports branded visual systems, advanced icons, status screens, and touch interaction.",
      "Can be integrated with custom PCBA to simplify wiring and accelerate system assembly.",
      "Brightness, touch stack, cover glass, and FPC routing can be engineered around the enclosure.",
    ],
    applications: [
      "Smart home hubs, EV chargers, medical ventilators, handheld terminals, and premium appliances.",
      "Products that require a modern interactive interface with color, touch, and rich graphics.",
      "Systems where visual differentiation and user experience are core product requirements.",
    ],
  },
  pcbaIntegration: {
    technicalSpecs: [
      "Custom display driver boards with MCU, power management, connectors, and touch controllers.",
      "Interface conversion across SPI, I2C, RGB, MIPI, UART, USB, and application-specific buses.",
      "EMI-aware routing, shielding strategy, cable simplification, and enclosure-fit board geometry.",
      "Firmware support for initialization, backlight control, touch tuning, and display diagnostics.",
    ],
    features: [
      "Turns a raw display into a complete plug-and-play hardware subsystem.",
      "Reduces client-side sourcing, validation, wiring, and mechanical integration effort.",
      "Improves certification readiness through controlled layout, grounding, and signal integrity.",
      "Best for customers who want one accountable engineering partner for the full display stack.",
    ],
    applications: [
      "Medical devices, industrial controllers, smart appliances, vehicle accessories, and IoT terminals.",
      "Projects with complex wiring, strict certification needs, or limited internal electronics resources.",
      "Programs that require fast samples, low NRE, and a direct path from prototype to volume production.",
    ],
  },
} as const satisfies ProductGuideDetails;

export function KnowledgeHub() {
  const { t } = useI18n();
  const [activeIndex, setActiveIndex] = useState(0);
  const contentScrollRef = useRef<HTMLDivElement | null>(null);
  const activeGuide = displayGuides[activeIndex] ?? displayGuides[0];
  const activeGuideKey = activeGuide.translationKey;
  const applications = splitApplications(
    t(`productGuide.items.${activeGuideKey}.applications`),
  );

  useEffect(() => {
    contentScrollRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [activeIndex]);

  return (
    <section
      id="knowledge-hub"
      aria-labelledby="knowledge-hub-title"
      className="scroll-mt-32 bg-slate-50 px-6 py-10 sm:px-8 lg:px-12"
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

        <div className="mt-7 h-[560px] overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 sm:h-[520px] lg:h-[380px]">
          <div className="grid h-full min-h-0 grid-rows-[auto_1fr] lg:grid-cols-[0.36fr_0.64fr] lg:grid-rows-1">
            <div
              role="tablist"
              aria-label={t("productGuide.title")}
              className="border-b border-slate-200 bg-slate-100/70 p-2 lg:min-h-0 lg:border-b-0 lg:border-r"
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
                      "flex w-full border-l-4 px-4 py-3 text-left outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:py-4",
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
              className="flex min-h-0 flex-col p-5 sm:p-6 lg:p-7"
            >
              <p className="text-sm font-semibold tracking-[0.16em] text-blue-700 uppercase">
                {String(activeIndex + 1).padStart(2, "0")} /{" "}
                {String(displayGuides.length).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-normal text-slate-950">
                {t(`productGuide.items.${activeGuideKey}.title`)}
              </h3>

              <div
                ref={contentScrollRef}
                className="mt-5 min-h-0 flex-1 overflow-y-auto pr-3 [scrollbar-color:rgb(203_213_225)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb:hover]:bg-slate-300 [&::-webkit-scrollbar-track]:bg-transparent"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <InfoBlock
                    title={t("productGuide.labels.whatItDoes")}
                    body={t(`productGuide.items.${activeGuideKey}.whatItDoes`)}
                  />
                  <InfoBlock
                    title={t("productGuide.labels.whyChooseIt")}
                    body={t(`productGuide.items.${activeGuideKey}.whyChooseIt`)}
                  />
                </div>

                <div className="mt-6 space-y-5">
                  {(Object.keys(detailLabels) as DetailSectionKey[]).map((sectionKey) => (
                    <DetailList
                      key={sectionKey}
                      title={translateWithFallback(
                        t,
                        `productGuide.detailLabels.${sectionKey}`,
                        detailLabels[sectionKey],
                      )}
                      bullets={productGuideDetails[activeGuideKey][sectionKey].map(
                        (fallback, index) =>
                          translateWithFallback(
                            t,
                            `productGuide.items.${activeGuideKey}.details.${sectionKey}.${index}`,
                            fallback,
                          ),
                      )}
                    />
                  ))}
                </div>

                <div className="mt-6 pb-1">
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
              </div>
            </article>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-4 rounded-2xl bg-white px-6 py-4 text-center shadow-sm ring-1 ring-slate-200 sm:flex-row sm:text-left">
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
    .split(/[,\u3001]/)
    .map((application) => application.trim())
    .filter(Boolean);
}

function translateWithFallback(
  t: (key: string) => string,
  translationKey: string,
  fallback: string,
) {
  const translated = t(translationKey);

  return translated === translationKey ? fallback : translated;
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
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}

interface DetailListProps {
  title: string;
  bullets: readonly string[];
}

function DetailList({ title, bullets }: DetailListProps) {
  return (
    <section>
      <h4 className="text-sm font-semibold tracking-[0.14em] text-slate-950 uppercase">
        {title}
      </h4>
      <ul className="mt-2 grid gap-1.5 text-sm leading-6 text-slate-600 sm:grid-cols-2">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex gap-3">
            <span
              aria-hidden="true"
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500"
            />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
