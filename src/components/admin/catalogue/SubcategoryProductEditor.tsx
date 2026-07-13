"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Edit3, ImagePlus, Plus, Trash2, Upload } from "lucide-react";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";

import { ActiveFilters } from "@/components/products/ActiveFilters";
import { EmptyResults } from "@/components/products/EmptyResults";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductSearch } from "@/components/products/ProductSearch";
import {
  buildFilterSections,
  countActiveFilters,
  createEmptyFilterState,
  filterProducts,
  validateProductFilterSelections,
  validateProductFilterValues,
  type ProductFilterKey,
  type ProductFilterState,
} from "@/components/products/productFiltering";
import {
  createEmptyFilterValues,
  getFilterSchemaForCatalogueNode,
  getFilterOptionLabel,
  normalizeFilterValues,
} from "@/data/categoryFilterSchemas";
import { createProductSlug } from "@/data/productCatalogue";
import {
  findSubcategory,
  createEmptyProductDetailDraft,
  getAllDraftProducts,
  updateProductCollection,
  type ProductDraft,
} from "@/lib/adminCatalogueDraft";
import {
  englishContentError,
  productAdminCopy as copy,
} from "@/lib/productAdminCopy";

import { AdminModal } from "./AdminModal";
import { useAdminCatalogue } from "./AdminCatalogueProvider";

const maximumDescriptionLength = 200;
const maximumImageSize = 1_500_000;
const supportedImageTypes = ["image/jpeg", "image/png", "image/webp"];

type CoverImageDraft = {
  src: string;
  displaySrc?: string;
  fileName: string;
};

