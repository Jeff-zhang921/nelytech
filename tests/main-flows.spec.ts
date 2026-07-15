import { expect, test } from "@playwright/test";

test.describe("NELYTECH critical user flows", () => {
  test("global navigation opens the products mega menu and view all resolves", async ({
    page,
  }) => {
    await page.goto("/");

    const productsTrigger = page.getByRole("button", { name: /products/i });
    await productsTrigger.hover();

    const megaMenu = page.locator("#products-mega-menu");
    await expect(megaMenu).toBeVisible();
    await expect(
      megaMenu.getByRole("heading", { name: /advanced & custom solutions/i }),
    ).toBeVisible();

    await megaMenu.getByRole("link", { name: /view all products/i }).click();

    await expect(page).toHaveURL("/products");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "All Products",
      }),
    ).toBeVisible();
    await expect(page.getByText(/filter all products/i)).toBeVisible();
  });

  test("language switcher hydrates context and updates visible copy without navigation", async ({
    page,
  }) => {
    await page.goto("/");

    await expect(page.getByRole("link", { name: /^Home$/ })).toBeVisible();
    await page.getByRole("button", { name: /language/i }).click();
    await page.getByRole("menuitemradio", { name: /\u4e2d\u6587/ }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("button", { name: /\u4ea7\u54c1/ })).toBeVisible();
    await expect(page.getByText(/\u6838\u5fc3\u4f18\u52bf/)).toBeVisible();

    await page.getByRole("button", { name: /\u4ea7\u54c1/ }).hover();
    const productsMenu = page.locator("#products-mega-menu");
    await expect(productsMenu).toBeVisible();
    await expect(
      productsMenu.getByRole("heading", { name: "LCD Panels (Monochrome)" }),
    ).toBeVisible();
    await expect(productsMenu.getByText("Core monochrome LCD panel technologies.")).toBeVisible();
    await expect(productsMenu.getByRole("link", { name: /TN \(Twisted Nematic\)/ })).toBeVisible();
    await expect(
      productsMenu.getByRole("link", { name: /Custom PCBA & MCU Development/ }),
    ).toBeVisible();
  });

  test("mobile product panel remains English while the surrounding navigation is Chinese", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");

    await page.getByRole("button", { name: /open navigation menu/i }).click();
    const mobileNavigation = page.locator("#mobile-navigation");
    await mobileNavigation.getByRole("button", { name: /language/i }).click();
    await mobileNavigation.getByRole("menuitemradio", { name: /\u4e2d\u6587/ }).click();

    const productsTrigger = mobileNavigation.getByRole("button", { name: /\u4ea7\u54c1/ });
    await expect(productsTrigger).toBeVisible();
    await productsTrigger.click();

    const productsPanel = page.locator("#mobile-products-panel");
    await expect(productsPanel.getByText("Core monochrome LCD panel technologies.")).toBeVisible();
    await expect(
      productsPanel.getByRole("link", { name: /Graphic LCD Modules/ }),
    ).toBeVisible();
    await expect(
      productsPanel.getByRole("link", { name: /Touch Panels \(CTP\/RTP\)/ }),
    ).toBeVisible();
    await expect(mobileNavigation.getByRole("link", { name: /\u9996\u9875/ })).toBeVisible();
  });

  test("process page scroll reveals the fourth framer-motion stage in the viewport", async ({
    page,
  }) => {
    await page.goto("/process");

    await expect(
      page.getByRole("heading", {
        name: /from blueprint to production/i,
      }),
    ).toBeVisible();

    const toolingHeading = page.getByRole("heading", {
      name: /tooling & nre optimization/i,
    });
    const toolingStage = toolingHeading.locator("xpath=ancestor::article");

    await expect(toolingStage).not.toBeInViewport();
    await toolingHeading.scrollIntoViewIfNeeded();
    await expect(toolingStage).toBeInViewport({ ratio: 0.35 });
    await expect(toolingHeading).toBeVisible();
  });

  test("contact form blocks empty submission through native validation", async ({ page }) => {
    await page.goto("/contact");

    const nameInput = page.getByLabel(/^Name/);
    await page.getByRole("button", { name: /send inquiry/i }).click();

    await expect(nameInput).toBeFocused();
    await expect
      .poll(() =>
        nameInput.evaluate((element) => (element as HTMLInputElement).validationMessage),
      )
      .not.toBe("");
  });

  test("contact form submits valid data through the server action and shows success", async ({
    page,
  }) => {
    await page.goto("/contact");

    await page.getByLabel(/^Name/).fill("QA Automation User");
    await page.getByLabel(/Work Email/).fill("qa.automation@example.com");
    await page.getByLabel(/^Company/).fill("NELYTECH Test Lab");
    await page
      .getByLabel(/^Message/)
      .fill("Testing the custom LCD and PCBA inquiry flow from Playwright.");
    await page
      .getByRole("region", { name: /What are you interested in/i })
      .getByText("I'm not sure - I need guidance", { exact: true })
      .click();

    await page.getByRole("button", { name: /send inquiry/i }).click();

    await expect(page.getByRole("button", { name: /sending/i })).toBeDisabled();
    await expect(
      page.getByText(/inquiry sent successfully\. our engineering team will follow up shortly\./i),
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.getByLabel(/^Name/)).toHaveValue("");
  });

  test("navigating to cases from the homepage resets scroll to the top", async ({ page }) => {
    await page.goto("/");

    const casesLink = page.locator('a[href="/cases"]').first();
    await casesLink.scrollIntoViewIfNeeded();

    const sourceScrollY = await page.evaluate(() => window.scrollY);
    expect(sourceScrollY).toBeGreaterThan(0);

    await casesLink.click();
    await page.waitForURL("**/cases");

    await expect
      .poll(() => page.evaluate(() => window.scrollY), {
        timeout: 5_000,
      })
      .toBe(0);
    await expect(
      page.getByRole("heading", {
        name: /engineering outcomes\. proven by industry leaders\./i,
      }),
    ).toBeVisible();
  });
});
