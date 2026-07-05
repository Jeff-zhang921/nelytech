"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";

import { pageTranslations } from "@/locales/pageTranslations";
import { productContentTranslations } from "@/locales/productContentTranslations";
import { productGuideDetailTranslations } from "@/locales/productGuideDetailTranslations";
import { translations, type Language, type TranslationLanguage } from "@/locales/translations";

type TranslationNode = string | { readonly [key: string]: TranslationNode };

const countryDisplayCodes = {
  unitedStates: "US",
  canada: "CA",
  mexico: "MX",
  brazil: "BR",
  argentina: "AR",
  chile: "CL",
  colombia: "CO",
  germany: "DE",
  unitedKingdom: "GB",
  france: "FR",
  italy: "IT",
  spain: "ES",
  netherlands: "NL",
  belgium: "BE",
  switzerland: "CH",
  austria: "AT",
  sweden: "SE",
  norway: "NO",
  denmark: "DK",
  finland: "FI",
  poland: "PL",
  czechRepublic: "CZ",
  hungary: "HU",
  romania: "RO",
  turkey: "TR",
  unitedArabEmirates: "AE",
  saudiArabia: "SA",
  southAfrica: "ZA",
  china: "CN",
  hongKong: "HK",
  taiwan: "TW",
  japan: "JP",
  southKorea: "KR",
  india: "IN",
  singapore: "SG",
  malaysia: "MY",
  thailand: "TH",
  vietnam: "VN",
  indonesia: "ID",
  philippines: "PH",
  australia: "AU",
  newZealand: "NZ",
  israel: "IL",
  ireland: "IE",
  portugal: "PT",
  greece: "GR",
  russia: "RU",
  ukraine: "UA",
  egypt: "EG",
  morocco: "MA",
} as const;

const otherCountryLabels: Record<Language, string> = {
  en: "Other",
  zh: "其他",
  de: "Sonstige",
  es: "Otro",
  fr: "Autre",
  it: "Altro",
  ja: "その他",
  ko: "기타",
};

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
      const dictionary = getDictionary(language);
      const pageDictionary = getPageDictionary(language);
      const productContentDictionary = getProductContentDictionary(language);
      const productGuideDetailDictionary = getProductGuideDetailDictionary(language);
      const translation =
        (productGuideDetailDictionary
          ? getTranslation(productGuideDetailDictionary, key)
          : undefined) ??
        (productContentDictionary
          ? getTranslation(productContentDictionary, key)
          : undefined) ??
        (pageDictionary ? getTranslation(pageDictionary, key) : undefined) ??
        getDynamicTranslation(language, key) ??
        getTranslation(dictionary, key) ??
        getTranslation(translations.en, key);

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

function getDictionary(language: Language): TranslationNode {
  if (language in translations) {
    return translations[language as TranslationLanguage];
  }

  return translations.en;
}

function getPageDictionary(language: Language): TranslationNode | undefined {
  if (language in pageTranslations) {
    return pageTranslations[language as keyof typeof pageTranslations];
  }

  return undefined;
}

function getProductContentDictionary(language: Language): TranslationNode | undefined {
  if (language in productContentTranslations) {
    return productContentTranslations[
      language as keyof typeof productContentTranslations
    ];
  }

  return undefined;
}

function getProductGuideDetailDictionary(language: Language): TranslationNode | undefined {
  if (language in productGuideDetailTranslations) {
    return productGuideDetailTranslations[
      language as keyof typeof productGuideDetailTranslations
    ];
  }

  return undefined;
}

function getDynamicTranslation(language: Language, key: string): string | undefined {
  const countryKey = key.replace(/^contactForm\.countries\./, "");

  if (countryKey === key) {
    return undefined;
  }

  if (countryKey === "other") {
    return otherCountryLabels[language];
  }

  const regionCode = countryDisplayCodes[countryKey as keyof typeof countryDisplayCodes];

  if (!regionCode) {
    return undefined;
  }

  try {
    return new Intl.DisplayNames([language], { type: "region" }).of(regionCode) ?? undefined;
  } catch {
    return undefined;
  }
}

function getTranslation(dictionary: TranslationNode, key: string): TranslationNode | undefined {
  return key.split(".").reduce<TranslationNode | undefined>((currentValue, keyPart) => {
    if (!currentValue || typeof currentValue === "string") {
      return undefined;
    }

    return currentValue[keyPart];
  }, dictionary);
}
