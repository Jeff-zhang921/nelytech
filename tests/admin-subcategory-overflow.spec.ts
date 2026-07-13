import { expect, test, type Locator, type Page } from "@playwright/test";

const LCD_PANELS = "LCD Panels";

function catalogueCard(page: Page, categoryName = LCD_PANELS) {
  return page.locator("article").filter({
    has: page.getByRole("heading", { name: categoryName, exact: true }),
  });
}

async function addSubcategory(page: Page, name: string) {
  const card = catalogueCard(page);
  await card.getByRole("button", { name: `Edit subcategories in ${LCD_PANELS}` }).click();

  const editor = page.getByRole("dialog", { name: "Edit Catalogue" });
  await editor.getByLabel("Subcategory name").fill(name);
  await editor.getByRole("button", { name: "Add Subcategory", exact: true }).click();
  await expect(page.getByText("Unsaved changes", { exact: true })).toBeVisible();
}

async function deleteSubcategory(page: Page, name: string) {
  const card = catalogueCard(page);
  await card.getByRole("button", { name: `Edit subcategories in ${LCD_PANELS}` }).click();

  const editor = page.getByRole("dialog", { name: "Edit Catalogue" });
  await editor.getByRole("button", { name: `Remove ${name} from the draft` }).click();

  const confirmation = page.getByRole("dialog", { name: "Delete subcategory?" });
  await confirmation.getByRole("button", { name: "Delete Subcategory", exact: true }).click();
}

async function seedOverflow(page: Page) {
  await page.goto("/admin/catalogue");
  await addSubcategory(page, "Overflow Six");
  await addSubcategory(page, "Overflow Seven");
}

async function expectInsideViewport(locator: Locator, page: Page) {
  const box = await locator.boundingBox();
  const viewport = page.viewportSize();

  expect(box).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(viewport!.height);
}

test.describe("Product Panel Extension subcategory overflow", () => {
  test("shows five direct items and supports hover, keyboard, and internal navigation", async ({
    page,
  }) => {
    await seedOverflow(page);

    const card = catalogueCard(page);
    const trigger = card.getByRole("button", {
      name: `View 2 more subcategories in ${LCD_PANELS}`,
    });

    await expect(trigger).toBeVisible();
    await expect(card.getByRole("link", { name: /Overflow Six/ })).toHaveCount(0);
    await expect(card.getByRole("link", { name: /Overflow Seven/ })).toHaveCount(0);
    await expect(card.locator('a[href^="/admin/catalogue/"]')).toHaveCount(6);

    await trigger.hover();
    const panel = page.getByRole("region", { name: `More subcategories in ${LCD_PANELS}` });
    await expect(panel).toBeVisible();
    await panel.getByRole("link", { name: /Overflow Six/ }).hover();
    await expect(panel).toBeVisible();
    await expect(panel.getByRole("link")).toHaveText([
      /Overflow Six/,
      /Overflow Seven/,
    ]);
    await expectInsideViewport(panel, page);

    await panel.getByRole("link", { name: /Overflow Six/ }).click();
    await expect(page).toHaveURL("/admin/catalogue/overflow-six");
    await expect(page.getByRole("dialog", { name: "You have unsaved changes" })).toHaveCount(0);
    await expect(page.getByText("Unsaved changes", { exact: true })).toBeVisible();

    await page.goBack();
    const restoredTrigger = catalogueCard(page).getByRole("button", {
      name: `View 2 more subcategories in ${LCD_PANELS}`,
    });
    await restoredTrigger.focus();
    await page.keyboard.press("Enter");
    const restoredPanel = page.getByRole("region", {
      name: `More subcategories in ${LCD_PANELS}`,
    });
    await expect(restoredPanel).toBeVisible();
    await restoredPanel.getByRole("link", { name: /Overflow Six/ }).focus();
    await page.keyboard.press("Escape");
    await expect(restoredPanel).toHaveCount(0);
    await expect(restoredTrigger).toBeFocused();
  });

  test("promotes overflow items after deletion and removes the trigger at five items", async ({
    page,
  }) => {
    await seedOverflow(page);
    await deleteSubcategory(page, "HTN (High Twisted Nematic)");

    const card = catalogueCard(page);
    await expect(card.getByRole("link", { name: /Overflow Six/ })).toBeVisible();
    const oneMoreTrigger = card.getByRole("button", {
      name: `View 1 more subcategories in ${LCD_PANELS}`,
    });
    await oneMoreTrigger.click();
    const panel = page.getByRole("region", { name: `More subcategories in ${LCD_PANELS}` });
    await expect(panel.getByRole("link", { name: /Overflow Seven/ })).toBeVisible();
    await expect(panel.getByRole("link", { name: /Overflow Six/ })).toHaveCount(0);

    await page.keyboard.press("Escape");
    await deleteSubcategory(page, "STN (Super Twisted Nematic)");
    await expect(
      catalogueCard(page).getByRole("button", { name: /more subcategories/i }),
    ).toHaveCount(0);
    await expect(catalogueCard(page).getByRole("link", { name: /Overflow Seven/ })).toBeVisible();
  });

  test("opens by touch without horizontal overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seedOverflow(page);

    const trigger = catalogueCard(page).getByRole("button", {
      name: `View 2 more subcategories in ${LCD_PANELS}`,
    });
    await trigger.click();

    const panel = page.getByRole("region", { name: `More subcategories in ${LCD_PANELS}` });
    await expect(panel).toBeVisible();
    await expectInsideViewport(panel, page);

    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);

    await page.getByRole("heading", { name: "Product Catalogue Editor" }).click();
    await expect(panel).toHaveCount(0);
  });
});
