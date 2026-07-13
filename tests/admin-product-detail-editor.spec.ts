import { expect, test, type Page } from "@playwright/test";

const testPng = {
  name: "prototype-display.png",
  mimeType: "image/png",
  buffer: Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X8xvAAAAAElFTkSuQmCC",
    "base64",
  ),
};

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

async function openProductManager(page: Page) {
  await page.getByRole("button", { name: "Edit Products" }).click();
  return page.getByRole("dialog", { name: "Manage Products: TN" });
}

async function addCardOnlyProduct(page: Page) {
  const manager = await openProductManager(page);
  await manager.getByRole("button", { name: "Add Product" }).click();

  const dialog = page.getByRole("dialog", { name: "Add Product" });
  await dialog.getByLabel("Product name").fill("Empty Detail Prototype");
  await dialog
    .getByLabel("Short description")
    .fill("Prototype card used to verify optional Product Detail fields.");
  await dialog
    .getByLabel("Image alt text")
    .fill("Front view of Empty Detail Prototype");
  await dialog.getByLabel("Counters", { exact: true }).check();
  await dialog.getByLabel("Glass only", { exact: true }).check();
  await dialog.getByLabel("7-segment", { exact: true }).check();
  await dialog.locator('input[type="file"]').setInputFiles(testPng);
  await dialog.getByRole("button", { name: "Add Product", exact: true }).click();
}

