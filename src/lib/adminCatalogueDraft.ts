import {
  createProductSlug,
  getCatalogueProductHref,
  getProductCatalogueHierarchy,
  type CatalogueProduct,
} from "@/data/productCatalogue";

import { validateProductFilterValues } from "@/components/products/productFiltering";
import {
  getFilterSchemaForCatalogueNode,
  normalizeFilterValues,
} from "@/data/categoryFilterSchemas";
import { getProductDetailBySlug, type ProductDetail } from "@/data/productDetails";
import { containsSubstantialChinese, productAdminCopy } from "@/lib/productAdminCopy";

export type AdminSession = {
  isAuthenticated: boolean;
  role: "admin";
};

export const developmentAdminSession: AdminSession = {
  isAuthenticated: true,
  role: "admin",
};

export type EditableTextItem = {
  id: string;
  text?: string;
  order: number;
};

export type ProductImageDraft = {
  id: string;
  src?: string;
  alt?: string;
  label?: string;
  isPrimary?: boolean;
  order: number;
};

export type SpecificationDraft = {
  id: string;
  label?: string;
  value?: string;
  order: number;
};

export type ProductOptionGroupDraft = {
  id: string;
  label?: string;
  values: EditableTextItem[];
  order: number;
};

export type ProductDownloadDraft = {
  id: string;
  label?: string;
  description?: string;
  href?: string;
  order: number;
};

export type ProductDetailDraft = {
  productTypeLabel?: string;
  introduction?: string;
  suitableFor?: string;
  specificationNote?: string;
  images: ProductImageDraft[];
  summary: SpecificationDraft[];
  specifications: SpecificationDraft[];
  descriptionParagraphs: EditableTextItem[];
  applications: EditableTextItem[];
  optionGroups: ProductOptionGroupDraft[];
  downloads: ProductDownloadDraft[];
};

export type ProductDraft = CatalogueProduct & {
  slug: string;
  detail: ProductDetailDraft;
  isDraft?: boolean;
};

export type SubcategoryDraft = {
  id: string;
  slug: string;
  name: string;
  shortName?: string;
  description: string;
  parentCategoryId: string;
  products: ProductDraft[];
  isDraft?: boolean;
  isCategoryRoot?: boolean;
};

export type CategoryDraft = {
  id: string;
  slug: string;
  name: string;
  shortName?: string;
  description: string;
  route: string;
  products: ProductDraft[];
  subcategories: SubcategoryDraft[];
};

export type CatalogueDraft = {
  categories: CategoryDraft[];
  updatedAt?: string;
};

export interface CatalogueDraftRepository {
  loadDraft(): CatalogueDraft | null;
  saveDraft(draft: CatalogueDraft): Promise<void>;
  clearDraft(): void;
}

const storageKey = "nelytech.admin.catalogue-draft.v1";

export const localCatalogueDraftRepository: CatalogueDraftRepository = {
  loadDraft() {
    if (typeof window === "undefined") {
      return null;
    }

    const savedDraft = window.localStorage.getItem(storageKey);

    if (!savedDraft) {
      return null;
    }

    try {
      return normalizeCatalogueDraft(JSON.parse(savedDraft) as CatalogueDraft);
    } catch {
      window.localStorage.removeItem(storageKey);
      return null;
    }
  },
  async saveDraft(draft) {
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
  },
  clearDraft() {
    window.localStorage.removeItem(storageKey);
  },
};

export function createPublishedCatalogueDraft(): CatalogueDraft {
  return {
    categories: getProductCatalogueHierarchy().map(({ category, subcategories }) => ({
      id: `category-${category.slug}`,
      slug: category.slug,
      name: category.name,
      shortName: category.shortName,
      description: category.description,
      route: `/products/${category.slug}`,
      products: (category.directProducts ?? category.products).map((product) =>
        clonePublishedProduct(product, category.slug),
      ),
      subcategories: subcategories.map((subcategory) => ({
        id: `subcategory-${subcategory.slug}`,
        slug: subcategory.slug,
        name: subcategory.name,
        shortName: subcategory.shortName,
        description: subcategory.description,
        parentCategoryId: `category-${category.slug}`,
        products: subcategory.products.map((product) =>
          clonePublishedProduct(product, category.slug),
        ),
      })),
    })),
  };
}

export function cloneCatalogueDraft(draft: CatalogueDraft): CatalogueDraft {
  return structuredClone(draft);
}

