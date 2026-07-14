import { expect, test, type Locator, type Page } from "@playwright/test";

import { authenticateAdmin } from "./adminTestHelpers";

type ModalStabilityOptions = {
  requireInternalScroll?: boolean;
};

async function scrollPagePartway(page: Page) {
  return page.evaluate(async () => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    const previousScrollBehaviorPriority = root.style.getPropertyPriority("scroll-behavior");
    const maximumScroll = Math.max(
      0,
      root.scrollHeight - window.innerHeight,
    );
    const target = Math.min(Math.max(160, maximumScroll / 2), maximumScroll);

    root.style.setProperty("scroll-behavior", "auto", "important");
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    window.scrollTo({
      behavior: "auto",
      left: 0,
      top: target,
    });
    await new Promise<void>((resolve) => {
      let remainingFrames = 120;

      const waitForTarget = () => {
        remainingFrames -= 1;
        if (Math.abs(window.scrollY - target) <= 1 || remainingFrames === 0) {
          resolve();
          return;
        }
        requestAnimationFrame(waitForTarget);
      };

      requestAnimationFrame(waitForTarget);
    });
    const scrollY = window.scrollY;

    if (previousScrollBehavior) {
      root.style.setProperty(
        "scroll-behavior",
        previousScrollBehavior,
        previousScrollBehaviorPriority,
      );
    } else {
      root.style.removeProperty("scroll-behavior");
    }

    return scrollY;
  });
}

async function clickWithoutChangingPageScroll(trigger: Locator) {
  await trigger.evaluate((element) => {
    const control = element as HTMLElement;
    control.focus({ preventScroll: true });
    control.click();
  });
}

async function placeTriggerInView(trigger: Locator) {
  return trigger.evaluate(async (element) => {
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;
    const previousScrollBehaviorPriority = root.style.getPropertyPriority("scroll-behavior");

    root.style.setProperty("scroll-behavior", "auto", "important");
    await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    element.scrollIntoView({ behavior: "auto", block: "center" });
    await new Promise<void>((resolve) => {
      let previousScrollY = window.scrollY;
      let stableFrames = 0;
      let remainingFrames = 120;

      const waitForStablePosition = () => {
        const currentScrollY = window.scrollY;
        remainingFrames -= 1;
        stableFrames = Math.abs(currentScrollY - previousScrollY) <= 1 ? stableFrames + 1 : 0;
        previousScrollY = currentScrollY;

        if (stableFrames >= 2 || remainingFrames === 0) {
          resolve();
          return;
        }
        requestAnimationFrame(waitForStablePosition);
      };

      requestAnimationFrame(waitForStablePosition);
    });
    const scrollY = window.scrollY;

    if (previousScrollBehavior) {
      root.style.setProperty(
        "scroll-behavior",
        previousScrollBehavior,
        previousScrollBehaviorPriority,
      );
    } else {
      root.style.removeProperty("scroll-behavior");
    }

    return scrollY;
  });
}

