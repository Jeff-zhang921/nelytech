import type { CatalogueDraft } from "@/lib/adminCatalogueDraft";
import {
  applyPublishedImageReplacements,
  prepareCataloguePublishRequest,
} from "@/admin/publishing/imagePreparation";

export type AdminSessionResponse =
  | { authenticated: false }
  | { authenticated: true; role: "admin"; expiresAt: number };

export type PublishResult = {
  commitSha: string;
  contentSha: string;
  previousCommitSha: string;
  commitUrl: string;
  publishedAt: string;
  images: Array<{ id: string; path: string }>;
  draft: CatalogueDraft;
};

export type RepositoryVersion = {
  commitSha: string;
  contentSha: string;
};

export type LatestCatalogueResult = {
  draft: CatalogueDraft;
  version: RepositoryVersion;
};

type AdminRequestOptions = {
  timeoutMs?: number;
  baseContentSha?: string;
};

const defaultRequestTimeoutMs = 20_000;

export class AdminApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly fields: Array<{ path: string; message: string }> = [],
    readonly latestVersion?: RepositoryVersion,
  ) {
    super(message);
    this.name = "AdminApiError";
  }
}

export async function getAdminSession() {
  return requestAdminApi<AdminSessionResponse>("/api/admin/session", {
    method: "GET",
    cache: "no-store",
    credentials: "same-origin",
  });
}

export async function signInAdmin(key: string) {
  return requestAdminApi<Extract<AdminSessionResponse, { authenticated: true }>>(
    "/api/admin/login",
    {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key }),
    },
  );
}

export async function signOutAdmin() {
  return requestAdminApi<{ success: true }>("/api/admin/logout", {
    method: "POST",
    credentials: "same-origin",
  });
}

export async function publishCatalogue(
  draft: CatalogueDraft,
  baseCommitSha?: string,
  options?: AdminRequestOptions,
): Promise<PublishResult> {
  const prepared = prepareCataloguePublishRequest(draft);
  let body: BodyInit;
  let headers: HeadersInit | undefined;

  if (prepared.formData) {
    if (baseCommitSha) prepared.formData.set("baseCommitSha", baseCommitSha);
    if (options?.baseContentSha) {
      prepared.formData.set("baseContentSha", options.baseContentSha);
    }
    body = prepared.formData;
  } else {
    headers = { "Content-Type": "application/json" };
    body = JSON.stringify({
      draft: prepared.draft,
      baseCommitSha,
      baseContentSha: options?.baseContentSha,
    });
  }

  const result = await requestAdminApi<Omit<PublishResult, "draft">>(
    "/api/admin/publish",
    {
      method: "POST",
      credentials: "same-origin",
      headers,
      body,
    },
    options,
  );

  if (
    !isSha(result.commitSha) ||
    !isSha(result.contentSha) ||
    !isSha(result.previousCommitSha) ||
    typeof result.commitUrl !== "string" ||
    typeof result.publishedAt !== "string" ||
    !Array.isArray(result.images)
  ) {
    throw invalidResponseError();
  }

  return {
    ...result,
    draft: applyPublishedImageReplacements(
      prepared.draft,
      result.images,
      prepared.previewSources,
      prepared.existingPreviews,
    ),
  };
}

export async function getLatestPublishedCatalogue(
  options?: AdminRequestOptions,
): Promise<LatestCatalogueResult> {
  const result = await requestAdminApi<LatestCatalogueResult>(
    "/api/admin/catalogue/latest",
    {
      method: "GET",
      cache: "no-store",
      credentials: "same-origin",
    },
    options,
  );

  const version = parseRepositoryVersion(result.version);
  if (!isRecord(result.draft) || !Array.isArray(result.draft.categories) || !version) {
    throw invalidResponseError();
  }

  return { draft: result.draft, version };
}