export function findSubcategory(draft: CatalogueDraft, slug: string) {
  for (const category of draft.categories) {
    if (category.slug === slug) {
      return {
        category,
        subcategory: {
          id: category.id,
          slug: category.slug,
          name: category.name,
          shortName: category.shortName,
          description: category.description,
          parentCategoryId: category.id,
          products: category.products,
          isCategoryRoot: true,
        } satisfies SubcategoryDraft,
      };
    }

    const subcategory = category.subcategories.find((item) => item.slug === slug);

    if (subcategory) {
      return { category, subcategory };
    }
  }

  return undefined;
}

export function findDraftProduct(
  draft: CatalogueDraft,
  subcategorySlug: string,
  productSlug: string,
) {
  const match = findSubcategory(draft, subcategorySlug);
  const product = match?.subcategory.products.find((item) => item.slug === productSlug);

  return match && product ? { ...match, product } : undefined;
}

export function getAllDraftProducts(draft: CatalogueDraft) {
  return draft.categories.flatMap((category) =>
    [
      ...category.products,
      ...category.subcategories.flatMap((subcategory) => subcategory.products),
    ],
  );
}

export function updateProductCollection(
  draft: CatalogueDraft,
  collectionId: string,
  updateProducts: (products: ProductDraft[]) => ProductDraft[],
): CatalogueDraft {
  return {
    ...draft,
    categories: draft.categories.map((category) => {
      if (category.id === collectionId) {
        return { ...category, products: updateProducts(category.products) };
      }

      return {
        ...category,
        subcategories: category.subcategories.map((subcategory) =>
          subcategory.id === collectionId
            ? { ...subcategory, products: updateProducts(subcategory.products) }
            : subcategory,
        ),
      };
    }),
  };
}

export function createAdminProductDetailPreview(
  product: ProductDraft,
  subcategory: SubcategoryDraft,
  category: CategoryDraft,
): ProductDetail {
  const detail = product.detail;
  const orderedImages = [...detail.images]
    .filter((image) => image.src)
    .sort((left, right) => {
      if (left.isPrimary !== right.isPrimary) {
        return left.isPrimary ? -1 : 1;
      }
      return left.order - right.order;
    });

  return {
    slug: product.slug,
    name: product.name,
    categoryLabel: detail.productTypeLabel?.trim() ?? "",
    parentCategory: {
      name: subcategory.name,
      shortName: subcategory.shortName,
      slug: subcategory.slug,
      route: `/admin/catalogue/${subcategory.slug}`,
    },
    shortDescription: detail.introduction?.trim() ?? "",
    useCase: detail.suitableFor?.trim() ?? "",
    specificationNote: detail.specificationNote?.trim() ?? "",
    breadcrumbs: subcategory.isCategoryRoot
      ? [
          { label: "Products", href: "/admin/catalogue" },
          {
            label: category.name,
            href: `/admin/catalogue/${category.slug}`,
          },
          { label: product.name },
        ]
      : [
          { label: "Products", href: "/admin/catalogue" },
          { label: category.shortName ?? category.name, href: "/admin/catalogue" },
          {
            label: subcategory.name,
            href: `/admin/catalogue/${subcategory.slug}`,
          },
          { label: product.name },
        ],
    images: orderedImages.map((image, index) => ({
      src: image.src ?? "",
      alt: image.alt?.trim() ?? "",
      label: image.label?.trim() || `View ${index + 1}`,
    })),
    summary: toProductDetailSpecifications(detail.summary),
    specifications: toProductDetailSpecifications(detail.specifications),
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
        [download.label?.trim(), download.description?.trim()]
          .filter(Boolean)
          .join(" - "),
      )
      .filter(Boolean),
  };
}

export function validateCatalogueDraft(draft: CatalogueDraft): string[] {
  const errors: string[] = [];
  const categorySlugs = new Set(draft.categories.map((category) => category.slug));
  const subcategorySlugs = new Set<string>();
  const productSlugs = new Set<string>();

  draft.categories.forEach((category) => {
    validateEnglishField(category.name, "Parent category name", category.name, errors);
    validateProductCollection(category.products, category.slug, productSlugs, errors);

    category.subcategories.forEach((subcategory) => {
      if (!subcategory.name.trim() || !subcategory.slug) {
        errors.push("Every subcategory requires an English name and page slug.");
      }

      validateEnglishField(subcategory.name, "Subcategory name", subcategory.name, errors);
      validateEnglishField(
        subcategory.description,
        "Subcategory description",
        subcategory.name,
        errors,
      );

      if (categorySlugs.has(subcategory.slug) || subcategorySlugs.has(subcategory.slug)) {
        errors.push(`Duplicate page slug: ${subcategory.slug}`);
      }
      subcategorySlugs.add(subcategory.slug);

      validateProductCollection(
        subcategory.products,
        category.slug,
        productSlugs,
        errors,
      );
    });
  });

  return Array.from(new Set(errors));
}