async function assertAdminModalStability(
  page: Page,
  dialog: Locator,
  options: ModalStabilityOptions = {},
) {
  await expect(dialog).toBeVisible();

  const root = page.locator("[data-admin-modal-root]");
  const body = dialog.locator("[data-admin-modal-body]");
  const header = dialog.locator("[data-admin-modal-header]");
  const footer = dialog.locator("[data-admin-modal-footer]");
  const viewport = page.viewportSize();

  await expect(root).toHaveCSS("position", "fixed");
  await expect(root).toHaveCSS("overflow", "hidden");
  await expect(body).toHaveCSS("overflow-y", "auto");
  await expect(page.locator("html")).toHaveAttribute("data-scroll-locked", "true");

  const pageScrollBefore = await page.evaluate(() => window.scrollY);
  const panelBefore = await dialog.boundingBox();
  const headerBefore = await header.boundingBox();
  const footerBefore = (await footer.count()) > 0 ? await footer.boundingBox() : null;
  const bodyMetrics = await body.evaluate((element) => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
  }));

  expect(panelBefore).not.toBeNull();
  expect(headerBefore).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(panelBefore!.y).toBeGreaterThanOrEqual(0);
  expect(panelBefore!.y + panelBefore!.height).toBeLessThanOrEqual(viewport!.height + 1);
  expect(panelBefore!.x).toBeGreaterThanOrEqual(0);
  expect(panelBefore!.x + panelBefore!.width).toBeLessThanOrEqual(viewport!.width + 1);

  if (options.requireInternalScroll) {
    expect(bodyMetrics.scrollHeight).toBeGreaterThan(bodyMetrics.clientHeight + 1);
  }

  await body.evaluate((element) => {
    element.scrollTop = 0;
  });
  await body.hover();
  await page.mouse.wheel(0, 1_200);

  if (bodyMetrics.scrollHeight > bodyMetrics.clientHeight + 1) {
    await expect.poll(() => body.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  }

  const panelAfter = await dialog.boundingBox();
  const headerAfter = await header.boundingBox();
  const footerAfter = footerBefore ? await footer.boundingBox() : null;

  expect(panelAfter).not.toBeNull();
  expect(headerAfter).not.toBeNull();
  expect(Math.abs(panelAfter!.x - panelBefore!.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(panelAfter!.y - panelBefore!.y)).toBeLessThanOrEqual(1);
  expect(Math.abs(panelAfter!.width - panelBefore!.width)).toBeLessThanOrEqual(1);
  expect(Math.abs(panelAfter!.height - panelBefore!.height)).toBeLessThanOrEqual(1);
  expect(Math.abs(headerAfter!.y - headerBefore!.y)).toBeLessThanOrEqual(1);
  if (footerBefore && footerAfter) {
    expect(Math.abs(footerAfter.y - footerBefore.y)).toBeLessThanOrEqual(1);
  }
  expect(await page.evaluate(() => window.scrollY)).toBe(pageScrollBefore);

  const rootBox = await root.boundingBox();
  expect(rootBox).not.toBeNull();
  const contentScrollBeforeOverlay = await body.evaluate((element) => element.scrollTop);
  await page.mouse.move(rootBox!.x + 2, rootBox!.y + 2);
  await page.mouse.wheel(0, 900);
  expect(await page.evaluate(() => window.scrollY)).toBe(pageScrollBefore);
  expect(await body.evaluate((element) => element.scrollTop)).toBe(
    contentScrollBeforeOverlay,
  );
}

async function closeModalWithEscape(
  page: Page,
  dialog: Locator,
  expectedPageScroll: number,
  returnFocus?: Locator,
) {
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveAttribute("data-scroll-locked", "true");
  expect(await page.evaluate(() => window.scrollY)).toBe(expectedPageScroll);
  if (returnFocus) await expect(returnFocus).toBeFocused();
}

test.describe("Product Panel Extension modal scrolling", () => {
  test.beforeEach(async ({ page }) => {
    await authenticateAdmin(page);
  });

  test("keeps hierarchy and product management dialogs fixed on a small laptop", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1100, height: 620 });
    await page.goto("/admin/catalogue");

    let pageScroll = await scrollPagePartway(page);
    const editCatalogue = page.getByRole("button", { name: "Edit Catalogue" });
    await clickWithoutChangingPageScroll(editCatalogue);

    let dialog = page.getByRole("dialog", { name: "Edit Catalogue" });
    await assertAdminModalStability(page, dialog, { requireInternalScroll: true });

    await dialog.getByRole("button", { name: /Remove TN \(Twisted Nematic\)/ }).click();
    dialog = page.getByRole("dialog", { name: "Delete subcategory?" });
    await assertAdminModalStability(page, dialog);
    await closeModalWithEscape(page, dialog, pageScroll);

    await page.goto("/admin/catalogue/tn");
    pageScroll = await scrollPagePartway(page);
    const editProducts = page.getByRole("button", { name: "Edit Products" });
    await clickWithoutChangingPageScroll(editProducts);

    dialog = page.getByRole("dialog", { name: "Manage Products: TN" });
    await assertAdminModalStability(page, dialog, { requireInternalScroll: true });
    await dialog.getByRole("button", { name: "Add Product" }).click();

    dialog = page.getByRole("dialog", { name: "Add Product" });
    await assertAdminModalStability(page, dialog, { requireInternalScroll: true });
    await closeModalWithEscape(page, dialog, pageScroll);

    await clickWithoutChangingPageScroll(editProducts);
    dialog = page.getByRole("dialog", { name: "Manage Products: TN" });
    await dialog.getByRole("button", { name: "Edit Product" }).first().click();
    dialog = page.getByRole("dialog", { name: "Edit Product" });
    await assertAdminModalStability(page, dialog, { requireInternalScroll: true });
    await closeModalWithEscape(page, dialog, pageScroll);

    await clickWithoutChangingPageScroll(editProducts);
    dialog = page.getByRole("dialog", { name: "Manage Products: TN" });
    await dialog
      .getByRole("button", { name: "Remove 4-Digit 7-Segment Display from the draft" })
      .click();
    dialog = page.getByRole("dialog", { name: "Delete product?" });
    await assertAdminModalStability(page, dialog);
    await closeModalWithEscape(page, dialog, pageScroll);
  });

  test("keeps every Product Detail section editor inside a tablet viewport", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 768, height: 640 });
    await page.goto("/admin/catalogue/tn/4-digit-7-segment-display");

    const sections = [
      { name: "Edit Product Summary", requireInternalScroll: false },
      { name: "Edit Gallery", requireInternalScroll: true },
      { name: "Edit Description", requireInternalScroll: true },
      { name: "Edit Product Information", requireInternalScroll: true },
      { name: "Edit Applications", requireInternalScroll: false },
      { name: "Edit Available Options", requireInternalScroll: false },
      { name: "Edit Downloads", requireInternalScroll: false },
    ];

    for (const section of sections) {
      const trigger = page.getByRole("button", { name: section.name });
      const pageScroll = await placeTriggerInView(trigger);
      await clickWithoutChangingPageScroll(trigger);
      const dialog = page.getByRole("dialog", { name: section.name });
      await assertAdminModalStability(page, dialog, {
        requireInternalScroll: section.requireInternalScroll,
      });
      await closeModalWithEscape(page, dialog, pageScroll, trigger);
    }
  });

  test("locks the page for unsaved-exit and submission-success dialogs", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 960, height: 620 });
    await page.goto("/admin/catalogue/tn/4-digit-7-segment-display");

    await page.getByRole("button", { name: "Edit Product Summary" }).click();
    let dialog = page.getByRole("dialog", { name: "Edit Product Summary" });
    await dialog
      .getByLabel(/^Main introduction/)
      .fill("Modal scroll isolation verification content.");
    await dialog.getByRole("button", { name: "Save Section" }).click();

    const pageScroll = await scrollPagePartway(page);
    const homeLink = page.locator('header a[href="/"]').first();
    await clickWithoutChangingPageScroll(homeLink);
    dialog = page.getByRole("dialog", { name: "You have unsaved changes" });
    await assertAdminModalStability(page, dialog);
    await closeModalWithEscape(page, dialog, pageScroll, homeLink);

    await page.getByRole("button", { name: "Submit Changes" }).click();
    dialog = page.getByRole("dialog", { name: "Changes submitted successfully" });
    await assertAdminModalStability(page, dialog);
    await dialog.getByRole("button", { name: "Continue Editing" }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.locator("html")).not.toHaveAttribute("data-scroll-locked", "true");
    expect(await page.evaluate(() => window.scrollY)).toBe(pageScroll);
  });
});

