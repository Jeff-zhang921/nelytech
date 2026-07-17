import { expect, test, type Page } from "@playwright/test";

import { canonicalCatalogue } from "@/content/catalogue";
import {
  getCanonicalProductInterestSummary,
  resolveProductBySlug,
  resolveProductInterest,
} from "@/data/productInterest";

const lcdPanels = canonicalCatalogue.categories.find(
  (category) => category.slug === "lcd-panels",
)!;
const tn = lcdPanels.subcategories.find((subcategory) => subcategory.slug === "tn")!;

function productInterestSelector(page: Page) {
  return page.locator('section[aria-labelledby="contact-product-interest-heading"]');
}

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

async function selectEnglishCategory(page: Page, label: string) {
  await productInterestSelector(page).getByText(label, { exact: true }).click();
}

test.describe("Contact Product Interest selector", () => {
  test("uses catalogue data, progressive disclosure, stable IDs, and keyboard product search", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.goto("/contact");
    const selector = productInterestSelector(page);
    const categoryGroup = selector.getByRole("group", { name: "Product category" });

    await expect(page.locator('select[name="interest"], input[name="interest"]')).toHaveCount(0);
    await expect(categoryGroup.getByRole("radio")).toHaveCount(
      canonicalCatalogue.categories.length + 2,
    );

    await selectEnglishCategory(page, "LCD Panels");
    await expect(page.locator('input[name="productInterestMode"]')).toHaveValue(
      "catalogue-selection",
    );
    await expect(page.locator('input[name="parentCategoryId"]')).toHaveValue(lcdPanels.id);

    if (lcdPanels.subcategories.length > 5) {
      const overflowSubcategory = lcdPanels.subcategories[5];
      await expect(
        selector.getByRole("radio", { name: overflowSubcategory.name }),
      ).toHaveCount(0);
      await selector.getByRole("button", { name: "More" }).click();
      await expect(
        selector.getByRole("radio", { name: overflowSubcategory.name }),
      ).toBeVisible();
    }

    await selector.getByText("TN", { exact: true }).click();
    await expect(page.locator('input[name="subcategoryId"]')).toHaveValue(tn.id);

    const productSearch = selector.getByRole("combobox", { name: "Optional product" });
    await productSearch.fill("4-Digit");
    await selector
      .getByRole("option", { name: /4-Digit 7-Segment Display/i })
      .click();

    await expect(page.locator('input[name="productId"]')).toHaveValue("prod_tn_01");
    await expect(selector).toContainText(
      /LCD Panels[\s\S]*TN[\s\S]*4-Digit 7-Segment Display/,
    );

    await productSearch.fill("16x2");
    await expect(selector.getByRole("listbox", { name: "Product results" })).toBeVisible();
    await productSearch.press("ArrowDown");
    await productSearch.press("Enter");
    await expect(page.locator('input[name="productId"]')).toHaveValue("prod_tn_02");
    await expect(selector).toContainText("16x2 Character LCD Module");

    await selectEnglishCategory(page, "Assembly Technologies");
    await expect(page.locator('input[name="subcategoryId"]')).toHaveValue("");
    await expect(page.locator('input[name="productId"]')).toHaveValue("");
    await expect(selector).toContainText(/Selected interest\s*Assembly Technologies/);

    expect(browserErrors).toEqual([]);
  });

  test("guidance is a valid stable selection and the validation message is connected", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.goto("/contact");
    await page.getByLabel(/^Name/).fill("Guidance User");
    await page.getByLabel(/Work Email/).fill("guidance@example.com");
    await page.getByLabel(/^Message/).fill("Please help us identify the correct display family.");
    await page.getByRole("button", { name: "Send Inquiry" }).click();

    const selector = productInterestSelector(page);
    await expect(
      selector.getByText(
        'Select a product category, General question, or "I\'m not sure".',
      ),
    ).toBeVisible();
    await expect(selector.getByRole("radio", { name: /LCD Panels/ })).toBeFocused();

    await selector.getByText("I'm not sure - I need guidance", { exact: true }).click();
    await expect(page.locator('input[name="productInterestMode"]')).toHaveValue(
      "needs-guidance",
    );
    await expect(page.locator('input[name="parentCategoryId"]')).toHaveValue("");
    await expect(selector).toContainText(/Selected interest\s*I'm not sure - I need guidance/);

    await page.getByRole("button", { name: "Send Inquiry" }).click();
    await expect(page.getByRole("button", { name: "Sending..." })).toBeDisabled();
    await expect(page.getByText(/Inquiry sent successfully/i)).toBeVisible({ timeout: 10_000 });

    expect(browserErrors).toEqual([]);
  });

  test("general question is a valid stable option without catalogue IDs", async ({ page }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.goto("/contact");
    const selector = productInterestSelector(page);
    await selector.getByText("General question", { exact: true }).click();

    await expect(page.locator('input[name="productInterestMode"]')).toHaveValue(
      "general-question",
    );
    await expect(page.locator('input[name="parentCategoryId"]')).toHaveValue("");
    await expect(page.locator('input[name="subcategoryId"]')).toHaveValue("");
    await expect(page.locator('input[name="productId"]')).toHaveValue("");
    await expect(selector).toContainText(/Selected interest\s*General question/);

    await page.getByLabel(/^Name/).fill("General Question User");
    await page.getByLabel(/Work Email/).fill("general-question@example.com");
    await page.getByLabel(/^Message/).fill("I have a general question about your services.");
    await page.getByRole("button", { name: "Send Inquiry" }).click();
    await expect(page.getByText(/Inquiry sent successfully/i)).toBeVisible({ timeout: 10_000 });

    expect(browserErrors).toEqual([]);
  });

  test("an empty subcategory keeps general enquiries available", async ({ page }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.goto("/contact");
    const selector = productInterestSelector(page);
    await selectEnglishCategory(page, "LCD Panels");
    await selector.getByText("HTN", { exact: true }).click();

    await expect(selector.getByText(/No specific products are currently listed/i)).toBeVisible();
    await expect(selector.getByRole("combobox", { name: "Optional product" })).toHaveCount(0);
    await expect(page.locator('input[name="subcategoryId"]')).toHaveValue(
      "subcategory-htn",
    );

    await page.getByLabel(/^Name/).fill("General Enquiry User");
    await page.getByLabel(/Work Email/).fill("general@example.com");
    await page.getByLabel(/^Message/).fill("Please advise on an HTN display project.");
    await page.getByRole("button", { name: "Send Inquiry" }).click();
    await expect(page.getByText(/Inquiry sent successfully/i)).toBeVisible({ timeout: 10_000 });

    expect(browserErrors).toEqual([]);
  });

  test("product context preselects the hierarchy, remains editable, and ignores invalid slugs", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.goto("/contact?product=4-digit-7-segment-display");
    const selector = productInterestSelector(page);
    await expect(selector.getByRole("radio", { name: /^LCD Panels/ })).toBeChecked();
    await expect(selector.getByRole("radio", { name: "TN", exact: true })).toBeChecked();
    await expect(page.locator('input[name="productId"]')).toHaveValue("prod_tn_01");

    await selector.getByRole("button", { name: "Clear", exact: true }).click();
    await expect(page.locator('input[name="productInterestMode"]')).toHaveValue("");
    await selector.getByText("Advanced & Custom Solutions", { exact: true }).click();
    await expect(page.locator('input[name="parentCategoryId"]')).toHaveValue(
      "category-custom-solutions",
    );

    await page.goto("/contact?product=not-a-real-product");
    await expect(page.locator('input[name="productInterestMode"]')).toHaveValue("");
    await expect(productInterestSelector(page).getByText("Selected interest")).toHaveCount(0);

    const languageTrigger = page.locator("header button[aria-haspopup='menu']").last();
    await languageTrigger.click();
    await page.getByRole("menuitemradio", { name: /中文/ }).click();

    await page.getByRole("button", { name: /产品/ }).hover();
    const productsMenu = page.locator("#products-mega-menu");
    await expect(productsMenu).toBeVisible();
    await productsMenu.getByRole("link", { name: /TN \(Twisted Nematic\)/ }).click();
    await expect(page).toHaveURL("/products/tn");
    await page.getByRole("link", { name: /4-Digit 7-Segment Display/i }).click();
    await expect(page).toHaveURL("/products/4-digit-7-segment-display");
    await page
      .locator('section[aria-labelledby="product-title"]')
      .getByRole("link", { name: /Contact Us about 4-Digit 7-Segment Display/i })
      .click();
    await expect(page).toHaveURL("/contact?product=4-digit-7-segment-display");

    const chineseSelector = productInterestSelector(page);
    await expect(
      page.getByRole("heading", { level: 3, name: "您对哪些产品感兴趣？" }),
    ).toBeVisible();
    await expect(
      chineseSelector.getByRole("radio", { name: /^LCD Panels/ }),
    ).toBeChecked();
    await expect(
      chineseSelector.getByRole("radio", { name: "TN", exact: true }),
    ).toBeChecked();
    await expect(
      chineseSelector.getByText("LCD Panels / TN / 4-Digit 7-Segment Display", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      chineseSelector.locator("#contact-product-interest-product-search"),
    ).toHaveValue("4-Digit 7-Segment Display");
    await expect(chineseSelector.getByText("LCD 面板（单色）", { exact: true })).toHaveCount(0);

    expect(browserErrors).toEqual([]);
  });

  test("all public languages translate the selector while stable IDs remain unchanged", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);
    const locales = [
      {
        code: "zh",
        menu: /中文/,
        heading: "您对哪些产品感兴趣？",
        translatedCategory: "LCD 面板（单色）",
        selected: "已选产品方向",
        generalQuestion: "一般咨询",
        guidance: "我不确定，需要专业建议",
      },
      {
        code: "de",
        menu: /Deutsch/,
        heading: "Wofür interessieren Sie sich?",
        translatedCategory: "LCD-Panels (monochrom)",
        selected: "Ausgewähltes Interesse",
        generalQuestion: "Allgemeine Anfrage",
        guidance: "Ich bin nicht sicher - ich benötige Beratung",
      },
      {
        code: "es",
        menu: /Español/,
        heading: "¿En qué producto está interesado?",
        translatedCategory: "Paneles LCD (monocromos)",
        selected: "Interés seleccionado",
        generalQuestion: "Consulta general",
        guidance: "No estoy seguro; necesito orientación",
      },
      {
        code: "fr",
        menu: /Français/,
        heading: "Quel produit vous intéresse ?",
        translatedCategory: "Panneaux LCD (monochromes)",
        selected: "Intérêt sélectionné",
        generalQuestion: "Question générale",
        guidance: "Je ne sais pas encore - j'ai besoin de conseils",
      },
      {
        code: "it",
        menu: /Italiano/,
        heading: "A quale prodotto siete interessati?",
        translatedCategory: "Pannelli LCD (monocromatici)",
        selected: "Interesse selezionato",
        generalQuestion: "Domanda generale",
        guidance: "Non sono sicuro - ho bisogno di assistenza",
      },
      {
        code: "ja",
        menu: /日本語/,
        heading: "ご関心のある製品を教えてください",
        translatedCategory: "LCD パネル（モノクロ）",
        selected: "選択した内容",
        generalQuestion: "一般的なお問い合わせ",
        guidance: "まだ分からないため、相談したい",
      },
      {
        code: "ko",
        menu: /한국어/,
        heading: "어떤 제품에 관심이 있으신가요?",
        translatedCategory: "LCD 패널(단색)",
        selected: "선택한 관심 제품",
        generalQuestion: "일반 문의",
        guidance: "잘 모르겠습니다 - 안내가 필요합니다",
      },
    ];

    await page.goto("/contact");
    const selector = productInterestSelector(page);
    await selectEnglishCategory(page, "LCD Panels");
    await selector.getByText("TN", { exact: true }).click();
    await selector.locator("#contact-product-interest-product-search").fill("4-Digit");
    await selector
      .getByRole("option", { name: /4-Digit 7-Segment Display/i })
      .click();

    for (const locale of locales) {
      const languageTrigger = page.locator("header button[aria-haspopup='menu']").last();
      await languageTrigger.click();
      await page.getByRole("menuitemradio", { name: locale.menu }).click();

      const localizedSelector = productInterestSelector(page);
      await expect(page.getByRole("heading", { level: 3, name: locale.heading })).toBeVisible();
      await expect(
        localizedSelector.getByRole("radio", { name: /^LCD Panels/ }),
      ).toBeChecked();
      await expect(
        localizedSelector.getByRole("radio", { name: "TN", exact: true }),
      ).toBeChecked();
      await expect(page.getByText(locale.selected, { exact: true })).toBeVisible();
      await expect(page.getByText(locale.generalQuestion, { exact: true })).toBeVisible();
      await expect(page.getByText(locale.guidance, { exact: true })).toBeVisible();
      await expect(
        localizedSelector.getByText(locale.translatedCategory, { exact: true }),
      ).toHaveCount(0);
      await expect(localizedSelector.getByText(/^TN(?:\s*\(|（)/)).toHaveCount(0);
      await expect(
        localizedSelector.getByText(
          "LCD Panels / TN / 4-Digit 7-Segment Display",
          { exact: true },
        ),
      ).toBeVisible();
      await expect(
        localizedSelector.locator("#contact-product-interest-product-search"),
      ).toHaveValue("4-Digit 7-Segment Display");
      await expect(page.locator('input[name="parentCategoryId"]')).toHaveValue(lcdPanels.id);
      await expect(page.locator('input[name="subcategoryId"]')).toHaveValue(tn.id);
      await expect(page.locator('input[name="productId"]')).toHaveValue("prod_tn_01");
      await expect(page.getByText("What are you interested in?", { exact: true })).toHaveCount(0);

      if (locale.code === "zh") {
        for (const subcategoryName of ["TN", "HTN", "STN", "FSTN", "VA"]) {
          await expect(
            localizedSelector.getByText(subcategoryName, { exact: true }),
          ).toBeVisible();
        }
      }
    }

    expect(browserErrors).toEqual([]);
  });

  test("mobile layout has touch targets, readable summary, and no horizontal overflow", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.setViewportSize({ width: 390, height: 820 });
    await page.goto("/contact?product=4-digit-7-segment-display");
    const selector = productInterestSelector(page);

    await expect(selector).toBeVisible();
    await expect(selector.getByRole("combobox", { name: "Optional product" })).toBeVisible();
    await expect(selector).toContainText("4-Digit 7-Segment Display");
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        ),
      )
      .toBe(true);

    const guidanceLabel = selector.getByText("I'm not sure - I need guidance", {
      exact: true,
    });
    const guidanceBox = await guidanceLabel.locator("xpath=ancestor::label").boundingBox();
    expect(guidanceBox).not.toBeNull();
    expect(guidanceBox!.height).toBeGreaterThanOrEqual(44);
    await guidanceLabel.click();
    await expect(page.locator('input[name="productInterestMode"]')).toHaveValue(
      "needs-guidance",
    );

    expect(browserErrors).toEqual([]);
  });
});

test("stable catalogue resolver rejects cross-category product identifiers", () => {
  expect(
    resolveProductInterest({
      mode: "catalogue-selection",
      parentCategoryId: "category-assembly-technologies",
      subcategoryId: "subcategory-cog",
      productId: "prod_tn_01",
    }),
  ).toBeUndefined();
});

test("canonical product context keeps stable IDs and an English enquiry summary", () => {
  const context = resolveProductBySlug("4-digit-7-segment-display");

  expect(context?.value).toEqual({
    mode: "catalogue-selection",
    parentCategoryId: "category-lcd-panels",
    subcategoryId: "subcategory-tn",
    productId: "prod_tn_01",
  });
  expect(context ? getCanonicalProductInterestSummary(context.value) : undefined).toBe(
    "LCD Panels > TN > 4-Digit 7-Segment Display",
  );
});
