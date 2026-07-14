import { canonicalCatalogue } from "@/content/catalogue";
import type { CatalogueDraft } from "@/lib/adminCatalogueDraft";
import { getVerifiedAdminSession } from "@/server/admin/adminSession";
import { getAdminEnvironment } from "@/server/admin/environment";
import {
  GitHubApiError,
  GitHubConfigurationError,
  loadPublishedCatalogueFile,
} from "@/server/admin/githubClient";
import { errorResponse, isSameOriginRequest, jsonResponse } from "@/server/admin/http";

export const runtime = "edge";

const mockVersion = {
  commitSha: "cccccccccccccccccccccccccccccccccccccccc",
  contentSha: "dddddddddddddddddddddddddddddddddddddddd",
};

export async function GET(request: Request) {
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

  try {
    if (environment.E2E_GITHUB_MOCK_MODE) {
      return jsonResponse({
        draft: toCatalogueDraft(canonicalCatalogue),
        version: mockVersion,
      });
    }

    const latest = await loadPublishedCatalogueFile(environment);
    const parsed = parseCatalogueDraft(latest.content);

    return jsonResponse({ draft: parsed, version: latest.version });
  } catch (error) {
    if (error instanceof GitHubConfigurationError) {
      console.error("Catalogue publishing is not configured correctly.");
      return errorResponse(
        "PUBLISHING_UNAVAILABLE",
        "The latest published catalogue could not be loaded. Your draft is still available.",
        503,
      );
    }

    if (error instanceof GitHubApiError) {
      console.error(`GitHub catalogue refresh failed with status ${error.status}.`);
      return errorResponse(
        "GITHUB_FAILURE",
        "The latest published catalogue could not be loaded from GitHub. Your draft is still available.",
        502,
      );
    }

    console.error("Unexpected catalogue refresh failure.");
    return errorResponse(
      "REFRESH_FAILED",
      "The latest published catalogue could not be loaded. Your draft is still available.",
      500,
    );
  }
}

function parseCatalogueDraft(content: string): CatalogueDraft {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new GitHubApiError(502);
  }

  if (!isRecord(parsed) || !Array.isArray(parsed.categories)) {
    throw new GitHubApiError(502);
  }

  return toCatalogueDraft(parsed as CatalogueDraft);
}

function toCatalogueDraft(value: CatalogueDraft): CatalogueDraft {
  return {
    categories: structuredClone(value.categories),
    ...(typeof value.updatedAt === "string" ? { updatedAt: value.updatedAt } : {}),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
