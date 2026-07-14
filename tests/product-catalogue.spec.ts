import { expect, test, type Page } from "@playwright/test";
import { canonicalCatalogue } from "@/content/catalogue";

const allProductCount = canonicalCatalogue.categories.reduce(
  (total, category) =>
    total +
    category.products.length +
    category.subcategories.reduce(
      (subcategoryTotal, subcategory) => subcategoryTotal + subcategory.products.length,
      0,
    ),
  0,
);
const lcdPanels = canonicalCatalogue.categories.find(
  (category) => category.slug === "lcd-panels",
)!;
const lcdPanelProductCount =
  lcdPanels.products.length +
  lcdPanels.subcategories.reduce(
    (total, subcategory) => total + subcategory.products.length,
    0,
  );

function productCards(page: Page) {
  return page.locator('section[aria-label="Product results"] [data-testid="product-card"]');
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

test.describe("product catalogue", () => {
  test("category breadcrumb navigation supports back links and subcategory menus", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.goto("/products");
    await expect(page.getByRole("link", { name: /^Back to/ })).toHaveCount(0);
    await expect(page.getByTestId("catalogue-assistance-panel")).toContainText(
      "Find the right display",
    );
    await expect(page.getByRole("button", { name: /browse product categories/i })).toBeVisible();

    await page.goto("/products/lcd-panels");
    await expect(page.getByLabel("Breadcrumb")).toContainText(
      /Products\s*\/\s*LCD Panels/,
    );
    await expect(page.getByRole("link", { name: "Back to Products" })).toBeVisible();
    await expect(page.getByTestId("catalogue-assistance-panel")).toContainText(
      "Compare LCD panel technologies",
    );
    const subcategoryTrigger = page.getByRole("button", {
      name: /browse LCD Panels subcategories/i,
    });
    await expect(subcategoryTrigger).toBeVisible();

    await subcategoryTrigger.hover();
    const subcategoryMenu = page.getByRole("menu", {
      name: /browse LCD Panels subcategories/i,
    });
    await expect(subcategoryMenu).toBeVisible();
    await expect(subcategoryMenu.getByRole("menuitem", { name: "TN (Twisted Nematic)" })).toBeVisible();
    await subcategoryMenu.getByRole("menuitem", { name: "TN (Twisted Nematic)" }).hover();
    await expect(subcategoryMenu).toBeVisible();
    await subcategoryMenu.getByRole("menuitem", { name: "TN (Twisted Nematic)" }).click();

    await expect(page).toHaveURL("/products/tn");
    await expect(page.getByLabel("Breadcrumb")).toContainText(
      /Products\s*\/\s*LCD Panels\s*\/\s*TN \(Twisted Nematic\)/,
    );
    await page.getByRole("link", { name: "Back to LCD Panels" }).click();
    await expect(page).toHaveURL("/products/lcd-panels");
    await page.getByRole("link", { name: "Back to Products" }).click();
    await expect(page).toHaveURL("/products");

    await page.goto("/products/cog");
    await expect(page.getByRole("heading", { level: 1, name: "COG (Chip On Glass)" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Back to Assembly Technologies" })).toBeVisible();
    await expect(page.getByRole("button", { name: /subcategories/i })).toHaveCount(0);
    await expect(page.getByTestId("catalogue-assistance-panel")).toContainText(
      "Need help with COG?",
    );
    await expect(
      page.getByTestId("catalogue-assistance-panel").getByRole("link", {
        name: /browse assembly technologies/i,
      }),
    ).toBeVisible();
    await expect(page.getByText("0 products")).toBeVisible();

    expect(browserErrors).toEqual([]);
  });

  test("category subcategory menu supports keyboard and mobile interactions", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.goto("/products/lcd-panels");
    const subcategoryTrigger = page.getByRole("button", {
      name: /browse LCD Panels subcategories/i,
    });
    await subcategoryTrigger.focus();
    await page.keyboard.press("Enter");
    const subcategoryMenu = page.getByRole("menu", {
      name: /browse LCD Panels subcategories/i,
    });
    await expect(subcategoryMenu).toBeVisible();
    await page.keyboard.press("Tab");
    await expect(
      subcategoryMenu.getByRole("menuitem", { name: "TN (Twisted Nematic)" }),
    ).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(subcategoryMenu).toHaveCount(0);
    await expect(subcategoryTrigger).toBeFocused();

    await page.setViewportSize({ width: 390, height: 820 });
    await page.goto("/products/lcd-panels");
    await expect(page.getByLabel("Breadcrumb")).toContainText(
      /Products\s*\/\s*LCD Panels/,
    );
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        ),
      )
      .toBe(true);
    const mobileTrigger = page.getByRole("button", {
      name: /browse LCD Panels subcategories/i,
    });
    await mobileTrigger.click();
    const mobileMenu = page.getByRole("menu", {
      name: /browse LCD Panels subcategories/i,
    });
    await expect(mobileMenu).toBeVisible();
    await page.mouse.click(16, 760);
    await expect(mobileMenu).toHaveCount(0);
    await mobileTrigger.click();
    await mobileMenu.getByRole("menuitem", { name: "TN (Twisted Nematic)" }).click();
    await expect(page).toHaveURL("/products/tn");

    expect(browserErrors).toEqual([]);
  });

  test("desktop catalogue navigation, filtering, detail link, and empty category", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.goto("/");
    await page.getByRole("button", { name: /products/i }).hover();

    const megaMenu = page.locator("#products-mega-menu");
    await expect(megaMenu).toBeVisible();
    await megaMenu.getByRole("link", { name: /view all products/i }).click();

    await expect(page).toHaveURL("/products");
    await expect(page.getByRole("heading", { level: 1, name: "All Products" })).toBeVisible();
    await expect(page.getByLabel("Breadcrumb")).toContainText("Products");
    await expect(page.getByTestId("catalogue-assistance-panel")).toContainText(
      "Browse the full product range",
    );
    await page
      .getByTestId("catalogue-assistance-panel")
      .getByRole("link", { name: /contact our team/i })
      .click();
    await expect(page).toHaveURL("/contact");
    await page.goBack();
    await expect(page).toHaveURL("/products");
    await expect(page.getByText("Filter all products")).toBeVisible();
    await expect(page.getByText("Display technology")).toHaveCount(0);
    await expect(productCards(page)).toHaveCount(allProductCount);

    await page.getByLabel("Search products").fill("thermostat");
    await expect(productCards(page)).toHaveCount(1);
    await expect(productCards(page).first()).toContainText("Custom Thermostat Panel");
    await page.getByRole("button", { name: /clear product search/i }).click();
    await expect(productCards(page)).toHaveCount(allProductCount);

    const filterSidebar = page.locator('aside[aria-label="Product filters"]');
    const applicationSection = filterSidebar.getByRole("button", { name: /^Application/ });
    await expect(applicationSection).toHaveAttribute("aria-expanded", "true");
    await applicationSection.click();
    await expect(applicationSection).toHaveAttribute("aria-expanded", "false");
    await applicationSection.click();
    await page.getByRole("checkbox", { name: /HVAC controls/i }).check();
    await expect(productCards(page)).toHaveCount(1);
    await applicationSection.click();
    await expect(applicationSection).toHaveText(/1 selected/);
    await page.getByRole("button", { name: /clear all/i }).click();
    await expect(productCards(page)).toHaveCount(allProductCount);

    await page.goto("/products/lcd-panels");
    await expect(page.getByRole("heading", { level: 1, name: "LCD Panels" })).toBeVisible();
    await expect(page.getByText("Filter products under LCD Panels")).toBeVisible();
    await expect(productCards(page)).toHaveCount(lcdPanelProductCount);

    await page.goto("/products/tn");
    await expect(page.getByLabel("Breadcrumb")).toContainText(
      /Products\s*\/\s*LCD Panels\s*\/\s*TN \(Twisted Nematic\)/,
    );
    await expect(page.getByTestId("catalogue-assistance-panel")).toContainText(
      "Need help choosing a TN display?",
    );
    await expect(page.getByRole("button", { name: /subcategories/i })).toHaveCount(0);
    await expect(
      page.getByTestId("catalogue-assistance-panel").getByRole("link", {
        name: /browse LCD Panels/i,
      }),
    ).toBeVisible();
    await expect(page.getByText("Filter products under TN")).toBeVisible();
    await expect(page.getByTestId("product-results")).not.toContainText(
      "TN (Twisted Nematic)",
    );
    await expect(productCards(page)).toHaveCount(6);

    await page.getByRole("link", { name: /4-Digit 7-Segment Display/i }).click();
    await expect(page).toHaveURL("/products/4-digit-7-segment-display");
    await expect(
      page.getByRole("heading", { level: 1, name: "4-Digit 7-Segment Display" }),
    ).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL("/products/tn");
    await expect(productCards(page)).toHaveCount(6);

    await page.goto("/products/cog");
    await expect(page.getByRole("heading", { level: 1, name: "COG (Chip On Glass)" })).toBeVisible();
    await expect(page.getByText("Filter products under COG")).toBeVisible();
    await expect(page.getByText("0 products")).toBeVisible();
    await expect(page.getByText("No products available")).toBeVisible();
    await expect(page.getByText("There are currently no products listed under COG.")).toBeVisible();
    await expect(
      page
        .getByRole("complementary", { name: "Product filters" })
        .getByRole("button", { name: /^Assembly Method/ }),
    ).toBeVisible();
    await expect(page.getByText("No filters available for this category.")).toHaveCount(0);
    await expect(productCards(page)).toHaveCount(0);
    await page.getByRole("link", { name: /view all products/i }).click();
    await expect(page).toHaveURL("/products");

    expect(browserErrors).toEqual([]);
  });

  test("mobile filters, cards, breadcrumbs, and empty category remain usable", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.setViewportSize({ width: 390, height: 820 });
    await page.goto("/products");

    const assistancePanel = page.getByTestId("catalogue-assistance-panel");
    await expect(assistancePanel).toBeVisible();
    await expect(assistancePanel).toContainText("Find the right display");
    await expect(
      assistancePanel.getByRole("button", { name: /browse product categories/i }),
    ).toBeVisible();
    await expect(page.locator('aside[aria-label="Product filters"]')).toBeHidden();
    await expect(page.getByRole("button", { name: /^Filters$/i })).toBeVisible();
    await expect(productCards(page).first()).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => {
          const panel = document.querySelector(
            '[data-testid="catalogue-assistance-panel"]',
          );
          const search = document.querySelector("#product-search");

          if (!panel || !search) {
            return false;
          }

          return (
            panel.getBoundingClientRect().bottom <=
            search.getBoundingClientRect().top
          );
        }),
      )
      .toBe(true);
    await page.getByRole("button", { name: /^Filters$/i }).click();

    const dialog = page.getByRole("dialog", { name: "Filters" });
    await expect(dialog).toBeVisible();
    const applicationSection = dialog.getByRole("button", { name: /^Application/ });
    await applicationSection.click();
    await expect(applicationSection).toHaveAttribute("aria-expanded", "false");
    await applicationSection.click();
    await dialog.getByRole("checkbox", { name: /HVAC controls/i }).check();
    await expect(dialog.getByText("1 active")).toBeVisible();
    await dialog.getByRole("button", { name: "Reset" }).click();
    await expect(dialog.getByText("1 active")).toHaveCount(0);
    await dialog.getByRole("button", { name: "Done" }).click();
    await expect(dialog).toHaveCount(0);
    await expect(productCards(page)).toHaveCount(allProductCount);

    await page.goto("/products/tn");
    await expect(page.getByLabel("Breadcrumb")).toContainText(
      /Products\s*\/\s*LCD Panels\s*\/\s*TN \(Twisted Nematic\)/,
    );
    await expect(page.getByRole("heading", { level: 1, name: "TN (Twisted Nematic)" })).toBeVisible();
    await expect(productCards(page).first()).toBeVisible();

    await page.goto("/products/cog");
    await expect(page.getByRole("heading", { level: 1, name: "COG (Chip On Glass)" })).toBeVisible();
    await expect(page.getByText("No products available")).toBeVisible();
    await expect(page.getByRole("link", { name: /view all products/i })).toBeVisible();

    expect(browserErrors).toEqual([]);
  });
});
