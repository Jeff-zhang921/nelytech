import { expect, test, type Locator, type Page } from "@playwright/test";
import { authenticateAdmin } from "./adminTestHelpers";
import { canonicalCatalogue } from "@/content/catalogue";

import { validateProductFilterValues } from "@/components/products/productFiltering";
import {
  getFilterSchemaForCatalogueNode,
  normalizeFilterValues,
} from "@/data/categoryFilterSchemas";

const lcdPanels = canonicalCatalogue.categories.find(
  (category) => category.slug === "lcd-panels",
)!;
const lcdPanelProductCount =
  lcdPanels.products.length +
  lcdPanels.subcategories.reduce(
    (total, subcategory) => total + subcategory.products.length,
    0,
  );

const testPng = {
  name: "schema-product.png",
  mimeType: "image/png",
  buffer: Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M/wHwAF/gL+X8xvAAAAAElFTkSuQmCC",
    "base64",
  ),
};

type SchemaCase = {
  slug: string;
  name: string;
  groups: string[];
  selections: Array<{ groupId: string; label: string; id: string }>;
  alternate: { label: string; id: string };
  incompatible: string;
};

const schemaCases: SchemaCase[] = [
  {
    slug: "lcd-modules",
    name: "LCD Modules",
    groups: ["Module Type", "Display Format", "Interface", "Backlight", "Application"],
    selections: [
      { groupId: "module-type", label: "Character LCD Module", id: "character-lcd-module" },
      { groupId: "display-format", label: "Character", id: "character" },
      { groupId: "interface", label: "Parallel", id: "parallel" },
      { groupId: "backlight", label: "No Backlight", id: "no-backlight" },
      { groupId: "application", label: "Industrial Control", id: "industrial-control" },
    ],
    alternate: { label: "Graphic LCD Module", id: "graphic-lcd-module" },
    incompatible: "Custom Format",
  },
  {
    slug: "assembly-technologies",
    name: "Assembly Technologies",
    groups: [
      "Assembly Method",
      "Interconnection Type",
      "Integration Scope",
      "Production Stage",
      "Application",
    ],
    selections: [
      { groupId: "assembly-method", label: "COB", id: "cob" },
      { groupId: "interconnection-type", label: "FPC", id: "fpc" },
      { groupId: "integration-scope", label: "LCD Only", id: "lcd-only" },
      { groupId: "production-stage", label: "Prototype", id: "prototype" },
      { groupId: "application", label: "Industrial Control", id: "industrial-control" },
    ],
    alternate: { label: "COG", id: "cog" },
    incompatible: "Heat Seal Connector",
  },
  {
    slug: "custom-solutions",
    name: "Advanced & Custom Solutions",
    groups: [
      "Solution Type",
      "Customisation Area",
      "Project Stage",
      "Production Volume",
      "Application",
    ],
    selections: [
      { groupId: "solution-type", label: "Custom LCD Panel", id: "custom-lcd-panel" },
      { groupId: "customisation-area", label: "Size and Shape", id: "size-and-shape" },
      { groupId: "project-stage", label: "Concept Development", id: "concept-development" },
      { groupId: "production-volume", label: "Prototype Quantity", id: "prototype-quantity" },
      { groupId: "application", label: "Industrial Control", id: "industrial-control" },
    ],
    alternate: { label: "Custom LCD Module", id: "custom-lcd-module" },
    incompatible: "Mechanical Integration",
  },
];

function optionRow(container: Locator, label: string) {
  return container.locator("label").filter({ hasText: label }).first();
}

async function getSavedProduct(page: Page, categorySlug: string, productSlug: string) {
  return page.evaluate(
    ({ categorySlug, productSlug }) => {
      const raw = localStorage.getItem("nelytech.admin.catalogue-draft.v1");
      const draft = raw ? JSON.parse(raw) : null;
      const category = draft?.categories.find(
        (item: { slug?: string }) => item.slug === categorySlug,
      );
      return category?.products.find(
        (item: { slug?: string }) => item.slug === productSlug,
      );
    },
    { categorySlug, productSlug },
  );
}

