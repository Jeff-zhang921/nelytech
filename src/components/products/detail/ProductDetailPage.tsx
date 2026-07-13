"use client";

import { Suspense, useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { useSearchParams } from "next/navigation";

import type {
  ProductCategoryReference,
  ProductDetail,
  ProductDetailSpecification,
} from "@/data/productDetails";
import { PRODUCT_CATALOGUE_RETURN_QUERY_PARAM } from "@/data/productDetails";
import {
  createFilterStateFromSearchParams,
  createSearchParamsFromFilterState,
} from "@/components/products/productFiltering";
import { getFilterSchemaForCatalogueNode } from "@/data/categoryFilterSchemas";
import { ParentCategoryLink } from "@/components/products/ParentCategoryLink";
import { ProductContactCTA } from "./ProductContactCTA";
import { productAdminCopy as adminCopy } from "@/lib/productAdminCopy";

export type ProductDetailSectionKey =
  | "summary"
  | "gallery"
  | "description"
  | "specifications"
  | "applications"
  | "options"
  | "downloads";

interface ProductDetailPageProps {
  product: ProductDetail;
  mode?: "public" | "admin-preview";
  onEditSection?: (section: ProductDetailSectionKey) => void;
}

type DetailSectionProps = ProductDetailPageProps & {
  isAdminPreview: boolean;
};

export function ProductDetailPage({
  product,
  mode = "public",
  onEditSection,
}: ProductDetailPageProps) {
  const isAdminPreview = mode === "admin-preview";
  const sectionProps = { product, mode, onEditSection, isAdminPreview };
  const hasSidebarContent =
    isAdminPreview ||
    product.applications.length > 0 ||
    product.options.length > 0 ||
    product.downloads.length > 0;
  const hasInformationContent = isAdminPreview || product.specifications.length > 0;

  return (
    <main className="relative isolate overflow-hidden bg-transparent">
      <ProductDetailBackground />
      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-8 pb-16 sm:px-8 md:pt-10 md:pb-24 lg:px-12">
        <div className="mb-8 space-y-4">
          <ProductBreadcrumbs product={product} />
          <Suspense
            fallback={
              <ProductParentLinkView
                parentCategory={product.parentCategory}
                href={product.parentCategory.route}
              />
            }
          >
            <ProductParentLink parentCategory={product.parentCategory} />
          </Suspense>
        </div>

        <section className="grid gap-x-10 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.82fr)] lg:items-start">
          <ProductGallery {...sectionProps} />
          <ProductSummary {...sectionProps} />
          {(isAdminPreview || product.description.length > 0) && (
            <div className="min-w-0 lg:col-span-2">
              <ProductDescription {...sectionProps} />
            </div>
          )}
        </section>

        {(hasInformationContent || hasSidebarContent) && (
          <section
            className={[
              "mt-12 grid gap-10 lg:gap-12",
              hasSidebarContent
                ? "lg:grid-cols-[minmax(0,1fr)_20rem]"
                : "lg:grid-cols-1",
            ].join(" ")}
          >
            {hasInformationContent ? <ProductSpecifications {...sectionProps} /> : null}

            {hasSidebarContent ? (
              <aside className="space-y-6">
                <ProductApplications
                  title="Applications"
                  items={product.applications}
                  section="applications"
                  placeholder={adminCopy.placeholders.application}
                  {...sectionProps}
                />
                <ProductApplications
                  title="Available Options"
                  items={product.options}
                  section="options"
                  placeholder={adminCopy.placeholders.options}
                  {...sectionProps}
                />
                <ProductDownloads {...sectionProps} />
              </aside>
            ) : null}
          </section>
        )}
      </section>
    </main>
  );
}

function ProductDetailBackground() {
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

function ProductBreadcrumbs({ product }: { product: ProductDetail }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs tracking-widest text-slate-400 uppercase">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
        {product.breadcrumbs.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
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

function ProductParentLink({
  parentCategory,
}: {
  parentCategory: ProductCategoryReference;
}) {
  const searchParams = useSearchParams();
  const rawReturnQuery = searchParams.get(PRODUCT_CATALOGUE_RETURN_QUERY_PARAM) ?? "";
  const filterSchema = getFilterSchemaForCatalogueNode(parentCategory.slug);
  const href = useMemo(() => {
    if (!rawReturnQuery) {
      return parentCategory.route;
    }

    const sanitizedReturnQuery = createSearchParamsFromFilterState(
      createFilterStateFromSearchParams(
        new URLSearchParams(rawReturnQuery),
        filterSchema,
      ),
      filterSchema,
    ).toString();

    return sanitizedReturnQuery
      ? `${parentCategory.route}?${sanitizedReturnQuery}`
      : parentCategory.route;
  }, [filterSchema, parentCategory.route, rawReturnQuery]);

  return <ProductParentLinkView parentCategory={parentCategory} href={href} />;
}

function ProductParentLinkView({
  parentCategory,
  href,
}: {
  parentCategory: ProductCategoryReference;
  href: string;
}) {
  return (
    <ParentCategoryLink
      href={href}
      ariaLabel={`Back to ${parentCategory.name} product category`}
      label={`Back to ${parentCategory.shortName ?? parentCategory.name}`}
    />
  );
}

function ProductGallery(props: DetailSectionProps) {
  const { product, isAdminPreview, onEditSection } = props;
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (selectedIndex >= product.images.length) {
      setSelectedIndex(0);
    }
  }, [product.images.length, selectedIndex]);

  if (product.images.length === 0) {
    if (!isAdminPreview) {
      return null;
    }

    return (
      <EditableSection section="gallery" label="Gallery" onEdit={onEditSection}>
        <section aria-labelledby="product-gallery-heading" className="min-w-0">
          <h2 id="product-gallery-heading" className="sr-only">Product image gallery</h2>
          <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/55 p-8 text-center backdrop-blur-sm">
            <AdminPlaceholder>{adminCopy.placeholders.mainImage}</AdminPlaceholder>
          </div>
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white/50 p-4 text-center">
            <AdminPlaceholder>{adminCopy.placeholders.gallery}</AdminPlaceholder>
          </div>
        </section>
      </EditableSection>
    );
  }

  const selectedImage = product.images[selectedIndex] ?? product.images[0];

  return (
    <EditableSection section="gallery" label="Gallery" onEdit={onEditSection} enabled={isAdminPreview}>
      <section aria-labelledby="product-gallery-heading" className="min-w-0">
        <h2 id="product-gallery-heading" className="sr-only">Product image gallery</h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-50/60 p-4 backdrop-blur-sm">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white">
            <Image
              key={selectedImage.src}
              src={selectedImage.src}
              alt={selectedImage.alt || `${product.name} product image`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-contain"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2" role="list" aria-label="Product image thumbnails">
          {product.images.map((image, index) => {
            const isSelected = index === selectedIndex;
            return (
              <button
                key={`${image.src}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Show ${image.label} image`}
                aria-pressed={isSelected}
                className={[
                  "group min-w-24 rounded-xl border bg-white p-2 text-left transition-colors focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:outline-none",
                  isSelected ? "border-slate-900" : "border-slate-200/70 hover:border-slate-300",
                ].join(" ")}
              >
                <span className="relative block aspect-[4/3] overflow-hidden rounded-lg bg-slate-50">
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    priority={index === 0}
                    sizes="96px"
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </span>
                <span className={`mt-2 block text-xs font-medium ${isSelected ? "text-slate-950" : "text-slate-500"}`}>
                  {image.label}
                </span>
              </button>
            );
          })}
          {isAdminPreview ? (
            <button
              type="button"
              onClick={() => onEditSection?.("gallery")}
              className="min-w-32 rounded-xl border border-dashed border-slate-300 bg-white/50 p-3 text-left focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
            >
              <AdminPlaceholder>{adminCopy.placeholders.gallery}</AdminPlaceholder>
            </button>
          ) : null}
        </div>
      </section>
    </EditableSection>
  );
}

function ProductSummary({ product, isAdminPreview, onEditSection }: DetailSectionProps) {
  return (
    <EditableSection section="summary" label="Product Summary" onEdit={onEditSection} enabled={isAdminPreview}>
      <section aria-labelledby="product-title" className="min-w-0 pt-1">
        <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">
          {product.categoryLabel || (isAdminPreview ? <AdminPlaceholder>{adminCopy.placeholders.productType}</AdminPlaceholder> : null)}
        </p>
        <h1 id="product-title" className="mt-4 text-4xl font-light tracking-normal text-slate-950 md:text-5xl">
          {product.name || (isAdminPreview ? <AdminPlaceholder>{adminCopy.placeholders.title}</AdminPlaceholder> : null)}
        </h1>
        <div className="mt-6 text-base leading-7 text-slate-500">
          {product.shortDescription || (isAdminPreview ? <AdminPlaceholder>{adminCopy.placeholders.introduction}</AdminPlaceholder> : null)}
        </div>

        <ProductContactCTA product={{ slug: product.slug, name: product.name, category: product.categoryLabel }} />

        <div className="mt-8 rounded-2xl border border-slate-200/60 bg-white/70 p-5 backdrop-blur-sm">
          <h2 className="text-sm font-medium text-slate-950">Suitable for</h2>
          <div className="mt-3 text-sm leading-6 text-slate-500">
            {product.useCase || (isAdminPreview ? <AdminPlaceholder>{adminCopy.placeholders.suitable}</AdminPlaceholder> : null)}
          </div>
        </div>

        <SpecificationSummary items={product.summary} isAdminPreview={isAdminPreview} />
      </section>
    </EditableSection>
  );
}

function SpecificationSummary({
  items,
  isAdminPreview,
}: {
  items: ProductDetailSpecification[];
  isAdminPreview: boolean;
}) {
  if (items.length === 0 && !isAdminPreview) {
    return null;
  }

  const previewItems = items.length > 0 ? items : [{ label: "", value: "" }];
  return (
    <dl className={`mt-6 divide-y divide-slate-200/70 rounded-2xl border bg-white/60 backdrop-blur-sm ${items.length ? "border-slate-200/60" : "border-dashed border-slate-300"}`}>
      {previewItems.map((item, index) => (
        <div key={`${item.label}-${index}`} className="grid gap-1 px-5 py-4 sm:grid-cols-[9rem_1fr]">
          <dt className="text-xs font-medium tracking-wide text-slate-400 uppercase">
            {item.label || (isAdminPreview ? <AdminPlaceholder>Enter an information label in English.</AdminPlaceholder> : null)}
          </dt>
          <dd className="text-sm text-slate-700">
            {item.value || (isAdminPreview ? <AdminPlaceholder>Enter an information value in English.</AdminPlaceholder> : null)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function ProductDescription({ product, isAdminPreview, onEditSection }: DetailSectionProps) {
  return (
    <EditableSection section="description" label="Description" onEdit={onEditSection} enabled={isAdminPreview}>
      <section aria-labelledby="product-description-heading" className="border-t border-slate-200/60 pt-8">
        <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-12">
          <SectionHeading id="product-description-heading" eyebrow="Overview" title="Description" description="A concise explanation of the display format, integration use cases, and configuration options." />
          <div className={`space-y-4 text-sm leading-7 text-slate-500 md:text-base md:leading-8 ${product.description.length ? "" : "rounded-xl border border-dashed border-slate-300 bg-white/50 p-5"}`}>
            {product.description.length > 0
              ? product.description.map((paragraph, index) => <p key={`${paragraph}-${index}`}>{paragraph}</p>)
              : <AdminPlaceholder>{adminCopy.placeholders.description}</AdminPlaceholder>}
          </div>
        </div>
      </section>
    </EditableSection>
  );
}

function ProductSpecifications({ product, isAdminPreview, onEditSection }: DetailSectionProps) {
  const hasInformationRows = product.specifications.length > 0;
  return (
    <EditableSection section="specifications" label="Product Information" onEdit={onEditSection} enabled={isAdminPreview}>
      <section aria-labelledby="product-specifications-heading">
        <SectionHeading
          id="product-specifications-heading"
          eyebrow="Product information"
          title="Specifications"
          description={product.specificationNote || (isAdminPreview ? adminCopy.placeholders.information : "")}
        />
        {hasInformationRows ? (
          <dl className="mt-6 divide-y divide-slate-200/70 rounded-2xl border border-slate-200/60 bg-white/60 backdrop-blur-sm">
            {product.specifications.map((item, index) => (
              <div key={`${item.label}-${index}`} className="grid gap-2 px-5 py-4 sm:grid-cols-[14rem_minmax(0,1fr)]">
                <dt className="text-sm font-medium text-slate-950">{item.label}</dt>
                <dd className="text-sm leading-6 text-slate-500">{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : isAdminPreview ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white/55 p-5 backdrop-blur-sm sm:p-6">
            <h3 className="text-base font-medium text-slate-950">{adminCopy.detail.informationEmpty}</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              {adminCopy.detail.informationEmptyHelp}
            </p>
            <dl aria-hidden="true" className="mt-5 divide-y divide-slate-200/70 rounded-xl border border-slate-200/70 bg-white/70 text-xs text-slate-400">
              {[
                ["Display Type", "4-Digit 7-Segment Display"],
                ["Operating Voltage", "Based on selected model"],
                ["Connection Type", "Common anode or common cathode"],
                ["Customisation", "Size, colour, pin layout and electrical configuration"],
              ].map(([label, value]) => (
                <div key={label} className="grid gap-1 px-4 py-3 sm:grid-cols-[12rem_minmax(0,1fr)]">
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs leading-5 text-slate-400">
              These English examples are editing guidance only and are not saved as confirmed
              product data.
            </p>
          </div>
        ) : null}
      </section>
    </EditableSection>
  );
}

function ProductApplications({
  title,
  items,
  section,
  placeholder,
  isAdminPreview,
  onEditSection,
}: DetailSectionProps & {
  title: string;
  items: string[];
  section: "applications" | "options";
  placeholder: string;
}) {
  if (items.length === 0 && !isAdminPreview) {
    return null;
  }

  return (
    <EditableSection section={section} label={section === "applications" ? "Applications" : "Available Options"} onEdit={onEditSection} enabled={isAdminPreview}>
      <section className={`rounded-2xl border bg-white/70 p-5 backdrop-blur-sm ${items.length ? "border-slate-200/60" : "border-dashed border-slate-300"}`}>
        <h2 className="text-sm font-medium text-slate-950">{title}</h2>
        {items.length ? (
          <ul className="mt-4 space-y-3">
            {items.map((item, index) => (
              <li key={`${item}-${index}`} className="flex gap-3 text-sm leading-6 text-slate-500">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4"><AdminPlaceholder>{placeholder}</AdminPlaceholder></div>
        )}
      </section>
    </EditableSection>
  );
}

function ProductDownloads({ product, isAdminPreview, onEditSection }: DetailSectionProps) {
  if (product.downloads.length === 0 && !isAdminPreview) {
    return null;
  }

  return (
    <EditableSection section="downloads" label="Downloads" onEdit={onEditSection} enabled={isAdminPreview}>
      <section id="product-downloads" className={`rounded-2xl border bg-slate-50/70 p-5 backdrop-blur-sm ${product.downloads.length ? "border-slate-200/60" : "border-dashed border-slate-300"}`}>
        <h2 className="text-sm font-medium text-slate-950">Downloads</h2>
        {product.downloads.length ? (
          <ul className="mt-4 space-y-3">
            {product.downloads.map((item, index) => (
              <li key={`${item}-${index}`}>
                <span className="block rounded-xl border border-dashed border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4"><AdminPlaceholder>{adminCopy.placeholders.downloads}</AdminPlaceholder></div>
        )}
      </section>
    </EditableSection>
  );
}

function EditableSection({
  section,
  label,
  onEdit,
  enabled = true,
  children,
}: {
  section: ProductDetailSectionKey;
  label: string;
  onEdit?: (section: ProductDetailSectionKey) => void;
  enabled?: boolean;
  children: ReactNode;
}) {
  if (!enabled) {
    return children;
  }

  return (
    <div className="group/admin-section relative rounded-2xl outline-none transition hover:ring-1 hover:ring-slate-300/80 focus-within:ring-1 focus-within:ring-slate-300/80">
      <button
        type="button"
        onClick={() => onEdit?.(section)}
        aria-label={`Edit ${label}`}
        className="absolute top-3 right-3 z-20 inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white/95 px-3 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur transition hover:border-slate-300 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
      >
        <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
        {adminCopy.shared.edit}
      </button>
      {children}
    </div>
  );
}

function AdminPlaceholder({ children }: { children: ReactNode }) {
  return (
    <span
      data-admin-placeholder="true"
      aria-label="Empty-field editing guidance"
      className="text-sm font-normal normal-case italic tracking-normal text-slate-400"
    >
      {children}
    </span>
  );
}

function SectionHeading({
  id,
  eyebrow,
  title,
  description,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header>
      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">{eyebrow}</p>
      <h2 id={id} className="mt-2 text-2xl font-light text-slate-950">{title}</h2>
      {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">{description}</p> : null}
    </header>
  );
}
