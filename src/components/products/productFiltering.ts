"use client";

export type ProductFilterKey = "application" | "interface" | "format";

export interface ProductFilterState {
  query: string;
  selected: Record<ProductFilterKey, string[]>;
}

export interface FilterableProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  imageAlt?: string;
  filters: Record<ProductFilterKey, string[]>;
}

export interface ProductFilterSection {
  key: ProductFilterKey;
  label: string;
}

export interface ProductFilterOption {
  value: string;
  count: number;
  selected: boolean;
  disabled: boolean;
}

export interface ProductFilterSectionWithOptions extends ProductFilterSection {
  options: ProductFilterOption[];
}

export const productFilterSections = [
  { key: "application", label: "Application" },
  { key: "interface", label: "Interface / connection" },
  { key: "format", label: "Format" },
] as const satisfies readonly ProductFilterSection[];

export const emptyFilterState: ProductFilterState = {
  query: "",
  selected: {
    application: [],
    interface: [],
    format: [],
  },
};

export function createFilterStateFromSearchParams(
  searchParams: URLSearchParams,
): ProductFilterState {
  return {
    query: searchParams.get("q")?.trim() ?? "",
    selected: productFilterSections.reduce<ProductFilterState["selected"]>(
      (selected, section) => {
        selected[section.key] = searchParams
          .getAll(section.key)
          .flatMap((value) => value.split(","))
          .map((value) => value.trim())
          .filter(Boolean);

        return selected;
      },
      {
        application: [],
        interface: [],
        format: [],
      },
    ),
  };
}

export function createSearchParamsFromFilterState(state: ProductFilterState) {
  const params = new URLSearchParams();
  const query = state.query.trim();

  if (query) {
    params.set("q", query);
  }

  productFilterSections.forEach((section) => {
    state.selected[section.key].forEach((value) => {
      params.append(section.key, value);
    });
  });

  return params;
}

export function filterProducts<TProduct extends FilterableProduct>(
  products: readonly TProduct[],
  state: ProductFilterState,
) {
  return products.filter(
    (product) => matchesSearch(product, state.query) && matchesSelectedFilters(product, state),
  );
}

export function buildFilterSections(
  products: readonly FilterableProduct[],
  state: ProductFilterState,
): ProductFilterSectionWithOptions[] {
  return productFilterSections
    .map((section) => {
      const values = uniqueSortedValues(
        products.flatMap((product) => product.filters[section.key] ?? []),
      );

      return {
        ...section,
        options: values.map((value) => {
          const selected = state.selected[section.key].includes(value);
          const count = products.filter(
            (product) =>
              matchesSearch(product, state.query) &&
              matchesSelectedFilters(product, state, section.key) &&
              (product.filters[section.key] ?? []).includes(value),
          ).length;

          return {
            value,
            count,
            selected,
            disabled: count === 0 && !selected,
          };
        }),
      };
    })
    .filter((section) => section.options.length > 0);
}

export function countActiveFilters(state: ProductFilterState) {
  return productFilterSections.reduce(
    (count, section) => count + state.selected[section.key].length,
    0,
  );
}

export function hasActiveFilters(state: ProductFilterState) {
  return state.query.trim().length > 0 || countActiveFilters(state) > 0;
}

function matchesSearch(product: FilterableProduct, query: string) {
  const normalizedQuery = normalize(query);

  if (!normalizedQuery) {
    return true;
  }

  return normalize(
    [
      product.name,
      product.description,
      ...Object.values(product.filters).flat(),
    ].join(" "),
  ).includes(normalizedQuery);
}

function matchesSelectedFilters(
  product: FilterableProduct,
  state: ProductFilterState,
  excludeKey?: ProductFilterKey,
) {
  return productFilterSections.every((section) => {
    if (section.key === excludeKey) {
      return true;
    }

    const selectedValues = state.selected[section.key];

    if (selectedValues.length === 0) {
      return true;
    }

    const productValues = product.filters[section.key] ?? [];

    return selectedValues.some((value) => productValues.includes(value));
  });
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function uniqueSortedValues(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );
}
