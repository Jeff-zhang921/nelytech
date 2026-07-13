"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { ProductCategoryPageConfig } from "@/data/productCatalogue";
import { getProductCategoryNavigationState } from "@/data/productCatalogue";
import {
  getFilterSchemaForCatalogueNode,
  getFilterOptionLabel,
} from "@/data/categoryFilterSchemas";

import { ActiveFilters } from "./ActiveFilters";
import { CatalogueAssistancePanel } from "./CatalogueAssistancePanel";
import { EmptyResults } from "./EmptyResults";
import { ParentCategoryLink } from "./ParentCategoryLink";
import { ProductFilters } from "./ProductFilters";
import { ProductGrid } from "./ProductGrid";
import { ProductSearch } from "./ProductSearch";
import {
  buildFilterSections,
  countActiveFilters,
  createEmptyFilterState,
  createFilterStateFromSearchParams,
  createSearchParamsFromFilterState,
  filterProducts,
  hasActiveFilters,
  type ProductFilterKey,
  type ProductFilterState,
} from "./productFiltering";

interface ProductCataloguePageProps {
  config: ProductCategoryPageConfig;
}

export function ProductCataloguePage({ config }: ProductCataloguePageProps) {
  return (
    <Suspense fallback={<ProductCatalogueFallback />}>
      <ProductCataloguePageContent config={config} />
    </Suspense>
  );
}

function ProductCataloguePageContent({ config }: ProductCataloguePageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamString = searchParams.toString();
  const filterSchema = getFilterSchemaForCatalogueNode(config.slug);
  const initialFilterState = useMemo(
    () =>
      createFilterStateFromSearchParams(
        new URLSearchParams(searchParamString),
        filterSchema,
      ),
    [filterSchema, searchParamString],
  );

  return (
    <ProductCatalogueStatefulContent
      key={config.slug}
      config={config}
      initialFilterState={initialFilterState}
      pathname={pathname}
      replaceUrl={(href) => router.replace(href, { scroll: false })}
    />
  );
}

