import { expect, test, type Page } from "@playwright/test";

import { canonicalCatalogue } from "@/content/catalogue";
import { resolveProductInterest } from "@/data/productInterest";

const lcdPanels = canonicalCatalogue.categories.find(
  (category) => category.slug === "lcd-panels",
)!;
const tn = lcdPanels.subcategories.find((subcategory) => subcategory.slug === "tn")!;

function productInterestSelector(page: Page) {
  return page.getByRole("region", { name: /What are you interested in/i });
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
      canonicalCatalogue.categories.length + 1,
    );

    await selectEnglishCategory(page, "LCD Panels (Monochrome)");
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

    await selector.getByText("TN (Twisted Nematic)", { exact: true }).click();
    await expect(page.locator('input[name="subcategoryId"]')).toHaveValue(tn.id);

    const productSearch = selector.getByRole("combobox", { name: "Optional product" });
    await productSearch.fill("4-Digit");
    await selector
      .getByRole("option", { name: /4-Digit 7-Segment Display/i })
      .click();

    await expect(page.locator('input[name="productId"]')).toHaveValue("prod_tn_01");
    await expect(selector).toContainText(
      /LCD Panels \(Monochrome\)[\s\S]*TN \(Twisted Nematic\)[\s\S]*4-Digit 7-Segment Display/,
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
      selector.getByText('Select a product category or choose "I\'m not sure".'),
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

  test("an empty subcategory keeps general enquiries available", async ({ page }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.goto("/contact");
    const selector = productInterestSelector(page);
    await selectEnglishCategory(page, "LCD Panels (Monochrome)");
    await selector.getByText("HTN (High Twisted Nematic)", { exact: true }).click();

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
    await expect(selector.getByRole("radio", { name: /LCD Panels \(Monochrome\)/ })).toBeChecked();
    await expect(selector.getByRole("radio", { name: /TN \(Twisted Nematic\)/ })).toBeChecked();
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

    expect(browserErrors).toEqual([]);
  });

  test("all public languages translate the selector while stable IDs remain unchanged", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);
    const locales = [
      {
        menu: /中文/,
        heading: "您对哪些产品感兴趣？",
        category: "LCD 面板（单色）",
        selected: "已选产品方向",
      },
      {
        menu: /Deutsch/,
        heading: "Wofür interessieren Sie sich?",
        category: "LCD-Panels (monochrom)",
        selected: "Ausgewähltes Interesse",
      },
      {
        menu: /Español/,
        heading: "¿En qué producto está interesado?",
        category: "Paneles LCD (monocromos)",
        selected: "Interés seleccionado",
      },
      {
        menu: /Français/,
        heading: "Quel produit vous intéresse ?",
        category: "Panneaux LCD (monochromes)",
        selected: "Intérêt sélectionné",
      },
      {
        menu: /Italiano/,
        heading: "A quale prodotto siete interessati?",
        category: "Pannelli LCD (monocromatici)",
        selected: "Interesse selezionato",
      },
      {
        menu: /日本語/,
        heading: "ご関心のある製品を教えてください",
        category: "LCD パネル（モノクロ）",
        selected: "選択した内容",
      },
      {
        menu: /한국어/,
        heading: "어떤 제품에 관심이 있으신가요?",
        category: "LCD 패널(단색)",
        selected: "선택한 관심 제품",
      },
    ];

    await page.goto("/contact");
    await selectEnglishCategory(page, "LCD Panels (Monochrome)");

    for (const locale of locales) {
      const languageTrigger = page.locator("header button[aria-haspopup='menu']").last();
      await languageTrigger.click();
      await page.getByRole("menuitemradio", { name: locale.menu }).click();

      await expect(page.getByRole("heading", { level: 3, name: locale.heading })).toBeVisible();
      await expect(page.getByRole("radio", { name: locale.category })).toBeChecked();
      await expect(page.getByText(locale.selected, { exact: true })).toBeVisible();
      await expect(page.locator('input[name="parentCategoryId"]')).toHaveValue(lcdPanels.id);
      await expect(page.getByText("What are you interested in?", { exact: true })).toHaveCount(0);
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
