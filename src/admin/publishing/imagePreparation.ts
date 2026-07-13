import type { CatalogueDraft, ProductDraft } from "@/lib/adminCatalogueDraft";
import type { PublishImageManifestEntry } from "@/server/admin/imagePreparation";

type PreparedPublishRequest = {
  draft: CatalogueDraft;
  manifest: PublishImageManifestEntry[];
  formData?: FormData;
  previewSources?: Map<string, string>;
  existingPreviews?: ExistingPreviewSources;
};

type ExistingPreviewSources = {
  covers: Record<string, string>;
  details: Record<string, string>;
};

const supportedImageTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export function prepareCataloguePublishRequest(draft: CatalogueDraft): PreparedPublishRequest {
  const preparedDraft = structuredClone(draft);
  const manifest: PublishImageManifestEntry[] = [];
  const uploads: Array<{ id: string; file: File }> = [];
  const previewSources = new Map<string, string>();
  const existingPreviews: ExistingPreviewSources = { covers: {}, details: {} };

  visitProducts(preparedDraft, (product) => {
    if (product.previewImage) existingPreviews.covers[product.id] = product.previewImage;
    delete product.previewImage;

    if (product.image.startsWith("data:")) {
      const upload = createUpload(product.image);
      const id = createUploadId();
      previewSources.set(id, product.image);
      product.image = `upload:${id}`;
      manifest.push({
        id,
        productId: product.id,
        productSlug: product.slug,
        target: "cover",
      });
      uploads.push({ id, file: upload });
    }

    product.detail.images.forEach((image) => {
      if (image.previewSrc) existingPreviews.details[`${product.id}:${image.id}`] = image.previewSrc;
      delete image.previewSrc;
      if (!image.src?.startsWith("data:")) return;

      const upload = createUpload(image.src);
      const id = createUploadId();
      previewSources.set(id, image.src);
      image.src = `upload:${id}`;
      manifest.push({
        id,
        productId: product.id,
        productSlug: product.slug,
        target: "detail",
        detailImageId: image.id,
      });
      uploads.push({ id, file: upload });
    });
  });

  if (uploads.length === 0) {
    return { draft: preparedDraft, manifest, existingPreviews };
  }

  const formData = new FormData();
  formData.set("draft", JSON.stringify(preparedDraft));
  formData.set("imageManifest", JSON.stringify(manifest));
  uploads.forEach(({ id, file }) => formData.append(`image:${id}`, file));

  return { draft: preparedDraft, manifest, formData, previewSources, existingPreviews };
}

export function applyPublishedImageReplacements(
  draft: CatalogueDraft,
  replacements: Array<{ id: string; path: string }>,
  previewSources?: Map<string, string>,
  existingPreviews?: ExistingPreviewSources,
) {
  const publishedDraft = structuredClone(draft);
  const replacementByMarker = new Map(
    replacements.map((replacement) => [`upload:${replacement.id}`, replacement.path]),
  );

  visitProducts(publishedDraft, (product) => {
    const coverMarker = product.image;
    product.image = replacementByMarker.get(product.image) ?? product.image;
    if (product.image !== coverMarker) {
      product.previewImage = previewSources?.get(coverMarker.replace(/^upload:/, ""));
    }
    product.previewImage ??= existingPreviews?.covers[product.id];
    product.detail.images.forEach((image) => {
      if (!image.src) return;
      const marker = image.src;
      image.src = replacementByMarker.get(image.src) ?? image.src;
      if (image.src !== marker) {
        image.previewSrc = previewSources?.get(marker.replace(/^upload:/, ""));
      }
      image.previewSrc ??= existingPreviews?.details[`${product.id}:${image.id}`];
    });
  });

  return publishedDraft;
}

function visitProducts(draft: CatalogueDraft, visitor: (product: ProductDraft) => void) {
  draft.categories.forEach((category) => {
    category.products.forEach(visitor);
    category.subcategories.forEach((subcategory) => subcategory.products.forEach(visitor));
  });
}

function createUpload(dataUrl: string) {
  const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw new Error("A selected product image could not be prepared for publishing.");

  const mimeType = match[1] as keyof typeof supportedImageTypes;
  const binary = atob(match[2]);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  const extension = supportedImageTypes[mimeType];

  return new File([bytes], `product-image.${extension}`, { type: mimeType });
}

function createUploadId() {
  return `image-${crypto.randomUUID().replaceAll("-", "")}`;
}
