import { canonicalCatalogue } from "@/content/catalogue";
import { resolveParentCategorySlug } from "@/data/productCategoryHierarchy";

export type FilterSelectionMode = "single" | "multiple";

export type ProductFilterOptionDefinition = {
  id: string;
  label: string;
};

export type ProductFilterGroupDefinition = {
  id: string;
  label: string;
  selectionMode: FilterSelectionMode;
  required: boolean;
  options: ProductFilterOptionDefinition[];
};

export type CategoryFilterSchema = {
  parentCategoryId: string;
  groups: ProductFilterGroupDefinition[];
};

export type ProductFilterValues = Record<string, string[]>;

export const parentCategoryFilterSchemas: Record<string, CategoryFilterSchema> =
  canonicalCatalogue.filterSchemas;

const emptySchemas = new Map<string, CategoryFilterSchema>();

export function getFilterSchemaForCatalogueNode(
  nodeId: string,
  parentCategoryId?: string,
): CategoryFilterSchema {
  const resolvedParentCategoryId = resolveParentCategorySlug(nodeId, parentCategoryId);
  const schema = parentCategoryFilterSchemas[resolvedParentCategoryId];
  if (schema) return schema;

  const existing = emptySchemas.get(resolvedParentCategoryId);
  if (existing) return existing;

  const emptySchema = { parentCategoryId: resolvedParentCategoryId, groups: [] };
  emptySchemas.set(resolvedParentCategoryId, emptySchema);
  return emptySchema;
}

export function createEmptyFilterValues(schema: CategoryFilterSchema): ProductFilterValues {
  return Object.fromEntries(schema.groups.map((group) => [group.id, []]));
}

export function getFilterOptionLabel(
  schema: CategoryFilterSchema,
  groupId: string,
  optionId: string,
) {
  return (
    schema.groups
      .find((group) => group.id === groupId)
      ?.options.find((option) => option.id === optionId)?.label ?? optionId
  );
}

export function normalizeFilterValues(
  schema: CategoryFilterSchema,
  values: ProductFilterValues | undefined,
) {
  const normalized = createEmptyFilterValues(schema);

  Object.entries(values ?? {}).forEach(([groupId, sourceValues]) => {
    if (!schema.groups.some((group) => group.id === groupId)) {
      normalized[groupId] = Array.from(new Set(sourceValues));
    }
  });

  schema.groups.forEach((groupDefinition) => {
    const sourceValues = values?.[groupDefinition.id] ?? [];
    const optionIdByLabel = new Map(
      groupDefinition.options.map((option) => [option.label, option.id]),
    );
    const validIds = new Set(groupDefinition.options.map((option) => option.id));

    normalized[groupDefinition.id] = Array.from(
      new Set(
        sourceValues
          .map((value) =>
            validIds.has(value) ? value : optionIdByLabel.get(value) ?? value,
          )
          .filter(Boolean),
      ),
    );
  });

  return normalized;
}

export function filterValuesFromLabels(
  nodeId: string,
  values: Record<string, string[]>,
  parentCategoryId?: string,
) {
  return normalizeFilterValues(
    getFilterSchemaForCatalogueNode(nodeId, parentCategoryId),
    values,
  );
}
