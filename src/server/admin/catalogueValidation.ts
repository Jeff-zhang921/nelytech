import type { CategoryFilterSchema } from "@/data/categoryFilterSchemas";
import type { CatalogueDraft } from "@/lib/adminCatalogueDraft";
import { containsSubstantialChinese } from "@/lib/productAdminCopy";

export type CatalogueValidationIssue = {
  path: string;
  message: string;
};

export type CatalogueValidationResult =
  | { valid: true; draft: CatalogueDraft; fields: [] }
  | { valid: false; fields: CatalogueValidationIssue[] };

const idPattern = /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/;
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const secretKeyPattern = /^(?:admin_?key|github_?token|access_?token|session_?secret|password|secret)$/i;
const placeholderValues = new Set([
  "Add a concise product type or series label in English.",
  "Enter the complete product name in English.",
  "Add a concise English introduction explaining the product and its main use.",
  "Describe suitable applications or use cases in English.",
  "Add the main product image.",
  "Add other views, details, drawings, or application images.",
  "Describe the product's function, features, benefits, and typical uses in English.",
  "Add technical or commercial information customers need for evaluation.",
  "Add an application in English.",
  "Add options such as colour, size, interface, brightness, or mounting method.",
  "Add datasheets, drawings, specifications, or other downloadable resources.",
]);

export function validateCatalogueDraftForPublish(
  input: unknown,
  filterSchemas: Record<string, CategoryFilterSchema>,
): CatalogueValidationResult {
  const fields: CatalogueValidationIssue[] = [];

  findSecretFields(input, "catalogue", fields);

  if (!isRecord(input) || !Array.isArray(input.categories)) {
    fields.push({ path: "categories", message: "The catalogue must contain a category list." });
    return { valid: false, fields };
  }

  if (input.categories.length < 1 || input.categories.length > 100) {
    fields.push({
      path: "categories",
      message: "The catalogue must contain between 1 and 100 parent categories.",
    });
  }

  const categoryIds = new Set<string>();
  const pageSlugs = new Set<string>();
  const productIds = new Set<string>();
  const productSlugs = new Set<string>();

  input.categories.forEach((categoryValue, categoryIndex) => {
    const path = `categories[${categoryIndex}]`;
    if (!isRecord(categoryValue)) {
      fields.push({ path, message: "Each parent category must be an object." });
      return;
    }

    validateIdentifier(categoryValue.id, `${path}.id`, categoryIds, fields);
    validateSlug(categoryValue.slug, `${path}.slug`, pageSlugs, fields);
    validateRequiredEnglishText(categoryValue.name, `${path}.name`, fields);
    validateRequiredEnglishText(categoryValue.description, `${path}.description`, fields);

    if (typeof categoryValue.slug === "string") {
      if (categoryValue.route !== `/products/${categoryValue.slug}`) {
        fields.push({ path: `${path}.route`, message: "The parent category route is invalid." });
      }
      validateParentSchema(categoryValue.slug, filterSchemas, `${path}.slug`, fields);
    }

    if (!Array.isArray(categoryValue.products)) {
      fields.push({ path: `${path}.products`, message: "Parent-category products must be a list." });
    } else {
      categoryValue.products.forEach((product, productIndex) =>
        validateProduct(
          product,
          `${path}.products[${productIndex}]`,
          typeof categoryValue.slug === "string" ? filterSchemas[categoryValue.slug] : undefined,
          productIds,
          productSlugs,
          fields,
        ),
      );
    }

    if (!Array.isArray(categoryValue.subcategories)) {
      fields.push({
        path: `${path}.subcategories`,
        message: "Parent-category subcategories must be a list.",
      });
      return;
    }

    if (categoryValue.subcategories.length > 500) {
      fields.push({ path: `${path}.subcategories`, message: "Too many subcategories were submitted." });
    }

    categoryValue.subcategories.forEach((subcategoryValue, subcategoryIndex) => {
      const subcategoryPath = `${path}.subcategories[${subcategoryIndex}]`;
      if (!isRecord(subcategoryValue)) {
        fields.push({ path: subcategoryPath, message: "Each subcategory must be an object." });
        return;
      }

      validateIdentifier(subcategoryValue.id, `${subcategoryPath}.id`, categoryIds, fields);
      validateSlug(subcategoryValue.slug, `${subcategoryPath}.slug`, pageSlugs, fields);
      validateRequiredEnglishText(subcategoryValue.name, `${subcategoryPath}.name`, fields);
      validateRequiredEnglishText(
        subcategoryValue.description,
        `${subcategoryPath}.description`,
        fields,
      );

      if (subcategoryValue.parentCategoryId !== categoryValue.id) {
        fields.push({
          path: `${subcategoryPath}.parentCategoryId`,
          message: "The subcategory does not belong to its declared parent category.",
        });
      }

      if (
        typeof subcategoryValue.slug === "string" &&
        filterSchemas[subcategoryValue.slug]
      ) {
        fields.push({
          path: `${subcategoryPath}.slug`,
          message: "Subcategories must inherit the Parent Category Filter Schema.",
        });
      }

      if (!Array.isArray(subcategoryValue.products)) {
        fields.push({
          path: `${subcategoryPath}.products`,
          message: "Subcategory products must be a list.",
        });
        return;
      }

      subcategoryValue.products.forEach((product, productIndex) =>
        validateProduct(
          product,
          `${subcategoryPath}.products[${productIndex}]`,
          typeof categoryValue.slug === "string" ? filterSchemas[categoryValue.slug] : undefined,
          productIds,
          productSlugs,
          fields,
        ),
      );
    });
  });

  return fields.length > 0
    ? { valid: false, fields: deduplicateIssues(fields) }
    : { valid: true, draft: input as CatalogueDraft, fields: [] };
}