export function SubcategoryProductEditor({ subcategorySlug }: { subcategorySlug: string }) {
  const { draft, isReady, updateDraft } = useAdminCatalogue();
  const match = findSubcategory(draft, subcategorySlug);
  const filterSchema = getFilterSchemaForCatalogueNode(
    subcategorySlug,
    match?.category.slug,
  );
  const [filterState, setFilterState] = useState<ProductFilterState>(() =>
    createEmptyFilterState(filterSchema),
  );
  const [isManagementOpen, setIsManagementOpen] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ProductDraft | null>(null);
  const [productName, setProductName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [coverImage, setCoverImage] = useState<CoverImageDraft | null>(null);
  const [coverImageAlt, setCoverImageAlt] = useState("");
  const [imageError, setImageError] = useState("");
  const [selectedFilters, setSelectedFilters] = useState(() =>
    createEmptyFilterValues(filterSchema),
  );

  const products = useMemo(() => match?.subcategory.products ?? [], [match?.subcategory.products]);
  const scopedProducts = useMemo(() => {
    if (!match?.subcategory.isCategoryRoot) {
      return products;
    }

    const productsById = new Map(
      [
        ...match.category.products,
        ...match.category.subcategories.flatMap((item) => item.products),
      ].map((product) => [product.id, product]),
    );

    return Array.from(productsById.values());
  }, [match?.category, match?.subcategory.isCategoryRoot, products]);
  const visibleProducts = useMemo(
    () => filterProducts(scopedProducts, filterState, filterSchema),
    [filterSchema, filterState, scopedProducts],
  );
  const filterSections = useMemo(
    () =>
      buildFilterSections(scopedProducts, filterState, filterSchema, {
        disableUnavailable: false,
      }),
    [filterSchema, filterState, scopedProducts],
  );
  const productSlug = createProductSlug(productName);
  const productNameEnglishError = englishContentError(productName);
  const shortDescriptionEnglishError = englishContentError(shortDescription);
  const coverImageAltEnglishError = englishContentError(coverImageAlt);
  const editingProduct = products.find((product) => product.id === editingProductId);
  const duplicateProductSlug = getAllDraftProducts(draft).some(
    (product) => product.slug === productSlug && product.id !== editingProductId,
  );
  const missingFilterKeys = validateProductFilterSelections(
    selectedFilters,
    filterSchema,
  );
  const invalidFilterIssues = validateProductFilterValues(
    selectedFilters,
    filterSchema,
  ).filter((issue) => issue.code !== "required");
  const canSaveProduct = Boolean(
    productName.trim() &&
      productSlug &&
      !duplicateProductSlug &&
      coverImage &&
      coverImageAlt.trim() &&
      !productNameEnglishError &&
      !shortDescriptionEnglishError &&
      !coverImageAltEnglishError &&
      shortDescription.trim() &&
      shortDescription.length <= maximumDescriptionLength &&
      missingFilterKeys.length === 0 &&
      invalidFilterIssues.length === 0,
  );

  useEffect(() => {
    setFilterState((current) => ({
      ...current,
      selected: filterSchema.groups.reduce<ProductFilterState["selected"]>(
        (selected, group) => {
          const availableValues = new Set(
            scopedProducts.flatMap((product) => product.filters[group.id] ?? []),
          );
          selected[group.id] = (current.selected[group.id] ?? []).filter((value) =>
            availableValues.has(value),
          );
          return selected;
        },
        createEmptyFilterValues(filterSchema),
      ),
    }));
  }, [filterSchema, scopedProducts]);

  if (!isReady) {
    return (
      <main className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
        <div className="rounded-2xl border border-slate-200/70 bg-white/70 px-6 py-16 text-center text-sm text-slate-500 backdrop-blur-xl">
          {copy.product.loading}
        </div>
      </main>
    );
  }

  if (!match) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-3xl font-light text-slate-950">{copy.product.notFound}</h1>
        <p className="mt-3 text-sm text-slate-500">
          {copy.product.notFoundDescription}
        </p>
        <Link
          href="/admin/catalogue"
          className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {copy.product.backCatalogue}
        </Link>
      </main>
    );
  }

  const { category, subcategory } = match;
  const collectionDisplayName = subcategory.isCategoryRoot
    ? subcategory.name
    : subcategory.shortName ?? subcategory.name;
  const activeFilterCount = countActiveFilters(filterState, filterSchema);

  function resetProductForm() {
    setEditingProductId(null);
    setProductName("");
    setShortDescription("");
    setCoverImage(null);
    setCoverImageAlt("");
    setImageError("");
    setSelectedFilters(createEmptyFilterValues(filterSchema));
  }

  function openProductForm() {
    resetProductForm();
    setIsManagementOpen(false);
    setIsProductFormOpen(true);
  }

  function openExistingProductForm(product: ProductDraft) {
    setEditingProductId(product.id);
    setProductName(product.name);
    setShortDescription(product.description);
    setCoverImage({
      src: product.image,
      displaySrc: product.previewImage,
      fileName: "Current cover image",
    });
    setCoverImageAlt(product.imageAlt ?? `${product.name} product cover image`);
    setImageError("");
    setSelectedFilters(normalizeFilterValues(filterSchema, product.filters));
    setIsManagementOpen(false);
    setIsProductFormOpen(true);
  }

  function updateSearch(query: string) {
    setFilterState((current) => ({ ...current, query }));
  }

  function toggleFilter(key: ProductFilterKey, value: string) {
    setFilterState((current) => ({
      ...current,
      selected: {
        ...current.selected,
        [key]: (current.selected[key] ?? []).includes(value)
          ? (current.selected[key] ?? []).filter((item) => item !== value)
          : filterSchema.groups.find((group) => group.id === key)?.selectionMode ===
              "single"
            ? [value]
            : [...(current.selected[key] ?? []), value],
      },
    }));
  }

  function removeFilter(key: ProductFilterKey, value: string) {
    setFilterState((current) => ({
      ...current,
      selected: {
        ...current.selected,
        [key]: (current.selected[key] ?? []).filter((item) => item !== value),
      },
    }));
  }

  function removeInvalidProductFilter(groupId: string, optionId?: string) {
    setSelectedFilters((current) => ({
      ...current,
      [groupId]: optionId
        ? (current[groupId] ?? []).filter((value) => value !== optionId)
        : [],
    }));
  }

  function getProductOwnerSlug(product: { id: string }) {
    if (!subcategory.isCategoryRoot) {
      return subcategory.slug;
    }

    return (
      category.subcategories.find((item) =>
        item.products.some((candidate) => candidate.id === product.id),
      )?.slug ?? category.slug
    );
  }

  function resetFilters() {
    setFilterState(createEmptyFilterState(filterSchema));
  }

  function toggleProductFilter(key: ProductFilterKey, value: string) {
    setSelectedFilters((current) => ({
      ...current,
      [key]: (current[key] ?? []).includes(value)
        ? (current[key] ?? []).filter((item) => item !== value)
        : filterSchema.groups.find((group) => group.id === key)?.selectionMode ===
            "single"
          ? [value]
          : [...(current[key] ?? []), value],
    }));
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!supportedImageTypes.includes(file.type)) {
      setImageError(copy.validation.imageType);
      return;
    }

    if (file.size > maximumImageSize) {
      setImageError(copy.validation.imageSize);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCoverImage({ src: reader.result, displaySrc: reader.result, fileName: file.name });
        setCoverImageAlt((current) =>
          current || `${productName.trim() || file.name.replace(/\.[^.]+$/, "")} product cover image`,
        );
        setImageError("");
      }
    };
    reader.onerror = () => setImageError(copy.validation.imageRead);
    reader.readAsDataURL(file);
  }

  function saveProduct() {
    if (!canSaveProduct || !coverImage) {
      return;
    }

    const name = productName.trim();
    const cardFields = {
      slug: productSlug,
      name,
      description: shortDescription.trim(),
      image: coverImage.src,
      previewImage:
        coverImage.displaySrc && coverImage.displaySrc !== coverImage.src
          ? coverImage.displaySrc
          : undefined,
      imageAlt: coverImageAlt.trim(),
      href: undefined,
      filters: Object.fromEntries(
        filterSchema.groups.map((group) => [
          group.id,
          [...(selectedFilters[group.id] ?? [])],
        ]),
      ),
    };

    updateDraft((current) =>
      updateProductCollection(current, subcategory.id, (currentProducts) =>
        editingProduct
          ? currentProducts.map((product) =>
              product.id === editingProduct.id
                ? { ...product, ...cardFields }
                : product,
            )
          : [
              ...currentProducts,
              {
                id: `draft-product-${productSlug}`,
                partNumber: `DRAFT-${productSlug.replaceAll("-", "").toUpperCase().slice(0, 18)}`,
                specs: [],
                detail: createEmptyProductDetailDraft(),
                isDraft: true,
                ...cardFields,
              },
            ],
      ),
    );
    setIsProductFormOpen(false);
    resetProductForm();
  }

  function deleteProduct() {
    if (!deleteTarget) {
      return;
    }

    updateDraft((current) =>
      updateProductCollection(current, subcategory.id, (currentProducts) =>
        currentProducts.filter((product) => product.id !== deleteTarget.id),
      ),
    );
    setDeleteTarget(null);
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-6 pt-8 pb-20 sm:px-8 lg:px-12">
      <nav aria-label="Breadcrumb" className="text-xs tracking-widest text-slate-400 uppercase">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/admin/catalogue" className="hover:text-slate-700 focus-visible:outline-none">
              Products
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/admin/catalogue" className="hover:text-slate-700 focus-visible:outline-none">
              {category.shortName ?? category.name}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{subcategory.name}</li>
        </ol>
      </nav>

      <Link
        href="/admin/catalogue"
        className="mt-6 inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 text-sm font-medium text-slate-600 backdrop-blur-xl transition-colors hover:border-slate-300 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {copy.product.backCatalogue}
      </Link>

      <header className="mt-8 flex flex-col gap-6 border-b border-slate-200/70 pb-9 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">
            Product Catalogue / Unpublished Preview
          </p>
          <h1 className="mt-3 text-3xl font-light text-slate-950 sm:text-4xl">{subcategory.name}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500">
            {subcategory.description}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsManagementOpen(true)}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Edit3 className="h-4 w-4" aria-hidden="true" />
          {copy.product.editProducts}
        </button>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10">
        <ProductFilters
          sections={filterSections}
          activeFilterCount={activeFilterCount}
          heading={`Filter products under ${collectionDisplayName}`}
          onToggleFilter={toggleFilter}
          onClearAll={resetFilters}
          copy={{
            filters: copy.filters.title,
            reset: copy.filters.reset,
            done: copy.filters.done,
            close: copy.filters.close,
            active: (count) => `${count}${copy.filters.active}`,
            selected: (count) => `${count}${copy.filters.selected}`,
            noFilters: copy.filters.none,
            asideLabel: "Product filters",
            matching: (count) => `${count} matching products`,
            optionLabel: (value) => value,
          }}
        />

        <section className="min-w-0" aria-labelledby="admin-product-results-heading">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">{copy.product.results}</p>
              <h2 id="admin-product-results-heading" className="mt-2 text-2xl font-light text-slate-950">
                {copy.product.available}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {visibleProducts.length} {visibleProducts.length === 1 ? "product" : "products"}
              </p>
            </div>
            <div className="w-full sm:max-w-sm">
              <ProductSearch
                value={filterState.query}
                onChange={updateSearch}
                onClear={() => updateSearch("")}
                labels={{
                  label: copy.filters.search,
                  placeholder: copy.filters.search,
                  clear: copy.filters.clearSearch,
                }}
              />
            </div>
          </div>

          <div className="mt-5">
            <ActiveFilters
              query={filterState.query}
              selected={filterState.selected}
              sections={filterSchema.groups.map((group) => ({
                key: group.id,
                label: group.label,
                selectionMode: group.selectionMode,
              }))}
              onClearQuery={() => updateSearch("")}
              onRemoveFilter={removeFilter}
              onClearAll={resetFilters}
              copy={{ searchPrefix: "Search", clearAll: copy.filters.clearAll }}
              valueLabel={(groupId, optionId) =>
                getFilterOptionLabel(filterSchema, groupId, optionId)
              }
            />
          </div>

          <div className="mt-6">
            {visibleProducts.length > 0 ? (
              <ProductGrid
                products={visibleProducts}
                getProductHref={(product) =>
                  `/admin/catalogue/${getProductOwnerSlug(product)}/${product.slug ?? createProductSlug(product.name)}`
                }
                getProductAriaLabel={(product) =>
                  `Edit Product Details for ${product.name}`
                }
              />
            ) : scopedProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white/65 px-6 py-12 text-center backdrop-blur-xl">
                <ImagePlus className="mx-auto h-6 w-6 text-slate-400" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-light text-slate-950">{copy.product.noProducts}</h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  {copy.product.noProductsDescription}
                </p>
                <button
                  type="button"
                  onClick={openProductForm}
                  className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  {copy.product.add}
                </button>
              </div>
            ) : (
              <EmptyResults
                onReset={resetFilters}
                copy={{
                  noMatches: copy.filters.noMatches,
                  noMatchesDescription: copy.filters.noMatchesDescription,
                  reset: copy.filters.resetFilters,
                }}
              />
            )}
          </div>
        </section>
      </div>

      <AdminModal
        isOpen={isManagementOpen}
        title={`${copy.product.manage}: ${collectionDisplayName}`}
        description={copy.product.manageDescription}
        onClose={() => setIsManagementOpen(false)}
        size="large"
        footer={
          <button
            type="button"
            onClick={() => setIsManagementOpen(false)}
            className="h-10 rounded-xl px-4 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
          >
            {copy.shared.done}
          </button>
        }
      >
        <button
          type="button"
          onClick={openProductForm}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {copy.product.add}
        </button>

        <div className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-200">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="flex flex-wrap items-center gap-4 px-4 py-4">
                <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <Image src={product.previewImage ?? product.image} alt="" fill sizes="64px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{product.name}</p>
                  <p className="mt-1 truncate text-xs text-slate-400">{product.description}</p>
                </div>
                <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => openExistingProductForm(product)}
                    className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 px-3 text-xs font-medium text-slate-600 hover:border-slate-300 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
                  >
                    <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                    {copy.product.edit}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsManagementOpen(false);
                      setDeleteTarget(product);
                    }}
                    aria-label={`Remove ${product.name} from the draft`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-700 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="px-4 py-8 text-center text-sm text-slate-500">No products added.</p>
          )}
        </div>
      </AdminModal>

      <AdminModal
        isOpen={isProductFormOpen}
        title={editingProduct ? copy.product.edit : copy.product.add}
        description={
          editingProduct
            ? copy.product.editDescription
            : copy.product.addDescription
        }
        onClose={() => setIsProductFormOpen(false)}
        size="large"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsProductFormOpen(false)}
              className="h-10 rounded-xl px-4 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
            >
              {copy.shared.cancel}
            </button>
            <button
              type="button"
              onClick={saveProduct}
              disabled={!canSaveProduct}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {editingProduct ? <Edit3 className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
              {editingProduct ? "Save Product" : copy.product.add}
            </button>
          </>
        }
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <div>
              <label htmlFor="admin-product-name" className="text-sm font-medium text-slate-800">
                {copy.product.name} <span aria-hidden="true">*</span>
              </label>
              <input
                id="admin-product-name"
                required
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                placeholder="4-Digit 7-Segment Display"
                aria-invalid={Boolean(productNameEnglishError || duplicateProductSlug)}
                aria-describedby={
                  productNameEnglishError
                    ? "admin-product-name-help admin-product-name-english-help admin-product-name-error"
                    : "admin-product-name-help admin-product-name-english-help"
                }
                className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
              <p id="admin-product-name-help" className={`mt-2 text-xs ${duplicateProductSlug ? "text-rose-600" : "text-slate-400"}`}>
                {duplicateProductSlug
                  ? copy.validation.duplicateSlug
                  : `Page slug: ${productSlug || "generated from the product name"}`}
              </p>
              <p id="admin-product-name-english-help" className="mt-1 text-xs leading-5 text-slate-500">{copy.shared.englishHint}</p>
              {productNameEnglishError ? <p id="admin-product-name-error" role="alert" className="mt-1 text-xs text-rose-600">{productNameEnglishError}</p> : null}
            </div>

            <div>
              <label htmlFor="admin-product-description" className="text-sm font-medium text-slate-800">
                {copy.product.shortDescription} <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="admin-product-description"
                required
                maxLength={maximumDescriptionLength}
                rows={4}
                value={shortDescription}
                onChange={(event) => setShortDescription(event.target.value)}
                aria-invalid={Boolean(shortDescriptionEnglishError)}
                aria-describedby={
                  shortDescriptionEnglishError
                    ? "admin-product-description-help admin-product-description-error"
                    : "admin-product-description-help"
                }
                className="mt-2 w-full resize-none rounded-xl border border-slate-300 px-3 py-3 text-sm leading-6 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
              <div id="admin-product-description-help" className="mt-2 flex justify-between gap-4 text-xs text-slate-400">
                <span>{copy.product.cardDescriptionHint}</span>
                <span>{shortDescription.length}/{maximumDescriptionLength}</span>
              </div>
              {shortDescriptionEnglishError ? <p id="admin-product-description-error" role="alert" className="mt-1 text-xs text-rose-600">{shortDescriptionEnglishError}</p> : null}
            </div>

            <fieldset>
              <legend className="text-sm font-medium text-slate-800">
                {copy.product.cover} <span aria-hidden="true">*</span>
              </legend>
              <p className="mt-1 text-xs text-slate-400">
                JPG, PNG, or WebP. Maximum file size: 1.5 MB.
              </p>
              {coverImage ? (
                <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                  <div className="relative aspect-[4/3] bg-slate-50">
                    <Image
                      src={coverImage.displaySrc ?? coverImage.src}
                      alt={`${productName || "New product"} cover preview`}
                      fill
                      sizes="400px"
                      className="object-contain p-4"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-3 py-2">
                    <span className="min-w-0 truncate text-xs text-slate-500">{coverImage.fileName}</span>
                    <span className="flex items-center gap-3">
                      <label className="cursor-pointer text-xs font-medium text-slate-700 hover:underline focus-within:ring-2 focus-within:ring-slate-400">
                        {copy.product.replaceImage}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageChange}
                          className="sr-only"
                          aria-label={copy.product.replaceImage}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setCoverImage(null)}
                        className="text-xs font-medium text-rose-700 hover:underline focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
                      >
                        {copy.product.removeImage}
                      </button>
                    </span>
                  </div>
                </div>
              ) : (
                <label className="mt-3 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-4 text-center hover:border-slate-400 hover:bg-slate-50">
                  <Upload className="h-5 w-5 text-slate-400" aria-hidden="true" />
                  <span className="mt-2 text-sm font-medium text-slate-700">{copy.product.selectImage}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="sr-only"
                    aria-describedby={imageError ? "admin-image-error" : undefined}
                  />
                </label>
              )}
              {imageError ? <p id="admin-image-error" className="mt-2 text-xs text-rose-600">{imageError}</p> : null}
            </fieldset>

            <div>
              <label htmlFor="admin-cover-image-alt" className="text-sm font-medium text-slate-800">
                {copy.product.imageAlt} <span aria-hidden="true">*</span>
              </label>
              <input
                id="admin-cover-image-alt"
                required
                value={coverImageAlt}
                onChange={(event) => setCoverImageAlt(event.target.value)}
                placeholder="Example: Front view of the display module"
                aria-invalid={Boolean(coverImageAltEnglishError)}
                aria-describedby={
                  coverImageAltEnglishError
                    ? "admin-cover-image-alt-help admin-cover-image-alt-error"
                    : "admin-cover-image-alt-help"
                }
                className="mt-2 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
              <p id="admin-cover-image-alt-help" className="mt-2 text-xs leading-5 text-slate-500">{copy.shared.englishHint}</p>
              {coverImageAltEnglishError ? <p id="admin-cover-image-alt-error" role="alert" className="mt-1 text-xs text-rose-600">{coverImageAltEnglishError}</p> : null}
            </div>
          </div>

          <div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <p className="text-sm font-medium text-slate-900">{copy.product.filterOptions}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                {copy.product.filterDescription}
              </p>
            </div>

            <div className="mt-5 space-y-6">
              {invalidFilterIssues.length > 0 ? (
                <div
                  role="alert"
                  className="rounded-xl border border-amber-200 bg-amber-50/70 p-4"
                >
                  <p className="text-sm font-medium text-amber-950">
                    Resolve incompatible legacy filter values
                  </p>
                  <div className="mt-3 space-y-2">
                    {invalidFilterIssues.map((issue) => (
                      <div
                        key={`${issue.code}-${issue.groupId}-${issue.optionId ?? "group"}`}
                        className="flex items-start justify-between gap-3 text-xs leading-5 text-amber-900"
                      >
                        <span>{issue.message}</span>
                        <button
                          type="button"
                          onClick={() =>
                            removeInvalidProductFilter(issue.groupId, issue.optionId)
                          }
                          className="shrink-0 rounded-md px-2 py-1 font-semibold text-amber-950 underline underline-offset-2 outline-none hover:bg-amber-100 focus-visible:ring-2 focus-visible:ring-amber-600"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {filterSchema.groups.map((group) => (
                <fieldset
                  key={group.id}
                  aria-describedby={`${group.id}-filter-help`}
                  aria-invalid={missingFilterKeys.includes(group.id)}
                >
                  <legend className="text-sm font-medium text-slate-800">
                    {group.label} {group.required ? <span aria-hidden="true">*</span> : null}
                  </legend>
                  <p id={`${group.id}-filter-help`} className={`mt-1 text-xs ${missingFilterKeys.includes(group.id) ? "text-amber-700" : "text-slate-400"}`}>
                    {copy.product.requiredFilters}
                  </p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {group.options.map((option) => (
                      <label key={option.id} className="flex min-h-10 cursor-pointer items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 hover:border-slate-300">
                        <input
                          type={group.selectionMode === "single" ? "radio" : "checkbox"}
                          name={
                            group.selectionMode === "single"
                              ? `admin-product-${group.id}`
                              : undefined
                          }
                          checked={(selectedFilters[group.id] ?? []).includes(option.id)}
                          onChange={() => toggleProductFilter(group.id, option.id)}
                          className="h-4 w-4 accent-slate-950"
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          </div>
        </div>
      </AdminModal>

      <AdminModal
        isOpen={Boolean(deleteTarget)}
        title={copy.product.deleteTitle}
        description={
          deleteTarget
            ? `Remove “${deleteTarget.name}” from the current draft? This will not modify the published website.`
            : ""
        }
        onClose={() => setDeleteTarget(null)}
        footer={
          <>
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              className="h-10 rounded-xl px-4 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
            >
              {copy.shared.cancel}
            </button>
            <button
              type="button"
              onClick={deleteProduct}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-rose-700 px-4 text-sm font-semibold text-white hover:bg-rose-800 focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              {copy.product.deleteAction}
            </button>
          </>
        }
      >
        {deleteTarget ? (
          <div className="flex items-center gap-4 rounded-xl border border-rose-200 bg-rose-50/60 p-4">
            <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg bg-white">
              <Image src={deleteTarget.image} alt="" fill sizes="96px" className="object-cover" />
            </div>
            <div>
              <p className="font-medium text-slate-950">{deleteTarget.name}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                This updates the draft preview immediately. It does not delete source files or
                modify GitHub content.
              </p>
            </div>
          </div>
        ) : null}
      </AdminModal>
    </main>
  );
}
