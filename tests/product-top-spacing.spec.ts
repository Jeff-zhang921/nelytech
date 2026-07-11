import { expect, test, type Page } from "@playwright/test";

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

async function productTopMetrics(page: Page) {
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByLabel("Breadcrumb")).toBeVisible();

  return page.evaluate(() => {
    const header = document.querySelector("header");
    const breadcrumb = document.querySelector('[aria-label="Breadcrumb"]');
    const backLink = document.querySelector('[data-testid="product-parent-link"]');
    const heading = document.querySelector("main h1");

    if (!header || !breadcrumb || !heading) {
      throw new Error("Missing required product page top-layout elements");
    }

    const headerBox = header.getBoundingClientRect();
    const breadcrumbBox = breadcrumb.getBoundingClientRect();
    const headingBox = heading.getBoundingClientRect();
    const backLinkBox = backLink?.getBoundingClientRect();

    return {
      headerBottom: Math.round(headerBox.bottom),
      breadcrumbTop: Math.round(breadcrumbBox.top),
      breadcrumbGap: Math.round(breadcrumbBox.top - headerBox.bottom),
      backLinkGap: backLinkBox
        ? Math.round(backLinkBox.top - breadcrumbBox.bottom)
        : null,
      headingTop: Math.round(headingBox.top),
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    };
  });
}

test.describe("product page top spacing", () => {
  test("desktop catalogue and detail pages start close to the global header", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);
    const urls = [
      "/products",
      "/products/lcd-panels",
      "/products/tn",
      "/products/cog",
      "/products/4-digit-7-segment-display",
      "/products/tn/4-digit-7-segment-display",
    ];

    await page.setViewportSize({ width: 1280, height: 900 });

    for (const url of urls) {
      await page.goto(url);
      const metrics = await productTopMetrics(page);

      expect(metrics.breadcrumbGap, url).toBeGreaterThanOrEqual(24);
      expect(metrics.breadcrumbGap, url).toBeLessThanOrEqual(48);
      expect(metrics.breadcrumbTop, url).toBeGreaterThanOrEqual(metrics.headerBottom);
      expect(metrics.headingTop, url).toBeGreaterThan(metrics.breadcrumbTop);
      expect(metrics.scrollWidth, url).toBeLessThanOrEqual(metrics.clientWidth);

      if (metrics.backLinkGap !== null) {
        expect(metrics.backLinkGap, url).toBeGreaterThanOrEqual(12);
        expect(metrics.backLinkGap, url).toBeLessThanOrEqual(24);
      }
    }

    expect(browserErrors).toEqual([]);
  });

  test("client navigation preserves compact top spacing", async ({ page }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/products/tn");
    await expect(page.getByRole("heading", { level: 1, name: "TN (Twisted Nematic)" })).toBeVisible();
    await expect((await productTopMetrics(page)).breadcrumbGap).toBeLessThanOrEqual(48);

    await page.getByRole("link", { name: /4-Digit 7-Segment Display/i }).click();
    await expect(page).toHaveURL("/products/4-digit-7-segment-display");
    await expect(
      page.getByRole("heading", { level: 1, name: "4-Digit 7-Segment Display" }),
    ).toBeVisible();
    await expect((await productTopMetrics(page)).breadcrumbGap).toBeLessThanOrEqual(48);

    await page.goBack();
    await expect(page).toHaveURL("/products/tn");
    await expect((await productTopMetrics(page)).breadcrumbGap).toBeLessThanOrEqual(48);

    expect(browserErrors).toEqual([]);
  });

  test("mobile product pages keep breadcrumbs visible without excess top gap", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.setViewportSize({ width: 390, height: 820 });

    for (const url of ["/products/tn", "/products/cog", "/products/4-digit-7-segment-display"]) {
      await page.goto(url);
      const metrics = await productTopMetrics(page);

      expect(metrics.breadcrumbGap, url).toBeGreaterThanOrEqual(20);
      expect(metrics.breadcrumbGap, url).toBeLessThanOrEqual(40);
      expect(metrics.breadcrumbTop, url).toBeGreaterThanOrEqual(metrics.headerBottom);
      expect(metrics.scrollWidth, url).toBeLessThanOrEqual(metrics.clientWidth);
    }

    expect(browserErrors).toEqual([]);
  });
});
