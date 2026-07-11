import { expect, test, type Locator, type Page } from "@playwright/test";

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

async function expectNoOverlap(first: Locator, second: Locator) {
  const [firstBox, secondBox] = await Promise.all([
    first.boundingBox(),
    second.boundingBox(),
  ]);

  expect(firstBox).not.toBeNull();
  expect(secondBox).not.toBeNull();

  const horizontalOverlap =
    firstBox!.x < secondBox!.x + secondBox!.width &&
    firstBox!.x + firstBox!.width > secondBox!.x;
  const verticalOverlap =
    firstBox!.y < secondBox!.y + secondBox!.height &&
    firstBox!.y + firstBox!.height > secondBox!.y;

  expect(horizontalOverlap && verticalOverlap).toBe(false);
}

test.describe("product detail contact CTA", () => {
  test("desktop catalogue card opens product detail before Contact CTA navigation", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto("/products/tn");

    await expect(page.locator('section[aria-label="Product results"] a[href^="/contact"]')).toHaveCount(
      0,
    );
    const characterModuleCard = page.getByRole("link", {
      name: /16x2 Character LCD Module/i,
    });
    await expect(characterModuleCard).toHaveAttribute(
      "href",
      "/products/16x2-character-lcd-module",
    );
    await characterModuleCard.click();
    await expect(page).toHaveURL("/products/16x2-character-lcd-module");
    await expect(
      page.getByRole("heading", { level: 1, name: "16x2 Character LCD Module" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: "Specifications" }),
    ).toBeVisible();
    await page.goBack();
    await expect(page).toHaveURL("/products/tn");

    const productCard = page.getByRole("link", {
      name: /4-Digit 7-Segment Display/i,
    });
    await expect(productCard).toHaveAttribute(
      "href",
      "/products/4-digit-7-segment-display",
    );
    await productCard.click();
    await expect(page).toHaveURL("/products/4-digit-7-segment-display");
    await expect(page).not.toHaveURL(/\/contact/);

    const summary = page.locator('section[aria-labelledby="product-title"]');
    const gallery = page.locator('section[aria-labelledby="product-gallery-heading"]');
    const description = page.locator('section[aria-labelledby="product-description-heading"]');
    const specifications = page.locator(
      'section[aria-labelledby="product-specifications-heading"]',
    );
    const contactLink = summary.getByRole("link", {
      name: /Contact Us about 4-Digit 7-Segment Display/i,
    });

    await expect(
      page.getByRole("heading", { level: 1, name: "4-Digit 7-Segment Display" }),
    ).toBeVisible();
    await expect(page.getByLabel("Breadcrumb")).toContainText(
      /Products\s*\/\s*LCD Panels\s*\/\s*TN \(Twisted Nematic\)\s*\/\s*4-Digit 7-Segment Display/,
    );
    await expect(gallery).toBeVisible();
    await expect(description.getByRole("heading", { name: "Description" })).toBeVisible();
    await expect(specifications.getByRole("heading", { name: "Specifications" })).toBeVisible();
    const [galleryBox, summaryBox, descriptionBox] = await Promise.all([
      gallery.boundingBox(),
      summary.boundingBox(),
      description.boundingBox(),
    ]);
    expect(galleryBox).not.toBeNull();
    expect(summaryBox).not.toBeNull();
    expect(descriptionBox).not.toBeNull();
    expect(
      descriptionBox!.y -
        Math.max(
          galleryBox!.y + galleryBox!.height,
          summaryBox!.y + summaryBox!.height,
        ),
    ).toBeLessThan(72);
    expect(descriptionBox!.width).toBeGreaterThan(galleryBox!.width + 200);
    await expect(page.getByText("English Only", { exact: true })).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 1, name: /Contact NELYTECH/i }),
    ).toHaveCount(0);
    await expect(
      summary.getByText(/Need pricing, technical details, or a customised display solution/i),
    ).toBeVisible();
    await expect(contactLink).toBeVisible();
    await expect(contactLink).toHaveAttribute(
      "href",
      "/contact?product=4-digit-7-segment-display",
    );

    const buttonStyles = await contactLink.evaluate((element) => {
      const styles = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();

      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        height: rect.height,
        width: rect.width,
      };
    });

    expect(buttonStyles.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
    expect(buttonStyles.color).toBe("rgb(255, 255, 255)");
    expect(buttonStyles.height).toBeGreaterThanOrEqual(48);
    expect(buttonStyles.width).toBeGreaterThan(130);
    await expectNoOverlap(contactLink, gallery);
    await expect(page.locator('section[aria-labelledby="product-contact-panel-heading"]')).toHaveCount(
      0,
    );

    await contactLink.click();
    await expect(page).toHaveURL("/contact?product=4-digit-7-segment-display");
    await expect(
      page.getByRole("heading", { level: 1, name: /Contact NELYTECH/i }),
    ).toBeVisible();
    await expect(page.getByLabel(/Product Interest/i)).toHaveValue(
      "4-Digit 7-Segment Display",
    );
    await expect(page.getByText(/Captured from the product page/i)).toBeVisible();
    await expect(page.getByText("English Only", { exact: true })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /language/i })).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL("/products/4-digit-7-segment-display");
    await expect(contactLink).toBeVisible();
    await expect(gallery).toBeVisible();
    await expect(specifications.getByRole("heading", { name: "Specifications" })).toBeVisible();
    await expect(page.getByText("English Only", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: /Show Angled image/i }).click();
    await expect(page.getByRole("button", { name: /Show Angled image/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    expect(browserErrors).toEqual([]);
  });

  test("mobile CTA remains easy to tap and navigates without layout overflow", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.setViewportSize({ width: 390, height: 820 });
    await page.goto("/products/4-digit-7-segment-display");

    const summary = page.locator('section[aria-labelledby="product-title"]');
    const contactLink = summary.getByRole("link", {
      name: /Contact Us about 4-Digit 7-Segment Display/i,
    });

    await expect(contactLink).toBeVisible();
    await expect(
      summary.getByText(/Need pricing, technical details, or a customised display solution/i),
    ).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
        ),
      )
      .toBe(true);

    const buttonBox = await contactLink.boundingBox();
    expect(buttonBox).not.toBeNull();
    expect(buttonBox!.height).toBeGreaterThanOrEqual(48);
    expect(buttonBox!.height).toBeLessThanOrEqual(56);

    await contactLink.click();
    await expect(page).toHaveURL("/contact?product=4-digit-7-segment-display");
    await expect(
      page.getByRole("heading", { level: 1, name: /Contact NELYTECH/i }),
    ).toBeVisible();
    await expect(page.getByLabel(/Product Interest/i)).toHaveValue(
      "4-Digit 7-Segment Display",
    );

    expect(browserErrors).toEqual([]);
  });
});
