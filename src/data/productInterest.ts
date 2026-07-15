import { canonicalCatalogue } from "@/content/catalogue";
import { megaMenus, productSectionRoutes } from "@/constants/navigation";

export type ProductInterestValue =
  | {
      mode: "catalogue-selection";
      parentCategoryId: string;
      subcategoryId?: string;
      productId?: string;
    }
  | {
      mode: "needs-guidance";
    };

export interface PublicInterestProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
}

export interface PublicInterestSubcategory {
  id: string;
  slug: string;
  name: string;
  shortName?: string;
  translationKey?: string;
  products: readonly PublicInterestProduct[];
}

export interface PublicInterestParentCategory {
  id: string;
  slug: string;
  name: string;
  shortName?: string;
  translationKey?: string;
  directProducts: readonly PublicInterestProduct[];
  subcategories: readonly PublicInterestSubcategory[];
}

export interface ResolvedProductInterest {
  value: ProductInterestValue;
  parentCategory?: PublicInterestParentCategory;
  subcategory?: PublicInterestSubcategory;
  product?: PublicInterestProduct;
}

const categoryTranslationKeysBySlug = new Map<string, string>();
const subcategoryTranslationKeysBySlug = new Map<string, string>();

megaMenus.products.sections.forEach((section) => {
  const categorySlug = productSectionRoutes[section.translationKey].split("/").at(-1);

  if (categorySlug) {
    categoryTranslationKeysBySlug.set(categorySlug, section.translationKey);
  }

  section.links.forEach((link) => {
    const subcategorySlug = link.href.split("/").at(-1);

    if (subcategorySlug) {
      subcategoryTranslationKeysBySlug.set(subcategorySlug, link.translationKey);
    }
  });
});

const publicCatalogue: readonly PublicInterestParentCategory[] =
  canonicalCatalogue.categories.map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    shortName: category.shortName,
    translationKey: categoryTranslationKeysBySlug.get(category.slug),
    directProducts: category.products.map(toPublicProduct),
    subcategories: category.subcategories.map((subcategory) => ({
      id: subcategory.id,
      slug: subcategory.slug,
      name: subcategory.name,
      shortName: subcategory.shortName,
      translationKey: subcategoryTranslationKeysBySlug.get(subcategory.slug),
      products: subcategory.products.map(toPublicProduct),
    })),
  }));

export function getPublicParentCategories() {
  return publicCatalogue;
}

export function getPublicParentCategory(parentCategoryId: string) {
  return publicCatalogue.find((category) => category.id === parentCategoryId);
}

export function getSubcategoriesForParent(parentCategoryId: string) {
  return getPublicParentCategory(parentCategoryId)?.subcategories ?? [];
}

export function getProductsForSelection(
  parentCategoryId: string,
  subcategoryId?: string,
) {
  const parentCategory = getPublicParentCategory(parentCategoryId);

  if (!parentCategory) {
    return [];
  }

  if (!subcategoryId) {
    return parentCategory.directProducts;
  }

  return (
    parentCategory.subcategories.find((subcategory) => subcategory.id === subcategoryId)
      ?.products ?? []
  );
}

export function resolveProductBySlug(productSlug: string): ResolvedProductInterest | undefined {
  for (const parentCategory of publicCatalogue) {
    for (const subcategory of parentCategory.subcategories) {
      const product = subcategory.products.find((item) => item.slug === productSlug);

      if (product) {
        return {
          value: {
            mode: "catalogue-selection",
            parentCategoryId: parentCategory.id,
            subcategoryId: subcategory.id,
            productId: product.id,
          },
          parentCategory,
          subcategory,
          product,
        };
      }
    }

    const directProduct = parentCategory.directProducts.find(
      (product) => product.slug === productSlug,
    );

    if (directProduct) {
      return {
        value: {
          mode: "catalogue-selection",
          parentCategoryId: parentCategory.id,
          productId: directProduct.id,
        },
        parentCategory,
        product: directProduct,
      };
    }
  }

  return undefined;
}

export function resolveProductInterest(
  value: ProductInterestValue,
): ResolvedProductInterest | undefined {
  if (value.mode === "needs-guidance") {
    return { value };
  }

  const parentCategory = getPublicParentCategory(value.parentCategoryId);

  if (!parentCategory) {
    return undefined;
  }

  const subcategory = value.subcategoryId
    ? parentCategory.subcategories.find((item) => item.id === value.subcategoryId)
    : undefined;

  if (value.subcategoryId && !subcategory) {
    return undefined;
  }

  const products = subcategory?.products ?? parentCategory.directProducts;
  const product = value.productId
    ? products.find((item) => item.id === value.productId)
    : undefined;

  if (value.productId && !product) {
    return undefined;
  }

  return {
    value,
    parentCategory,
    subcategory,
    product,
  };
}

export function getCanonicalProductInterestSummary(value: ProductInterestValue) {
  if (value.mode === "needs-guidance") {
    return "I'm not sure - I need guidance";
  }

  const resolved = resolveProductInterest(value);

  if (!resolved?.parentCategory) {
    return undefined;
  }

  return [
    resolved.parentCategory.name,
    resolved.subcategory?.name,
    resolved.product?.name,
  ]
    .filter(Boolean)
    .join(" > ");
}

function toPublicProduct(product: {
  id: string;
  slug: string;
  name: string;
  description: string;
}): PublicInterestProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
  };
}