function validateProduct(
  value: unknown,
  path: string,
  schema: CategoryFilterSchema | undefined,
  productIds: Set<string>,
  productSlugs: Set<string>,
  fields: CatalogueValidationIssue[],
) {
  if (!isRecord(value)) {
    fields.push({ path, message: "Each product must be an object." });
    return;
  }

  validateIdentifier(value.id, `${path}.id`, productIds, fields);
  validateSlug(value.slug, `${path}.slug`, productSlugs, fields);
  validateRequiredEnglishText(value.partNumber, `${path}.partNumber`, fields);
  validateRequiredEnglishText(value.name, `${path}.name`, fields);
  validateRequiredEnglishText(value.description, `${path}.description`, fields);
  validateImageSource(value.image, `${path}.image`, fields);
  validateOptionalEnglishText(value.imageAlt, `${path}.imageAlt`, fields);

  if (!Array.isArray(value.specs) || value.specs.some((item) => typeof item !== "string")) {
    fields.push({ path: `${path}.specs`, message: "Product-card specifications must be text values." });
  } else {
    value.specs.forEach((item, index) =>
      validateOptionalEnglishText(item, `${path}.specs[${index}]`, fields),
    );
  }

  validateFilters(value.filters, `${path}.filters`, schema, fields);
  validateProductDetail(value.detail, `${path}.detail`, fields);

  if (typeof value.href === "string" && typeof value.slug === "string") {
    if (value.href !== `/products/${value.slug}`) {
      fields.push({ path: `${path}.href`, message: "The product route is invalid." });
    }
  }
}

function validateFilters(
  value: unknown,
  path: string,
  schema: CategoryFilterSchema | undefined,
  fields: CatalogueValidationIssue[],
) {
  if (!schema) {
    fields.push({ path, message: "The product Parent Category has no Filter Schema." });
    return;
  }
  if (!isRecord(value)) {
    fields.push({ path, message: "Product filter values must be an object." });
    return;
  }

  const groupById = new Map(schema.groups.map((group) => [group.id, group]));
  Object.keys(value).forEach((groupId) => {
    if (!groupById.has(groupId)) {
      fields.push({
        path: `${path}.${groupId}`,
        message: "The filter group does not belong to the Parent Category Filter Schema.",
      });
    }
  });

  schema.groups.forEach((group) => {
    const selected = value[group.id];
    if (!Array.isArray(selected) || selected.some((option) => typeof option !== "string")) {
      fields.push({ path: `${path}.${group.id}`, message: "Filter selections must be a list." });
      return;
    }
    if (group.required && selected.length === 0) {
      fields.push({ path: `${path}.${group.id}`, message: "Select at least one required filter option." });
    }
    if (group.selectionMode === "single" && selected.length > 1) {
      fields.push({ path: `${path}.${group.id}`, message: "Select only one option for this filter." });
    }

    const validOptions = new Set(group.options.map((option) => option.id));
    selected.forEach((option, optionIndex) => {
      if (!validOptions.has(option)) {
        fields.push({
          path: `${path}.${group.id}[${optionIndex}]`,
          message: "The selected filter option does not belong to the Parent Category schema.",
        });
      }
    });
  });
}

