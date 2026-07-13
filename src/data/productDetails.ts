import { canonicalCatalogue } from "@/content/catalogue";
import { PRODUCT_CATALOGUE_RETURN_QUERY_PARAM } from "@/data/productCatalogue";

export interface ProductDetailImage {
  src: string;
  alt: string;
  label: string;
}

export interface ProductDetailSpecification {
  label: string;
  value: string;
}

export interface ProductDetailBreadcrumb {
  label: string;
  href?: string;
}

export interface ProductCategoryReference {
  name: string;
  shortName?: string;
  slug: string;
  route: string;
}

export interface ProductDetail {
  slug: string;
  name: string;
  categoryLabel: string;
  parentCategory: ProductCategoryReference;
  shortDescription: string;
  useCase: string;
  specificationNote: string;
  breadcrumbs: ProductDetailBreadcrumb[];
  images: ProductDetailImage[];
  summary: ProductDetailSpecification[];
  specifications: ProductDetailSpecification[];
  description: string[];
  applications: string[];
  options: string[];
  downloads: string[];
}

type CanonicalProduct = (typeof canonicalCatalogue.categories)[number]["products"][number];

const productDetailsBySlug = new Map<string, ProductDetail>();

canonicalCatalogue.categories.forEach((category) => {
  category.products.forEach((product) => {
    productDetailsBySlug.set(
      product.slug,
      toProductDetail(product, {
        name: category.name,
        shortName: category.shortName,
        slug: category.slug,
        route: `/products/${category.slug}`,
      }, category),
    );
  });

  category.subcategories.forEach((subcategory) => {
    subcategory.products.forEach((product) => {
      productDetailsBySlug.set(
        product.slug,
        toProductDetail(product, {
          name: subcategory.name,
          shortName: subcategory.shortName,
          slug: subcategory.slug,
          route: `/products/${subcategory.slug}`,
        }, category),
      );
    });
  });
});

export const productDetails = Array.from(productDetailsBySlug.values());

export const fourDigitSevenSegmentDisplay = productDetailsBySlug.get(
  "4-digit-7-segment-display",
) as ProductDetail;

export function getProductDetailBySlug(slug: string): ProductDetail | undefined {
  return productDetailsBySlug.get(slug);
}

function toProductDetail(
  product: CanonicalProduct,
  parentCategory: ProductCategoryReference,
  rootCategory: (typeof canonicalCatalogue.categories)[number],
): ProductDetail {
  const detail = product.detail;
  const isDirectProduct = parentCategory.slug === rootCategory.slug;

  return {
    slug: product.slug,
    name: product.name,
    categoryLabel: detail.productTypeLabel?.trim() ?? "",
    parentCategory,
    shortDescription: detail.introduction?.trim() ?? "",
    useCase: detail.suitableFor?.trim() ?? "",
    specificationNote: detail.specificationNote?.trim() ?? "",
    breadcrumbs: [
      { label: "Products", href: "/products" },
      ...(isDirectProduct
        ? []
        : [
            {
              label: rootCategory.shortName ?? rootCategory.name,
              href: `/products/${rootCategory.slug}`,
            },
          ]),
      { label: parentCategory.name, href: parentCategory.route },
      { label: product.name },
    ],
    images: [...detail.images]
      .filter((image) => image.src)
      .sort((left, right) => {
        if (left.isPrimary !== right.isPrimary) return left.isPrimary ? -1 : 1;
        return left.order - right.order;
      })
      .map((image, index) => ({
        src: image.src ?? "",
        alt: image.alt?.trim() ?? "",
        label: image.label?.trim() || `View ${index + 1}`,
      })),
    summary: toSpecifications(detail.summary),
    specifications: toSpecifications(detail.specifications),
    description: toTextValues(detail.descriptionParagraphs),
    applications: toTextValues(detail.applications),
    options: [...detail.optionGroups]
      .sort((left, right) => left.order - right.order)
      .flatMap((group) =>
        toTextValues(group.values).map((value) =>
          group.label?.trim() ? `${group.label.trim()}: ${value}` : value,
        ),
      ),
    downloads: [...detail.downloads]
      .sort((left, right) => left.order - right.order)
      .map((download) =>
        [download.label?.trim(), download.description?.trim()].filter(Boolean).join(" - "),
      )
      .filter(Boolean),
  };
}

function toSpecifications(
  items: CanonicalProduct["detail"]["specifications"],
): ProductDetailSpecification[] {
  return [...items]
    .sort((left, right) => left.order - right.order)
    .filter((item) => item.label?.trim() || item.value?.trim())
    .map((item) => ({
      label: item.label?.trim() ?? "",
      value: item.value?.trim() ?? "",
    }));
}

function toTextValues(
  items: CanonicalProduct["detail"]["descriptionParagraphs"],
) {
  return [...items]
    .sort((left, right) => left.order - right.order)
    .map((item) => item.text?.trim() ?? "")
    .filter(Boolean);
}

export { PRODUCT_CATALOGUE_RETURN_QUERY_PARAM };
