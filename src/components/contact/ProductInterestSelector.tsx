"use client";

import type { KeyboardEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

import { useI18n } from "@/context/I18nContext";
import {
  getProductsForSelection,
  getPublicParentCategories,
  getPublicParentCategory,
  getSubcategoriesForParent,
  resolveProductInterest,
  type ProductInterestValue,
  type PublicInterestParentCategory,
  type PublicInterestProduct,
  type PublicInterestSubcategory,
} from "@/data/productInterest";

const visibleSubcategoryLimit = 5;

interface ProductInterestSelectorProps {
  value: ProductInterestValue | null;
  error?: string;
  onChange: (value: ProductInterestValue | null) => void;
}

export function ProductInterestSelector({
  value,
  error,
  onChange,
}: ProductInterestSelectorProps) {
  const { t } = useI18n();
  const [showAllSubcategories, setShowAllSubcategories] = useState(false);
  const firstCategoryRef = useRef<HTMLInputElement | null>(null);
  const categories = getPublicParentCategories();
  const selectedParent =
    value?.mode === "catalogue-selection"
      ? getPublicParentCategory(value.parentCategoryId)
      : undefined;
  const subcategories = selectedParent
    ? getSubcategoriesForParent(selectedParent.id)
    : [];
  const selectedSubcategory =
    value?.mode === "catalogue-selection" && value.subcategoryId
      ? subcategories.find((subcategory) => subcategory.id === value.subcategoryId)
      : undefined;
  const products = selectedParent
    ? getProductsForSelection(selectedParent.id, selectedSubcategory?.id)
    : [];
  const shouldShowProductSelector = Boolean(
    selectedParent &&
      (selectedSubcategory ||
        subcategories.length === 0 ||
        (value?.mode === "catalogue-selection" && value.productId)),
  );
  const hasSubcategoryOverflow = subcategories.length > visibleSubcategoryLimit;
  const visibleSubcategories = showAllSubcategories
    ? subcategories
    : subcategories.slice(0, visibleSubcategoryLimit);
  const resolvedSelection = value ? resolveProductInterest(value) : undefined;
  const summary = value
    ? value.mode === "needs-guidance"
      ? text(t, "needsGuidance")
      : [
          resolvedSelection?.parentCategory
            ? getParentCategoryLabel(t, resolvedSelection.parentCategory)
            : undefined,
          resolvedSelection?.subcategory
            ? getSubcategoryLabel(t, resolvedSelection.subcategory)
            : undefined,
          resolvedSelection?.product?.name,
        ]
          .filter(Boolean)
          .join(" / ")
    : "";

  function selectParent(parentCategoryId: string) {
    setShowAllSubcategories(false);
    onChange({ mode: "catalogue-selection", parentCategoryId });
  }

  function selectSubcategory(subcategoryId: string) {
    if (!selectedParent) return;

    onChange({
      mode: "catalogue-selection",
      parentCategoryId: selectedParent.id,
      subcategoryId,
    });
  }

  function selectProduct(productId?: string) {
    if (!selectedParent || value?.mode !== "catalogue-selection") return;

    onChange({
      mode: "catalogue-selection",
      parentCategoryId: selectedParent.id,
      ...(selectedSubcategory ? { subcategoryId: selectedSubcategory.id } : {}),
      ...(productId ? { productId } : {}),
    });
  }

  function clearSubcategory() {
    if (!selectedParent) return;

    onChange({
      mode: "catalogue-selection",
      parentCategoryId: selectedParent.id,
    });
  }

  const errorId = "contact-product-interest-error";
  const summaryId = "contact-product-interest-summary";

  return (
    <section
      aria-labelledby="contact-product-interest-heading"
      className="md:col-span-2"
    >
      <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
        <div className="max-w-2xl">
          <h3
            id="contact-product-interest-heading"
            className="text-base font-semibold text-slate-950"
          >
            {text(t, "heading")}
            <span className="ml-1 text-blue-700" aria-hidden="true">
              *
            </span>
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            {text(t, "instruction")}
          </p>
        </div>

        <fieldset
          aria-describedby={[error ? errorId : "", summary ? summaryId : ""]
            .filter(Boolean)
            .join(" ") || undefined}
          aria-invalid={error ? "true" : undefined}
          className="mt-5"
        >
          <legend className="text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase">
            {text(t, "parentLegend")}
          </legend>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {categories.map((category, index) => {
              const label = getParentCategoryLabel(t, category);
              const isSelected = selectedParent?.id === category.id;
              const inputId = `contact-product-interest-parent-${category.id}`;

              return (
                <label
                  key={category.id}
                  htmlFor={inputId}
                  className={[
                    "flex min-h-14 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-left transition focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2",
                    isSelected
                      ? "border-blue-500 bg-white text-slate-950 shadow-sm"
                      : "border-slate-200 bg-white/70 text-slate-700 hover:border-slate-300 hover:bg-white",
                  ].join(" ")}
                >
                  <input
                    ref={index === 0 ? firstCategoryRef : undefined}
                    id={inputId}
                    type="radio"
                    name="product-interest-choice"
                    value={category.id}
                    checked={isSelected}
                    onChange={() => selectParent(category.id)}
                    className="sr-only"
                    data-product-interest-focus={index === 0 ? "true" : undefined}
                  />
                  <RadioIndicator selected={isSelected} />
                  <span className="min-w-0 flex-1 text-sm font-semibold leading-5">
                    {label}
                  </span>
                  {isSelected ? (
                    <span className="sr-only">
                      {text(t, "selected")}
                    </span>
                  ) : null}
                </label>
              );
            })}
          </div>

          <label
            htmlFor="contact-product-interest-guidance"
            className={[
              "mt-3 flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2",
              value?.mode === "needs-guidance"
                ? "border-blue-500 bg-white text-slate-950"
                : "border-dashed border-slate-300 bg-transparent text-slate-600 hover:border-slate-400 hover:bg-white/70",
            ].join(" ")}
          >
            <input
              id="contact-product-interest-guidance"
              type="radio"
              name="product-interest-choice"
              value="needs-guidance"
              checked={value?.mode === "needs-guidance"}
              onChange={() => onChange({ mode: "needs-guidance" })}
              className="sr-only"
            />
            <RadioIndicator selected={value?.mode === "needs-guidance"} />
            <span>{text(t, "needsGuidance")}</span>
          </label>
        </fieldset>

        {selectedParent && subcategories.length > 0 ? (
          <fieldset className="mt-6 border-t border-slate-200 pt-5">
            <legend className="text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase">
              {text(t, "subcategoryLegend")}
            </legend>
            {selectedSubcategory ? (
              <button
                type="button"
                onClick={clearSubcategory}
                className="mt-2 rounded-sm text-xs font-semibold text-blue-700 underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                {text(t, "clearSubcategory")}
              </button>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              {visibleSubcategories.map((subcategory) => {
                const label = getSubcategoryLabel(t, subcategory);
                const isSelected = selectedSubcategory?.id === subcategory.id;
                const inputId = `contact-product-interest-subcategory-${subcategory.id}`;

                return (
                  <label
                    key={subcategory.id}
                    htmlFor={inputId}
                    className={[
                      "inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2",
                      isSelected
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-300 bg-white text-slate-700 hover:border-slate-400",
                    ].join(" ")}
                  >
                    <input
                      id={inputId}
                      type="radio"
                      name="product-interest-subcategory"
                      value={subcategory.id}
                      checked={isSelected}
                      onChange={() => selectSubcategory(subcategory.id)}
                      className="sr-only"
                    />
                    {isSelected ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
                    <span>{label}</span>
                  </label>
                );
              })}

              {hasSubcategoryOverflow ? (
                <button
                  type="button"
                  aria-expanded={showAllSubcategories}
                  onClick={() => setShowAllSubcategories((current) => !current)}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 outline-none transition hover:border-slate-400 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                >
                  {showAllSubcategories
                    ? text(t, "showFewer")
                    : text(t, "more")}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${showAllSubcategories ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
              ) : null}
            </div>
          </fieldset>
        ) : null}

        {shouldShowProductSelector ? (
          <div className="mt-6 border-t border-slate-200 pt-5">
            {products.length > 0 ? (
              <ProductCombobox
                key={`${selectedParent?.id ?? "none"}:${selectedSubcategory?.id ?? "direct"}`}
                products={products}
                value={
                  value?.mode === "catalogue-selection" ? value.productId : undefined
                }
                onChange={selectProduct}
              />
            ) : (
              <p className="text-sm leading-6 text-slate-600" role="status">
                {text(t, "noProducts")}
              </p>
            )}
          </div>
        ) : null}

        {error ? (
          <p id={errorId} role="alert" className="mt-4 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}

        {summary ? (
          <div
            id={summaryId}
            className="mt-6 flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="min-w-0" aria-live="polite" aria-atomic="true">
              <p className="text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase">
                {text(t, "selectedInterest")}
              </p>
              <p className="mt-1 break-words text-sm font-semibold leading-6 text-slate-950">
                {summary}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4">
              <button
                type="button"
                onClick={() => firstCategoryRef.current?.focus()}
                className="rounded-sm text-sm font-semibold text-blue-700 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                {text(t, "change")}
              </button>
              <button
                type="button"
                onClick={() => onChange(null)}
                className="rounded-sm text-sm font-semibold text-slate-600 outline-none hover:text-slate-950 hover:underline focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
              >
                {text(t, "clear")}
              </button>
            </div>
          </div>
        ) : null}

        <input
          type="hidden"
          name="productInterestMode"
          value={value?.mode ?? ""}
        />
        <input
          type="hidden"
          name="parentCategoryId"
          value={value?.mode === "catalogue-selection" ? value.parentCategoryId : ""}
        />
        <input
          type="hidden"
          name="subcategoryId"
          value={
            value?.mode === "catalogue-selection" ? value.subcategoryId ?? "" : ""
          }
        />
        <input
          type="hidden"
          name="productId"
          value={value?.mode === "catalogue-selection" ? value.productId ?? "" : ""}
        />
      </div>
    </section>
  );
}

interface ProductComboboxProps {
  products: readonly PublicInterestProduct[];
  value?: string;
  onChange: (productId?: string) => void;
}

function ProductCombobox({ products, value, onChange }: ProductComboboxProps) {
  const { t } = useI18n();
  const selectedProduct = products.find((product) => product.id === value);
  const [query, setQuery] = useState(selectedProduct?.name ?? "");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery || normalizedQuery === selectedProduct?.name.toLowerCase()) {
      return products;
    }

    return products.filter((product) =>
      `${product.name} ${product.description}`.toLowerCase().includes(normalizedQuery),
    );
  }, [products, query, selectedProduct?.name]);

  useEffect(() => {
    setActiveIndex((current) =>
      filteredProducts.length === 0 ? 0 : Math.min(current, filteredProducts.length - 1),
    );
  }, [filteredProducts.length]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function selectProduct(product: PublicInterestProduct) {
    onChange(product.id);
    setQuery(product.name);
    setIsOpen(false);
  }

  function clearProduct() {
    onChange(undefined);
    setQuery("");
    setActiveIndex(0);
    setIsOpen(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) =>
        filteredProducts.length === 0
          ? 0
          : Math.min(current + 1, filteredProducts.length - 1),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => Math.max(current - 1, 0));
      return;
    }

    if (event.key === "Enter" && isOpen && filteredProducts[activeIndex]) {
      event.preventDefault();
      selectProduct(filteredProducts[activeIndex]);
    }
  }

  const listboxId = "contact-product-interest-product-listbox";
  const labelId = "contact-product-interest-product-label";

  return (
    <div ref={wrapperRef}>
      <label
        id={labelId}
        htmlFor="contact-product-interest-product-search"
        className="text-xs font-semibold tracking-[0.12em] text-slate-500 uppercase"
      >
        {text(t, "productLabel")}
      </label>
      <div className="relative mt-3 max-w-2xl">
        <Search
          className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />
        <input
          id="contact-product-interest-product-search"
          type="text"
          role="combobox"
          aria-labelledby={labelId}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={
            isOpen && filteredProducts[activeIndex]
              ? `contact-product-interest-product-${filteredProducts[activeIndex].id}`
              : undefined
          }
          autoComplete="off"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(event) => {
            if (selectedProduct) {
              onChange(undefined);
            }
            setQuery(event.target.value);
            setActiveIndex(0);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={text(t, "productSearchPlaceholder")}
          className="h-12 w-full rounded-lg border border-slate-300 bg-white pr-12 pl-11 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20"
        />
        {query ? (
          <button
            type="button"
            aria-label={text(t, "clearProduct")}
            onClick={clearProduct}
            className="absolute top-1/2 right-2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-slate-500 outline-none transition hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}

        {isOpen ? (
          <div
            id={listboxId}
            role="listbox"
            aria-label={text(t, "productResults")}
            className="absolute z-40 mt-2 max-h-72 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white p-1.5 shadow-lg"
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <button
                  key={product.id}
                  id={`contact-product-interest-product-${product.id}`}
                  type="button"
                  role="option"
                  aria-selected={product.id === value}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectProduct(product)}
                  className={[
                    "block w-full rounded-md px-3 py-3 text-left outline-none transition",
                    index === activeIndex || product.id === value
                      ? "bg-blue-50"
                      : "hover:bg-slate-50",
                  ].join(" ")}
                >
                  <span className="block text-sm font-semibold text-slate-950">
                    {product.name}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    {product.description}
                  </span>
                </button>
              ))
            ) : (
              <p className="px-3 py-4 text-sm text-slate-500">
                {text(t, "productNoMatches")}
              </p>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function RadioIndicator({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={[
        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
        selected ? "border-blue-600 bg-blue-600" : "border-slate-400 bg-white",
      ].join(" ")}
    >
      {selected ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
    </span>
  );
}

function getParentCategoryLabel(
  t: (key: string) => string,
  category: PublicInterestParentCategory,
) {
  const translationKey = category.translationKey
    ? `megaMenu.products.sections.${category.translationKey}.heading`
    : undefined;

  return translationKey ? translateWithFallback(t, translationKey, category.name) : category.name;
}

function getSubcategoryLabel(
  t: (key: string) => string,
  subcategory: PublicInterestSubcategory,
) {
  const translationKey = subcategory.translationKey
    ? `megaMenu.products.links.${subcategory.translationKey}`
    : undefined;

  return translationKey
    ? translateWithFallback(t, translationKey, subcategory.name)
    : subcategory.name;
}

function text(t: (key: string) => string, key: string) {
  return t(`contactForm.productInterestSelector.${key}`);
}

function translateWithFallback(
  t: (key: string) => string,
  key: string,
  fallback: string,
) {
  const translated = t(key);

  return translated === key ? fallback : translated;
}
