import type { CatalogueDraft, ProductDraft } from "@/lib/adminCatalogueDraft";

export type PublishImageManifestEntry = {
  id: string;
  productId: string;
  productSlug: string;
  target: "cover" | "detail";
  detailImageId?: string;
};

export type RepositoryFile = {
  path: string;
  content: Uint8Array;
};

export type PublishedImageReplacement = {
  id: string;
  path: string;
};

const maximumImageSize = 1.5 * 1024 * 1024;
const maximumImageCount = 30;
const maximumTotalImageSize = 24 * 1024 * 1024;
const supportedImages = {
  "image/jpeg": { extension: "jpg", matches: isJpeg },
  "image/png": { extension: "png", matches: isPng },
  "image/webp": { extension: "webp", matches: isWebp },
} as const;

export class ImagePreparationError extends Error {
  constructor(
    message: string,
    readonly path = "images",
  ) {
    super(message);
    this.name = "ImagePreparationError";
  }
}

export async function prepareRepositoryImages(
  draft: CatalogueDraft,
  manifest: PublishImageManifestEntry[],
  formData: FormData,
  configuredRoot = "public/uploads/products",
): Promise<{
  files: RepositoryFile[];
  replacements: PublishedImageReplacement[];
}> {
  if (manifest.length > maximumImageCount) {
    throw new ImagePreparationError("Too many product images were submitted.");
  }

  const repositoryRoot = normalizeRepositoryRoot(configuredRoot);
  const manifestIds = new Set<string>();
  const targetKeys = new Set<string>();
  const files: RepositoryFile[] = [];
  const replacements: PublishedImageReplacement[] = [];
  let totalSize = 0;

  for (const entry of manifest) {
    validateManifestEntry(entry);

    if (manifestIds.has(entry.id)) {
      throw new ImagePreparationError("Duplicate image upload identifier.");
    }
    manifestIds.add(entry.id);

    const targetKey = `${entry.productId}:${entry.target}:${entry.detailImageId ?? ""}`;
    if (targetKeys.has(targetKey)) {
      throw new ImagePreparationError("The same product image target was submitted twice.");
    }
    targetKeys.add(targetKey);

    const product = findProduct(draft, entry.productId);
    if (!product || product.slug !== entry.productSlug) {
      throw new ImagePreparationError("The image does not belong to a valid product.");
    }

    const upload = getSingleUpload(formData, `image:${entry.id}`);
    if (!upload || upload.size < 1 || upload.size > maximumImageSize) {
      throw new ImagePreparationError("Each product image must be smaller than 1.5 MB.");
    }

    totalSize += upload.size;
    if (totalSize > maximumTotalImageSize) {
      throw new ImagePreparationError("The total product image upload is too large.");
    }

    const imageType = supportedImages[upload.type as keyof typeof supportedImages];
    if (!imageType || !upload.name.toLowerCase().endsWith(`.${imageType.extension}`)) {
      throw new ImagePreparationError("Only JPG, PNG, and WebP product images are supported.");
    }

    const content = new Uint8Array(await upload.arrayBuffer());
    if (!imageType.matches(content)) {
      throw new ImagePreparationError("The uploaded image content does not match its file type.");
    }

    const repositoryPath = [
      repositoryRoot,
      entry.productSlug,
      `${entry.target}-${crypto.randomUUID().replaceAll("-", "").slice(0, 12)}.${imageType.extension}`,
    ].join("/");
    const publicPath = `/${repositoryPath.replace(/^public\//, "")}`;

    replaceImageTarget(product, entry, publicPath);
    files.push({ path: repositoryPath, content });
    replacements.push({ id: entry.id, path: publicPath });
  }

  return { files, replacements };
}

function replaceImageTarget(
  product: ProductDraft,
  entry: PublishImageManifestEntry,
  publicPath: string,
) {
  const expectedMarker = `upload:${entry.id}`;

  if (entry.target === "cover") {
    if (product.image !== expectedMarker) {
      throw new ImagePreparationError("The product cover image upload marker is invalid.");
    }
    product.image = publicPath;
    return;
  }

  const detailImage = product.detail.images.find((image) => image.id === entry.detailImageId);
  if (!detailImage || detailImage.src !== expectedMarker) {
    throw new ImagePreparationError("The Product Detail image upload marker is invalid.");
  }
  detailImage.src = publicPath;
}

function findProduct(draft: CatalogueDraft, productId: string) {
  for (const category of draft.categories) {
    const directProduct = category.products.find((product) => product.id === productId);
    if (directProduct) return directProduct;

    for (const subcategory of category.subcategories) {
      const product = subcategory.products.find((item) => item.id === productId);
      if (product) return product;
    }
  }

  return undefined;
}

function validateManifestEntry(entry: PublishImageManifestEntry) {
  if (
    !entry ||
    typeof entry.id !== "string" ||
    !/^[A-Za-z0-9_-]{8,128}$/.test(entry.id) ||
    typeof entry.productId !== "string" ||
    typeof entry.productSlug !== "string" ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.productSlug) ||
    (entry.target !== "cover" && entry.target !== "detail") ||
    (entry.target === "detail" && typeof entry.detailImageId !== "string")
  ) {
    throw new ImagePreparationError("The product image metadata is invalid.");
  }
}

function normalizeRepositoryRoot(value: string) {
  const normalized = value.trim().replaceAll("\\", "/").replace(/^\/+|\/+$/g, "");
  const segments = normalized.split("/");

  if (
    !normalized.startsWith("public/") ||
    segments.some((segment) => !segment || segment === "." || segment === "..") ||
    !segments.every((segment) => /^[A-Za-z0-9._-]+$/.test(segment))
  ) {
    throw new ImagePreparationError("The configured product image path is invalid.");
  }

  return normalized;
}

function getSingleUpload(formData: FormData, name: string) {
  const values = formData.getAll(name);
  if (values.length !== 1 || !isUploadedFile(values[0])) return undefined;
  return values[0];
}

function isUploadedFile(value: FormDataEntryValue): value is File {
  return (
    typeof value === "object" &&
    value !== null &&
    "arrayBuffer" in value &&
    typeof value.arrayBuffer === "function" &&
    "size" in value &&
    typeof value.size === "number"
  );
}

function isJpeg(bytes: Uint8Array) {
  return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
}

function isPng(bytes: Uint8Array) {
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  return bytes.length >= signature.length && signature.every((byte, index) => bytes[index] === byte);
}

function isWebp(bytes: Uint8Array) {
  return (
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  );
}