test.describe("admin Product Detail editor", () => {
  test("editing an existing product card preserves its complete detail content", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.goto("/admin/catalogue/tn");
    const manager = await openProductManager(page);
    await expect(manager.getByText("Open Detail Editor", { exact: true })).toHaveCount(0);
    await manager.getByRole("button", { name: "Edit Product" }).first().click();

    const dialog = page.getByRole("dialog", { name: "Edit Product" });
    await expect(dialog.getByLabel("Product name")).toHaveValue(
      "4-Digit 7-Segment Display",
    );
    await expect(dialog.getByLabel("Short description")).toHaveValue(
      "Fixed numeric display for meters, counters, and low-power controls.",
    );
    await expect(dialog.getByLabel("Image alt text")).toHaveValue(
      "LCD glass and circuit detail for a TN segment display",
    );
    await expect(dialog.getByLabel("Counters", { exact: true })).toBeChecked();
    await expect(dialog.getByLabel("Glass only", { exact: true })).toBeChecked();
    await expect(dialog.getByLabel("7-segment", { exact: true })).toBeChecked();
    await expect(dialog.locator("img")).toBeVisible();

    await dialog
      .getByLabel("Short description")
      .fill("Updated card description for the admin editor test.");
    await dialog.getByLabel("Appliances", { exact: true }).check();
    await dialog
      .getByLabel("Replace image")
      .setInputFiles({ ...testPng, name: "replacement-cover.png" });
    await dialog.getByRole("button", { name: "Save Product" }).click();

    const updatedCard = page.getByTestId("product-card").filter({
      hasText: "4-Digit 7-Segment Display",
    });
    await expect(updatedCard).toContainText(
      "Updated card description for the admin editor test.",
    );
    await expect(page.getByRole("checkbox", { name: /Appliances.*2/ })).toBeVisible();

    await page.getByLabel("Search products").fill("updated card description");
    await expect(page.getByTestId("product-card")).toHaveCount(1);
    await updatedCard.click();
    await expect(page).toHaveURL(
      "/admin/catalogue/tn/4-digit-7-segment-display",
    );
    await expect(page.getByRole("dialog", { name: "You have unsaved changes" })).toHaveCount(0);
    await expect(page.getByText("Unsaved changes", { exact: true })).toBeVisible();
    await expect(
      page.getByText(
        /The 4-Digit 7-Segment Display is designed to present numerical information/,
      ),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Specifications" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Contact Us about 4-Digit/ })).toBeVisible();

    await page.getByRole("link", { name: "Back to TN" }).click();
    await expect(page).toHaveURL("/admin/catalogue/tn");
    await expect(page.getByText("Unsaved changes", { exact: true })).toBeVisible();
    await expect(updatedCard).toContainText(
      "Updated card description for the admin editor test.",
    );

    expect(browserErrors).toEqual([]);
  });

  test("a card-only product opens a complete optional detail draft and persists it", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.goto("/admin/catalogue/tn");
    await addCardOnlyProduct(page);

    await page.getByRole("button", { name: "Submit Changes" }).click();
    await page
      .getByRole("dialog", { name: "Draft saved successfully" })
      .getByRole("button", { name: "Continue Editing" })
      .click();

    await page
      .getByRole("link", { name: "Edit Product Details for Empty Detail Prototype" })
      .click();
    await expect(page).toHaveURL(
      "/admin/catalogue/tn/empty-detail-prototype",
    );
    await expect(page.getByText("Live Preview", { exact: true })).toBeVisible();
    await expect(page.getByText("All Product Detail fields are optional")).toBeVisible();
    await expect(page.getByText("Add the main product image.")).toBeVisible();
    await expect(
      page.getByText(
        "Add a concise English introduction explaining the product and its main use.",
      ),
    ).toBeVisible();
    await expect(
      page.getByText(
        "Describe the product's function, features, benefits, and typical uses in English.",
      ),
    ).toBeVisible();
    await expect(page.getByText("Add an application in English.")).toBeVisible();
    await expect(page.getByText(/Add options such as colour, size, interface/)).toBeVisible();
    await expect(page.getByText(/Add datasheets, drawings, specifications/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Submit Changes" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    await expect(page.getByRole("link", { name: "Back to TN" })).toHaveAttribute(
      "href",
      "/admin/catalogue/tn",
    );

    const savedDraft = await page.evaluate(() =>
      localStorage.getItem("nelytech.admin.catalogue-draft.v1"),
    );
    expect(savedDraft).toContain("empty-detail-prototype");
    expect(savedDraft).not.toContain("Add the main product image.");
    expect(savedDraft).not.toContain("Describe the product's function");

    await page.reload();
    await expect(page.getByText("Local draft restored").first()).toBeVisible();
    await expect(page.getByText("Add the main product image.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Specifications" })).toBeVisible();

    await page.goto("/products/tn");
    await expect(page.locator("[data-admin-placeholder]")).toHaveCount(0);
    await expect(page.getByText("Empty Detail Prototype")).toHaveCount(0);

    expect(browserErrors).toEqual([]);
  });

  test("Product Information guidance stays instructional and blank rows are normalized", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);

    await page.goto("/admin/catalogue/tn");
    await addCardOnlyProduct(page);
    await page.getByRole("button", { name: "Submit Changes" }).click();
    await page
      .getByRole("dialog", { name: "Draft saved successfully" })
      .getByRole("button", { name: "Continue Editing" })
      .click();
    await page
      .getByRole("link", { name: "Edit Product Details for Empty Detail Prototype" })
      .click();

    await expect(page.getByRole("heading", { name: "Add product information" })).toBeVisible();
    await page.getByRole("button", { name: "Edit Product Information" }).click();

    let dialog = page.getByRole("dialog", { name: "Edit Product Information" });
    await expect(dialog.getByLabel(/^Additional explanation/)).toHaveAttribute(
      "placeholder",
      /Available in different voltages/,
    );
    await expect(
      dialog.getByText(/only when the value needs extra context/),
    ).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "Add product information" })).toBeVisible();

    await dialog.getByRole("button", { name: "Add Information Row" }).click();
    const informationLabel = dialog.getByLabel("Information label");
    const informationValue = dialog.getByLabel("Information value");
    await expect(informationLabel).toHaveAttribute("placeholder", /Display Type/);
    await expect(informationValue).toHaveAttribute(
      "placeholder",
      /4-Digit 7-Segment Display/,
    );
    await expect(
      dialog.getByText(/shown on the left side of the row/),
    ).toBeVisible();
    await expect(
      dialog.getByText(/shown on the right side of the row/),
    ).toBeVisible();

    await dialog.getByRole("button", { name: "Save Section" }).click();
    await expect(page.getByRole("heading", { name: "Add product information" })).toBeVisible();

    await page.getByRole("button", { name: "Edit Product Information" }).click();
    dialog = page.getByRole("dialog", { name: "Edit Product Information" });
    await expect(dialog.getByLabel("Information label")).toHaveCount(0);
    await dialog.getByRole("button", { name: "Add Information Row" }).click();
    await dialog.getByLabel("Information label").fill("Operating Voltage");
    await dialog.getByLabel("Information value").fill("3.0 V");
    await dialog
      .getByLabel(/^Additional explanation/)
      .fill("Voltage may vary by selected model.");
    await dialog.getByRole("button", { name: "Save Section" }).click();

    await expect(page.getByText("Operating Voltage", { exact: true })).toBeVisible();
    await expect(page.getByText("3.0 V", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Edit Product Information" }).click();
    dialog = page.getByRole("dialog", { name: "Edit Product Information" });
    await expect(dialog.getByLabel("Information label")).toHaveValue("Operating Voltage");
    await expect(dialog.getByLabel("Information value")).toHaveValue("3.0 V");
    await expect(dialog.getByLabel(/^Additional explanation/)).toHaveValue(
      "Voltage may vary by selected model.",
    );
    await dialog.getByRole("button", { name: "Save Section" }).click();
    await page.getByRole("button", { name: "Submit Changes" }).click();

    const savedProductDetail = await page.evaluate(() => {
      const rawDraft = localStorage.getItem("nelytech.admin.catalogue-draft.v1");
      const draft = rawDraft ? JSON.parse(rawDraft) : null;
      return draft?.categories
        .flatMap((category: { subcategories: unknown[] }) => category.subcategories)
        .flatMap((subcategory: { products?: unknown[] }) => subcategory.products ?? [])
        .find((product: { slug?: string }) => product.slug === "empty-detail-prototype")
        ?.detail;
    });
    expect(savedProductDetail.specifications).toHaveLength(1);
    expect(JSON.stringify(savedProductDetail)).not.toContain("4-Digit 7-Segment Display");
    expect(JSON.stringify(savedProductDetail)).not.toContain("Based on selected model");

    expect(browserErrors).toEqual([]);
  });

  test("internal Admin navigation preserves unsaved detail changes without a warning", async ({
    page,
  }) => {
    const browserErrors = collectBrowserErrors(page);
    const detailRoute = "/admin/catalogue/tn/4-digit-7-segment-display";
    const changedIntroduction = "Unsaved navigation guard prototype introduction.";

    await page.goto(detailRoute);
    await page.getByRole("button", { name: "Edit Product Summary" }).click();
    let editor = page.getByRole("dialog", { name: "Edit Product Summary" });
    await editor.getByLabel(/^Main introduction/).fill(changedIntroduction);
    await editor.getByRole("button", { name: "Save Section" }).click();
    await expect(page.getByText("Unsaved changes", { exact: true })).toBeVisible();

    await page.getByRole("link", { name: "Back to TN" }).click();
    await expect(page).toHaveURL("/admin/catalogue/tn");
    await expect(page.getByRole("dialog", { name: "You have unsaved changes" })).toHaveCount(0);
    await expect(page.getByText("Unsaved changes", { exact: true })).toBeVisible();

    const card = page.getByRole("link", {
      name: "Edit Product Details for 4-Digit 7-Segment Display",
    });
    await card.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(detailRoute);
    await expect(page.getByText(changedIntroduction)).toBeVisible();
    await expect(page.getByRole("dialog", { name: "You have unsaved changes" })).toHaveCount(0);

    await page.getByRole("button", { name: "Edit Product Summary" }).click();
    editor = page.getByRole("dialog", { name: "Edit Product Summary" });
    await editor
      .getByLabel(/^Suitable-for summary/)
      .fill("Browser navigation guard check.");
    await editor.getByRole("button", { name: "Save Section" }).click();

    await page
      .getByLabel("Breadcrumb")
      .getByRole("link", { name: "TN (Twisted Nematic)" })
      .click();
    await expect(page).toHaveURL("/admin/catalogue/tn");
    await expect(page.getByRole("dialog", { name: "You have unsaved changes" })).toHaveCount(0);
    await card.click();
    await expect(page).toHaveURL(detailRoute);
    await expect(page.getByText("Browser navigation guard check.")).toBeVisible();

    await page.goBack();
    await expect(page).toHaveURL("/admin/catalogue/tn");
    await expect(page.getByRole("dialog", { name: "You have unsaved changes" })).toHaveCount(0);
    await expect(page.getByText("Unsaved changes", { exact: true })).toBeVisible();

    expect(browserErrors).toEqual([]);
  });
});
