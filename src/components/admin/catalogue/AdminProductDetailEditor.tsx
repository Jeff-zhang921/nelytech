"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  FilePlus2,
  ImagePlus,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState, type ChangeEvent, type ReactNode } from "react";

import {
  ProductDetailPage,
  type ProductDetailSectionKey,
} from "@/components/products/detail/ProductDetailPage";
import {
  createAdminProductDetailPreview,
  findDraftProduct,
  normalizeProductDetailDraft,
  updateProductCollection,
  type EditableTextItem,
  type ProductDetailDraft,
  type SpecificationDraft,
} from "@/lib/adminCatalogueDraft";
import {
  containsSubstantialChinese,
  englishContentHint,
  productAdminCopy as copy,
} from "@/lib/productAdminCopy";

import { AdminModal } from "./AdminModal";
import { useAdminCatalogue } from "./AdminCatalogueProvider";

const maximumImageSize = 1_500_000;
const supportedImageTypes = ["image/jpeg", "image/png", "image/webp"];

export function AdminProductDetailEditor({
  subcategorySlug,
  productSlug,
}: {
  subcategorySlug: string;
  productSlug: string;
}) {
  const { draft, isReady, updateDraft } = useAdminCatalogue();
  const match = findDraftProduct(draft, subcategorySlug, productSlug);
  const [activeSection, setActiveSection] = useState<ProductDetailSectionKey | null>(null);
  const [workingDetail, setWorkingDetail] = useState<ProductDetailDraft | null>(null);
  const [workingProductName, setWorkingProductName] = useState("");
  const workingEnglishError = useMemo(
    () =>
      workingDetail
        ? getDetailEnglishError(workingProductName, workingDetail)
        : undefined,
    [workingDetail, workingProductName],
  );

  const previewProduct = useMemo(
    () =>
      match
        ? createAdminProductDetailPreview(match.product, match.subcategory, match.category)
        : null,
    [match],
  );

  if (!isReady) {
    return <EditorStateMessage>{copy.detail.loading}</EditorStateMessage>;
  }

  if (!match || !previewProduct) {
    return (
      <EditorStateMessage>
        <h1 className="text-2xl font-light text-slate-950">{copy.detail.notFound}</h1>
        <Link
          href={`/admin/catalogue/${subcategorySlug}`}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {copy.detail.backSubcategory}
        </Link>
      </EditorStateMessage>
    );
  }

  const { product, subcategory } = match;
  const productId = product.id;
  const subcategoryId = subcategory.id;

  function openSection(section: ProductDetailSectionKey) {
    setWorkingDetail(structuredClone(product.detail));
    setWorkingProductName(product.name);
    setActiveSection(section);
  }

  function closeSection() {
    setActiveSection(null);
    setWorkingDetail(null);
  }

  function saveSection() {
    if (!workingDetail || !workingProductName.trim() || workingEnglishError) {
      return;
    }

    updateDraft((current) =>
      updateProductCollection(current, subcategoryId, (products) =>
        products.map((product) =>
          product.id === productId
            ? {
                ...product,
                name: workingProductName.trim(),
                detail: normalizeProductDetailDraft(
                  structuredClone(workingDetail),
                ),
              }
            : product,
        ),
      ),
    );
    closeSection();
  }

  return (
    <>
      <div className="relative z-20 mx-auto -mb-3 flex w-full max-w-7xl items-center justify-between gap-4 px-6 pt-6 sm:px-8 lg:px-12">
        <p className="text-xs font-medium tracking-widest text-slate-400 uppercase">
          {copy.detail.editor}
        </p>
        <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-500 backdrop-blur">
          {copy.detail.allOptional}
        </span>
      </div>

      <ProductDetailPage
        product={previewProduct}
        mode="admin-preview"
        onEditSection={openSection}
      />

      <AdminModal
        isOpen={Boolean(activeSection && workingDetail)}
        title={activeSection ? sectionTitles[activeSection] : copy.detail.editor}
        description={copy.detail.modalDescription}
        onClose={closeSection}
        size="large"
        footer={
          <>
            <button
              type="button"
              onClick={closeSection}
              className="h-10 rounded-xl px-4 text-sm font-medium text-slate-600 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none"
            >
              {copy.shared.cancel}
            </button>
            <button
              type="button"
              onClick={saveSection}
              disabled={!workingProductName.trim() || Boolean(workingEnglishError)}
              className="h-10 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {copy.detail.saveSection}
            </button>
          </>
        }
      >
        {workingDetail && activeSection ? (
          <>
            <EnglishContentHint />
            {workingEnglishError ? (
              <p role="alert" className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {workingEnglishError}
              </p>
            ) : null}
            <div className="mt-6">
              <SectionEditor
                section={activeSection}
                detail={workingDetail}
                productName={workingProductName}
                onProductNameChange={setWorkingProductName}
                onChange={setWorkingDetail}
              />
            </div>
          </>
        ) : null}
      </AdminModal>
    </>
  );
}