function validateProductCollection(
  products: ProductDraft[],
  categoryId: string,
  productSlugs: Set<string>,
  errors: string[],
) {
  const schema = getFilterSchemaForCatalogueNode(categoryId);

  products.forEach((product) => {
    if (!product.name.trim() || !product.description.trim() || !product.image) {
      errors.push(
        `Complete every required product-card field for “${product.name || "Unnamed product"}”.`,
      );
    }

    validateProductEnglishContent(product, errors);

    if (productSlugs.has(product.slug)) {
      errors.push(`Duplicate product page slug: ${product.slug}`);
    }
    productSlugs.add(product.slug);

    validateProductFilterValues(product.filters, schema).forEach((issue) => {
      errors.push(`“${product.name}”: ${issue.message}`);
    });

    validateProductDetailStructure(product.detail, product.name, errors);
  });
}

function clonePublishedProduct(
  product: CatalogueProduct,
  categoryId: string,
): ProductDraft {
  const slug =
    getCatalogueProductHref(product).split("/").filter(Boolean).pop() ??
    createProductSlug(product.name);

  return {
    ...product,
    slug,
    detail: createProductDetailDraft(getProductDetailBySlug(slug)),
    specs: [...product.specs],
    filters: normalizeFilterValues(
      getFilterSchemaForCatalogueNode(categoryId),
      product.filters,
    ),
  };
}

export function createEmptyProductDetailDraft(): ProductDetailDraft {
  return {
    images: [],
    summary: [],
    specifications: [],
    descriptionParagraphs: [],
    applications: [],
    optionGroups: [],
    downloads: [],
  };
}

function createProductDetailDraft(detail?: ProductDetail): ProductDetailDraft {
  if (!detail) {
    return createEmptyProductDetailDraft();
  }

  return {
    productTypeLabel: detail.categoryLabel,
    introduction: detail.shortDescription,
    suitableFor: detail.useCase,
    specificationNote: detail.specificationNote,
    images: detail.images.map((image, index) => ({
      id: `detail-image-${index + 1}`,
      src: image.src,
      alt: image.alt,
      label: image.label,
      isPrimary: index === 0,
      order: index,
    })),
    summary: detail.summary.map((item, index) => ({
      id: `summary-${index + 1}`,
      label: item.label,
      value: item.value,
      order: index,
    })),
    specifications: detail.specifications.map((item, index) => ({
      id: `specification-${index + 1}`,
      label: item.label,
      value: item.value,
      order: index,
    })),
    descriptionParagraphs: detail.description.map((text, index) => ({
      id: `description-${index + 1}`,
      text,
      order: index,
    })),
    applications: detail.applications.map((text, index) => ({
      id: `application-${index + 1}`,
      text,
      order: index,
    })),
    optionGroups: detail.options.length
      ? [
          {
            id: "option-group-1",
            label: "Available options",
            order: 0,
            values: detail.options.map((text, index) => ({
              id: `option-1-${index + 1}`,
              text,
              order: index,
            })),
          },
        ]
      : [],
    downloads: detail.downloads.map((label, index) => ({
      id: `download-${index + 1}`,
      label,
      order: index,
    })),
  };
}

export function normalizeCatalogueDraft(draft: CatalogueDraft): CatalogueDraft {
  return {
    ...draft,
    categories: draft.categories.map((category) => ({
      ...category,
      description: category.description ?? "",
      products: normalizeProducts(category.products ?? [], category.slug),
      subcategories: category.subcategories.map((subcategory) => ({
        ...subcategory,
        products: normalizeProducts(subcategory.products, category.slug),
      })),
    })),
  };
}

function normalizeProducts(products: ProductDraft[], categoryId: string) {
  const schema = getFilterSchemaForCatalogueNode(categoryId);

  return products.map((product) => {
    const slug =
      product.slug ??
      product.href?.split("/").filter(Boolean).pop() ??
      createProductSlug(product.name);

    return {
      ...product,
      slug,
      filters: normalizeFilterValues(schema, product.filters),
      detail: normalizeProductDetailDraft(
        product.detail ?? createProductDetailDraft(getProductDetailBySlug(slug)),
      ),
    };
  });
}

