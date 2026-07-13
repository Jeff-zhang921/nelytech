"use client";

import {
  createEmptyFilterValues,
  getFilterOptionLabel,
  type CategoryFilterSchema,
  type FilterSelectionMode,
  type ProductFilterValues,
} from "@/data/categoryFilterSchemas";

export type ProductFilterKey = string;

export interface ProductFilterState {
  query: string;
  selected: ProductFilterValues;
}

export interface FilterableProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  previewImage?: string;
  imageAlt?: string;
  filters: ProductFilterValues;
}

export interface ProductFilterSection {
  key: ProductFilterKey;
  label: string;
  selectionMode: FilterSelectionMode;
}

export interface ProductFilterOption {
  value: string;
  label: string;
  count: number;
  selected: boolean;
  disabled: boolean;
}

export interface ProductFilterSectionWithOptions extends ProductFilterSection {
  options: ProductFilterOption[];
}

export type ProductFilterValidationIssue = {
  code: "required" | "unknown-group" | "unknown-option" | "single-selection";
  groupId: string;
  optionId?: string;
  message: string;
};

export function createEmptyFilterState(schema: CategoryFilterSchema): ProductFilterState {
  return {
    query: "",
    selected: createEmptyFilterValues(schema),
  };
}

export function createFilterStateFromSearchParams(
  searchParams: URLSearchParams,
  schema: CategoryFilterSchema,
): ProductFilterState {
  return {
    query: searchParams.get("q")?.trim() ?? "",
    selected: Object.fromEntries(
      schema.groups.map((group) => [
        group.id,
        searchParams
          .getAll(group.id)
          .flatMap((value) => value.split(","))
          .map((value) => value.trim())
          .filter((value) => group.options.some((option) => option.id === value)),
      ]),
    ),
  };
}

export function createSearchParamsFromFilterState(
  state: ProductFilterState,
  schema: CategoryFilterSchema,
) {
  const params = new URLSearchParams();
  const query = state.query.trim();

  if (query) params.set("q", query);

  schema.groups.forEach((group) => {
    (state.selected[group.id] ?? []).forEach((value) => {
      params.append(group.id, value);
    });
  });

  return params;
}

export function filterProducts<TProduct extends FilterableProduct>(
  products: readonly TProduct[],
  state: ProductFilterState,
  schema: CategoryFilterSchema,
) {
  return products.filter(
    (product) =>
      matchesSearch(product, state.query, schema) &&
      matchesSelectedFilters(product, state.selected, schema),
  );
}

export function buildFilterSections(
  products: readonly FilterableProduct[],
  state: ProductFilterState,
  schema: CategoryFilterSchema,
  options: { disableUnavailable?: boolean } = {},
): ProductFilterSectionWithOptions[] {
  const { disableUnavailable = true } = options;

  return schema.groups.map((group) => ({
    key: group.id,
    label: group.label,
    selectionMode: group.selectionMode,
    options: group.options.map((option) => {
      const selected = (state.selected[group.id] ?? []).includes(option.id);
      const count = products.filter(
        (product) =>
          matchesSearch(product, state.query, schema) &&
          matchesSelectedFilters(product, state.selected, schema, group.id) &&
          (product.filters[group.id] ?? []).includes(option.id),
      ).length;

      return {
        value: option.id,
        label: option.label,
        count,
        selected,
        disabled: disableUnavailable && count === 0 && !selected,
      };
    }),
  }));
}

export function calculateFilterOptionCounts(
  products: readonly FilterableProduct[],
  schema: CategoryFilterSchema,
) {
  const state = createEmptyFilterState(schema);
  return Object.fromEntries(
    buildFilterSections(products, state, schema).map((section) => [
      section.key,
      Object.fromEntries(section.options.map((option) => [option.value, option.count])),
    ]),
  );
}

export function countActiveFilters(
  state: ProductFilterState,
  schema: CategoryFilterSchema,
) {
  return schema.groups.reduce(
    (count, group) => count + (state.selected[group.id]?.length ?? 0),
    0,
  );
}

export function hasActiveFilters(
  state: ProductFilterState,
  schema: CategoryFilterSchema,
) {
  return state.query.trim().length > 0 || countActiveFilters(state, schema) > 0;
}

export function matchesSelectedFilters(
  product: FilterableProduct,
  selected: ProductFilterValues,
  schema: CategoryFilterSchema,
  excludeGroupId?: string,
) {
  return schema.groups.every((group) => {
    if (group.id === excludeGroupId) return true;

    const selectedValues = selected[group.id] ?? [];
    if (selectedValues.length === 0) return true;

    const productValues = product.filters[group.id] ?? [];
    return selectedValues.some((value) => productValues.includes(value));
  });
}

export function validateProductFilterSelections(
  filters: ProductFilterValues,
  schema: CategoryFilterSchema,
) {
  return validateProductFilterValues(filters, schema)
    .filter((issue) => issue.code === "required")
    .map((issue) => issue.groupId);
}

export function validateProductFilterValues(
  filters: ProductFilterValues,
  schema: CategoryFilterSchema,
): ProductFilterValidationIssue[] {
  const issues: ProductFilterValidationIssue[] = [];
  const groupsById = new Map(schema.groups.map((group) => [group.id, group]));
  const schemaName = getFilterSchemaName(schema.parentCategoryId);

  Object.entries(filters).forEach(([groupId, selectedValues]) => {
    const group = groupsById.get(groupId);
    const uniqueValues = Array.from(new Set(selectedValues));

    if (!group) {
      if (uniqueValues.length > 0) {
        issues.push({
          code: "unknown-group",
          groupId,
          message: `The “${groupId}” filter group does not belong to the ${schemaName} filter schema.`,
        });
      }
      return;
    }

    const validOptionIds = new Set(group.options.map((option) => option.id));
    uniqueValues.forEach((optionId) => {
      if (!validOptionIds.has(optionId)) {
        issues.push({
          code: "unknown-option",
          groupId,
          optionId,
          message: `The “${optionId}” filter option does not belong to the ${schemaName} filter schema.`,
        });
      }
    });

    const validSelections = uniqueValues.filter((optionId) => validOptionIds.has(optionId));
    if (group.selectionMode === "single" && validSelections.length > 1) {
      issues.push({
        code: "single-selection",
        groupId,
        message: `${group.label} accepts only one selection.`,
      });
    }
  });

  schema.groups.forEach((group) => {
    const validOptionIds = new Set(group.options.map((option) => option.id));
    const validSelections = (filters[group.id] ?? []).filter((optionId) =>
      validOptionIds.has(optionId),
    );

    if (group.required && validSelections.length === 0) {
      issues.push({
        code: "required",
        groupId: group.id,
        message: `${group.label} requires at least one selection.`,
      });
    }
  });

  return issues;
}

function matchesSearch(
  product: FilterableProduct,
  query: string,
  schema: CategoryFilterSchema,
) {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return true;

  const filterLabels = schema.groups.flatMap((group) =>
    (product.filters[group.id] ?? []).map((optionId) =>
      getFilterOptionLabel(schema, group.id, optionId),
    ),
  );

  return normalize(
    [product.name, product.description, ...filterLabels].join(" "),
  ).includes(normalizedQuery);
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function getFilterSchemaName(parentCategoryId: string) {
  const names: Record<string, string> = {
    "lcd-panels": "LCD Panels",
    "lcd-modules": "LCD Modules",
    "assembly-technologies": "Assembly Technologies",
    "custom-solutions": "Advanced & Custom Solutions",
    all: "All Products",
  };

  return names[parentCategoryId] ?? parentCategoryId;
}
