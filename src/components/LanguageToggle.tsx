"use client";

import { type FocusEvent, useId, useState } from "react";
import { usePathname } from "next/navigation";

import { useI18n } from "@/context/I18nContext";
import { isProductCataloguePathname } from "@/data/productCatalogue";
import type { Language } from "@/locales/translations";

const languageOptions = [
  { code: "en", shortLabel: "EN", label: "English", nativeLabel: "English" },
  { code: "zh", shortLabel: "\u4e2d\u6587", label: "Chinese", nativeLabel: "\u4e2d\u6587" },
  { code: "de", shortLabel: "DE", label: "German", nativeLabel: "Deutsch" },
  { code: "es", shortLabel: "ES", label: "Spanish", nativeLabel: "Espa\u00f1ol" },
  { code: "fr", shortLabel: "FR", label: "French", nativeLabel: "Fran\u00e7ais" },
  { code: "it", shortLabel: "IT", label: "Italian", nativeLabel: "Italiano" },
  { code: "ja", shortLabel: "JA", label: "Japanese", nativeLabel: "\u65e5\u672c\u8a9e" },
  { code: "ko", shortLabel: "KO", label: "Korean", nativeLabel: "\ud55c\uad6d\uc5b4" },
] as const satisfies readonly {
  code: Language;
  shortLabel: string;
  label: string;
  nativeLabel: string;
}[];

export function LanguageToggle() {
  const pathname = usePathname();
  const isProductCatalogueRoute = isProductCataloguePathname(pathname);

  return (
    <LanguageToggleControl
      key={pathname}
      mode={isProductCatalogueRoute ? "english-only" : "default"}
    />
  );
}

type LanguageControlMode = "default" | "english-only";

function LanguageToggleControl({
  mode,
}: {
  mode: LanguageControlMode;
}) {
  const { language, setLanguage, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const activeLanguage =
    languageOptions.find((option) => option.code === language) ?? languageOptions[0];

  function handleLanguageSelect(nextLanguage: Language) {
    setLanguage(nextLanguage);
    setIsOpen(false);
  }

  function openLanguageMenu() {
    if (mode === "default") {
      setIsOpen(true);
    }
  }

  function closeLanguageMenu() {
    setIsOpen(false);
  }

  function handleBlur(event: FocusEvent<HTMLDivElement>) {
    const nextFocusedElement = event.relatedTarget as Node | null;

    if (!nextFocusedElement || !event.currentTarget.contains(nextFocusedElement)) {
      closeLanguageMenu();
    }
  }

  if (mode === "english-only") {
    return (
      <span
        className="inline-flex items-center rounded-full px-1.5 py-1 text-sm font-medium tracking-[0.03em] whitespace-nowrap text-slate-600"
      >
        English Only
      </span>
    );
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={openLanguageMenu}
      onMouseLeave={closeLanguageMenu}
      onFocus={openLanguageMenu}
      onBlur={handleBlur}
    >
      <button
        type="button"
        aria-label={t("nav.language")}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        className="inline-flex items-center gap-2 rounded-full px-1.5 py-1 text-sm font-medium text-slate-600 outline-none transition-colors hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-4"
      >
        <GlobeIcon className="h-4 w-4" />
        <span className="tracking-[0.08em]">{activeLanguage.shortLabel}</span>
        <ChevronDownIcon
          className={[
            "h-3.5 w-3.5 transition-transform duration-300",
            isOpen ? "rotate-180" : "rotate-0",
          ].join(" ")}
        />
      </button>

      <div
        className={[
          "absolute right-0 top-full z-50 pt-4 transition-all duration-300",
          isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-1 scale-[0.98] opacity-0",
        ].join(" ")}
      >
        <div
          id={menuId}
          role="menu"
          aria-label={t("nav.language")}
          className="w-56 origin-top-right overflow-hidden rounded-2xl border border-slate-100 bg-white/90 py-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-md"
        >
          {languageOptions.map((option) => {
            const isActive = option.code === language;

            return (
              <button
                key={option.code}
                type="button"
                role="menuitemradio"
                aria-checked={isActive}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleLanguageSelect(option.code)}
                className={[
                  "flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left text-sm outline-none transition-colors hover:bg-slate-50 focus-visible:bg-slate-50",
                  isActive ? "font-semibold text-slate-950" : "font-normal text-slate-600",
                ].join(" ")}
              >
                <span>{option.nativeLabel}</span>
                <span className="text-xs tracking-[0.12em] text-slate-400">
                  {option.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface IconProps {
  className?: string;
}

function GlobeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M3.8 9h16.4M3.8 15h16.4M12 3c2.2 2.4 3.3 5.4 3.3 9S14.2 18.6 12 21c-2.2-2.4-3.3-5.4-3.3-9S9.8 5.4 12 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} fill="none" aria-hidden="true">
      <path
        d="m5 7.5 5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
