"use client";

import { Suspense, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
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
import { ParentCategoryLink } from "@/components/products/ParentCategoryLink";
import { ProductContactCTA } from "./ProductContactCTA";

interface ProductDetailPageProps {
  product: ProductDetail;
}

export function ProductDetailPage({ product }: ProductDetailPageProps) {
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
          <ProductGallery product={product} />
          <ProductSummary product={product} />
          <div className="min-w-0 lg:col-span-2">
            <ProductDescription product={product} />
          </div>
        </section>

        <section className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
          <div className="space-y-12">
            <ProductSpecifications product={product} />
          </div>

          <aside className="space-y-6">
            <ProductApplications title="Applications" items={product.applications} />
            <ProductApplications title="Available Options" items={product.options} />
            <ProductDownloads items={product.downloads} />
          </aside>
        </section>
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

function ProductBreadcrumbs({ product }: ProductDetailPageProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-xs tracking-widest text-slate-400 uppercase"
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-2">
        {product.breadcrumbs.map((item, index) => (
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

function ProductParentLink({
  parentCategory,
}: {
  parentCategory: ProductCategoryReference;
}) {
  const searchParams = useSearchParams();
  const rawReturnQuery = searchParams.get(PRODUCT_CATALOGUE_RETURN_QUERY_PARAM) ?? "";
  const href = useMemo(() => {
    if (!rawReturnQuery) {
      return parentCategory.route;
    }

    const sanitizedReturnQuery = createSearchParamsFromFilterState(
      createFilterStateFromSearchParams(new URLSearchParams(rawReturnQuery)),
    ).toString();

    return sanitizedReturnQuery
      ? `${parentCategory.route}?${sanitizedReturnQuery}`
      : parentCategory.route;
  }, [parentCategory.route, rawReturnQuery]);
  const label = `Back to ${parentCategory.shortName ?? parentCategory.name}`;

  return (
    <ProductParentLinkView parentCategory={parentCategory} href={href} label={label} />
  );
}

function ProductParentLinkView({
  parentCategory,
  href,
  label = `Back to ${parentCategory.shortName ?? parentCategory.name}`,
}: {
  parentCategory: ProductCategoryReference;
  href: string;
  label?: string;
}) {
  return (
    <ParentCategoryLink
      href={href}
      ariaLabel={`Back to ${parentCategory.name} product category`}
      label={label}
    />
  );
}

function ProductGallery({ product }: ProductDetailPageProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = product.images[selectedIndex];

  return (
    <section aria-labelledby="product-gallery-heading" className="min-w-0">
      <h2 id="product-gallery-heading" className="sr-only">
        Product image gallery
      </h2>

      <div className="overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-50/60 p-4 backdrop-blur-sm">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white">
          <Image
            key={selectedImage.src}
            src={selectedImage.src}
            alt={selectedImage.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 52vw"
            className="object-contain"
          />
        </div>
      </div>

      <div
        className="mt-4 flex gap-3 overflow-x-auto pb-2"
        role="list"
        aria-label="Product image thumbnails"
      >
        {product.images.map((image, index) => {
          const isSelected = index === selectedIndex;

          return (
            <button
              key={image.src}
              type="button"
              onClick={() => setSelectedIndex(index)}
              aria-label={`Show ${image.label} image`}
              aria-pressed={isSelected}
              className={[
                "group min-w-24 rounded-xl border bg-white p-2 text-left transition-colors focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:outline-none",
                isSelected
                  ? "border-slate-900"
                  : "border-slate-200/70 hover:border-slate-300",
              ].join(" ")}
            >
              <span className="relative block aspect-[4/3] overflow-hidden rounded-lg bg-slate-50">
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </span>
              <span
                className={[
                  "mt-2 block text-xs font-medium",
                  isSelected ? "text-slate-950" : "text-slate-500",
                ].join(" ")}
              >
                {image.label}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ProductSummary({ product }: ProductDetailPageProps) {
  return (
    <section aria-labelledby="product-title" className="min-w-0 pt-1">
      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">
        {product.categoryLabel}
      </p>
      <h1
        id="product-title"
        className="mt-4 text-4xl font-light tracking-normal text-slate-950 md:text-5xl"
      >
        {product.name}
      </h1>
      <p className="mt-6 text-base leading-7 text-slate-500">
        {product.shortDescription}
      </p>

      <ProductContactCTA
        product={{
          slug: product.slug,
          name: product.name,
          category: product.categoryLabel,
        }}
      />

      <div className="mt-8 rounded-2xl border border-slate-200/60 bg-white/70 p-5 backdrop-blur-sm">
        <h2 className="text-sm font-medium text-slate-950">Suitable for</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">{product.useCase}</p>
      </div>

      <SpecificationSummary items={product.summary} />
    </section>
  );
}

function SpecificationSummary({ items }: { items: ProductDetailSpecification[] }) {
  return (
    <dl className="mt-6 divide-y divide-slate-200/70 rounded-2xl border border-slate-200/60 bg-white/60 backdrop-blur-sm">
      {items.map((item) => (
        <div key={item.label} className="grid gap-1 px-5 py-4 sm:grid-cols-[9rem_1fr]">
          <dt className="text-xs font-medium tracking-wide text-slate-400 uppercase">
            {item.label}
          </dt>
          <dd className="text-sm text-slate-700">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ProductDescription({ product }: ProductDetailPageProps) {
  return (
    <section
      aria-labelledby="product-description-heading"
      className="border-t border-slate-200/60 pt-8"
    >
      <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-12">
        <SectionHeading
          id="product-description-heading"
          eyebrow="Overview"
          title="Description"
          description="A concise explanation of the display format, integration use cases, and configuration options."
        />
        <div className="space-y-4 text-sm leading-7 text-slate-500 md:text-base md:leading-8">
          {product.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductSpecifications({ product }: ProductDetailPageProps) {
  return (
    <section aria-labelledby="product-specifications-heading">
      <SectionHeading
        id="product-specifications-heading"
        eyebrow="Product information"
        title="Specifications"
        description={product.specificationNote}
      />
      <dl className="mt-6 divide-y divide-slate-200/70 rounded-2xl border border-slate-200/60 bg-white/60 backdrop-blur-sm">
        {product.specifications.map((specification) => (
          <div
            key={specification.label}
            className="grid gap-2 px-5 py-4 sm:grid-cols-[14rem_minmax(0,1fr)]"
          >
            <dt className="text-sm font-medium text-slate-950">
              {specification.label}
            </dt>
            <dd className="text-sm leading-6 text-slate-500">
              {specification.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function ProductApplications({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-2xl border border-slate-200/60 bg-white/70 p-5 backdrop-blur-sm">
      <h2 className="text-sm font-medium text-slate-950">{title}</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-slate-500">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProductDownloads({ items }: { items: string[] }) {
  return (
    <section
      id="product-downloads"
      className="rounded-2xl border border-slate-200/60 bg-slate-50/70 p-5 backdrop-blur-sm"
    >
      <h2 className="text-sm font-medium text-slate-950">Downloads</h2>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item}>
            <span className="block rounded-xl border border-dashed border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </section>
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
      <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">
        {eyebrow}
      </p>
      <h2 id={id} className="mt-2 text-2xl font-light text-slate-950">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
        {description}
      </p>
    </header>
  );
}
