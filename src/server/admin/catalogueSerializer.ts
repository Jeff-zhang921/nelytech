import { canonicalCatalogue, type CanonicalCatalogue } from "@/content/catalogue";
import type { CategoryFilterSchema } from "@/data/categoryFilterSchemas";
import type {
  CatalogueDraft,
  EditableTextItem,
  ProductDetailDraft,
  ProductDraft,
  SpecificationDraft,
} from "@/lib/adminCatalogueDraft";

export function createCanonicalCatalogue(
  draft: CatalogueDraft,
  filterSchemas: Record<string, CategoryFilterSchema>,
  publishedAt = new Date().toISOString(),
): CanonicalCatalogue {
  return {
    version: canonicalCatalogue.version,
    allProducts: structuredClone(canonicalCatalogue.allProducts),
    categories: draft.categories.map((category) => ({
      id: category.id,
      slug: category.slug,
      name: category.name.trim(),
      shortName: category.shortName?.trim() || undefined,
      description: category.description.trim(),
      route: `/products/${category.slug}`,
      products: category.products.map((product) =>
        serializeProduct(product, filterSchemas[category.slug]),
      ),
      subcategories: category.subcategories.map((subcategory) => ({
        id: subcategory.id,
        slug: subcategory.slug,
        name: subcategory.name.trim(),
        shortName: subcategory.shortName?.trim() || undefined,
        description: subcategory.description.trim(),
        parentCategoryId: category.id,
        products: subcategory.products.map((product) =>
          serializeProduct(product, filterSchemas[category.slug]),
        ),
      })),
    })),
    updatedAt: publishedAt,
    filterSchemas: structuredClone(filterSchemas),
  };
}

export function serializeCanonicalCatalogue(catalogue: CanonicalCatalogue) {
  return `${JSON.stringify(catalogue, null, 2)}\n`;
}

function serializeProduct(
  product: ProductDraft,
  schema: CategoryFilterSchema | undefined,
): ProductDraft {
  return {
    id: product.id,
    partNumber: product.partNumber.trim(),
    ...(product.href ? { href: product.href } : {}),
    slug: product.slug,
    name: product.name.trim(),
    description: product.description.trim(),
    image: product.image,
    imageAlt: product.imageAlt?.trim() || undefined,
    specs: product.specs.map((specification) => specification.trim()).filter(Boolean),
    filters: serializeFilters(product.filters, schema),
    detail: serializeProductDetail(product.detail),
  };
}

function serializeFilters(
  values: ProductDraft["filters"],
  schema: CategoryFilterSchema | undefined,
) {
  if (!schema) return structuredClone(values);

  return Object.fromEntries(
    schema.groups.map((group) => {
      const optionOrder = new Map(group.options.map((option, index) => [option.id, index]));
      return [
        group.id,
        Array.from(new Set(values[group.id] ?? [])).sort(
          (left, right) =>
            (optionOrder.get(left) ?? Number.MAX_SAFE_INTEGER) -
            (optionOrder.get(right) ?? Number.MAX_SAFE_INTEGER),
        ),
      ];
    }),
  );
}

function serializeProductDetail(detail: ProductDetailDraft): ProductDetailDraft {
  return {
    productTypeLabel: detail.productTypeLabel?.trim() || undefined,
    introduction: detail.introduction?.trim() || undefined,
    suitableFor: detail.suitableFor?.trim() || undefined,
    specificationNote: detail.specificationNote?.trim() || undefined,
    images: [...detail.images]
      .filter((image) => image.src)
      .sort((left, right) => {
        if (left.isPrimary !== right.isPrimary) return left.isPrimary ? -1 : 1;
        return left.order - right.order;
      })
      .map((image, order) => ({
        id: image.id,
        src: image.src,
        alt: image.alt?.trim() || undefined,
        label: image.label?.trim() || undefined,
        isPrimary: order === 0,
        order,
      })),
    summary: serializeSpecifications(detail.summary),
    specifications: serializeSpecifications(detail.specifications),
    descriptionParagraphs: serializeTextItems(detail.descriptionParagraphs),
    applications: serializeTextItems(detail.applications),
    optionGroups: [...detail.optionGroups]
      .sort((left, right) => left.order - right.order)
      .map((group) => ({
        id: group.id,
        label: group.label?.trim() || undefined,
        values: serializeTextItems(group.values),
        order: group.order,
      }))
      .filter((group) => group.label || group.values.length > 0)
      .map((group, order) => ({ ...group, order })),
    downloads: [...detail.downloads]
      .sort((left, right) => left.order - right.order)
      .filter(
        (download) =>
          download.label?.trim() || download.description?.trim() || download.href?.trim(),
      )
      .map((download, order) => ({
        id: download.id,
        label: download.label?.trim() || undefined,
        description: download.description?.trim() || undefined,
        href: download.href?.trim() || undefined,
        order,
      })),
  };
}

function serializeSpecifications(items: SpecificationDraft[]) {
  return [...items]
    .sort((left, right) => left.order - right.order)
    .filter((item) => item.label?.trim() || item.value?.trim())
    .map((item, order) => ({
      id: item.id,
      label: item.label?.trim() || undefined,
      value: item.value?.trim() || undefined,
      order,
    }));
}

function serializeTextItems(items: EditableTextItem[]) {
  return [...items]
    .sort((left, right) => left.order - right.order)
    .filter((item) => item.text?.trim())
    .map((item, order) => ({
      id: item.id,
      text: item.text?.trim(),
      order,
    }));
}
