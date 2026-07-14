"use client";

import Link from "next/link";
import { ChevronRight, Edit3, Layers3, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

import { createProductSlug } from "@/data/productCatalogue";
import type { SubcategoryDraft } from "@/lib/adminCatalogueDraft";
import {
  englishContentError,
  productAdminCopy as copy,
} from "@/lib/productAdminCopy";

import { AdminModal } from "./AdminModal";
import { useAdminCatalogue } from "./AdminCatalogueProvider";
import { SubcategoryOverflowList } from "./SubcategoryOverflowList";

export function CatalogueHierarchyEditor() {
  const { draft, isReady, updateDraft } = useAdminCatalogue();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [parentCategoryId, setParentCategoryId] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<SubcategoryDraft | null>(null);
  const [confirmProductsRemoval, setConfirmProductsRemoval] = useState(false);
  const slug = createProductSlug(subcategoryName);
  const existingSlugs = useMemo(
    () =>
      new Set([
        ...draft.categories.map((category) => category.slug),
        ...draft.categories.flatMap((category) =>
          category.subcategories.map((subcategory) => subcategory.slug),
        ),
      ]),
    [draft.categories],
  );
  const hasSlugConflict = Boolean(slug && existingSlugs.has(slug));
  const nameEnglishError = englishContentError(subcategoryName);
  const canAdd = Boolean(
    parentCategoryId &&
      subcategoryName.trim() &&
      slug &&
      !hasSlugConflict &&
      !nameEnglishError,
  );

  if (!isReady) {
    return <AdminEditorLoadingState label="Loading Product Catalogue hierarchy..." />;
  }

  function openEditor(categoryId = "") {
    setParentCategoryId(categoryId);
    setSubcategoryName("");
    setIsEditorOpen(true);
  }

  function addSubcategory() {
    if (!canAdd) {
      return;
    }

    updateDraft((current) => ({
      ...current,
      categories: current.categories.map((category) =>
        category.id === parentCategoryId
          ? {
              ...category,
              subcategories: [
                ...category.subcategories,
                {
                  id: `subcategory-${slug}`,
                  slug,
                  name: subcategoryName.trim(),
                  shortName: subcategoryName.trim(),
                  description: `Product options for ${subcategoryName.trim()} are being prepared in this unpublished draft.`,
                  parentCategoryId,
                  products: [],
                  isDraft: true,
                },
              ],
            }
          : category,
      ),
    }));
    setIsEditorOpen(false);
    setSubcategoryName("");
  }

  function requestDelete(subcategory: SubcategoryDraft) {
    setDeleteTarget(subcategory);
    setConfirmProductsRemoval(false);
    setIsEditorOpen(false);
  }

  function deleteSubcategory() {
    if (!deleteTarget || (deleteTarget.products.length > 0 && !confirmProductsRemoval)) {
      return;
    }

    updateDraft((current) => ({
      ...current,
      categories: current.categories.map((category) => ({
        ...category,
        subcategories: category.subcategories.filter(
          (subcategory) => subcategory.id !== deleteTarget.id,
        ),
      })),
    }));
    setDeleteTarget(null);
    setConfirmProductsRemoval(false);
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-6 pt-10 pb-20 sm:px-8 lg:px-12">
      <header className="flex flex-col gap-6 border-b border-slate-200/70 pb-9 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">
            Product management workspace
          </p>
          <h1 className="mt-3 text-3xl font-light text-slate-950 sm:text-4xl">
            {copy.catalogue.editor}
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-500">
            {copy.catalogue.description}
          </p>
        </div>
        <button
          type="button"
          onClick={() => openEditor()}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <Edit3 className="h-4 w-4" aria-hidden="true" />
          {copy.catalogue.editCatalogue}
        </button>
      </header>

      <section className="mt-10" aria-labelledby="catalogue-preview-heading">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">
            Product navigation
            </p>
            <h2 id="catalogue-preview-heading" className="mt-2 text-2xl font-light text-slate-950">
              {copy.catalogue.hierarchy}
            </h2>
          </div>
          <p className="text-sm text-slate-500">
            {draft.categories.length} {copy.catalogue.parentCategories}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {draft.categories.map((category) => (
            <article
              key={category.id}
              className="min-w-0 rounded-2xl border border-white/70 bg-white/70 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Layers3 className="h-4 w-4" aria-hidden="true" />
                    <span className="text-[11px] font-medium tracking-widest uppercase">
                  Parent category
                    </span>
                  </div>
                  <h3 className="mt-3 break-words text-xl font-light text-slate-950">
                    {category.name}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => openEditor(category.id)}
                  aria-label={`Edit subcategories in ${category.name}`}
                  className="inline-flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
                >
                  <Edit3 className="h-3.5 w-3.5" aria-hidden="true" />
                  {copy.shared.edit}
                </button>
              </div>

              <div className="mt-6 divide-y divide-slate-100 border-y border-slate-100">
                <Link
                  href={`/admin/catalogue/${category.slug}`}
                  className="group flex min-h-14 items-center justify-between gap-4 py-3 outline-none transition-colors hover:text-teal-700 focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-slate-800 group-hover:text-teal-700">
                      Manage {category.name} products
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-400">
                      {category.products.length} {copy.catalogue.products}
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-teal-600" aria-hidden="true" />
                </Link>
                {category.subcategories.length > 0 ? (
                  <SubcategoryOverflowList
                    categoryName={category.name}
                    subcategories={category.subcategories}
                  />
                ) : (
                  <p className="py-5 text-sm text-slate-500">{copy.catalogue.emptyCategory}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <AdminModal
        isOpen={isEditorOpen}
        title={copy.catalogue.editCatalogue}
        description={copy.subcategory.modalDescription}
        onClose={() => setIsEditorOpen(false)}
        size="large"
        footer={
          <>
            <button
              type="button"
              onClick={() => setIsEditorOpen(false)}
              className="h-10 rounded-xl px-4 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
            >
              {copy.shared.cancel}
            </button>
            <button
              type="button"
              onClick={addSubcategory}
              disabled={!canAdd}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              {copy.subcategory.add}
            </button>
          </>
        }
      >
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="space-y-5">
            <div>
              <label htmlFor="subcategory-parent" className="text-sm font-medium text-slate-800">
                {copy.subcategory.parent} <span aria-hidden="true">*</span>
              </label>
              <select
                id="subcategory-parent"
                required
                value={parentCategoryId}
                onChange={(event) => setParentCategoryId(event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              >
                <option value="">Select a parent category</option>
                {draft.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="subcategory-name" className="text-sm font-medium text-slate-800">
                {copy.subcategory.name} <span aria-hidden="true">*</span>
              </label>
              <input
                id="subcategory-name"
                required
                value={subcategoryName}
                onChange={(event) => setSubcategoryName(event.target.value)}
                placeholder="COG Displays"
                aria-describedby="subcategory-name-help subcategory-slug-help"
                className="mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
              <p id="subcategory-name-help" className="mt-2 text-xs leading-5 text-slate-500">
                {copy.subcategory.englishNameHint}
              </p>
              {nameEnglishError ? (
                <p role="alert" className="mt-1 text-xs text-rose-600">
                  {nameEnglishError}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="subcategory-slug" className="text-sm font-medium text-slate-800">
                {copy.subcategory.slug}
              </label>
              <input
                id="subcategory-slug"
                value={slug}
                readOnly
                tabIndex={-1}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 font-mono text-sm text-slate-500"
              />
              <p
                id="subcategory-slug-help"
                className={`mt-2 text-xs ${hasSlugConflict ? "text-rose-600" : "text-slate-400"}`}
              >
                {hasSlugConflict ? copy.subcategory.slugConflict : copy.subcategory.slugHint}
              </p>
            </div>
          </div>

          <section aria-labelledby="current-subcategories-heading">
            <h3 id="current-subcategories-heading" className="text-sm font-medium text-slate-950">
              {copy.subcategory.current}
            </h3>
            <div className="mt-3 space-y-4 rounded-xl border border-slate-200 p-3">
              {draft.categories
                .filter((category) => !parentCategoryId || category.id === parentCategoryId)
                .map((category) => (
                  <div key={category.id}>
                    {!parentCategoryId ? (
                      <p className="px-1 pb-2 text-[11px] font-medium tracking-widest text-slate-400 uppercase">
                        {category.shortName ?? category.name}
                      </p>
                    ) : null}
                    {category.subcategories.length > 0 ? (
                      <div className="divide-y divide-slate-100 border-y border-slate-100">
                        <SubcategoryOverflowList
                          categoryName={category.name}
                          subcategories={category.subcategories}
                          onDelete={requestDelete}
                        />
                      </div>
                    ) : (
                      <p className="px-1 py-3 text-sm text-slate-500">
                        {copy.catalogue.emptyCategory}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </section>
        </div>
      </AdminModal>

      <AdminModal
        isOpen={Boolean(deleteTarget)}
        title={copy.subcategory.deleteTitle}
        description={
          deleteTarget
            ? `Delete “${deleteTarget.name}”? Its products will also be removed from the current draft.`
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
              onClick={deleteSubcategory}
              disabled={Boolean(deleteTarget?.products.length && !confirmProductsRemoval)}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-rose-700 px-4 text-sm font-semibold text-white hover:bg-rose-800 disabled:cursor-not-allowed disabled:bg-rose-300 focus-visible:ring-2 focus-visible:ring-rose-700 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              {copy.subcategory.delete}
            </button>
          </>
        }
      >
        {deleteTarget ? (
          <div className="space-y-5">
            <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
              <p className="font-medium text-slate-950">{deleteTarget.name}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                This subcategory contains {deleteTarget.products.length} products. Deletion affects
                only the unpublished Admin draft.
              </p>
            </div>
            {deleteTarget.products.length > 0 ? (
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-700">
                <input
                  type="checkbox"
                  checked={confirmProductsRemoval}
                  onChange={(event) => setConfirmProductsRemoval(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-rose-700"
                />
                <span>{copy.subcategory.deleteAcknowledge}</span>
              </label>
            ) : null}
          </div>
        ) : null}
      </AdminModal>
    </main>
  );
}

function AdminEditorLoadingState({ label }: { label: string }) {
  return (
    <main className="mx-auto w-full max-w-7xl px-6 py-20 sm:px-8 lg:px-12">
      <div className="rounded-2xl border border-slate-200/70 bg-white/70 px-6 py-16 text-center text-sm text-slate-500 backdrop-blur-xl">
        {label}
      </div>
    </main>
  );
}
