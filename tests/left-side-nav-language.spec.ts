import { expect, test, type Page } from "@playwright/test";

const sectionIds = [
  "about-us",
  "advantages",
  "industries",
  "knowledge-hub",
  "deep-customization",
  "trusted",
  "contact",
] as const;

const locales = [
  {
    menu: /English/,
    ariaLabel: "Homepage section navigation",
    labels: ["Intro", "Advantages", "Industries", "Guide", "Custom", "Trusted", "Contact"],
  },
  {
    menu: /中文/,
    ariaLabel: "首页章节导航",
    labels: ["简介", "核心优势", "应用行业", "产品指南", "深度定制", "客户信赖", "联系我们"],
  },
  {
    menu: /Deutsch/,
    ariaLabel: "Navigation der Startseitenabschnitte",
    labels: ["Einführung", "Vorteile", "Branchen", "Leitfaden", "Anpassung", "Vertrauen", "Kontakt"],
  },
  {
    menu: /Español/,
    ariaLabel: "Navegación por las secciones de inicio",
    labels: ["Introducción", "Ventajas", "Industrias", "Guía", "Personalización", "Confianza", "Contacto"],
  },
  {
    menu: /Français/,
    ariaLabel: "Navigation des sections d'accueil",
    labels: ["Introduction", "Avantages", "Secteurs", "Guide", "Sur mesure", "Confiance", "Contact"],
  },
  {
    menu: /Italiano/,
    ariaLabel: "Navigazione delle sezioni della home page",
    labels: ["Introduzione", "Vantaggi", "Settori", "Guida", "Personalizzazione", "Affidabilità", "Contatti"],
  },
  {
    menu: /日本語/,
    ariaLabel: "ホームページのセクションナビゲーション",
    labels: ["概要", "強み", "業界", "ガイド", "カスタム", "信頼", "お問い合わせ"],
  },
  {
    menu: /한국어/,
    ariaLabel: "홈페이지 섹션 탐색",
    labels: ["소개", "강점", "산업", "가이드", "맞춤 제작", "신뢰", "문의"],
  },
] as const;

function collectBrowserErrors(page: Page) {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
  });
  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  return errors;
}

test("homepage left-side navigation follows all public languages", async ({ page }) => {
  const browserErrors = collectBrowserErrors(page);

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  for (const [localeIndex, locale] of locales.entries()) {
    if (localeIndex > 0) {
      const languageTrigger = page.locator("header button[aria-haspopup='menu']").last();
      await languageTrigger.click();
      await page.getByRole("menuitemradio", { name: locale.menu }).click();
    }

    const navigation = page.getByRole("navigation", { name: locale.ariaLabel });
    await expect(navigation).toBeVisible();

    for (const [index, label] of locale.labels.entries()) {
      await expect(
        navigation.getByRole("link", { name: label, exact: true }),
      ).toHaveAttribute("href", `#${sectionIds[index]}`);
    }
  }

  expect(browserErrors).toEqual([]);
});
