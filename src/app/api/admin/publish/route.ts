import { canonicalCatalogue } from "@/content/catalogue";
import type { CatalogueDraft } from "@/lib/adminCatalogueDraft";
import { getVerifiedAdminSession } from "@/server/admin/adminSession";
import {
  createCanonicalCatalogue,
  serializeCanonicalCatalogue,
} from "@/server/admin/catalogueSerializer";
import { validateCatalogueDraftForPublish } from "@/server/admin/catalogueValidation";
import { getAdminEnvironment } from "@/server/admin/environment";
import {
  GitHubApiError,
  GitHubConfigurationError,
  GitHubConflictError,
  publishCatalogueCommit,
} from "@/server/admin/githubClient";
import {
  ImagePreparationError,
  prepareRepositoryImages,
  type PublishImageManifestEntry,
} from "@/server/admin/imagePreparation";
import {
  errorResponse,
  hasAcceptableBodySize,
  hasJsonContentType,
  hasMultipartContentType,
  isSameOriginRequest,
  jsonResponse,
} from "@/server/admin/http";

export const runtime = "edge";

const maximumPublishRequestSize = 30 * 1024 * 1024;

export async function POST(request: Request) {
  const environment = getAdminEnvironment();
  const session = await getVerifiedAdminSession(request, environment.SESSION_SECRET);

  if (!session) {
    return errorResponse(
      "AUTHENTICATION_REQUIRED",
      "Your Admin session has expired. Sign in again to continue.",
      401,
    );
  }

  if (!isSameOriginRequest(request)) {
    return errorResponse("INVALID_ORIGIN", "The request could not be accepted.", 403);
  }

  if (!hasAcceptableBodySize(request, maximumPublishRequestSize)) {
    return errorResponse("REQUEST_TOO_LARGE", "The catalogue submission is too large.", 413);
  }

  try {
    const submission = await parsePublishSubmission(request);
    if (!isRecord(submission.draft) || !Array.isArray(submission.draft.categories)) {
      return validationResponse([
        { path: "categories", message: "The catalogue must contain a category list." },
      ]);
    }

    const draft = structuredClone(submission.draft) as unknown as CatalogueDraft;
    const imageResult = await prepareRepositoryImages(
      draft,
      submission.manifest,
      submission.formData,
      environment.PRODUCT_IMAGES_PATH,
    );
    const validation = validateCatalogueDraftForPublish(
      draft,
      canonicalCatalogue.filterSchemas,
    );

    if (!validation.valid) return validationResponse(validation.fields);

    const publishedAt = new Date().toISOString();
    const catalogue = createCanonicalCatalogue(
      validation.draft,
      canonicalCatalogue.filterSchemas,
      publishedAt,
    );
    const serializedCatalogue = serializeCanonicalCatalogue(catalogue);
    const publishResult = await publishWithConfiguredProvider(
      environment,
      serializedCatalogue,
      imageResult.files,
      submission.baseCommitSha,
      submission.baseContentSha,
    );

    return jsonResponse({
      success: true,
      ...publishResult,
      publishedAt,
      images: imageResult.replacements,
    });
  } catch (error) {
    if (error instanceof PublishRequestError) {
      return errorResponse(error.code, error.message, error.status);
    }
    if (error instanceof ImagePreparationError) {
      return validationResponse([{ path: error.path, message: error.message }]);
    }
    if (error instanceof GitHubConflictError) {
      return jsonResponse(
        {
          error: "REPOSITORY_CONFLICT",
          message:
            "The repository changed while you were editing. Your draft has been preserved.",
          latestVersion: error.latestVersion,
        },
        409,
      );
    }
    if (error instanceof GitHubConfigurationError) {
      console.error("Catalogue publishing is not configured correctly.");
      return errorResponse(
        "PUBLISHING_UNAVAILABLE",
        "Changes could not be submitted. Your draft is still available.",
        503,
      );
    }
    if (error instanceof GitHubApiError) {
      console.error(`GitHub catalogue publishing failed with status ${error.status}.`);
      return errorResponse(
        "GITHUB_FAILURE",
        "The catalogue could not be committed to GitHub. Your draft has been preserved. Please try again.",
        502,
      );
    }

    console.error("Unexpected catalogue publishing failure.");
    return errorResponse(
      "PUBLISH_FAILED",
      "Changes could not be submitted. Your draft is still available.",
      500,
    );
  }
}

