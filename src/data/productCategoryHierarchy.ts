import { canonicalCatalogue } from "@/content/catalogue";

export const productCategoryChildren = Object.fromEntries(
  canonicalCatalogue.categories.map((category) => [
    category.slug,
    category.subcategories.map((subcategory) => subcategory.slug),
  ]),
) as Record<string, readonly string[]>;

export const topLevelCategorySlugs = canonicalCatalogue.categories.map(
  (category) => category.slug,
);

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
