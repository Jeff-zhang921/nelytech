import { expect, test, type Browser, type Page } from "@playwright/test";

const catalogueRoutes = [
  "/products",
  "/products/lcd-panels",
  "/products/tn",
  "/products/cog",
  "/products/4-digit-7-segment-display",
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

function header(page: Page) {
  return page.locator("header");
}

function languageButtons(page: Page) {
  return header(page).locator(
    'button[aria-label*="Language"], button[aria-label*="language"]',
  );
}

async function expectCatalogueEnglishOnly(page: Page) {
  const siteHeader = header(page);

  await expect(siteHeader.getByText("English Only", { exact: true })).toBeVisible();
  await expect(siteHeader.getByText("English (Only)", { exact: true })).toHaveCount(0);
  await expect(languageButtons(page)).toHaveCount(0);
  await expect(page.getByRole("menu", { name: /language/i })).toHaveCount(0);
  await expect(page.getByRole("menuitemradio")).toHaveCount(0);

  await siteHeader.getByText("English Only", { exact: true }).click();
  await expect(page.getByRole("menu", { name: /language/i })).toHaveCount(0);
  await expect(page.getByRole("menuitemradio")).toHaveCount(0);
}

async function openDefaultLanguageMenu(page: Page) {
  const trigger = languageButtons(page).first();

  await expect(trigger).toBeVisible();
  await trigger.click();
  await expect(page.getByRole("menu")).toBeVisible();

  return trigger;
}

async function expectDirectCatalogueRoute(browser: Browser, route: string) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const browserErrors = collectBrowserErrors(page);

  await page.goto(route);
  await expectCatalogueEnglishOnly(page);
  expect(browserErrors).toEqual([]);
  await context.close();
}

test.describe("product catalogue language control", () => {
  test("desktop uses non-interactive English Only across catalogue navigation", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.goto("/products");
    await expectCatalogueEnglishOnly(page);

    await page.goto("/products/lcd-panels");
    await expectCatalogueEnglishOnly(page);

    await page.goto("/products/tn");
    await expectCatalogueEnglishOnly(page);

    await page.goto("/products/cog");
    await expectCatalogueEnglishOnly(page);

    await page.goto("/products/4-digit-7-segment-display");
    await expectCatalogueEnglishOnly(page);

    await page
      .getByLabel("Breadcrumb")
      .getByRole("link", { name: "TN (Twisted Nematic)", exact: true })
      .click();
    await expect(page).toHaveURL("/products/tn");
    await expectCatalogueEnglishOnly(page);

    await page.goBack();
    await expect(page).toHaveURL("/products/4-digit-7-segment-display");
    await expectCatalogueEnglishOnly(page);

    await page.goForward();
    await expect(page).toHaveURL("/products/tn");
    await expectCatalogueEnglishOnly(page);

    expect(browserErrors).toEqual([]);
  });

  test("leaving catalogue restores the normal language selector and preserved language", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.goto("/");
    await openDefaultLanguageMenu(page);
    await page.getByRole("menuitemradio", { name: /\u4e2d\u6587/ }).click();
    await expect(header(page).locator("button[aria-haspopup='menu']").last()).toContainText(
      "\u4e2d\u6587",
    );

    await header(page).locator('button[aria-controls="products-mega-menu"]').hover();
    await page.locator('#products-mega-menu a[href="/products"]').click();
    await expect(page).toHaveURL("/products");
    await expectCatalogueEnglishOnly(page);

    await page.keyboard.press("Escape");
    await header(page)
      .locator('nav[aria-label="Main navigation"] a[href="/contact"]')
      .click();
    await expect(page).toHaveURL("/contact");
    await expect(header(page).getByText("English Only", { exact: true })).toHaveCount(0);
    const restoredTrigger = header(page).locator("button[aria-haspopup='menu']").last();
    await expect(restoredTrigger).toBeVisible();
    await expect(restoredTrigger).toContainText("\u4e2d\u6587");
    await restoredTrigger.click();
    await expect(page.getByRole("menu")).toBeVisible();
    await expect(page.getByRole("menuitemradio", { name: /\u4e2d\u6587/ })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await expect(page.getByRole("menuitemradio", { name: /Deutsch/ })).toBeVisible();

    await page.goto("/products/tn");
    await expectCatalogueEnglishOnly(page);

    expect(browserErrors).toEqual([]);
  });

  test("direct catalogue routes immediately render English Only", async ({ browser }) => {
    for (const route of catalogueRoutes) {
      await expectDirectCatalogueRoute(browser, route);
    }
  });

  test("mobile catalogue routes do not expose the full language list", async ({ page }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.setViewportSize({ width: 390, height: 820 });
    await page.goto("/products");
    await page.getByRole("button", { name: /open navigation menu/i }).click();
    let mobileNavigation = page.getByLabel("Mobile navigation");
    await expect(mobileNavigation.getByText("English Only", { exact: true })).toBeVisible();
    await expect(mobileNavigation.getByRole("button", { name: /language/i })).toHaveCount(0);
    await expect(page.getByRole("menuitemradio")).toHaveCount(0);

    await page.goto("/products/tn");
    await page.getByRole("button", { name: /open navigation menu/i }).click();
    mobileNavigation = page.getByLabel("Mobile navigation");
    await expect(mobileNavigation.getByText("English Only", { exact: true })).toBeVisible();
    await expect(mobileNavigation.getByRole("button", { name: /language/i })).toHaveCount(0);

    await page.goto("/products/4-digit-7-segment-display");
    await page.getByRole("button", { name: /open navigation menu/i }).click();
    mobileNavigation = page.getByLabel("Mobile navigation");
    await expect(mobileNavigation.getByText("English Only", { exact: true })).toBeVisible();
    await expect(mobileNavigation.getByRole("button", { name: /language/i })).toHaveCount(0);

    await page.goto("/contact");
    await page.getByRole("button", { name: /open navigation menu/i }).click();
    mobileNavigation = page.getByLabel("Mobile navigation");
    await expect(mobileNavigation.getByText("English Only", { exact: true })).toHaveCount(0);
    await expect(mobileNavigation.getByRole("button", { name: /language/i })).toBeVisible();
    await mobileNavigation.getByRole("button", { name: /language/i }).click();
    await expect(page.getByRole("menu")).toBeVisible();
    await expect(page.getByRole("menuitemradio", { name: /Deutsch/ })).toBeVisible();

    expect(browserErrors).toEqual([]);
  });
});
