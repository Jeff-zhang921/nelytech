"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";

import { translations, type Language } from "@/locales/translations";

type TranslationNode = string | { readonly [key: string]: TranslationNode };

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguage] = useState<Language>("en");

  const value = useMemo<I18nContextValue>(() => {
    function t(key: string) {
      const translation = getTranslation(translations[language], key);

      return typeof translation === "string" ? translation : key;
    }

    return { language, setLanguage, t };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider.");
  }

  return context;
}

function getTranslation(dictionary: TranslationNode, key: string): TranslationNode | undefined {
  return key.split(".").reduce<TranslationNode | undefined>((currentValue, keyPart) => {
    if (!currentValue || typeof currentValue === "string") {
      return undefined;
    }

    return currentValue[keyPart];
  }, dictionary);
}
