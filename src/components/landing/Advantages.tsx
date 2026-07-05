"use client";

import Image from "next/image";

import { useI18n } from "@/context/I18nContext";

interface AdvantageVisual {
  translationKey: string;
  imageSrc: string;
  imageAlt: string;
  accentClassName: string;
}

const advantages = [
  {
    translationKey: "customController",
    imageSrc:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Macro view of a printed circuit board and microchip traces",
    accentClassName: "text-cyan-400",
  },
  {
    translationKey: "lowTooling",
    imageSrc:
      "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Precision manufacturing equipment inside an industrial production facility",
    accentClassName: "text-amber-300",
  },
  {
    translationKey: "multiColor",
    imageSrc:
      "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Close-up of illuminated electronics and circuit components",
    accentClassName: "text-sky-400",
  },
  {
    translationKey: "lowPower",
    imageSrc:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Detailed semiconductor chip and low-voltage electronic board components",
    accentClassName: "text-emerald-400",
  },
  {
    translationKey: "flexiblePcba",
    imageSrc:
      "https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Macro electronics assembly with dense PCB traces and mounted components",
    accentClassName: "text-violet-400",
  },
] as const satisfies readonly AdvantageVisual[];

export function Advantages() {
  const { t } = useI18n();

  return (
    <section
      id="advantages"
      aria-labelledby="advantages-title"
      className="scroll-mt-32 border-b border-slate-200 bg-white px-5 py-10 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold tracking-[0.16em] text-teal-700 uppercase">
            {t("advantage.eyebrow")}
          </p>
          <h2
            id="advantages-title"
            className="mt-2 text-2xl font-semibold tracking-normal text-slate-950 sm:text-3xl"
          >
            {t("advantage.title")}
          </h2>
        </div>

        <ul className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {advantages.map((advantage) => (
            <li key={advantage.translationKey}>
              <article className="group h-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
                <div
                  className="relative h-28 overflow-hidden bg-slate-200"
                  style={{ position: "relative" }}
                >
                  <Image
                    src={advantage.imageSrc}
                    alt={advantage.imageAlt}
                    unoptimized
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-950/25" />
                  <span
                    className={`absolute bottom-3 left-3 text-3xl font-semibold leading-none tracking-normal drop-shadow-md ${advantage.accentClassName}`}
                  >
                    {t(`advantage.items.${advantage.translationKey}.index`)}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold leading-5 tracking-normal text-slate-950">
                    {t(`advantage.items.${advantage.translationKey}.title`)}
                  </h3>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
