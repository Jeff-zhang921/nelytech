"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Star } from "lucide-react";
import { motion } from "framer-motion";

interface CaseStudy {
  client: string;
  challenge: string;
  solution: string;
  imageSrc: string;
  imageAlt: string;
  metric: string;
}

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  companyType: string;
}

const caseStudies = [
  {
    client: "Global Industrial Automation Leader (e.g., Siemens)",
    challenge:
      "Needed a ruggedized, extreme-temperature PLC display module with a custom interface that could remain readable on factory floors and survive vibration-heavy equipment cycles.",
    solution:
      "NELYTECH engineered a high-contrast custom STN module with bespoke PCBA, reinforced connector strategy, and anti-vibration tooling for stable long-term deployment.",
    imageSrc: "https://images.unsplash.com/photo-1565514020179-026b92b84bb6?q=80&w=1600",
    imageAlt: "Robotic industrial automation equipment inside a modern factory",
    metric: "Rugged PLC display platform",
  },
  {
    client: "Top-Tier Medical Device Manufacturer",
    challenge:
      "Required ultra-low EMI, medical-grade compliance discipline, and liquid-resistant touch integration for surgical equipment used in high-risk clinical environments.",
    solution:
      "We delivered a fully tested LCD, touch, and PCBA assembly with controlled shielding, strict inspection gates, and a zero-defect deployment expectation.",
    imageSrc: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=1600",
    imageAlt: "Modern medical equipment and surgical lighting in a clinical room",
    metric: "Medical-ready LCD + touch + PCBA",
  },
  {
    client: "Leading European Smart Home Ecosystem",
    challenge:
      "Faced extremely tight spatial constraints and strict low-power requirements for battery-operated thermostats with premium consumer-facing interaction.",
    solution:
      "NELYTECH combined deep firmware optimization with a custom multi-layer micro-PCBA, reducing module thickness by 30% while preserving stable display performance.",
    imageSrc: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?q=80&w=1600",
    imageAlt: "Sharp close-up of smart home device technology",
    metric: "30% thinner display subsystem",
  },
] as const satisfies readonly CaseStudy[];

const testimonials = [
  {
    quote:
      "NELYTECH treated our display issue like a system-level engineering problem, not a commodity screen order. Their interface work removed weeks of internal debugging.",
    name: "Daniel Hartmann",
    title: "VP of Hardware Engineering",
    companyType: "Industrial Automation Group",
  },
  {
    quote:
      "The low NRE model gave us room to test a custom glass and PCBA path without locking the program into an expensive tooling decision too early.",
    name: "Marta Klein",
    title: "Chief Procurement Officer",
    companyType: "European Smart Device Manufacturer",
  },
  {
    quote:
      "Their inspection discipline is the reason we moved from samples to production. The documentation, electrical testing, and quality response were consistently precise.",
    name: "Evan Brooks",
    title: "Director of Quality Systems",
    companyType: "Medical Technology OEM",
  },
] as const satisfies readonly Testimonial[];

const revealViewport = { once: true, amount: 0.2 } as const;
const revealTransition = {
  type: "spring",
  stiffness: 88,
  damping: 20,
  mass: 0.9,
} as const;