test.describe("predefined category filter schemas", () => {
  test.beforeEach(async ({ page }) => {
    await authenticateAdmin(page);
  });

  test("shared lookup resolves parent ownership and preserves invalid legacy values", () => {
    const lcdPanelsSchema = getFilterSchemaForCatalogueNode("lcd-panels");
    expect(getFilterSchemaForCatalogueNode("tn")).toBe(lcdPanelsSchema);
    expect(getFilterSchemaForCatalogueNode("htn")).toBe(lcdPanelsSchema);
    expect(getFilterSchemaForCatalogueNode("cog").parentCategoryId).toBe(
      "assembly-technologies",
    );

    const migratedValues = normalizeFilterValues(lcdPanelsSchema, {
      application: ["counters"],
      "assembly-method": ["cog"],
    });
    expect(migratedValues.application).toEqual(["counters"]);
    expect(migratedValues["assembly-method"]).toEqual(["cog"]);
    expect(validateProductFilterValues(migratedValues, lcdPanelsSchema)).toContainEqual(
      expect.objectContaining({
        code: "unknown-group",
        groupId: "assembly-method",
        message:
          "The “assembly-method” filter group does not belong to the LCD Panels filter schema.",
      }),
    );
  });

  test("parent and sibling public pages inherit identical schema IDs and order", async ({
    page,
  }) => {
    const inheritanceCases = [
      {
        routes: ["lcd-panels", "tn", "htn", "stn", "fstn", "va"],
        groups: ["application", "interface", "format"],
      },
      {
        routes: ["lcd-modules", "character-modules", "graphic-modules", "custom-segment"],
        groups: ["module-type", "display-format", "interface", "backlight", "application"],
      },
      {
        routes: ["assembly-technologies", "cob", "cog", "tab", "cof"],
        groups: [
          "assembly-method",
          "interconnection-type",
          "integration-scope",
          "production-stage",
          "application",
        ],
      },
      {
        routes: ["custom-solutions", "tft-modules", "custom-pcba-mcu", "touch-panels"],
        groups: [
          "solution-type",
          "customisation-area",
          "project-stage",
          "production-volume",
          "application",
        ],
      },
    ];

    for (const inheritanceCase of inheritanceCases) {
      for (const route of inheritanceCase.routes) {
        await page.goto(`/products/${route}`);
        const filters = page.getByRole("complementary", { name: "Product filters" });
        await expect(filters).toBeVisible();
        await expect(filters.getByText("Display Technology", { exact: true })).toHaveCount(0);
        const groupIds = await filters
          .locator("[data-filter-group]")
          .evaluateAll((elements) =>
            elements.map((element) => element.getAttribute("data-filter-group")),
          );
        expect(groupIds).toEqual(inheritanceCase.groups);
      }
    }
  });

  test("parent counts aggregate child products while child and empty scopes stay isolated", async ({
    page,
  }) => {
    await page.goto("/products/lcd-panels");
    await expect(page.getByTestId("product-card")).toHaveCount(lcdPanelProductCount);
    let filters = page.getByRole("complementary", { name: "Product filters" });
    await expect(optionRow(filters, "Counters")).toContainText("1");

    await page.goto("/products/tn");
    await expect(page.getByTestId("product-card")).toHaveCount(6);
    filters = page.getByRole("complementary", { name: "Product filters" });
    await expect(optionRow(filters, "Counters")).toContainText("1");

    await page.goto("/products/htn");
    await expect(page.getByText("Filter products under HTN")).toBeVisible();
    await expect(page.getByText("0 products", { exact: true })).toBeVisible();
    filters = page.getByRole("complementary", { name: "Product filters" });
    const emptyCounter = optionRow(filters, "Counters");
    await expect(emptyCounter).toContainText("0");
    await expect(emptyCounter.locator("input")).toBeDisabled();
    await expect(page.getByRole("heading", { name: "No products available" })).toBeVisible();
  });

  test("Admin parent Live Preview aggregates children and preserves their owner routes", async ({
    page,
  }) => {
    await page.goto("/admin/catalogue/lcd-panels");
    await expect(
      page.getByText(`${lcdPanelProductCount} products`, { exact: true }),
    ).toBeVisible();
    const filters = page.getByRole("complementary", { name: "Product filters" });
    await expect(optionRow(filters, "Counters")).toContainText("1");

    await page
      .getByTestId("product-card")
      .filter({ hasText: "4-Digit 7-Segment Display" })
      .click();
    await expect(page).toHaveURL("/admin/catalogue/tn/4-digit-7-segment-display");
  });

  test("Admin siblings and new subcategories inherit selectable parent filters", async ({
    page,
  }) => {
    const expectedLcdPanelGroups = ["Application", "Interface / connection", "Format"];

    for (const route of ["tn", "htn"]) {
      await page.goto(`/admin/catalogue/${route}`);
      await page.getByRole("button", { name: "Edit Products" }).click();
      await page
        .getByRole("dialog", { name: /Manage Products:/ })
        .getByRole("button", { name: "Add Product" })
        .click();
      const editor = page.getByRole("dialog", { name: "Add Product" });
      await expect(editor.locator('fieldset[aria-describedby$="-filter-help"]')).toHaveCount(
        expectedLcdPanelGroups.length,
      );
      for (const group of expectedLcdPanelGroups) {
        await expect(editor.getByRole("group", { name: group })).toBeVisible();
      }
      await expect(editor.getByLabel("Counters", { exact: true })).toBeEnabled();
      await page.keyboard.press("Escape");
    }

    await page.goto("/admin/catalogue");
    const lcdModulesCard = page.locator("article").filter({
      has: page.getByRole("heading", { name: "LCD Modules", exact: true }),
    });
    await lcdModulesCard
      .getByRole("button", { name: "Edit subcategories in LCD Modules" })
      .click();
    const catalogueEditor = page.getByRole("dialog", { name: "Edit Catalogue" });
    await catalogueEditor.getByLabel("Subcategory name").fill("Custom Character Modules");
    await catalogueEditor
      .getByRole("button", { name: "Add Subcategory", exact: true })
      .click();
    await lcdModulesCard.getByRole("link", { name: /Custom Character Modules/ }).click();
    await expect(page).toHaveURL("/admin/catalogue/custom-character-modules");
    await page.getByRole("button", { name: "Edit Products" }).click();
    await page
      .getByRole("dialog", { name: /Manage Products:/ })
      .getByRole("button", { name: "Add Product" })
      .click();
    const newSubcategoryEditor = page.getByRole("dialog", { name: "Add Product" });
    for (const group of schemaCases[0].groups) {
      await expect(newSubcategoryEditor.getByRole("group", { name: group })).toBeVisible();
    }
    await expect(
      newSubcategoryEditor.getByLabel("Character LCD Module", { exact: true }),
    ).toBeEnabled();
  });

  for (const schemaCase of schemaCases) {
    test("public " + schemaCase.name + " page exposes its disabled zero-count schema", async ({
      page,
    }) => {
      await page.goto("/products/" + schemaCase.slug);

      await expect(page.getByRole("heading", { level: 1, name: schemaCase.name })).toBeVisible();
      await expect(page.getByLabel("Breadcrumb")).toContainText(schemaCase.name);
      await expect(page.getByTestId("product-parent-link")).toContainText("Back to Products");

      const filters = page.getByRole("complementary", { name: "Product filters" });
      await expect(filters).toContainText("Filter products under " + schemaCase.name);
      await expect(filters.getByText("Display Technology", { exact: true })).toHaveCount(0);

      for (const group of schemaCase.groups) {
        await expect(filters.getByRole("button", { name: new RegExp("^" + group) })).toBeVisible();
      }

      const firstGroup = filters.getByRole("button", {
        name: new RegExp("^" + schemaCase.groups[0]),
      });
      await expect(firstGroup).toHaveAttribute("aria-expanded", "true");
      await firstGroup.click();
      await expect(firstGroup).toHaveAttribute("aria-expanded", "false");
      await firstGroup.click();

      const firstOption = optionRow(filters, schemaCase.selections[0].label);
      await expect(firstOption.locator("input")).toBeDisabled();
      await expect(firstOption).toContainText("0");
      await expect(firstOption.locator("[aria-label='0 matching products']")).toBeVisible();

      await expect(page.getByText("0 products", { exact: true })).toBeVisible();
      await expect(page.getByRole("heading", { name: "No products available" })).toBeVisible();
      await expect(
        page.getByText(
          "There are currently no products listed under " + schemaCase.name + ".",
        ),
      ).toBeVisible();
      await expect(page.getByTestId("product-card")).toHaveCount(0);
    });
  }

  for (const schemaCase of schemaCases) {
    test("Admin " + schemaCase.name + " Add/Edit and Live Preview share stable filter IDs", async ({
      page,
    }) => {
      const productName = schemaCase.name + " Schema Prototype";
      const productSlug = productName
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      await page.goto("/admin/catalogue/" + schemaCase.slug);

      await expect(page.getByText("0 products", { exact: true })).toBeVisible();
      await page.getByRole("button", { name: "Add Product" }).click();
      let editor = page.getByRole("dialog", { name: "Add Product" });

      for (const group of schemaCase.groups) {
        await expect(editor.getByRole("group", { name: group })).toBeVisible();
      }
      await expect(editor.getByText("Display Technology", { exact: true })).toHaveCount(0);

      await editor.getByLabel("Product name").fill(productName);
      await editor
        .getByLabel("Short description")
        .fill("Prototype product used to verify shared category filter schemas.");
      await editor.getByLabel("Image alt text").fill("Front view of " + productName);
      await editor.locator('input[type="file"]').setInputFiles(testPng);

      for (const selection of schemaCase.selections) {
        const option = editor.getByLabel(selection.label, { exact: true });
        await expect(option).toBeEnabled();
        await option.check();
      }
      await editor.getByRole("button", { name: "Add Product", exact: true }).click();

      await expect(page.getByText("1 product", { exact: true })).toBeVisible();
      await expect(page.getByTestId("product-card").filter({ hasText: productName })).toBeVisible();

      const filters = page.getByRole("complementary", { name: "Product filters" });
      await expect(optionRow(filters, schemaCase.selections[0].label)).toContainText("1");
      await optionRow(filters, schemaCase.selections[0].label).locator("input").check();
      await expect(page.getByTestId("product-card").filter({ hasText: productName })).toBeVisible();
      await optionRow(filters, schemaCase.incompatible).locator("input").check();
      await expect(page.getByTestId("product-card")).toHaveCount(0);
      await filters.getByRole("button", { name: "Reset" }).click();
      await expect(page.getByTestId("product-card").filter({ hasText: productName })).toBeVisible();

      await page.getByRole("button", { name: "Submit Changes" }).click();
      await page
        .getByRole("dialog", { name: "Changes submitted successfully" })
        .getByRole("button", { name: "Continue Editing" })
        .click();
      const beforeEdit = await getSavedProduct(page, schemaCase.slug, productSlug);
      expect(beforeEdit.filters).toEqual(
        Object.fromEntries(
          schemaCase.selections.map((selection) => [
            selection.groupId,
            [selection.id],
          ]),
        ),
      );

      await page.getByRole("button", { name: "Edit Products" }).click();
      const manager = page.getByRole("dialog", {
        name: "Manage Products: " + schemaCase.name,
      });
      await manager.getByRole("button", { name: "Edit Product" }).click();
      editor = page.getByRole("dialog", { name: "Edit Product" });
      await expect(
        editor.getByLabel(schemaCase.selections[0].label, { exact: true }),
      ).toBeChecked();
      await editor.getByLabel(schemaCase.selections[0].label, { exact: true }).uncheck();
      await editor.getByLabel(schemaCase.alternate.label, { exact: true }).check();
      await editor.getByRole("button", { name: "Save Product" }).click();

      await expect(optionRow(filters, schemaCase.selections[0].label)).toContainText("0");
      await expect(optionRow(filters, schemaCase.alternate.label)).toContainText("1");
      await expect(page.getByTestId("product-card").filter({ hasText: productName })).toContainText(
        "Prototype product used to verify shared category filter schemas.",
      );

      await page.getByRole("button", { name: "Submit Changes" }).click();
      await page
        .getByRole("dialog", { name: "Changes submitted successfully" })
        .getByRole("button", { name: "Continue Editing" })
        .click();
      const afterEdit = await getSavedProduct(page, schemaCase.slug, productSlug);
      expect(afterEdit.filters[schemaCase.selections[0].groupId]).toEqual([
        schemaCase.alternate.id,
      ]);
      expect(afterEdit.detail).toEqual(beforeEdit.detail);
      expect(afterEdit.description).toBe(beforeEdit.description);
    });
  }

  test("mobile empty schema keeps long labels readable and the drawer keyboard accessible", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/products/custom-solutions");
    const trigger = page.getByRole("button", { name: "Filters" });
    await trigger.click();
    const drawer = page.getByRole("dialog", { name: "Filters" });
    await expect(drawer.getByText("Polariser and Viewing Mode", { exact: true })).toBeVisible();
    await expect(optionRow(drawer, "Polariser and Viewing Mode").locator("input")).toBeDisabled();
    await page.keyboard.press("Escape");
    await expect(drawer).toHaveCount(0);
    await expect(trigger).toBeFocused();

    const overflow = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }));
    expect(overflow.documentWidth).toBeLessThanOrEqual(overflow.viewportWidth);
  });
});