async function parsePublishSubmission(request: Request) {
  if (hasJsonContentType(request)) {
    let body: unknown;
    try {
      const rawBody = await request.text();
      if (new TextEncoder().encode(rawBody).byteLength > maximumPublishRequestSize) {
        throw new PublishRequestError(
          "REQUEST_TOO_LARGE",
          "The catalogue submission is too large.",
          413,
        );
      }
      body = JSON.parse(rawBody);
    } catch (error) {
      if (error instanceof PublishRequestError) throw error;
      throw new PublishRequestError("INVALID_REQUEST", "The catalogue submission is invalid.", 400);
    }
    if (!isRecord(body) || !("draft" in body)) {
      throw new PublishRequestError("INVALID_REQUEST", "The catalogue submission is invalid.", 400);
    }

    return {
      draft: body.draft,
      baseCommitSha: parseBaseCommitSha(body.baseCommitSha),
      baseContentSha: parseBaseCommitSha(body.baseContentSha),
      manifest: [] as PublishImageManifestEntry[],
      formData: new FormData(),
    };
  }

  if (!hasMultipartContentType(request)) {
    throw new PublishRequestError(
      "UNSUPPORTED_MEDIA_TYPE",
      "Use JSON or multipart form data for catalogue submissions.",
      415,
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    throw new PublishRequestError("INVALID_REQUEST", "The catalogue submission is invalid.", 400);
  }

  const draftJson = formData.get("draft");
  const manifestJson = formData.get("imageManifest");
  if (typeof draftJson !== "string" || typeof manifestJson !== "string") {
    throw new PublishRequestError("INVALID_REQUEST", "The catalogue submission is invalid.", 400);
  }

  let draft: unknown;
  let manifest: unknown;
  try {
    draft = JSON.parse(draftJson);
    manifest = JSON.parse(manifestJson);
  } catch {
    throw new PublishRequestError("INVALID_REQUEST", "The catalogue submission is invalid.", 400);
  }
  if (!Array.isArray(manifest)) {
    throw new PublishRequestError("INVALID_REQUEST", "The product image metadata is invalid.", 400);
  }

  return {
    draft,
    baseCommitSha: parseBaseCommitSha(formData.get("baseCommitSha")),
    baseContentSha: parseBaseCommitSha(formData.get("baseContentSha")),
    manifest: manifest as PublishImageManifestEntry[],
    formData,
  };
}

async function publishWithConfiguredProvider(
  environment: ReturnType<typeof getAdminEnvironment>,
  catalogueJson: string,
  imageFiles: Parameters<typeof publishCatalogueCommit>[2],
  baseCommitSha?: string,
  baseContentSha?: string,
) {
  if (environment.E2E_GITHUB_MOCK_MODE === "conflict") {
    throw new GitHubConflictError({
      commitSha: "cccccccccccccccccccccccccccccccccccccccc",
      contentSha: "dddddddddddddddddddddddddddddddddddddddd",
    });
  }
  if (environment.E2E_GITHUB_MOCK_MODE === "failure") throw new GitHubApiError(500);
  if (environment.E2E_GITHUB_MOCK_MODE === "success") {
    return {
      commitSha: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      contentSha: "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      previousCommitSha: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
      commitUrl: "https://github.com/example/example/commit/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    };
  }

  return publishCatalogueCommit(
    environment,
    catalogueJson,
    imageFiles,
    baseCommitSha,
    fetch,
    baseContentSha,
  );
}

function parseBaseCommitSha(value: unknown) {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string" || !/^[a-f0-9]{40,64}$/i.test(value)) {
    throw new PublishRequestError("INVALID_REQUEST", "The repository version is invalid.", 400);
  }
  return value;
}

function validationResponse(fields: Array<{ path: string; message: string }>) {
  return errorResponse(
    "VALIDATION_FAILED",
    "Some catalogue data is invalid. Review the highlighted fields and try again.",
    422,
    fields.slice(0, 100),
  );
}

class PublishRequestError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "PublishRequestError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