export function normalizeProductDetailDraft(
  detail: ProductDetailDraft,
): ProductDetailDraft {
  const specifications = [...detail.specifications]
    .sort((left, right) => left.order - right.order)
    .filter((item) => item.label?.trim() || item.value?.trim())
    .map((item, index) => ({ ...item, order: index }));

  return {
    ...detail,
    specifications,
  };
}

function validateProductDetailStructure(
  detail: ProductDetailDraft,
  productName: string,
  errors: string[],
) {
  const ids = [
    ...detail.images.map((item) => item.id),
    ...detail.summary.map((item) => item.id),
    ...detail.specifications.map((item) => item.id),
    ...detail.descriptionParagraphs.map((item) => item.id),
    ...detail.applications.map((item) => item.id),
    ...detail.optionGroups.flatMap((group) => [
      group.id,
      ...group.values.map((item) => item.id),
    ]),
    ...detail.downloads.map((item) => item.id),
  ];

  if (new Set(ids).size !== ids.length) {
    errors.push(`Product Details for “${productName}” contain duplicate item identifiers.`);
  }

  const orderedItems = [
    ...detail.images,
    ...detail.summary,
    ...detail.specifications,
    ...detail.descriptionParagraphs,
    ...detail.applications,
    ...detail.optionGroups,
    ...detail.optionGroups.flatMap((group) => group.values),
    ...detail.downloads,
  ];

  if (orderedItems.some((item) => !Number.isFinite(item.order) || item.order < 0)) {
    errors.push(`Product Details for “${productName}” contain invalid ordering data.`);
  }

  detail.downloads.forEach((download) => {
    if (download.href && !isValidResourceHref(download.href)) {
      errors.push(`“${productName}” contains an invalid download link.`);
    }
  });
}

function validateProductEnglishContent(product: ProductDraft, errors: string[]) {
  const context = product.name || "Unnamed product";
  const fields: Array<[string | undefined, string]> = [
    [product.name, "Product name"],
    [product.description, "Short description"],
    [product.imageAlt, "Cover image alt text"],
    ...product.specs.map((value) => [value, "Product-card specification"] as [string, string]),
    ...Object.values(product.filters).flatMap((values) =>
      values.map((value) => [value, "Public filter value"] as [string, string]),
    ),
    [product.detail.productTypeLabel, "Product type label"],
    [product.detail.introduction, "Product Detail introduction"],
    [product.detail.suitableFor, "Suitable-for summary"],
    [product.detail.specificationNote, "Product Information explanation"],
    ...product.detail.images.flatMap((image) => [
      [image.alt, "Detail image alt text"] as [string | undefined, string],
      [image.label, "Image label"] as [string | undefined, string],
    ]),
    ...[...product.detail.summary, ...product.detail.specifications].flatMap((item) => [
      [item.label, "Product Information label"] as [string | undefined, string],
      [item.value, "Product Information value"] as [string | undefined, string],
    ]),
    ...product.detail.descriptionParagraphs.map((item) =>
      [item.text, "Product description paragraph"] as [string | undefined, string],
    ),
    ...product.detail.applications.map((item) =>
      [item.text, "Application"] as [string | undefined, string],
    ),
    ...product.detail.optionGroups.flatMap((group) => [
      [group.label, "Available-option group name"] as [string | undefined, string],
      ...group.values.map((item) =>
        [item.text, "Available-option value"] as [string | undefined, string],
      ),
    ]),
    ...product.detail.downloads.flatMap((download) => [
      [download.label, "Download label"] as [string | undefined, string],
      [download.description, "Download description"] as [string | undefined, string],
    ]),
  ];

  fields.forEach(([value, label]) =>
    validateEnglishField(value, label, context, errors),
  );
}

function validateEnglishField(
  value: string | undefined,
  label: string,
  context: string,
  errors: string[],
) {
  if (containsSubstantialChinese(value)) {
    errors.push(
      `${label} for “${context}”: ${productAdminCopy.validation.englishOnly}`,
    );
  }
}

function isValidResourceHref(href: string) {
  if (href.startsWith("/")) {
    return true;
  }

  try {
    const url = new URL(href);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function toProductDetailSpecifications(items: SpecificationDraft[]) {
  return [...items]
    .sort((left, right) => left.order - right.order)
    .filter((item) => item.label?.trim() || item.value?.trim())
    .map((item) => ({
      label: item.label?.trim() ?? "",
      value: item.value?.trim() ?? "",
    }));
}

function toTextValues(items: EditableTextItem[]) {
  return [...items]
    .sort((left, right) => left.order - right.order)
    .map((item) => item.text?.trim() ?? "")
    .filter(Boolean);
}