function validateProductDetail(
  value: unknown,
  path: string,
  fields: CatalogueValidationIssue[],
) {
  if (!isRecord(value)) {
    fields.push({ path, message: "Product Detail data must be an object." });
    return;
  }

  ["productTypeLabel", "introduction", "suitableFor", "specificationNote"].forEach((key) =>
    validateOptionalEnglishText(value[key], `${path}.${key}`, fields),
  );

  const detailIds = new Set<string>();
  validateOrderedItems(value.images, `${path}.images`, detailIds, fields, (item, itemPath, issues) => {
    validateImageSource(item.src, `${itemPath}.src`, issues);
    validateOptionalEnglishText(item.alt, `${itemPath}.alt`, issues);
    validateOptionalEnglishText(item.label, `${itemPath}.label`, issues);
  });
  validateOrderedItems(value.summary, `${path}.summary`, detailIds, fields, validateSpecification);
  validateOrderedItems(
    value.specifications,
    `${path}.specifications`,
    detailIds,
    fields,
    validateSpecification,
  );
  validateOrderedItems(
    value.descriptionParagraphs,
    `${path}.descriptionParagraphs`,
    detailIds,
    fields,
    validateTextItem,
  );
  validateOrderedItems(
    value.applications,
    `${path}.applications`,
    detailIds,
    fields,
    validateTextItem,
  );
  validateOrderedItems(value.optionGroups, `${path}.optionGroups`, detailIds, fields, (group, groupPath, issues) => {
    validateOptionalEnglishText(group.label, `${groupPath}.label`, issues);
    validateOrderedItems(group.values, `${groupPath}.values`, detailIds, issues, validateTextItem);
  });
  validateOrderedItems(value.downloads, `${path}.downloads`, detailIds, fields, (item, itemPath, issues) => {
    validateOptionalEnglishText(item.label, `${itemPath}.label`, issues);
    validateOptionalEnglishText(item.description, `${itemPath}.description`, issues);
    if (item.href !== undefined && (typeof item.href !== "string" || !isSafeResourceHref(item.href))) {
      issues.push({ path: `${itemPath}.href`, message: "The download link is invalid." });
    }
  });
}

function validateOrderedItems(
  value: unknown,
  path: string,
  ids: Set<string>,
  fields: CatalogueValidationIssue[],
  validateItem: (
    item: Record<string, unknown>,
    path: string,
    fields: CatalogueValidationIssue[],
  ) => void,
) {
  if (!Array.isArray(value)) {
    fields.push({ path, message: "This Product Detail section must be a list." });
    return;
  }

  value.forEach((itemValue, index) => {
    const itemPath = `${path}[${index}]`;
    if (!isRecord(itemValue)) {
      fields.push({ path: itemPath, message: "Each Product Detail item must be an object." });
      return;
    }
    validateIdentifier(itemValue.id, `${itemPath}.id`, ids, fields);
    if (!Number.isInteger(itemValue.order) || (itemValue.order as number) < 0) {
      fields.push({ path: `${itemPath}.order`, message: "Product Detail ordering is invalid." });
    }
    validateItem(itemValue, itemPath, fields);
  });
}

function validateSpecification(
  item: Record<string, unknown>,
  path: string,
  fields: CatalogueValidationIssue[],
) {
  validateOptionalEnglishText(item.label, `${path}.label`, fields);
  validateOptionalEnglishText(item.value, `${path}.value`, fields);
}

