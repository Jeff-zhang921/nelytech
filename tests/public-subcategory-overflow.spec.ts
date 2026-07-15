import { expect, test, type Locator, type Page } from "@playwright/test";

import { getPublishedProductMegaMenu } from "../src/data/productNavigation";
import {
  MAX_VISIBLE_SUBCATEGORIES,
  splitSubcategories,
} from "../src/lib/subcategoryOverflow";

const productMenu = getPublishedProductMegaMenu();

function productSection(panel: Locator, sectionKey: string) {
  return panel.locator(`[data-product-menu-section="${sectionKey}"]`);
}

async function openDesktopProductsPanel(page: Page, pathname: string) {
  await page.goto(pathname, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /^Products/i }).hover();

  const panel = page.locator("#products-mega-menu");
  await expect(panel).toBeVisible();
  return panel;
}

async function expectPublishedSections(panel: Locator) {
  for (const section of productMenu.sections) {
    const group = productSection(panel, section.translationKey);
    const { visible, overflow } = splitSubcategories(section.links);
    const directLinks = group.locator('[data-subcategory-placement="direct"]');

    await expect(directLinks).toHaveCount(visible.length);
    await expect
      .poll(() =>
        directLinks.evaluateAll((links) =>
          links.map((link) => new URL((link as HTMLAnchorElement).href).pathname),
        ),
      )
      .toEqual(visible.map((link) => link.href));

    const trigger = group.getByRole("button", {
      name: `View ${overflow.length} more ${section.heading} subcategories`,
    });

    if (overflow.length === 0) {
      await expect(group.getByRole("button", { name: /more .* subcategories/i })).toHaveCount(0);
      await expect(group.getByRole("region", { name: /more subcategories/i })).toHaveCount(0);
      continue;
    }

    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.hover();

    const overflowPanel = group.getByRole("region", {
      name: `More subcategories in ${section.heading}`,
    });
    await expect(overflowPanel).toBeVisible();
    await overflowPanel.getByRole("link").first().hover();
    await expect(overflowPanel).toBeVisible();
    await expect
      .poll(() =>
        overflowPanel.getByRole("link").evaluateAll((links) =>
          links.map((link) => new URL((link as HTMLAnchorElement).href).pathname),
        ),
      )
      .toEqual(overflow.map((link) => link.href));

    await pageKeyboardClose(trigger, overflowPanel);
  }
}

async function pageKeyboardClose(trigger: Locator, panel: Locator) {
  const firstOverflowLink = panel.getByRole("link").first();
  await firstOverflowLink.focus();
  await firstOverflowLink.press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(trigger).toBeFocused();

  await trigger.press("Enter");
  await expect(panel).toBeVisible();
  await panel.getByRole("link").first().press("Escape");
  await expect(panel).toHaveCount(0);
  await expect(trigger).toBeFocused();
}

test.describe("public Products subcategory overflow", () => {
  test("uses one stable first-five split for public and Admin consumers", () => {
    const items = ["A", "B", "C", "D", "E", "F", "G"];

    expect(MAX_VISIBLE_SUBCATEGORIES).toBe(5);
    expect(splitSubcategories(items)).toEqual({
      visible: ["A", "B", "C", "D", "E"],
      overflow: ["F", "G"],
    });
    expect(splitSubcategories(items.slice(0, 5))).toEqual({
      visible: ["A", "B", "C", "D", "E"],
      overflow: [],
    });
  });

  test("matches the published first-five boundary on the homepage and another public page", async ({
    page,
  }) => {
    for (const pathname of ["/", "/about"]) {
      const panel = await openDesktopProductsPanel(page, pathname);
      await expectPublishedSections(panel);
    }
  });

  test("routes a published overflow item to its public catalogue page", async ({ page }) => {
    const section = productMenu.sections.find(
      (candidate) => candidate.links.length > MAX_VISIBLE_SUBCATEGORIES,
    );

    if (!section) {
      expect(productMenu.sections.every((candidate) => candidate.links.length <= 5)).toBe(true);
      return;
    }

    const panel = await openDesktopProductsPanel(page, "/");
    const group = productSection(panel, section.translationKey);
    const overflowLink = section.links[MAX_VISIBLE_SUBCATEGORIES];
    await group
      .getByRole("button", {
        name: `View ${section.links.length - MAX_VISIBLE_SUBCATEGORIES} more ${section.heading} subcategories`,
      })
      .click();
    await group.getByRole("link", { name: overflowLink.title, exact: true }).click();

    await expect(page).toHaveURL(overflowLink.href);
    expect(new URL(page.url()).pathname.startsWith("/admin/")).toBe(false);
  });

  test("uses the same boundary in mobile navigation without horizontal overflow", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.getByRole("button", { name: /open navigation menu/i }).click();

    const navigation = page.locator("#mobile-navigation");
    await navigation.getByRole("button", { name: /^Products/i }).click();
    const panel = page.locator("#mobile-products-panel");
    let overflowNavigation:
      | {
          sectionKey: string;
          sectionHeading: string;
          hiddenCount: number;
          link: (typeof productMenu.sections)[number]["links"][number];
        }
      | undefined;

    for (const section of productMenu.sections) {
      const group = productSection(panel, section.translationKey);
      const { visible, overflow } = splitSubcategories(section.links);

      await expect(group.locator('[data-subcategory-placement="direct"]')).toHaveCount(
        visible.length,
      );

      const trigger = group.getByRole("button", {
        name: `View ${overflow.length} more ${section.heading} subcategories`,
      });

      if (overflow.length === 0) {
        await expect(group.getByRole("button", { name: /more .* subcategories/i })).toHaveCount(0);
        continue;
      }

      await trigger.click();
      const overflowPanel = group.getByRole("region", {
        name: `More subcategories in ${section.heading}`,
      });
      await expect(overflowPanel.getByRole("link")).toHaveCount(overflow.length);
      await trigger.click();
      await expect(overflowPanel).toHaveCount(0);

      overflowNavigation ??= {
        sectionKey: section.translationKey,
        sectionHeading: section.heading,
        hiddenCount: overflow.length,
        link: overflow[0],
      };
    }

    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);

    if (overflowNavigation) {
      const group = productSection(panel, overflowNavigation.sectionKey);
      await group
        .getByRole("button", {
          name: `View ${overflowNavigation.hiddenCount} more ${overflowNavigation.sectionHeading} subcategories`,
        })
        .click();
      await group
        .getByRole("link", { name: overflowNavigation.link.title, exact: true })
        .click();
      await expect(page).toHaveURL(overflowNavigation.link.href);
    }
  });
});