test.describe("Product Panel Extension mobile drawer scrolling", () => {
  test.use({
    viewport: { width: 390, height: 700 },
    hasTouch: true,
    isMobile: true,
  });

  test("keeps the filter drawer anchored during touch scrolling", async ({ page }) => {
    await authenticateAdmin(page, "/admin/catalogue/tn");
    const pageScroll = await scrollPagePartway(page);
    const trigger = page.getByRole("button", { name: /^Filters/ });
    await clickWithoutChangingPageScroll(trigger);

    const drawer = page.locator("[data-product-filter-drawer-panel]");
    const body = drawer.locator("[data-product-filter-drawer-body]");
    await expect(drawer).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-scroll-locked", "true");

    const lockedPageState = await page.evaluate(() => ({
      bodyPosition: document.body.style.position,
      bodyTop: Number.parseFloat(document.body.style.top),
      scrollY: window.scrollY,
    }));
    expect(lockedPageState.bodyPosition).toBe("fixed");
    expect(lockedPageState.bodyTop).toBe(-pageScroll);

    const panelBefore = await drawer.boundingBox();
    const bodyBox = await body.boundingBox();
    expect(panelBefore).not.toBeNull();
    expect(bodyBox).not.toBeNull();
    expect(panelBefore!.y).toBeGreaterThanOrEqual(0);
    expect(panelBefore!.y + panelBefore!.height).toBeLessThanOrEqual(701);

    const cdp = await page.context().newCDPSession(page);
    const x = bodyBox!.x + bodyBox!.width / 2;
    const startY = bodyBox!.y + bodyBox!.height - 60;
    const endY = bodyBox!.y + 70;
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y: startY }],
    });
    for (let step = 1; step <= 5; step += 1) {
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x, y: startY + ((endY - startY) * step) / 5 }],
      });
    }
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await cdp.detach();

    await expect.poll(() => body.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
    const panelAfter = await drawer.boundingBox();
    expect(panelAfter).not.toBeNull();
    expect(Math.abs(panelAfter!.x - panelBefore!.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(panelAfter!.y - panelBefore!.y)).toBeLessThanOrEqual(1);
    expect(await page.evaluate(() => window.scrollY)).toBe(lockedPageState.scrollY);
    await expect(drawer.getByRole("button", { name: "Done" })).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));
    expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);

    await drawer.getByRole("button", { name: "Done" }).click();
    await expect(drawer).toHaveCount(0);
    await expect(page.locator("html")).not.toHaveAttribute("data-scroll-locked", "true");
    expect(await page.evaluate(() => window.scrollY)).toBe(pageScroll);
    await expect(trigger).toBeFocused();
  });
});