const sectionTitles: Record<ProductDetailSectionKey, string> = {
  summary: copy.detail.summary,
  gallery: copy.detail.gallery,
  description: copy.detail.description,
  specifications: copy.detail.information,
  applications: copy.detail.applications,
  options: copy.detail.options,
  downloads: copy.detail.downloads,
};

function SectionEditor({
  section,
  detail,
  productName,
  onProductNameChange,
  onChange,
}: {
  section: ProductDetailSectionKey;
  detail: ProductDetailDraft;
  productName: string;
  onProductNameChange: (value: string) => void;
  onChange: (detail: ProductDetailDraft) => void;
}) {
  switch (section) {
    case "summary":
      return (
        <SummaryEditor
          detail={detail}
          productName={productName}
          onProductNameChange={onProductNameChange}
          onChange={onChange}
        />
      );
    case "gallery":
      return <GalleryEditor detail={detail} onChange={onChange} />;
    case "description":
      return (
        <TextListEditor
          label="Product description paragraph"
          addLabel={copy.detail.addParagraph}
          items={detail.descriptionParagraphs}
          multiline
          onChange={(descriptionParagraphs) => onChange({ ...detail, descriptionParagraphs })}
        />
      );
    case "specifications":
      return <SpecificationsEditor detail={detail} onChange={onChange} />;
    case "applications":
      return (
        <TextListEditor
          label="Application"
          addLabel={copy.detail.addApplication}
          items={detail.applications}
          onChange={(applications) => onChange({ ...detail, applications })}
        />
      );
    case "options":
      return <OptionsEditor detail={detail} onChange={onChange} />;
    case "downloads":
      return <DownloadsEditor detail={detail} onChange={onChange} />;
  }
}

function SummaryEditor({
  detail,
  productName,
  onProductNameChange,
  onChange,
}: {
  detail: ProductDetailDraft;
  productName: string;
  onProductNameChange: (value: string) => void;
  onChange: (detail: ProductDetailDraft) => void;
}) {
  return (
    <div className="space-y-6">
      <EditorField label={copy.product.name} required>
        <input
          value={productName}
          onChange={(event) => onProductNameChange(event.target.value)}
          className={inputClassName}
        />
      </EditorField>
      <EditorField label={copy.detail.productType} optional>
        <input
          value={detail.productTypeLabel ?? ""}
          onChange={(event) => onChange({ ...detail, productTypeLabel: event.target.value })}
          className={inputClassName}
        />
      </EditorField>
      <EditorField label={copy.detail.introduction} optional>
        <textarea
          rows={4}
          value={detail.introduction ?? ""}
          onChange={(event) => onChange({ ...detail, introduction: event.target.value })}
          className={`${textareaClassName} mt-2`}
        />
      </EditorField>
      <EditorField label={copy.detail.suitable} optional>
        <textarea
          rows={3}
          value={detail.suitableFor ?? ""}
          onChange={(event) => onChange({ ...detail, suitableFor: event.target.value })}
          className={`${textareaClassName} mt-2`}
        />
      </EditorField>
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-sm font-medium text-slate-950">{copy.detail.quickRows}</h3>
        <p className="mt-1 text-xs text-slate-500">{copy.detail.quickRowsHint}</p>
        <SpecificationRows
          items={detail.summary}
          onChange={(summary) => onChange({ ...detail, summary })}
        />
      </div>
    </div>
  );
}

