import catalogueSource from "./products.json";

import type { CategoryFilterSchema } from "@/data/categoryFilterSchemas";
import type { CatalogueDraft } from "@/lib/adminCatalogueDraft";

export type CanonicalCatalogue = CatalogueDraft & {
  version: number;
  allProducts: {
    slug: "all";
    name: string;
    shortName: string;
    description: string;
  };
  filterSchemas: Record<string, CategoryFilterSchema>;
};

export const canonicalCatalogue = catalogueSource as CanonicalCatalogue;