function ProductCatalogueStatefulContent({
  config,
  initialFilterState,
  pathname,
  replaceUrl,
}: ProductCataloguePageProps & {
  initialFilterState: ProductFilterState;
  pathname: string;
  replaceUrl: (href: string) => void;
}) {
  const [filterState, setFilterState] = useState<ProductFilterState>(initialFilterState);
  const filterSchema = getFilterSchemaForCatalogueNode(config.slug);
  const visibleProducts = useMemo(
    () => filterProducts(config.products, filterState, filterSchema),
    [config.products, filterSchema, filterState],
  );
  const filterSections = useMemo(
    () => buildFilterSections(config.products, filterState, filterSchema),
    [config.products, filterSchema, filterState],
  );
  const activeFilterCount = countActiveFilters(filterState, filterSchema);
  const resultLabel = `${visibleProducts.length} ${
    visibleProducts.length === 1 ? "product" : "products"
  }`;
  const isAllProductsPage = config.slug === "all";
  const isEmptyCategory = config.products.length === 0;
  const categoryNavigation = getProductCategoryNavigationState(config.slug);
  const categoryFilterName =
    categoryNavigation.backItem?.slug === "all"
      ? config.name
      : config.shortName ?? config.name;
  const filterHeading = isAllProductsPage
    ? "Filter all products"
    : `Filter products under ${categoryFilterName}`;

  function commitFilterState(nextState: ProductFilterState) {
    setFilterState(nextState);

    const nextParams = createSearchParamsFromFilterState(nextState, filterSchema);
    const nextQuery = nextParams.toString();

    replaceUrl(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  }

  function updateSearchQuery(query: string) {
    commitFilterState({ ...filterState, query });
  }

  function clearSearchQuery() {
    commitFilterState({ ...filterState, query: "" });
  }

  function toggleFilter(key: ProductFilterKey, value: string) {
    const selectedValues = filterState.selected[key] ?? [];
    const group = filterSchema.groups.find((item) => item.id === key);
    const nextValues = selectedValues.includes(value)
      ? selectedValues.filter((selectedValue) => selectedValue !== value)
      : group?.selectionMode === "single"
        ? [value]
        : [...selectedValues, value];

    commitFilterState({
      ...filterState,
      selected: {
        ...filterState.selected,
        [key]: nextValues,
      },
    });
  }

  function removeFilter(key: ProductFilterKey, value: string) {
    commitFilterState({
      ...filterState,
      selected: {
        ...filterState.selected,
        [key]: (filterState.selected[key] ?? []).filter(
          (selectedValue) => selectedValue !== value,
        ),
      },
    });
  }

  function resetFilters() {
    commitFilterState(createEmptyFilterState(filterSchema));
  }

  const catalogueReturnQuery = createSearchParamsFromFilterState(
    filterState,
    filterSchema,
  ).toString();

  return (
    <main className="relative isolate overflow-hidden bg-transparent">
      <ProductCatalogueBackground />
      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-8 pb-16 sm:px-8 md:pt-10 md:pb-24 lg:px-12">
        <div className="relative z-30 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-12">
          <div className="min-w-0">
            <div className="mb-8 space-y-4">
              <Breadcrumbs items={config.breadcrumbItems} />
              {categoryNavigation.backItem ? (
                <ParentCategoryLink
                  href={categoryNavigation.backItem.route}
                  label={`Back to ${
                    categoryNavigation.backItem.shortName ??
                    categoryNavigation.backItem.name
                  }`}
                />
              ) : null}
            </div>

            <ProductCatalogueHeader config={config} />
          </div>

          <CatalogueAssistancePanel
            config={config}
            navigation={categoryNavigation}
          />
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10">
          <ProductFilters
            sections={filterSections}
            activeFilterCount={activeFilterCount}
            heading={filterHeading}
            onToggleFilter={toggleFilter}
            onClearAll={resetFilters}
          />

          <section
            className="min-w-0"
            aria-labelledby="product-results-heading"
            data-testid="product-results"
          >
            <ProductResultsHeader
              heading={isAllProductsPage ? "All products" : "Available Product"}
              resultLabel={resultLabel}
              hasActiveFilters={hasActiveFilters(filterState, filterSchema)}
              searchValue={filterState.query}
              onSearchChange={updateSearchQuery}
              onSearchClear={clearSearchQuery}
            />

            <div className="mt-5">
              <ActiveFilters
                query={filterState.query}
                selected={filterState.selected}
                sections={filterSchema.groups.map((group) => ({
                  key: group.id,
                  label: group.label,
                  selectionMode: group.selectionMode,
                }))}
                onClearQuery={clearSearchQuery}
                onRemoveFilter={removeFilter}
                onClearAll={resetFilters}
                valueLabel={(groupId, optionId) =>
                  getFilterOptionLabel(filterSchema, groupId, optionId)
                }
              />
            </div>

            <div className="mt-6">
              {visibleProducts.length > 0 ? (
                <ProductGrid
                  products={visibleProducts}
                  returnQuery={catalogueReturnQuery}
                />
              ) : (
                <EmptyResults
                  categoryName={categoryFilterName}
                  isEmptyCategory={isEmptyCategory}
                  onReset={resetFilters}
                />
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function ProductCatalogueBackground() {
  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 -z-20 bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed top-24 left-1/2 -z-10 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-blue-100/45 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed top-1/3 right-[-12rem] -z-10 h-[520px] w-[520px] rounded-full bg-cyan-100/25 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-white/90 to-transparent"
        aria-hidden="true"
      />
    </>
  );
}

function Breadcrumbs({ items }: { items: ProductCategoryPageConfig["breadcrumbItems"] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-xs tracking-widest text-slate-400 uppercase"
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-slate-600 focus-visible:text-slate-600 focus-visible:outline-none"
              >
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function ProductCatalogueHeader({ config }: ProductCataloguePageProps) {
  return (
    <header className="max-w-4xl">
      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">
        Product catalogue
      </p>
      <h1 className="mt-3 text-4xl font-light tracking-normal text-slate-900 md:text-5xl">
        {config.name}
      </h1>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-500 md:text-lg">
        {config.description}
      </p>
    </header>
  );
}

function ProductResultsHeader({
  heading,
  resultLabel,
  hasActiveFilters: hasFilters,
  searchValue,
  onSearchChange,
  onSearchClear,
}: {
  heading: string;
  resultLabel: string;
  hasActiveFilters: boolean;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
}) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">
          Product results
        </p>
        <h2
          id="product-results-heading"
          className="mt-2 text-2xl font-light tracking-normal text-slate-950"
        >
          {heading}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          {resultLabel}
          {hasFilters ? " found for current filters" : ""}
        </p>
      </div>

      <div className="w-full sm:max-w-sm">
        <ProductSearch
          value={searchValue}
          onChange={onSearchChange}
          onClear={onSearchClear}
        />
      </div>
    </div>
  );
}

function ProductCatalogueFallback() {
  return (
    <main className="relative isolate overflow-hidden bg-transparent">
      <ProductCatalogueBackground />
      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-8 pb-16 sm:px-8 md:pt-10 md:pb-24 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-12">
          <div>
            <div className="mb-8 h-3 w-64 rounded-full bg-slate-100" />
            <div className="h-12 w-full max-w-xl rounded-full bg-slate-100" />
            <div className="mt-6 h-5 w-full max-w-2xl rounded-full bg-slate-100" />
          </div>
          <div className="h-44 rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-xl" />
        </div>
        <div className="mt-14 grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10">
          <div className="hidden h-96 rounded-2xl border border-slate-200/60 lg:block" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="h-72 rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-xl"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