function GalleryEditor({
  detail,
  onChange,
}: {
  detail: ProductDetailDraft;
  onChange: (detail: ProductDetailDraft) => void;
}) {
  const [imageError, setImageError] = useState("");
  const images = [...detail.images].sort((left, right) => left.order - right.order);

  async function addImages(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    const invalidFile = files.find(
      (file) => !supportedImageTypes.includes(file.type) || file.size > maximumImageSize,
    );
    if (invalidFile) {
      setImageError("Each image must be a JPG, PNG, or WebP file smaller than 1.5 MB.");
      return;
    }

    const sources = await Promise.all(files.map(readImageFile));
    const nextImages = [
      ...images,
      ...sources.map(({ src, name }, index) => ({
        id: createItemId("detail-image"),
        src,
        alt: `${name.replace(/\.[^.]+$/, "")} product image`,
        label: `View ${images.length + index + 1}`,
        isPrimary: images.length === 0 && index === 0,
        order: images.length + index,
      })),
    ];
    setImageError("");
    onChange({ ...detail, images: normalizeOrder(nextImages) });
  }

  async function replaceImage(event: ChangeEvent<HTMLInputElement>, imageId: string) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!supportedImageTypes.includes(file.type) || file.size > maximumImageSize) {
      setImageError("Select a JPG, PNG, or WebP image smaller than 1.5 MB.");
      return;
    }
    const { src } = await readImageFile(file);
    onChange({
      ...detail,
      images: images.map((image) =>
        image.id === imageId ? { ...image, src, previewSrc: undefined } : image,
      ),
    });
    setImageError("");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
        <div>
          <p className="text-sm font-medium text-slate-950">{copy.detail.galleryImages}</p>
          <p className="mt-1 text-xs text-slate-500">{copy.detail.galleryHint}</p>
        </div>
        <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white focus-within:ring-2 focus-within:ring-slate-950 focus-within:ring-offset-2">
          <ImagePlus className="h-4 w-4" aria-hidden="true" />
          {copy.detail.addImages}
          <input type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={addImages} className="sr-only" />
        </label>
      </div>
      {imageError ? <p role="alert" className="mt-3 text-sm text-rose-600">{imageError}</p> : null}

      <div className="mt-5 space-y-4">
        {images.map((image, index) => (
          <div key={image.id} className="grid gap-4 rounded-xl border border-slate-200 p-4 sm:grid-cols-[8rem_minmax(0,1fr)_auto]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-50">
              {image.src ? <Image src={image.previewSrc ?? image.src} alt="" fill sizes="128px" className="object-contain" /> : null}
            </div>
            <div className="space-y-3">
              <input
                aria-label={`Label for image ${index + 1}`}
                value={image.label ?? ""}
                onChange={(event) => onChange({ ...detail, images: updateItem(images, image.id, { label: event.target.value }) })}
                placeholder="Example: Front View"
                className={inputClassName}
              />
              <input
                aria-label={`Alt text for image ${index + 1}`}
                value={image.alt ?? ""}
                onChange={(event) => onChange({ ...detail, images: updateItem(images, image.id, { alt: event.target.value }) })}
                placeholder="Enter image alt text in English"
                className={inputClassName}
              />
              <div className="flex flex-wrap items-center gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600">
                  <input
                    type="radio"
                    name="primary-detail-image"
                    checked={Boolean(image.isPrimary)}
                    onChange={() => onChange({ ...detail, images: images.map((item) => ({ ...item, isPrimary: item.id === image.id })) })}
                  />
                  {copy.detail.primaryImage}
                </label>
                <label className="cursor-pointer text-xs font-medium text-slate-700 underline underline-offset-4">
                  {copy.detail.replace}
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => replaceImage(event, image.id)} className="sr-only" />
                </label>
              </div>
            </div>
            <OrderControls
              label={`image ${index + 1}`}
              index={index}
              count={images.length}
              onMove={(direction) => onChange({ ...detail, images: moveItem(images, index, direction) })}
              onRemove={() => {
                const remaining = normalizeOrder(images.filter((item) => item.id !== image.id));
                if (image.isPrimary && remaining[0]) remaining[0].isPrimary = true;
                onChange({ ...detail, images: remaining });
              }}
            />
          </div>
        ))}
        {images.length === 0 ? <EmptyEditorMessage>{copy.detail.noImages}</EmptyEditorMessage> : null}
      </div>
    </div>
  );
}

