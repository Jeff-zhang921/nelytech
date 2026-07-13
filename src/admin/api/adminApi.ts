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
  previousCommitSha: string;
  commitUrl: string;
  publishedAt: string;
  images: Array<{ id: string; path: string }>;
  draft: CatalogueDraft;
};

export class AdminApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly fields: Array<{ path: string; message: string }> = [],
  ) {
    super(message);
    this.name = "AdminApiError";
  }
}

export async function getAdminSession() {
  const response = await fetch("/api/admin/session", {
    method: "GET",
    cache: "no-store",
    credentials: "same-origin",
  });
  return parseResponse<AdminSessionResponse>(response);
}

export async function signInAdmin(key: string) {
  const response = await fetch("/api/admin/login", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key }),
  });
  return parseResponse<Extract<AdminSessionResponse, { authenticated: true }>>(response);
}

export async function signOutAdmin() {
  const response = await fetch("/api/admin/logout", {
    method: "POST",
    credentials: "same-origin",
  });
  return parseResponse<{ success: true }>(response);
}

export async function publishCatalogue(
  draft: CatalogueDraft,
  baseCommitSha?: string,
): Promise<PublishResult> {
  const prepared = prepareCataloguePublishRequest(draft);
  let body: BodyInit;
  let headers: HeadersInit | undefined;

  if (prepared.formData) {
    if (baseCommitSha) prepared.formData.set("baseCommitSha", baseCommitSha);
    body = prepared.formData;
  } else {
    headers = { "Content-Type": "application/json" };
    body = JSON.stringify({ draft: prepared.draft, baseCommitSha });
  }

  const response = await fetch("/api/admin/publish", {
    method: "POST",
    credentials: "same-origin",
    headers,
    body,
  });
  const result = await parseResponse<Omit<PublishResult, "draft">>(response);

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

async function parseResponse<T>(response: Response): Promise<T> {
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new AdminApiError(
      response.status || 500,
      "INVALID_RESPONSE",
      "The Admin service returned an invalid response.",
    );
  }

  if (!response.ok) {
    const errorBody = isRecord(body) ? body : {};
    throw new AdminApiError(
      response.status,
      typeof errorBody.error === "string" ? errorBody.error : "REQUEST_FAILED",
      typeof errorBody.message === "string"
        ? errorBody.message
        : "The Admin request could not be completed.",
      Array.isArray(errorBody.fields)
        ? errorBody.fields.filter(isValidationField).slice(0, 100)
        : [],
    );
  }

  return body as T;
}

function isValidationField(value: unknown): value is { path: string; message: string } {
  return (
    isRecord(value) && typeof value.path === "string" && typeof value.message === "string"
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
