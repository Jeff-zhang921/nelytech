import { expect, test, type Page } from "@playwright/test";
import { authenticateAdmin } from "./adminTestHelpers";

const testPng = {
  name: "internal-navigation-product.png",
  mimeType: "image/png",
  buffer: Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X8xvAAAAAElFTkSuQmCC",
    "base64",
  ),
};

function collectBrowserErrors(page: Page) {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  return errors;
}

async function changeIntroduction(page: Page, value: string) {
  await page.getByRole("button", { name: "Edit Product Summary" }).click();
  const editor = page.getByRole("dialog", { name: "Edit Product Summary" });
  await editor.getByLabel(/^Main introduction/).fill(value);
  await editor.getByRole("button", { name: "Save Section" }).click();
  await expect(page.getByText("Unsaved changes", { exact: true })).toBeVisible();
}

async function addUnsavedProduct(page: Page) {
  await page.getByRole("button", { name: "Edit Products" }).click();
  const manager = page.getByRole("dialog", { name: "Manage Products: TN" });
  await manager.getByRole("button", { name: "Add Product" }).click();

  const editor = page.getByRole("dialog", { name: "Add Product" });
  await editor.getByLabel("Product name").fill("Internal Navigation Prototype");
  await editor
    .getByLabel("Short description")
    .fill("Unsaved product used to verify internal Admin navigation.");
  await editor.getByLabel("Image alt text").fill("Front view of prototype display");
  await editor.getByLabel("Counters", { exact: true }).check();
  await editor.getByLabel("Glass only", { exact: true }).check();
  await editor.getByLabel("7-segment", { exact: true }).check();
  await editor.locator('input[type="file"]').setInputFiles(testPng);
  await editor.getByRole("button", { name: "Add Product", exact: true }).click();
}

test.describe("Product Panel Extension unsaved exits", () => {
  test.beforeEach(async ({ page }) => {
    await authenticateAdmin(page);
  });

  test("new products navigate internally without warnings and remain in the shared draft", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);
    await page.goto("/admin/catalogue/tn");
    await addUnsavedProduct(page);

    const productCard = page.getByRole("link", {
      name: "Edit Product Details for Internal Navigation Prototype",
    });
    await productCard.click();
    await expect(page).toHaveURL("/admin/catalogue/tn/internal-navigation-prototype");
    await expect(page.getByRole("dialog", { name: "You have unsaved changes" })).toHaveCount(0);
    await expect(page.getByText("Unsaved changes", { exact: true })).toBeVisible();

    await page.getByRole("link", { name: "Back to TN" }).click();
    await expect(page).toHaveURL("/admin/catalogue/tn");
    await expect(page.getByRole("dialog", { name: "You have unsaved changes" })).toHaveCount(0);
    await expect(productCard).toBeVisible();
    await expect(page.getByText("Unsaved changes", { exact: true })).toBeVisible();

    expect(browserErrors).toEqual([]);
  });

  test("header exits support stay, Escape focus restoration, and save before exit", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);
    const detailRoute = "/admin/catalogue/tn/4-digit-7-segment-display";
    const savedIntroduction = "Saved through the global header exit flow.";
    await page.goto(detailRoute);
    await changeIntroduction(page, savedIntroduction);

    const homeLink = page.locator('header a[href="/"]').first();
    await homeLink.click();
    let warning = page.getByRole("dialog", { name: "You have unsaved changes" });
    await expect(warning).toBeVisible();
    await expect(page).toHaveURL(detailRoute);
    await expect(
      warning.getByText(
        "Your latest Product Catalogue changes have not been submitted. Leaving the Product Panel Extension now will discard these changes.",
      ),
    ).toBeVisible();
    await expect(warning.getByRole("button", { name: "Stay in the editor" })).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(warning).toHaveCount(0);
    await expect(homeLink).toBeFocused();
    await expect(page.getByText(savedIntroduction)).toBeVisible();

    const contactLink = page.locator('header a[href="/contact"]').first();
    await contactLink.click();
    warning = page.getByRole("dialog", { name: "You have unsaved changes" });
    await warning.getByRole("button", { name: "Submit and leave" }).click();
    await expect(page).toHaveURL("/contact");

    const savedDraft = await page.evaluate(() =>
      localStorage.getItem("nelytech.admin.catalogue-draft.v1"),
    );
    expect(savedDraft).toContain(savedIntroduction);

    await page.goto(detailRoute);
    await expect(page.getByText(savedIntroduction)).toBeVisible();
    await page.locator('header a[href="/"]').first().click();
    await expect(page).toHaveURL("/");
    await expect(page.getByRole("dialog", { name: "You have unsaved changes" })).toHaveCount(0);

    await page.goto(detailRoute);
    await page.locator('footer a[href="/about"]').click();
    await expect(page).toHaveURL("/about");
    await expect(page.getByRole("dialog", { name: "You have unsaved changes" })).toHaveCount(0);

    expect(browserErrors).toEqual([]);
  });

  test("footer exit discards only changes made since the latest submission", async ({ page }) => {
    const browserErrors = collectBrowserErrors(page);
    const detailRoute = "/admin/catalogue/tn/4-digit-7-segment-display";
    const discardedIntroduction = "This unsaved footer-exit change must be discarded.";
    await page.goto(detailRoute);
    await changeIntroduction(page, discardedIntroduction);

    await page.locator('footer a[href="/about"]').click();
    const warning = page.getByRole("dialog", { name: "You have unsaved changes" });
    await expect(warning).toBeVisible();
    await expect(page).toHaveURL(detailRoute);
    await warning.getByRole("button", { name: "Leave without saving" }).click();
    await expect(page).toHaveURL("/about");

    await page.goto(detailRoute);
    await expect(page.getByText(discardedIntroduction)).toHaveCount(0);
    await expect(page.getByText("Unsaved changes", { exact: true })).toHaveCount(0);

    expect(browserErrors).toEqual([]);
  });

  test("non-header preview links do not open the custom exit dialog", async ({ page }) => {
    const browserErrors = collectBrowserErrors(page);
    await page.goto("/admin/catalogue/tn/4-digit-7-segment-display");
    await changeIntroduction(page, "Preview link navigation should not be intercepted.");

    await page.getByRole("link", { name: /Contact Us about 4-Digit/ }).click();
    await expect(page).toHaveURL("/contact?product=4-digit-7-segment-display");
    await expect(page.getByRole("dialog", { name: "You have unsaved changes" })).toHaveCount(0);

    expect(browserErrors).toEqual([]);
  });
});