function SpecificationsEditor({
  detail,
  onChange,
}: {
  detail: ProductDetailDraft;
  onChange: (detail: ProductDetailDraft) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="product-information-additional-explanation"
          className="text-sm font-medium text-slate-800"
        >
          {copy.detail.additionalExplanation} <span className="font-normal text-slate-400">({copy.shared.optional})</span>
        </label>
        <p
          id="product-information-additional-explanation-help"
          className="mt-1.5 text-xs leading-5 text-slate-500"
        >
          {copy.detail.additionalHelp}
        </p>
        <textarea
          id="product-information-additional-explanation"
          aria-describedby="product-information-additional-explanation-help"
          rows={3}
          value={detail.specificationNote ?? ""}
          onChange={(event) => onChange({ ...detail, specificationNote: event.target.value })}
          placeholder="Example: Available in different voltages and pin configurations depending on the selected model."
          className={`${textareaClassName} mt-2`}
        />
      </div>
      <SpecificationRows
        items={detail.specifications}
        variant="information"
        addLabel={copy.detail.addInformation}
        onChange={(specifications) => onChange({ ...detail, specifications })}
      />
    </div>
  );
}

function SpecificationRows({
  items,
  variant = "compact",
  addLabel = "Add Specification Row",
  onChange,
}: {
  items: SpecificationDraft[];
  variant?: "compact" | "information";
  addLabel?: string;
  onChange: (items: SpecificationDraft[]) => void;
}) {
  const orderedItems = [...items].sort((left, right) => left.order - right.order);
  return (
    <div className="mt-4 space-y-3">
      {variant === "information" && orderedItems.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-5">
          <h3 className="text-sm font-medium text-slate-950">{copy.detail.informationEmpty}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {copy.detail.informationEmptyHelp}
          </p>
          <div aria-hidden="true" className="mt-4 grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
            <span>Display Type</span><span>4-Digit 7-Segment Display</span>
            <span>Operating Voltage</span><span>Based on selected model</span>
            <span>Connection Type</span><span>Common anode or common cathode</span>
            <span>Customisation</span><span>Size, colour, pin layout and electrical configuration</span>
          </div>
        </div>
      ) : null}
      {orderedItems.map((item, index) => (
        <div key={item.id} className="grid gap-4 rounded-xl border border-slate-200 p-4 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)_auto]">
          <div>
            <label
              htmlFor={`information-label-${item.id}`}
              className="text-sm font-medium text-slate-800"
            >
              {variant === "information" ? copy.detail.informationLabel : "Specification label"}
            </label>
            {variant === "information" ? (
              <p id={`information-label-help-${item.id}`} className="mt-1 text-xs leading-5 text-slate-500">
                {copy.detail.informationLabelHelp}
              </p>
            ) : null}
            <input
              id={`information-label-${item.id}`}
              aria-describedby={variant === "information" ? `information-label-help-${item.id}` : undefined}
              value={item.label ?? ""}
              onChange={(event) => onChange(updateItem(orderedItems, item.id, { label: event.target.value }))}
              placeholder={
                variant === "information"
                  ? "Example: Display Type, Operating Voltage, Interface"
                  : "Example: Display Type"
              }
              className={`${inputClassName} mt-2`}
            />
            {variant === "information" ? (
              <p aria-hidden="true" className="mt-1.5 text-[11px] leading-4 text-slate-400">
                English examples: Number of Digits, Operating Voltage, Viewing Area, Interface,
                Connection Type
              </p>
            ) : null}
          </div>
          <div>
            <label
              htmlFor={`information-value-${item.id}`}
              className="text-sm font-medium text-slate-800"
            >
              {variant === "information" ? copy.detail.informationValue : "Specification value"}
            </label>
            {variant === "information" ? (
              <p id={`information-value-help-${item.id}`} className="mt-1 text-xs leading-5 text-slate-500">
                {copy.detail.informationValueHelp}
              </p>
            ) : null}
            <input
              id={`information-value-${item.id}`}
              aria-describedby={variant === "information" ? `information-value-help-${item.id}` : undefined}
              value={item.value ?? ""}
              onChange={(event) => onChange(updateItem(orderedItems, item.id, { value: event.target.value }))}
              placeholder={
                variant === "information"
                  ? "Example: 4-Digit 7-Segment Display, 3.0 V, COG"
                  : "Enter the specification value in English"
              }
              className={`${inputClassName} mt-2`}
            />
            {variant === "information" ? (
              <p aria-hidden="true" className="mt-1.5 text-[11px] leading-4 text-slate-400">
                English examples: 3.0 V, COG, Common anode, Through-hole mounting, -20 to 70 C
              </p>
            ) : null}
          </div>
          <OrderControls
            label={`${variant === "information" ? "information row" : "specification row"} ${index + 1}`}
            index={index}
            count={orderedItems.length}
            onMove={(direction) => onChange(moveItem(orderedItems, index, direction))}
            onRemove={() => onChange(normalizeOrder(orderedItems.filter((entry) => entry.id !== item.id)))}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...orderedItems, { id: createItemId("specification"), order: orderedItems.length }])}
        className={secondaryButtonClassName}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        {addLabel}
      </button>
    </div>
  );
}

