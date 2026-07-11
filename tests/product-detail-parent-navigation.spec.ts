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

async function parentLinkSignature(page: Page) {
  await page.mouse.move(1, 1);

  const link = page.getByTestId("product-parent-link");
  await expect(link).toBeVisible();
  await link.evaluate((element) => {
    if (element instanceof HTMLElement) {
      element.blur();
    }
  });
  await page.waitForTimeout(250);

  return link.evaluate((element) => {
    const styles = window.getComputedStyle(element);
    const box = element.getBoundingClientRect();
    const breadcrumb = document
      .querySelector('[aria-label="Breadcrumb"]')
      ?.getBoundingClientRect();
    const icon = element.querySelector("svg");
    const iconStyles = icon ? window.getComputedStyle(icon) : null;
    const iconBox = icon?.getBoundingClientRect();

    return {
      height: Math.round(box.height),
      breadcrumbGap: breadcrumb ? Math.round(box.top - breadcrumb.bottom) : null,
      display: styles.display,
      alignItems: styles.alignItems,
      gap: styles.gap,
      paddingLeft: styles.paddingLeft,
      paddingRight: styles.paddingRight,
      paddingTop: styles.paddingTop,
      paddingBottom: styles.paddingBottom,
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      lineHeight: styles.lineHeight,
      color: styles.color,
      backgroundColor: styles.backgroundColor,
      borderTopWidth: styles.borderTopWidth,
      borderTopColor: styles.borderTopColor,
      borderRadius: styles.borderRadius,
      minHeight: styles.minHeight,
      iconWidth: iconBox ? Math.round(iconBox.width) : null,
      iconHeight: iconBox ? Math.round(iconBox.height) : null,
      iconShrink: iconStyles?.flexShrink ?? null,
    };
  });
}

test.describe("product detail parent navigation", () => {
  test("returns to the immediate parent category and preserves catalogue search", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.goto("/products/tn");
    await page.getByLabel("Search products").fill("4-digit");
    await expect(page).toHaveURL(/\/products\/tn\?q=4-digit/);
    await expect(page.getByTestId("product-card")).toHaveCount(1);

    const productCard = page.getByRole("link", {
      name: /4-Digit 7-Segment Display/i,
    });
    await expect(productCard).toHaveAttribute(
      "href",
      "/products/4-digit-7-segment-display?returnQuery=q%3D4-digit",
    );
    await productCard.click();
    await expect(page).toHaveURL(
      "/products/4-digit-7-segment-display?returnQuery=q%3D4-digit",
    );

    const parentLink = page.getByRole("link", {
      name: "Back to TN (Twisted Nematic) product category",
    });
    await expect(parentLink).toBeVisible();
    await expect(parentLink).toContainText("Back to TN");
    await expect(
      page.getByRole("link", {
        name: /Contact Us about 4-Digit 7-Segment Display/i,
      }),
    ).toBeVisible();

    await parentLink.click();
    await expect(page).toHaveURL("/products/tn?q=4-digit");
    await expect(page.getByRole("heading", { level: 1, name: "TN (Twisted Nematic)" })).toBeVisible();
    await expect(page.getByLabel("Search products")).toHaveValue("4-digit");
    await expect(page.getByTestId("product-card")).toHaveCount(1);

    expect(browserErrors).toEqual([]);
  });

  test("catalogue and detail parent links share the same style and placement", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.goto("/products/4-digit-7-segment-display");
    const detailSignature = await parentLinkSignature(page);
    await expect(page.getByTestId("product-parent-link")).toContainText("Back to TN");

    await page.goto("/products/tn");
    await expect(page.getByTestId("product-parent-link")).toContainText(
      "Back to LCD Panels",
    );
    await expect(page.getByTestId("product-parent-link")).toHaveAttribute(
      "href",
      "/products/lcd-panels",
    );
    const tnSignature = await parentLinkSignature(page);
    expect(tnSignature).toEqual(detailSignature);

    await page.getByTestId("product-parent-link").click();
    await expect(page).toHaveURL("/products/lcd-panels");
    await expect(page.getByTestId("product-parent-link")).toContainText(
      "Back to Products",
    );
    await expect(page.getByTestId("product-parent-link")).toHaveAttribute(
      "href",
      "/products",
    );
    expect(await parentLinkSignature(page)).toEqual(detailSignature);

    await page.getByTestId("product-parent-link").click();
    await expect(page).toHaveURL("/products");
    await expect(page.getByTestId("product-parent-link")).toHaveCount(0);

    await page.goto("/products/cog");
    await expect(page.getByTestId("product-parent-link")).toContainText(
      "Back to Assembly Technologies",
    );
    await expect(page.getByTestId("product-parent-link")).toHaveAttribute(
      "href",
      "/products/assembly-technologies",
    );
    expect(await parentLinkSignature(page)).toEqual(detailSignature);

    expect(browserErrors).toEqual([]);
  });

  test("direct product URL returns to parent category without browser history", async ({
    browser,
  }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const browserErrors = collectBrowserErrors(page);

    await page.goto("/products/4-digit-7-segment-display");
    await expect(
      page.getByRole("heading", { level: 1, name: "4-Digit 7-Segment Display" }),
    ).toBeVisible();

    await page
      .getByRole("link", {
        name: "Back to TN (Twisted Nematic) product category",
      })
      .click();
    await expect(page).toHaveURL("/products/tn");
    await expect(page.getByRole("heading", { level: 1, name: "TN (Twisted Nematic)" })).toBeVisible();

    expect(browserErrors).toEqual([]);
    await context.close();
  });

  test("generated product details derive the same parent category dynamically", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.goto("/products/16x2-character-lcd-module");
    await expect(
      page.getByRole("heading", { level: 1, name: "16x2 Character LCD Module" }),
    ).toBeVisible();
    await expect(page.getByLabel("Breadcrumb")).toContainText(
      /Products\s*\/\s*LCD Panels\s*\/\s*TN \(Twisted Nematic\)\s*\/\s*16x2 Character LCD Module/,
    );

    const parentLink = page.getByRole("link", {
      name: "Back to TN (Twisted Nematic) product category",
    });
    await expect(parentLink).toBeVisible();
    await parentLink.click();
    await expect(page).toHaveURL("/products/tn");

    expect(browserErrors).toEqual([]);
  });

  test("mobile return link is visible and navigates to parent category", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.setViewportSize({ width: 390, height: 820 });
    await page.goto("/products/4-digit-7-segment-display");

    const parentLink = page.getByRole("link", {
      name: "Back to TN (Twisted Nematic) product category",
    });
    await expect(parentLink).toBeVisible();
    await expect(parentLink).toContainText("Back to TN");
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        ),
      )
      .toBe(true);

    await parentLink.click();
    await expect(page).toHaveURL("/products/tn");
    await expect(page.getByRole("heading", { level: 1, name: "TN (Twisted Nematic)" })).toBeVisible();

    expect(browserErrors).toEqual([]);
  });
});
