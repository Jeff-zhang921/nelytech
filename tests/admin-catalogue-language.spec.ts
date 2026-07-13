import { expect, test, type Page } from "@playwright/test";
import { authenticateAdmin, playwrightAdminKey } from "./adminTestHelpers";

const testPng = {
  name: "english-product-cover.png",
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

async function openAddProduct(page: Page) {
  await page.getByRole("button", { name: "Edit Products" }).click();
  const manager = page.getByRole("dialog", { name: "Manage Products: TN" });
  await manager.getByRole("button", { name: "Add Product" }).click();
  return page.getByRole("dialog", { name: "Add Product" });
}

async function addValidProduct(page: Page, name = "English Filter Prototype") {
  const dialog = await openAddProduct(page);
  await dialog.getByLabel("Product name").fill(name);
  await dialog
    .getByLabel("Short description")
    .fill("Compact display for counters and embedded controls.");
  await dialog.getByLabel("Counters", { exact: true }).check();
  await dialog.getByLabel("Glass only", { exact: true }).check();
  await dialog.getByLabel("7-segment", { exact: true }).check();
  await dialog.locator('input[type="file"]').setInputFiles(testPng);
  await dialog.getByLabel("Image alt text").fill("Front view of " + name);
  await dialog.getByRole("button", { name: "Add Product", exact: true }).click();
}

test.describe("Product Panel Extension language boundary", () => {
  test("uses English throughout Admin and restores the selected public language on exit", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.goto("/");
    const languageTrigger = page.locator("header button[aria-haspopup='menu']").last();
    await languageTrigger.click();
    await page.getByRole("menuitemradio", { name: /中文/ }).click();
    await expect(page.locator("header").getByRole("link", { name: "首页" })).toBeVisible();

    await page.locator('footer a[href="/admin/login"]').click();
    await expect(page).toHaveURL("/admin/login");
    await expect(page.getByRole("heading", { name: "Admin Sign In" })).toBeVisible();
    await page
      .getByLabel("Administrator access key", { exact: true })
      .fill(playwrightAdminKey);
    await page.getByRole("button", { name: "Sign In", exact: true }).click();

    await expect(page).toHaveURL("/admin/catalogue");
    await expect(page.locator('[data-interface-context="product-admin"]')).toHaveAttribute(
      "lang",
      "en",
    );
    await expect(page.getByRole("heading", { name: "Product Catalogue Editor" })).toBeVisible();
    await expect(page.getByText("Live Preview", { exact: true })).toBeVisible();
    await expect(page.locator("header").getByText("English Only", { exact: true })).toBeVisible();
    await expect(page.locator("header button[aria-haspopup='menu']")).toHaveCount(0);
    await expect(page.locator("header").getByRole("link", { name: "Home" })).toBeVisible();

    await page.locator("header").getByRole("link", { name: "Home" }).click();
    await expect(page).toHaveURL("/");
    const restoredLanguageTrigger = page.locator("header button[aria-haspopup='menu']").last();
    await expect(restoredLanguageTrigger).toContainText("中文");
    await expect(page.locator("header").getByRole("link", { name: "首页" })).toBeVisible();

    expect(browserErrors).toEqual([]);
  });

  test("keeps Admin controls and errors English while preserving canonical filter values", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);
    await authenticateAdmin(page, "/admin/catalogue/tn");

    const dialog = await openAddProduct(page);
    const productName = dialog.getByLabel("Product name");
    const imageAlt = dialog.getByLabel("Image alt text");
    const saveButton = dialog.getByRole("button", { name: "Add Product", exact: true });

    await expect(dialog.getByText(/Enter this content in English/).first()).toBeVisible();
    await productName.fill("中文产品名称");
    await expect(dialog.getByRole("alert")).toContainText(
      "Product content supports English only",
    );
    await expect(productName).toHaveAttribute("aria-invalid", "true");

    await productName.fill("English Filter Prototype");
    await dialog
      .getByLabel("Short description")
      .fill("Compact display for counters and embedded controls.");
    await dialog.getByLabel("Counters", { exact: true }).check();
    await dialog.getByLabel("Glass only", { exact: true }).check();
    await dialog.getByLabel("7-segment", { exact: true }).check();
    await dialog.locator('input[type="file"]').setInputFiles(testPng);
    await imageAlt.fill("产品正面图片");
    await expect(imageAlt).toHaveAttribute("aria-invalid", "true");
    await expect(saveButton).toBeDisabled();

    await imageAlt.fill("Front view of English Filter Prototype");
    await expect(saveButton).toBeEnabled();
    await saveButton.click();
    await expect(page.getByText("English Filter Prototype", { exact: true })).toBeVisible();

    const submit = page.getByRole("button", { name: "Submit Changes" });
    await submit.click();
    const success = page.getByRole("dialog", { name: "Changes submitted successfully" });
    await expect(success).toBeVisible();
    await expect(success).toContainText("committed");
    await expect(success).toContainText("approximately 2 minutes");
    await expect(success).not.toContainText("live website is currently updating");
    const continueEditing = success.getByRole("button", { name: "Continue Editing" });
    await expect(continueEditing).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(success).toHaveCount(0);
    await expect(submit).toBeFocused();

    const savedProduct = await page.evaluate(() => {
      const rawDraft = localStorage.getItem("nelytech.admin.catalogue-draft.v1");
      const draft = rawDraft ? JSON.parse(rawDraft) : null;
      return draft?.categories
        .flatMap((category: { subcategories: unknown[] }) => category.subcategories)
        .flatMap((subcategory: { products?: unknown[] }) => subcategory.products ?? [])
        .find((product: { slug?: string }) => product.slug === "english-filter-prototype");
    });

    expect(savedProduct.filters).toEqual({
      application: ["counters"],
      interface: ["glass-only"],
      format: ["7-segment"],
    });
    expect(savedProduct.name).toBe("English Filter Prototype");
    expect(savedProduct.image).toMatch(
      /^\/uploads\/products\/english-filter-prototype\/cover-[a-f0-9]{12}\.png$/,
    );
    expect(savedProduct.image).not.toContain("data:");
    expect(browserErrors).toEqual([]);
  });

  test("does not show success or discard the dirty draft when local persistence fails", async ({
    page,
  }) => {
    await authenticateAdmin(page, "/admin/catalogue/tn");
    await addValidProduct(page, "Failed Save Prototype");

    await page.evaluate(() => {
      const windowWithTestHook = window as typeof window & {
        __originalStorageSetItem?: typeof Storage.prototype.setItem;
      };
      windowWithTestHook.__originalStorageSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = () => {
        throw new Error("Forced local storage failure");
      };
    });

    await page.getByRole("button", { name: "Submit Changes" }).click();
    await expect(page.getByRole("dialog", { name: "Changes submitted successfully" })).toHaveCount(0);
    await expect(page.getByRole("status")).toContainText("draft has been preserved");
    await expect(page.getByText("Unsaved changes", { exact: true })).toBeVisible();
    await expect(page.getByText("Failed Save Prototype", { exact: true })).toBeVisible();

    await page.evaluate(() => {
      const windowWithTestHook = window as typeof window & {
        __originalStorageSetItem?: typeof Storage.prototype.setItem;
      };
      if (windowWithTestHook.__originalStorageSetItem) {
        Storage.prototype.setItem = windowWithTestHook.__originalStorageSetItem;
      }
    });
  });

  test("rejects Chinese Product Detail content and has no mobile horizontal overflow", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await authenticateAdmin(page, "/admin/catalogue/tn/4-digit-7-segment-display");

    await expect(page.getByText("Live Preview", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Edit Product Summary" }).click();
    const editor = page.getByRole("dialog", { name: "Edit Product Summary" });
    await editor.getByLabel(/^Main introduction/).fill("这是中文产品介绍");
    await expect(editor.getByRole("alert")).toContainText(
      "Main introduction: Product content supports English only",
    );
    await expect(editor.getByRole("button", { name: "Save Section" })).toBeDisabled();

    await editor
      .getByLabel(/^Main introduction/)
      .fill("Compact numeric output for meters and embedded controls.");
    await editor.getByRole("button", { name: "Save Section" }).click();

    const overflow = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }));
    expect(overflow.documentWidth).toBeLessThanOrEqual(overflow.viewportWidth);
    expect(browserErrors).toEqual([]);
  });
});
