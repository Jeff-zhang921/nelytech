export const productCategoryChildren = {
  "lcd-panels": ["tn", "htn", "stn", "fstn", "va"],
  "lcd-modules": ["character-modules", "graphic-modules", "custom-segment"],
  "assembly-technologies": ["cob", "cog", "tab", "cof"],
  "custom-solutions": ["tft-modules", "custom-pcba-mcu", "touch-panels"],
} as const satisfies Record<string, readonly string[]>;

export const topLevelCategorySlugs = [
  "lcd-panels",
  "lcd-modules",
  "assembly-technologies",
  "custom-solutions",
] as const;

const parentSlugByCategory = Object.entries(productCategoryChildren).reduce<
  Record<string, string>
>((parents, [parentSlug, childSlugs]) => {
  childSlugs.forEach((childSlug) => {
    parents[childSlug] = parentSlug;
  });

  return parents;
}, {});

export function getParentCategorySlug(nodeSlug: string) {
  return parentSlugByCategory[nodeSlug];
}

export function resolveParentCategorySlug(
  nodeSlug: string,
  explicitParentSlug?: string,
) {
  if (nodeSlug === "all") {
    return "all";
  }

  return explicitParentSlug ?? getParentCategorySlug(nodeSlug) ?? nodeSlug;
}