function TextListEditor({
  label,
  addLabel,
  items,
  multiline = false,
  onChange,
}: {
  label: string;
  addLabel: string;
  items: EditableTextItem[];
  multiline?: boolean;
  onChange: (items: EditableTextItem[]) => void;
}) {
  const orderedItems = [...items].sort((left, right) => left.order - right.order);
  return (
    <div className="space-y-3">
      {orderedItems.map((item, index) => (
        <div key={item.id} className="grid gap-3 rounded-xl border border-slate-200 p-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          {multiline ? (
            <textarea
              aria-label={`${label} ${index + 1}`}
              rows={4}
              value={item.text ?? ""}
              onChange={(event) => onChange(updateItem(orderedItems, item.id, { text: event.target.value }))}
              className={textareaClassName}
            />
          ) : (
            <input
              aria-label={`${label} ${index + 1}`}
              value={item.text ?? ""}
              onChange={(event) => onChange(updateItem(orderedItems, item.id, { text: event.target.value }))}
              className={inputClassName}
            />
          )}
          <OrderControls
            label={`${label.toLowerCase()} ${index + 1}`}
            index={index}
            count={orderedItems.length}
            onMove={(direction) => onChange(moveItem(orderedItems, index, direction))}
            onRemove={() => onChange(normalizeOrder(orderedItems.filter((entry) => entry.id !== item.id)))}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...orderedItems, { id: createItemId(label.toLowerCase().replaceAll(" ", "-")), order: orderedItems.length }])}
        className={secondaryButtonClassName}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        {addLabel}
      </button>
    </div>
  );
}

