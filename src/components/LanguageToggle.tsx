"use client";

import type { Language } from "@/locales/translations";
import { useI18n } from "@/context/I18nContext";

const languageOptions = [
  { code: "en", labelKey: "language.en" },
  { code: "zh", labelKey: "language.zh" },
] as const satisfies readonly { code: Language; labelKey: string }[];

export function LanguageToggle() {
  const { language, setLanguage, t } = useI18n();

  return (
    <div
      aria-label={t("nav.language")}
      className="inline-flex items-center rounded-full bg-slate-100 p-1"
    >
      {languageOptions.map((option) => {
        const isActive = language === option.code;

        return (
          <button
            key={option.code}
            type="button"
            aria-pressed={isActive}
            onClick={() => setLanguage(option.code)}
            className={[
              "rounded-full px-3 py-1.5 text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2",
              isActive
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-500 hover:text-teal-700",
            ].join(" ")}
          >
            {t(option.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