async function requestAdminApi<T>(
  input: string,
  init: RequestInit,
  options?: AdminRequestOptions,
): Promise<T> {
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(
    () => controller.abort(),
    options?.timeoutMs ?? defaultRequestTimeoutMs,
  );

  try {
    const response = await fetch(input, { ...init, signal: controller.signal });
    if (process.env.NODE_ENV === "development" && input === "/api/admin/publish") {
      console.info("[product-admin] publish response received", { status: response.status });
    }
    return await parseResponse<T>(response);
  } catch (error) {
    if (controller.signal.aborted) {
      throw new AdminApiError(
        408,
        "REQUEST_TIMEOUT",
        "The publishing request took too long. Your draft is still available. Please try again.",
      );
    }

    if (error instanceof AdminApiError) throw error;

    throw new AdminApiError(
      0,
      "NETWORK_ERROR",
      "The Admin service could not be reached. Your draft has been preserved. Please check your connection and try again.",
    );
  } finally {
    globalThis.clearTimeout(timeout);
  }
}

async function parseResponse<T>(response: Response): Promise<T> {
  let rawBody = "";
  try {
    rawBody = await response.text();
  } catch {
    throw new AdminApiError(
      response.status || 500,
      "INVALID_RESPONSE",
      "The Admin service response could not be read. Your draft has been preserved.",
    );
  }

  let body: unknown;
  if (rawBody.trim()) {
    try {
      body = JSON.parse(rawBody);
    } catch {
      body = undefined;
    }
  }

  if (!response.ok) {
    const errorBody = isRecord(body) ? body : {};
    const plainTextMessage = getSafePlainTextMessage(response, rawBody);
    const jsonMessage = getSafeMessage(errorBody.message);
    throw new AdminApiError(
      response.status,
      typeof errorBody.error === "string" ? errorBody.error : "REQUEST_FAILED",
      jsonMessage ??
        plainTextMessage ??
        "The Admin request could not be completed. Your draft has been preserved.",
      Array.isArray(errorBody.fields)
        ? errorBody.fields.filter(isValidationField).slice(0, 100)
        : [],
      parseRepositoryVersion(errorBody.latestVersion),
    );
  }

  if (!isRecord(body)) {
    throw new AdminApiError(
      response.status || 500,
      "INVALID_RESPONSE",
      "The Admin service returned an invalid response. Your draft has been preserved.",
    );
  }

  return body as T;
}

function parseRepositoryVersion(value: unknown): RepositoryVersion | undefined {
  if (
    !isRecord(value) ||
    typeof value.commitSha !== "string" ||
    typeof value.contentSha !== "string" ||
    !isSha(value.commitSha) ||
    !isSha(value.contentSha)
  ) {
    return undefined;
  }

  return { commitSha: value.commitSha, contentSha: value.contentSha };
}

function invalidResponseError() {
  return new AdminApiError(
    500,
    "INVALID_RESPONSE",
    "The Admin service returned an invalid response. Your draft has been preserved.",
  );
}

function isSha(value: unknown): value is string {
  return typeof value === "string" && /^[a-f0-9]{40,64}$/i.test(value);
}

function getSafeMessage(value: unknown) {
  if (typeof value !== "string") return undefined;
  const message = value.replace(/\s+/g, " ").trim();
  return message && message.length <= 500 && !/[<>]/.test(message) ? message : undefined;
}

function getSafePlainTextMessage(response: Response, rawBody: string) {
  const contentType = response.headers.get("content-type")?.split(";", 1)[0].trim();
  const message = rawBody.replace(/\s+/g, " ").trim();

  if (contentType !== "text/plain" || !message || message.length > 300 || /[<>]/.test(message)) {
    return undefined;
  }

  return message;
}

function isValidationField(value: unknown): value is { path: string; message: string } {
  return (
    isRecord(value) &&
    typeof value.path === "string" &&
    value.path.length <= 300 &&
    !/[<>]/.test(value.path) &&
    Boolean(getSafeMessage(value.message))
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