export default function CasesPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    document.title = "Engineering Outcomes & Testimonials | NELYTECH";

    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );

    description?.setAttribute(
      "content",
      "Recent NELYTECH engineering outcomes and enterprise testimonials across industrial automation, medical devices, and smart home display programs.",
    );
  }, []);

  return (
    <main className="relative isolate overflow-hidden bg-white text-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(37,99,235,0.08),transparent_30%),radial-gradient(circle_at_82%_20%,rgba(14,165,233,0.07),transparent_28%),linear-gradient(180deg,#ffffff_0%,#f8fafc_44%,#ffffff_100%)]"
      />

      <section className="px-6 pb-20 pt-28 text-center sm:px-8 lg:px-12 lg:pb-28 lg:pt-40">
        <motion.div
          className="mx-auto max-w-6xl"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={revealTransition}
        >
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
            Recent Engineering Outcomes
          </p>
          <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-semibold leading-[0.95] tracking-normal text-slate-950 sm:text-6xl lg:text-7xl xl:text-8xl">
            Engineering Outcomes. Proven by Industry Leaders.
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-600 lg:text-xl lg:leading-9">
            Enterprise display programs succeed when technical risk is resolved early.
            These representative outcomes show how NELYTECH turns difficult LCD,
            touch, firmware, and PCBA requirements into production-ready hardware.
          </p>
        </motion.div>
      </section>

      <TestimonialsSection />

      <section aria-label="Engineering case studies" className="px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="max-w-4xl pb-14 lg:pb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealViewport}
            transition={revealTransition}
          >
            <h2 className="text-4xl font-semibold tracking-normal text-slate-950 lg:text-5xl">
             The Brief & Execution
            </h2>
          </motion.div>

          {caseStudies.map((caseStudy, index) => {
            const imageFirst = index % 2 === 1;

            return (
              <article
                key={caseStudy.client}
                className="border-t border-slate-200/60 py-20 lg:py-24"
              >
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
                  <motion.div
                    className={[
                      "lg:col-span-6",
                      imageFirst
                        ? "lg:col-start-1 lg:row-start-1"
                        : "lg:col-start-7 lg:row-start-1",
                    ].join(" ")}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={revealViewport}
                    transition={{ ...revealTransition, delay: 0.08 }}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/60">
                      <Image
                        src={caseStudy.imageSrc}
                        alt={caseStudy.imageAlt}
                        unoptimized
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    className={[
                      "lg:col-span-5",
                      imageFirst
                        ? "lg:col-start-8 lg:row-start-1"
                        : "lg:col-start-1 lg:row-start-1",
                    ].join(" ")}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={revealViewport}
                    transition={revealTransition}
                  >
                    <div className="flex items-end gap-5">
                      <span className="text-8xl font-light leading-none tracking-normal text-slate-300 sm:text-9xl">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <p className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
                        {caseStudy.metric}
                      </p>
                    </div>

                    <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl">
                      {caseStudy.client}
                    </h2>

                    <div className="mt-8 space-y-7">
                      <div>
                        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Challenge
                        </p>
                        <p className="mt-3 text-base leading-8 text-slate-600">
                          {caseStudy.challenge}
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                          Solution
                        </p>
                        <p className="mt-3 text-base leading-8 text-slate-600">
                          {caseStudy.solution}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="px-6 py-24 sm:px-8 lg:px-12 lg:py-32">
        <div className="mx-auto max-w-7xl border-t border-slate-200/60 pt-16">
          <motion.div
            className="max-w-4xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={revealViewport}
            transition={revealTransition}
          >
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-full border border-slate-300 bg-white px-8 py-3 text-sm font-medium text-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition-all duration-300 hover:bg-slate-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-4"
            >
              Discuss a similar engineering program
              <ArrowUpRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.5}
              />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

function TestimonialsSection() {
  return (
    <section className="px-6 pb-24 sm:px-8 lg:px-12 lg:pb-32">
      <div className="mx-auto max-w-7xl border-t border-slate-200/60 pt-16">
        <motion.div
          className="max-w-4xl"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={revealViewport}
          transition={revealTransition}
        >
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
            Testimonials
          </p>
          <h2 className="mt-5 text-4xl font-semibold tracking-normal text-slate-950 lg:text-5xl">
            What enterprise teams value most.
          </h2>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
          {testimonials.map((testimonial, index) => (
            <motion.figure
              key={testimonial.name}
              className="border-t border-slate-200/70 pt-8"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={revealViewport}
              transition={{ ...revealTransition, delay: index * 0.06 }}
            >
              <div className="mb-4 flex items-center gap-1.5" aria-label="5 star rating">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    aria-hidden="true"
                    className="h-4 w-4 fill-amber-500 text-amber-500"
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <blockquote className="text-xl leading-9 tracking-normal text-slate-500">
                "{testimonial.quote}"
              </blockquote>
              <figcaption className="mt-8">
                <p className="text-base font-semibold text-slate-950">
                  {testimonial.name}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  {testimonial.title}
                </p>
                <p className="text-sm leading-6 text-slate-400">
                  {testimonial.companyType}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