function OptionsEditor({ detail, onChange }: { detail: ProductDetailDraft; onChange: (detail: ProductDetailDraft) => void }) {
  const groups = [...detail.optionGroups].sort((left, right) => left.order - right.order);
  return (
    <div className="space-y-4">
      {groups.map((group, groupIndex) => (
        <div key={group.id} className="rounded-xl border border-slate-200 p-4">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <input
              aria-label={`Name for option group ${groupIndex + 1}`}
              value={group.label ?? ""}
              onChange={(event) => onChange({ ...detail, optionGroups: updateItem(groups, group.id, { label: event.target.value }) })}
              placeholder="Enter the option group name in English"
              className={inputClassName}
            />
            <OrderControls
              label={`option group ${groupIndex + 1}`}
              index={groupIndex}
              count={groups.length}
              onMove={(direction) => onChange({ ...detail, optionGroups: moveItem(groups, groupIndex, direction) })}
              onRemove={() => onChange({ ...detail, optionGroups: normalizeOrder(groups.filter((item) => item.id !== group.id)) })}
            />
          </div>
          <div className="mt-4 pl-3">
            <TextListEditor
              label="Option value"
              addLabel={copy.detail.addOptionValue}
              items={group.values}
              onChange={(values) => onChange({ ...detail, optionGroups: updateItem(groups, group.id, { values }) })}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange({ ...detail, optionGroups: [...groups, { id: createItemId("option-group"), order: groups.length, values: [] }] })}
        className={secondaryButtonClassName}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        {copy.detail.addOptionGroup}
      </button>
    </div>
  );
}

function DownloadsEditor({ detail, onChange }: { detail: ProductDetailDraft; onChange: (detail: ProductDetailDraft) => void }) {
  const downloads = [...detail.downloads].sort((left, right) => left.order - right.order);
  return (
    <div className="space-y-4">
      {downloads.map((download, index) => (
        <div key={download.id} className="grid gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="space-y-3">
            <input
              aria-label={`Label for download ${index + 1}`}
              value={download.label ?? ""}
              onChange={(event) => onChange({ ...detail, downloads: updateItem(downloads, download.id, { label: event.target.value }) })}
              placeholder="Enter the download label in English"
              className={inputClassName}
            />
            <input
              aria-label={`Description for download ${index + 1}`}
              value={download.description ?? ""}
              onChange={(event) => onChange({ ...detail, downloads: updateItem(downloads, download.id, { description: event.target.value }) })}
              placeholder="Enter an optional download description in English"
              className={inputClassName}
            />
            <input
              aria-label={`Link for download ${index + 1}`}
              value={download.href ?? ""}
              onChange={(event) => onChange({ ...detail, downloads: updateItem(downloads, download.id, { href: event.target.value }) })}
              placeholder="https://example.com/file.pdf or /downloads/file.pdf"
              className={inputClassName}
            />
          </div>
          <OrderControls
            label={`download ${index + 1}`}
            index={index}
            count={downloads.length}
            onMove={(direction) => onChange({ ...detail, downloads: moveItem(downloads, index, direction) })}
            onRemove={() => onChange({ ...detail, downloads: normalizeOrder(downloads.filter((item) => item.id !== download.id)) })}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange({ ...detail, downloads: [...downloads, { id: createItemId("download"), order: downloads.length }] })}
        className={secondaryButtonClassName}
      >
        <FilePlus2 className="h-4 w-4" aria-hidden="true" />
        {copy.detail.addDownload}
      </button>
    </div>
  );
}

function OrderControls({
  label,
  index,
  count,
  onMove,
  onRemove,
}: {
  label: string;
  index: number;
  count: number;
  onMove: (direction: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-1 self-start">
      <IconButton label={`Move ${label} up`} disabled={index === 0} onClick={() => onMove(-1)}>
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
      </IconButton>
      <IconButton label={`Move ${label} down`} disabled={index === count - 1} onClick={() => onMove(1)}>
        <ArrowDown className="h-4 w-4" aria-hidden="true" />
      </IconButton>
      <IconButton label={`Remove ${label}`} destructive onClick={onRemove}>
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </IconButton>
    </div>
  );
}

function IconButton({
  label,
  children,
  disabled = false,
  destructive = false,
  onClick,
}: {
  label: string;
  children: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:text-slate-200 ${destructive ? "text-slate-400 hover:bg-rose-50 hover:text-rose-700" : "text-slate-400 hover:bg-slate-100 hover:text-slate-950"}`}
    >
      {children}
    </button>
  );
}

function EditorField({ label, optional, required, children }: { label: string; optional?: boolean; required?: boolean; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-800">
        {label} {optional ? <span className="font-normal text-slate-400">({copy.shared.optional})</span> : null}
        {required ? <span aria-hidden="true"> *</span> : null}
      </span>
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

function EmptyEditorMessage({ children }: { children: ReactNode }) {
  return <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-4 py-8 text-center text-sm text-slate-500">{children}</p>;
}

function EditorStateMessage({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-20 text-center sm:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white/70 p-10 text-sm text-slate-500 backdrop-blur">{children}</div>
    </main>
  );
}

function EnglishContentHint() {
  return (
    <p className="rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm leading-6 text-slate-600">
      {englishContentHint}
    </p>
  );
}

function getDetailEnglishError(
  productName: string,
  detail: ProductDetailDraft,
) {
  const fields: Array<[string | undefined, string]> = [
    [productName, copy.product.name],
    [detail.productTypeLabel, copy.detail.productType],
    [detail.introduction, copy.detail.introduction],
    [detail.suitableFor, copy.detail.suitable],
    [detail.specificationNote, copy.detail.additionalExplanation],
    ...detail.images.flatMap((image) => [
      [image.label, "Image label"] as [string | undefined, string],
      [image.alt, copy.detail.imageAlt] as [string | undefined, string],
    ]),
    ...[...detail.summary, ...detail.specifications].flatMap((item) => [
      [item.label, copy.detail.informationLabel] as [string | undefined, string],
      [item.value, copy.detail.informationValue] as [string | undefined, string],
    ]),
    ...detail.descriptionParagraphs.map((item) =>
      [item.text, "Product description paragraph"] as [string | undefined, string],
    ),
    ...detail.applications.map((item) =>
      [item.text, "Application"] as [string | undefined, string],
    ),
    ...detail.optionGroups.flatMap((group) => [
      [group.label, "Option group name"] as [string | undefined, string],
      ...group.values.map((item) =>
        [item.text, "Option value"] as [string | undefined, string],
      ),
    ]),
    ...detail.downloads.flatMap((download) => [
      [download.label, "Download label"] as [string | undefined, string],
      [download.description, "Download description"] as [string | undefined, string],
    ]),
  ];
  const invalidField = fields.find(([value]) => containsSubstantialChinese(value));

  return invalidField
    ? `${invalidField[1]}: ${copy.validation.englishOnly}`
    : undefined;
}

function createItemId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function normalizeOrder<T extends { order: number }>(items: T[]): T[] {
  return items.map((item, index) => ({ ...item, order: index }));
}

function moveItem<T extends { order: number }>(items: T[], index: number, direction: -1 | 1): T[] {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) return items;
  const nextItems = [...items];
  [nextItems[index], nextItems[nextIndex]] = [nextItems[nextIndex], nextItems[index]];
  return normalizeOrder(nextItems);
}

function updateItem<T extends { id: string }>(items: T[], id: string, updates: Partial<T>): T[] {
  return items.map((item) => (item.id === id ? { ...item, ...updates } : item));
}

function readImageFile(file: File): Promise<{ src: string; name: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === "string"
        ? resolve({ src: reader.result, name: file.name })
          : reject(new Error("Invalid image data"));
    reader.onerror = () => reject(reader.error ?? new Error("The image could not be read"));
    reader.readAsDataURL(file);
  });
}

const inputClassName =
  "h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200";
const textareaClassName =
  "w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-950 outline-none placeholder:text-slate-400 focus:border-slate-500 focus:ring-2 focus:ring-slate-200";
const secondaryButtonClassName =
  "inline-flex h-10 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 hover:border-slate-400 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:outline-none";
