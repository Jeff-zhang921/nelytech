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

const sharedApplicationOptionDefinitions = [
  ["industrial-control", "Industrial Control"],
  ["instrumentation", "Instrumentation"],
  ["medical-equipment", "Medical Equipment"],
  ["consumer-electronics", "Consumer Electronics"],
  ["automotive", "Automotive"],
  ["custom-application", "Custom Application"],
] as const;

const tnApplicationLabels = [
  "Counters",
  "Low-power controls",
  "Meters",
  "Embedded equipment",
  "Status text",
  "HVAC controls",
  "Thermostats",
  "Industrial meters",
  "Appliances",
  "Device status",
  "Handheld instruments",
  "Portable controls",
];

const lcdPanelApplicationLabels = [
  "Icon displays",
  "Numeric displays",
  "Instrument interfaces",
  "Graphic interfaces",
  "Text displays",
  "High-readability displays",
  "Dark-face interfaces",
  "Premium controls",
  "Application-specific layouts",
  "Custom icons",
];

const lcdPanelsSchema = legacyDisplaySchema(
  "lcd-panels",
  [...lcdPanelApplicationLabels, ...tnApplicationLabels],
  [
    "Glass only",
    "Controller-ready",
    "FPC",
    "Pin",
    "Custom",
    "6800 Parallel",
    "Heat seal",
    "Elastomer",
  ],
  [
    "Segment",
    "Graphic",
    "7-segment",
    "Numeric",
    "16x2",
    "Character module",
    "Custom segment",
    "Icon segment",
  ],
);

export const parentCategoryFilterSchemas: Record<string, CategoryFilterSchema> = {
  all: legacyDisplaySchema(
    "all",
    [...tnApplicationLabels, ...lcdPanelApplicationLabels],
    [
      "Glass only",
      "6800 Parallel",
      "FPC",
      "Heat seal",
      "Elastomer",
      "Pin",
      "Controller-ready",
      "Custom",
    ],
    [
      "7-segment",
      "Numeric",
      "16x2",
      "Character module",
      "Custom segment",
      "Icon segment",
      "Segment",
      "Graphic",
    ],
  ),
  "lcd-panels": lcdPanelsSchema,
  "lcd-modules": {
    parentCategoryId: "lcd-modules",
    groups: [
      group("module-type", "Module Type", [
        ["character-lcd-module", "Character LCD Module"],
        ["graphic-lcd-module", "Graphic LCD Module"],
        ["segment-lcd-module", "Segment LCD Module"],
        ["cog-module", "COG Module"],
        ["cob-module", "COB Module"],
        ["tab-module", "TAB Module"],
      ]),
      group("display-format", "Display Format", [
        ["character", "Character"],
        ["graphic", "Graphic"],
        ["numeric-segment", "Numeric / Segment"],
        ["custom-format", "Custom Format"],
      ]),
      group("interface", "Interface", [
        ["parallel", "Parallel"],
        ["spi", "SPI"],
        ["i2c", "I\u00b2C"],
        ["uart", "UART"],
        ["custom-interface", "Custom Interface"],
      ]),
      group("backlight", "Backlight", [
        ["no-backlight", "No Backlight"],
        ["led-backlight", "LED Backlight"],
        ["el-backlight", "EL Backlight"],
        ["custom-backlight", "Custom Backlight"],
      ]),
      group("application", "Application", sharedApplicationOptionDefinitions),
    ],
  },
  "assembly-technologies": {
    parentCategoryId: "assembly-technologies",
    groups: [
      group("assembly-method", "Assembly Method", [
        ["cob", "COB"],
        ["cog", "COG"],
        ["tab", "TAB"],
        ["smt", "SMT"],
        ["heat-seal", "Heat Seal"],
        ["elastomeric-connector", "Elastomeric Connector"],
        ["custom-assembly", "Custom Assembly"],
      ]),
      group("interconnection-type", "Interconnection Type", [
        ["fpc", "FPC"],
        ["heat-seal-connector", "Heat Seal Connector"],
        ["zebra-connector", "Zebra Connector"],
        ["pin-header", "Pin Header"],
        ["wire-harness", "Wire Harness"],
        ["custom-connector", "Custom Connector"],
      ]),
      group("integration-scope", "Integration Scope", [
        ["lcd-only", "LCD Only"],
        ["lcd-pcb", "LCD + PCB"],
        ["lcd-backlight", "LCD + Backlight"],
        ["lcd-touch", "LCD + Touch"],
        ["complete-display-module", "Complete Display Module"],
      ]),
      group("production-stage", "Production Stage", [
        ["prototype", "Prototype"],
        ["pilot-run", "Pilot Run"],
        ["mass-production", "Mass Production"],
      ]),
      group("application", "Application", sharedApplicationOptionDefinitions),
    ],
  },
  "custom-solutions": {
    parentCategoryId: "custom-solutions",
    groups: [
      group("solution-type", "Solution Type", [
        ["custom-lcd-panel", "Custom LCD Panel"],
        ["custom-lcd-module", "Custom LCD Module"],
        ["touch-integration", "Touch Integration"],
        ["optical-bonding", "Optical Bonding"],
        ["custom-backlight", "Custom Backlight"],
        ["complete-display-assembly", "Complete Display Assembly"],
      ]),
      group("customisation-area", "Customisation Area", [
        ["size-and-shape", "Size and Shape"],
        ["segment-and-icon-design", "Segment and Icon Design"],
        ["interface", "Interface"],
        ["backlight", "Backlight"],
        ["connector-and-fpc", "Connector and FPC"],
        ["polariser-and-viewing-mode", "Polariser and Viewing Mode"],
        ["mechanical-integration", "Mechanical Integration"],
      ]),
      group("project-stage", "Project Stage", [
        ["concept-development", "Concept Development"],
        ["engineering-prototype", "Engineering Prototype"],
        ["design-validation", "Design Validation"],
        ["mass-production", "Mass Production"],
      ]),
      group("production-volume", "Production Volume", [
        ["prototype-quantity", "Prototype Quantity"],
        ["low-volume", "Low Volume"],
        ["medium-volume", "Medium Volume"],
        ["high-volume", "High Volume"],
      ]),
      group("application", "Application", sharedApplicationOptionDefinitions),
    ],
  },
};

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

function legacyDisplaySchema(
  parentCategoryId: string,
  applicationLabels: string[],
  interfaceLabels: string[],
  formatLabels: string[],
): CategoryFilterSchema {
  return {
    parentCategoryId,
    groups: [
      group("application", "Application", legacyOptions(applicationLabels)),
      group("interface", "Interface / connection", legacyOptions(interfaceLabels)),
      group("format", "Format", legacyOptions(formatLabels)),
    ],
  };
}

function legacyOptions(labels: string[]) {
  return Array.from(new Set(labels)).map(
    (label) => [toFilterOptionId(label), label] as const,
  );
}

function toFilterOptionId(label: string) {
  return label
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function group(
  id: string,
  label: string,
  optionDefinitions: readonly (readonly [string, string])[],
): ProductFilterGroupDefinition {
  return {
    id,
    label,
    selectionMode: "multiple",
    required: true,
    options: options(optionDefinitions),
  };
}

function options(optionDefinitions: readonly (readonly [string, string])[]) {
  return optionDefinitions.map(([id, label]) => ({ id, label }));
}
