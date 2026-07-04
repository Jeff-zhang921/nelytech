"use client";

import { useEffect, useState } from "react";

const leadTimes = [
  { label: "LCD Panel Prototype", duration: "2 Weeks" },
  { label: "LCD Module Prototype", duration: "3 Weeks" },
  { label: "MCU Design Prototype", duration: "3-5 Weeks" },
  { label: "LCD Panel Mass Production", duration: "3 Weeks" },
  { label: "LCD Module Mass Production", duration: "3-4 Weeks" },
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
              About NELYTECH
            </p>
            <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-semibold leading-tight tracking-normal text-slate-950 sm:text-6xl lg:text-7xl">
              NELYTECH is a fast-growing LCD &amp; LCM manufacturer in China.
            </h1>
            <p className="mx-auto mt-8 max-w-4xl text-lg leading-8 text-slate-600 sm:text-xl sm:leading-9">
              From TN, HTN, STN, FSTN panels to COB, TAB, COG modules, we supply complete display
              solutions-including custom MCU development and PCB assembly. Known globally for
              quality, speed, service, and competitive pricing.
            </p>
          </div>
        </section>

        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto grid max-w-7xl gap-y-16 md:grid-cols-2 md:gap-x-20">
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-blue-700 uppercase">
                Engineering
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-normal text-slate-950 lg:text-5xl">
                Bespoke display engineering from concept to production.
              </h2>
              <p className="mt-8 text-lg leading-8 text-slate-600">
                A team of veteran engineers in LCD processes, MCU development, optoelectronics, and
                PCBA. We offer bespoke hardware and software designs, accelerating your development
                and optimizing your final product.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-blue-700 uppercase">
                Uncompromising QC
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-normal text-slate-950 lg:text-5xl">
                Quality control built for durability, not just inspection.
              </h2>
              <p className="mt-8 text-lg leading-8 text-slate-600">
                Effective quality control is our definitive advantage. Beyond 100% visual and
                electrical inspections, we heavily prioritize extreme durability and power
                consumption testing.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 py-24 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-5xl">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold tracking-[0.18em] text-blue-700 uppercase">
                Agile Lead Times
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-normal text-slate-950 lg:text-5xl">
                Fast development cycles for urgent display programs.
              </h2>
            </div>

            <ol className="mt-16 space-y-9">
              {leadTimes.map((item, index) => (
                <li key={item.label} className="flex items-baseline gap-8">
                  <span className="w-14 shrink-0 text-4xl font-semibold tracking-normal text-blue-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                    <span className="text-xl font-semibold text-slate-900">{item.label}</span>
                    <span className="text-2xl font-semibold tracking-normal text-slate-500">
                      {item.duration}
                    </span>
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-16 max-w-4xl text-2xl leading-10 text-slate-700">
              We offer special fast-track procedures for urgent cases-a vital lifeline for clients
              in difficulty.
            </p>
          </div>
        </section>

        <section className="px-6 py-24 sm:px-8 lg:px-12 lg:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold tracking-[0.18em] text-blue-700 uppercase">
                Global Footprint
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-normal text-slate-950 lg:text-5xl">
                Trusted Across the Globe
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
