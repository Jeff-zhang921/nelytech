"use client";

import Link from "next/link";
import { useState } from "react";

interface DisplayGuide {
  title: string;
  whatItDoes: string;
  whyChoose: string;
  applications: readonly string[];
}

const displayGuides = [
  {
    title: "Segment LCD Panels",
    whatItDoes:
      'Displays pre-designed, fixed segments like the number "8" or battery icons. No custom graphics.',
    whyChoose:
      "Absolute lowest power consumption, extremely durable, and most cost-effective.",
    applications: ["Calculators", "Digital thermometers", "Gas/water meters", "Electronic scales"],
  },
  {
    title: "Character & Graphic LCDs",
    whatItDoes:
      "A grid of pixels. Character LCDs show standard text; Graphic LCDs can draw custom shapes and basic charts in single colors.",
    whyChoose: "Perfect for dynamic data and simple menus without the cost of full color.",
    applications: [
      "Industrial control panels",
      "Factory automation",
      "Heavy-duty printers",
      "Basic medical monitors",
    ],
  },
  {
    title: "TFT Color Modules",
    whatItDoes:
      "Full-color, high-resolution screens, often with touch, that can show any image, video, or complex UI.",
    whyChoose: "For a modern, smartphone-like experience and rich interactive graphics.",
    applications: ["Smart home hubs", "EV charging stations", "Advanced medical ventilators"],
  },
  {
    title: "PCBA Integration",
    whatItDoes: "The custom Printed Circuit Board Assembly, or motherboard, that drives the display.",
    whyChoose:
      'For clients seeking a complete "plug-and-play" hardware solution rather than just raw screen components.',
    applications: [
      "Custom controllers",
      "Display driver boards",
      "Integrated HMI hardware",
      "Production-ready assemblies",
    ],
  },
] as const satisfies readonly DisplayGuide[];

export function KnowledgeHub() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeGuide = displayGuides[activeIndex];

  return (
    <section
      id="knowledge-hub"
      aria-labelledby="knowledge-hub-title"
      className="scroll-mt-32 bg-slate-50 px-6 py-14 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-[0.16em] text-blue-700 uppercase">
            Product Guide
          </p>
          <h2
            id="knowledge-hub-title"
            className="mt-3 text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl"
          >
            Which Display Do I Need?
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Compare the main display technologies NELYTECH manufactures and match each option to
            real-world product requirements.
          </p>
        </div>

        <div className="mt-9 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-[0.36fr_0.64fr]">
            <div
              role="tablist"
              aria-label="Display technology guide"
              className="border-b border-slate-200 bg-slate-100/70 p-2 lg:border-b-0 lg:border-r"
            >
              {displayGuides.map((guide, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={guide.title}
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
                    <span className="text-sm font-semibold leading-6">{guide.title}</span>
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
                {activeGuide.title}
              </h3>

              <div className="mt-7 grid gap-6 md:grid-cols-2">
                <InfoBlock title="What it does" body={activeGuide.whatItDoes} />
                <InfoBlock title="Why choose it" body={activeGuide.whyChoose} />
              </div>

              <div className="mt-8">
                <h4 className="text-sm font-semibold tracking-[0.14em] text-slate-950 uppercase">
                  Applications
                </h4>
                <div className="mt-4 flex flex-wrap gap-2">
                  {activeGuide.applications.map((application) => (
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
            Still not sure? Let our engineers help you choose.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Ask an Engineer
          </Link>
        </div>
      </div>
    </section>
  );
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