function validateTextItem(
  item: Record<string, unknown>,
  path: string,
  fields: CatalogueValidationIssue[],
) {
  validateOptionalEnglishText(item.text, `${path}.text`, fields);
}

function validateIdentifier(
  value: unknown,
  path: string,
  values: Set<string>,
  fields: CatalogueValidationIssue[],
) {
  if (typeof value !== "string" || !idPattern.test(value)) {
    fields.push({ path, message: "Use a stable alphanumeric identifier." });
    return;
  }
  if (values.has(value)) fields.push({ path, message: "This identifier is already in use." });
  values.add(value);
}

function validateSlug(
  value: unknown,
  path: string,
  values: Set<string>,
  fields: CatalogueValidationIssue[],
) {
  if (typeof value !== "string" || value.length > 100 || !slugPattern.test(value)) {
    fields.push({ path, message: "Use a lowercase, hyphen-separated page slug." });
    return;
  }
  if (values.has(value)) fields.push({ path, message: "This page slug is already in use." });
  values.add(value);
}

function validateRequiredEnglishText(
  value: unknown,
  path: string,
  fields: CatalogueValidationIssue[],
) {
  if (typeof value !== "string" || !value.trim() || value.length > 10_000) {
    fields.push({ path, message: "This required English field is incomplete." });
    return;
  }
  validateEnglishText(value, path, fields);
}

function validateOptionalEnglishText(
  value: unknown,
  path: string,
  fields: CatalogueValidationIssue[],
) {
  if (value === undefined || value === null || value === "") return;
  if (typeof value !== "string" || value.length > 20_000) {
    fields.push({ path, message: "This field must contain valid text." });
    return;
  }
  validateEnglishText(value, path, fields);
}

function validateEnglishText(value: string, path: string, fields: CatalogueValidationIssue[]) {
  if (containsSubstantialChinese(value)) {
    fields.push({ path, message: "Product content supports English only." });
  }
  if (placeholderValues.has(value.trim())) {
    fields.push({ path, message: "Replace the editor placeholder before publishing." });
  }
}

function validateImageSource(
  value: unknown,
  path: string,
  fields: CatalogueValidationIssue[],
) {
  if (typeof value !== "string" || !isSafeResourceHref(value)) {
    fields.push({ path, message: "The product image path is invalid." });
  }
}

function isSafeResourceHref(value: string) {
  const normalized = value.trim();
  if (!normalized || /^(?:blob|data|upload):/i.test(normalized) || hasTraversal(normalized)) {
    return false;
  }
  if (normalized.startsWith("/")) return !normalized.startsWith("//");

  try {
    const url = new URL(normalized);
    return (url.protocol === "https:" || url.protocol === "http:") && !url.username && !url.password;
  } catch {
    return false;
  }
}

function hasTraversal(value: string) {
  try {
    return decodeURIComponent(value).split(/[\\/]/).includes("..");
  } catch {
    return true;
  }
}

function validateParentSchema(
  parentSlug: string,
  schemas: Record<string, CategoryFilterSchema>,
  path: string,
  fields: CatalogueValidationIssue[],
) {
  const schema = schemas[parentSlug];
  if (!schema || schema.parentCategoryId !== parentSlug) {
    fields.push({ path, message: "The Parent Category Filter Schema is missing or invalid." });
  }
}

function findSecretFields(
  value: unknown,
  path: string,
  fields: CatalogueValidationIssue[],
) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => findSecretFields(item, `${path}[${index}]`, fields));
    return;
  }
  if (!isRecord(value)) return;

  Object.entries(value).forEach(([key, child]) => {
    if (secretKeyPattern.test(key)) {
      fields.push({ path: `${path}.${key}`, message: "Secret fields cannot be published." });
      return;
    }
    findSecretFields(child, `${path}.${key}`, fields);
  });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deduplicateIssues(fields: CatalogueValidationIssue[]) {
  const seen = new Set<string>();
  return fields.filter((field) => {
    const key = `${field.path}\u0000${field.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
