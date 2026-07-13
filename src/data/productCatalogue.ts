import type { FilterableProduct } from "@/components/products/productFiltering";
import { canonicalCatalogue } from "@/content/catalogue";
import {
  getParentCategorySlug,
  productCategoryChildren,
  topLevelCategorySlugs,
} from "@/data/productCategoryHierarchy";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type CatalogueProduct = FilterableProduct & {
  partNumber: string;
  href?: string;
  specs: string[];
};

export type ProductCategoryPageConfig = {
  slug: string;
  name: string;
  shortName?: string;
  description: string;
  breadcrumbItems: BreadcrumbItem[];
  products: CatalogueProduct[];
  directProducts?: CatalogueProduct[];
};

export type ProductCategoryNavigationItem = {
  slug: string;
  name: string;
  shortName?: string;
  route: string;
};

export type ProductCategoryNavigationState = {
  backItem?: ProductCategoryNavigationItem;
  menuLabel?: string;
  menuAriaLabel?: string;
  menuItems: ProductCategoryNavigationItem[];
};

export type CatalogueProductEntry = {
  product: CatalogueProduct;
  categorySlug: string;
};

export type ProductCatalogueHierarchyGroup = {
  category: ProductCategoryPageConfig;
  subcategories: ProductCategoryPageConfig[];
};

export const PRODUCT_CATALOGUE_RETURN_QUERY_PARAM = "returnQuery";

const catalogueProductEntries: CatalogueProductEntry[] = canonicalCatalogue.categories.flatMap(
  (category) => [
    ...category.products.map((product) => ({
      product: toCatalogueProduct(product),
      categorySlug: category.slug,
    })),
    ...category.subcategories.flatMap((subcategory) =>
      subcategory.products.map((product) => ({
        product: toCatalogueProduct(product),
        categorySlug: subcategory.slug,
      })),
    ),
  ],
);

export const allCatalogueProducts = uniqueProducts(
  catalogueProductEntries.map(({ product }) => product),
);

export const allProductsPageConfig: ProductCategoryPageConfig = {
  ...canonicalCatalogue.allProducts,
  breadcrumbItems: [{ label: "Products" }],
  products: allCatalogueProducts,
};

export const productCategoryConfigs: Record<string, ProductCategoryPageConfig> =
  Object.fromEntries(
    canonicalCatalogue.categories.flatMap((category) => {
      const directProducts = category.products.map(toCatalogueProduct);
      const childConfigs = category.subcategories.map((subcategory) => ({
        slug: subcategory.slug,
        name: subcategory.name,
        shortName: subcategory.shortName,
        description: subcategory.description,
        breadcrumbItems: [
          { label: "Products", href: "/products" },
          {
            label: category.shortName ?? category.name,
            href: `/products/${category.slug}`,
          },
          { label: subcategory.name },
        ],
        products: subcategory.products.map(toCatalogueProduct),
      })) satisfies ProductCategoryPageConfig[];
      const childProducts = childConfigs.flatMap((subcategory) => subcategory.products);
      const parentConfig: ProductCategoryPageConfig = {
        slug: category.slug,
        name: category.name,
        shortName: category.shortName,
        description: category.description,
        breadcrumbItems: [
          { label: "Products", href: "/products" },
          { label: category.name },
        ],
        products: uniqueProducts([...directProducts, ...childProducts]),
        directProducts,
      };

      return [
        [category.slug, parentConfig],
        ...childConfigs.map((subcategory) => [subcategory.slug, subcategory] as const),
      ];
    }),
  );

export function getProductCategoryConfig(slug: string) {
  return productCategoryConfigs[slug];
}

export function getProductCatalogueHierarchy(): ProductCatalogueHierarchyGroup[] {
  return topLevelCategorySlugs.map((categorySlug) => ({
    category: productCategoryConfigs[categorySlug],
    subcategories: (productCategoryChildren[categorySlug] ?? []).map(
      (subcategorySlug) => productCategoryConfigs[subcategorySlug],
    ),
  }));
}

export function createProductSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCatalogueProductHref(product: Pick<CatalogueProduct, "href" | "name">) {
  return product.href ?? `/products/${createProductSlug(product.name)}`;
}

export function createProductDetailHref(
  product: Pick<CatalogueProduct, "href" | "name">,
  returnQuery?: string,
) {
  const href = getCatalogueProductHref(product);

  if (!returnQuery) {
    return href;
  }

  const searchParams = new URLSearchParams();
  searchParams.set(PRODUCT_CATALOGUE_RETURN_QUERY_PARAM, returnQuery);

  return `${href}?${searchParams.toString()}`;
}

export function getCatalogueProductEntryBySlug(slug: string) {
  return catalogueProductEntries.find(
    ({ product }) => getCatalogueProductHref(product).split("/").pop() === slug,
  );
}

export function getProductCategoryNavigationState(
  slug: string,
): ProductCategoryNavigationState {
  if (slug === "all") {
    return {
      menuLabel: "View categories",
      menuAriaLabel: "View product categories",
      menuItems: topLevelCategorySlugs.map(createCategoryNavigationItem),
    };
  }

  const config = getProductCategoryConfig(slug);

  if (!config) {
    return { menuItems: [] };
  }

  const parentSlug = getParentCategorySlug(slug);
  const parentItem = parentSlug
    ? createCategoryNavigationItem(parentSlug)
    : {
        slug: "all",
        name: "Products",
        shortName: "Products",
        route: "/products",
      };
  const childSlugs = productCategoryChildren[slug] ?? [];

  return {
    backItem: parentItem,
    menuLabel: childSlugs.length > 0 ? "View subcategories" : undefined,
    menuAriaLabel:
      childSlugs.length > 0
        ? `View ${config.shortName ?? config.name} subcategories`
        : undefined,
    menuItems: childSlugs.map(createCategoryNavigationItem),
  };
}

export function isProductDetailPathname(pathname: string) {
  const normalizedPathname = pathname.replace(/\/+$/, "") || "/";
  const productRouteMatch = normalizedPathname.match(/^\/products\/([^/]+)$/);

  if (!productRouteMatch) {
    return false;
  }

  return !getProductCategoryConfig(productRouteMatch[1]);
}

export function isProductCataloguePathname(pathname: string) {
  const normalizedPathname = pathname.replace(/\/+$/, "") || "/";

  return normalizedPathname === "/products" || normalizedPathname.startsWith("/products/");
}

function createCategoryNavigationItem(slug: string): ProductCategoryNavigationItem {
  const config = productCategoryConfigs[slug];

  return {
    slug,
    name: config.name,
    shortName: config.shortName,
    route: `/products/${slug}`,
  };
}

function toCatalogueProduct(
  product: (typeof canonicalCatalogue.categories)[number]["products"][number],
): CatalogueProduct {
  return {
    id: product.id,
    partNumber: product.partNumber,
    href: `/products/${product.slug}`,
    name: product.name,
    description: product.description,
    image: product.image,
    imageAlt: product.imageAlt,
    specs: [...product.specs],
    filters: structuredClone(product.filters),
  };
}

function uniqueProducts(products: CatalogueProduct[]) {
  const productsById = new Map<string, CatalogueProduct>();

  products.forEach((product) => {
    if (!productsById.has(product.id)) {
      productsById.set(product.id, product);
    }
  });

  return Array.from(productsById.values());
}
