"use client";

import { companyLogos } from "@/constants/logos";
import { useI18n } from "@/context/I18nContext";

const logoHoverColorClassNames: Record<string, string> = {
  siemens: "group-hover/logo:text-[#009999]",
  honeywell: "group-hover/logo:text-[#d71920]",
  abb: "group-hover/logo:text-[#ff0000]",
  bosch: "group-hover/logo:text-[#e20015]",
  panasonic: "group-hover/logo:text-[#0041c0]",
  continental: "group-hover/logo:text-[#ffa500]",
  philips: "group-hover/logo:text-[#0b5ed7]",
};

export function LogoTicker() {
  const { t } = useI18n();

  return (
    <section
      id="trusted"
      aria-labelledby="trusted-by-title"
      className="scroll-mt-32 overflow-hidden border-t border-slate-200 bg-white px-6 py-16 sm:px-8 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <h2
          id="trusted-by-title"
          className="text-center text-3xl font-semibold tracking-normal text-slate-950 sm:text-4xl"
        >
          {t("trustedBy.title")}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-6 text-slate-600 sm:text-base">
          {t("trustedBy.subtitle")}
        </p>

        <div
          data-logo-marquee
          className="group relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]"
        >
          <div
            data-logo-track
            className="flex w-max animate-logo-marquee [animation-duration:42s] group-hover:[animation-play-state:paused] motion-reduce:animate-none sm:[animation-duration:34s]"
          >
            <LogoRow logoAltPrefix={t("trustedBy.logoAltPrefix")} />
            <LogoRow logoAltPrefix={t("trustedBy.logoAltPrefix")} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}

interface LogoRowProps {
  logoAltPrefix: string;
  "aria-hidden"?: "true";
}

function LogoRow({ logoAltPrefix, ...props }: LogoRowProps) {
  return (
    <ul className="flex shrink-0 gap-4 pr-4 sm:gap-5 sm:pr-5" {...props}>
      {companyLogos.map((logo) => (
        <li key={logo.id}>
          <div
            className={`group/logo flex min-w-44 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-6 py-5 text-gray-400 opacity-50 transition duration-200 hover:border-teal-200 hover:bg-white hover:opacity-100 sm:min-w-56 ${logoHoverColorClassNames[logo.id] ?? "group-hover/logo:text-slate-950"}`}
            role="img"
            aria-label={`${logoAltPrefix} ${logo.name}`}
            title={logo.name}
          >
            <span aria-hidden="true" className="flex h-9 items-center">
              {logo.svgString}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
