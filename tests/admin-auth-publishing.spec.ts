import { expect, test } from "@playwright/test";

import { createAdminSession, verifyAdminSession } from "@/server/admin/adminSession";
import {
  normalizeRepositoryPath,
  publishCatalogueCommit,
} from "@/server/admin/githubClient";
import { createCanonicalCatalogue, serializeCanonicalCatalogue } from "@/server/admin/catalogueSerializer";
import { validateCatalogueDraftForPublish } from "@/server/admin/catalogueValidation";
import { canonicalCatalogue } from "@/content/catalogue";
import { createPublishedCatalogueDraft } from "@/lib/adminCatalogueDraft";

import { authenticateAdmin, playwrightAdminKey } from "./adminTestHelpers";

const sessionSecret = "unit-test-session-secret-with-more-than-32-characters";

test.describe("Admin authentication and publishing", () => {
  test("protects Admin routes and creates an HTTP-only session after valid login", async ({
    page,
  }) => {
    const protectedCatalogue = await page.request.get("/api/admin/catalogue/latest");
    expect(protectedCatalogue.status()).toBe(401);
    expect(protectedCatalogue.headers()["cache-control"]).toContain("no-store");

    await page.goto("/admin/catalogue/tn");
    await expect(page).toHaveURL(/\/admin\/login\?returnTo=/);
    await expect(page.locator('[data-interface-context="product-admin"]')).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Admin Sign In" })).toBeVisible();

    const accessKey = page.getByLabel("Administrator access key", { exact: true });
    await accessKey.fill("incorrect-key");
    await page.getByRole("button", { name: "Sign In", exact: true }).click();
    await expect(page.locator("#admin-login-error")).toHaveText(
      "The access key is incorrect.",
    );
    await expect(accessKey).toHaveValue("");

    await accessKey.fill(playwrightAdminKey);
    await page.getByRole("button", { name: "Sign In", exact: true }).click();
    await expect(page).toHaveURL("/admin/catalogue/tn");
    await page.reload();
    await expect(page.getByText("Live Preview", { exact: true })).toBeVisible();
    const latestCatalogue = await page.request.get("/api/admin/catalogue/latest");
    expect(latestCatalogue.status()).toBe(200);
    expect(latestCatalogue.headers()["cache-control"]).toContain("no-store");

    const sessionCookie = (await page.context().cookies()).find(
      (cookie) => cookie.name === "nelytech_admin_session",
    );
    expect(sessionCookie?.httpOnly).toBe(true);
    expect(sessionCookie?.sameSite).toBe("Strict");

    const storedSecrets = await page.evaluate(() => ({
      local: Object.values(localStorage),
      session: Object.values(sessionStorage),
    }));
    expect(JSON.stringify(storedSecrets)).not.toContain(playwrightAdminKey);

    await page.getByRole("button", { name: "Log out" }).click();
    await expect(page).toHaveURL("/admin/login");
    await page.goto("/admin/catalogue");
    await expect(page).toHaveURL(/\/admin\/login\?returnTo=/);
  });

  test("publishes only after the protected request succeeds", async ({ page }) => {
    await authenticateAdmin(page, "/admin/catalogue/tn/4-digit-7-segment-display");
    await page.getByRole("button", { name: "Edit Product Summary" }).click();
    const editor = page.getByRole("dialog", { name: "Edit Product Summary" });
    await editor
      .getByLabel(/^Main introduction/)
      .fill("Published through the protected Git-based catalogue workflow.");
    await editor.getByRole("button", { name: "Save Section" }).click();

    const publishResponse = page.waitForResponse(
      (response) => response.url().endsWith("/api/admin/publish") && response.status() === 200,
    );
    const submit = page.getByRole("button", { name: "Submit Changes" });
    await submit.click();
    await expect(submit).toBeDisabled();
    await publishResponse;

    const success = page.getByRole("dialog", { name: "Changes submitted successfully" });
    await expect(success).toContainText("approximately 2 minutes");
    await expect(page.getByText("Unsaved changes", { exact: true })).toHaveCount(0);
    await success.getByRole("button", { name: "Continue Editing" }).click();
    await expect(submit).toHaveAttribute("aria-disabled", "true");
  });

  test("preserves the dirty draft on GitHub failure and conflict", async ({ page }) => {
    await authenticateAdmin(page, "/admin/catalogue/tn/4-digit-7-segment-display");

    for (const response of [
      {
        status: 502,
        body: {
          error: "GITHUB_FAILURE",
          message:
            "The catalogue could not be committed to GitHub. Your draft has been preserved. Please try again.",
        },
      },
      {
        status: 409,
        body: {
          error: "REPOSITORY_CONFLICT",
          message:
            "The catalogue changed in GitHub while you were editing. Your draft has been preserved.",
          latestVersion: {
            commitSha: "c".repeat(40),
            contentSha: "d".repeat(40),
          },
        },
      },
    ]) {
      await page.route("**/api/admin/publish", (route) =>
        route.fulfill({ status: response.status, contentType: "application/json", body: JSON.stringify(response.body) }),
      );
      await page.getByRole("button", { name: "Edit Product Summary" }).click();
      const editor = page.getByRole("dialog", { name: "Edit Product Summary" });
      await editor
        .getByLabel(/^Main introduction/)
        .fill(`Draft preserved after status ${response.status}.`);
      await editor.getByRole("button", { name: "Save Section" }).click();
      await page.getByRole("button", { name: "Submit Changes" }).click();

      await expect(page.getByRole("status")).toContainText(response.body.message);
      await expect(page.getByText("Unsaved changes", { exact: true })).toBeVisible();
      await expect(
        page.getByRole("dialog", { name: "Changes submitted successfully" }),
      ).toHaveCount(0);
      await page.unroute("**/api/admin/publish");
    }
  });
});

test.describe("Admin security modules", () => {
  test("signs, verifies, rejects tampering, and expires sessions", async () => {
    const now = Date.UTC(2026, 6, 13, 0, 0, 0);
    const session = await createAdminSession(sessionSecret, now);

    expect(await verifyAdminSession(session.token, sessionSecret, now + 1_000)).toMatchObject({
      role: "admin",
      expiresAt: session.payload.expiresAt,
    });
    expect(
      await verifyAdminSession(`${session.token.slice(0, -1)}x`, sessionSecret, now + 1_000),
    ).toBeNull();
    expect(
      await verifyAdminSession(session.token, sessionSecret, now + 4 * 60 * 60 * 1_000 + 1),
    ).toBeNull();
  });

  test("validates and serializes the canonical catalogue deterministically", () => {
    const draft = createPublishedCatalogueDraft();
    const validation = validateCatalogueDraftForPublish(
      draft,
      canonicalCatalogue.filterSchemas,
    );
    expect(validation.valid).toBe(true);

    const canonical = createCanonicalCatalogue(
      draft,
      canonicalCatalogue.filterSchemas,
      "2026-07-13T00:00:00.000Z",
    );
    const serialized = serializeCanonicalCatalogue(canonical);
    expect(serialized.endsWith("\n")).toBe(true);
    expect(serialized).not.toContain("blob:");
    expect(serialized).toBe(serializeCanonicalCatalogue(canonical));

    draft.categories[0].subcategories[0].products[0].filters.interface = ["not-in-schema"];
    const invalid = validateCatalogueDraftForPublish(draft, canonicalCatalogue.filterSchemas);
    expect(invalid.valid).toBe(false);
    if (!invalid.valid) {
      expect(invalid.fields).toContainEqual(
        expect.objectContaining({
          path: expect.stringContaining("filters.interface"),
          message: expect.stringContaining("does not belong"),
        }),
      );
    }
  });

  test("sanitizes repository paths and performs a non-forced single Git commit", async () => {
    expect(() => normalizeRepositoryPath("../products.json")).toThrow();
    expect(normalizeRepositoryPath("src/content/products.json")).toBe(
      "src/content/products.json",
    );

    const requests: Array<{ url: string; init?: RequestInit }> = [];
    let refReads = 0;
    const mockedFetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      requests.push({ url, init });
      if (url.includes("/git/ref/heads/")) {
        refReads += 1;
        return Response.json({ object: { sha: "a".repeat(40) } });
      }
      if (url.includes("/git/commits/") && (!init?.method || init.method === "GET")) {
        return Response.json({ tree: { sha: "b".repeat(40) } });
      }
      if (url.includes("/contents/")) {
        return Response.json({
          type: "file",
          encoding: "base64",
          sha: "9".repeat(40),
          content: btoa("{}\n"),
        });
      }
      if (url.endsWith("/git/blobs")) return Response.json({ sha: "c".repeat(40) });
      if (url.endsWith("/git/trees")) return Response.json({ sha: "d".repeat(40) });
      if (url.endsWith("/git/commits")) return Response.json({ sha: "e".repeat(40) });
      if (url.includes("/git/refs/heads/")) return Response.json({ object: { sha: "e".repeat(40) } });
      return new Response(null, { status: 404 });
    }) as typeof fetch;

    const result = await publishCatalogueCommit(
      {
        GITHUB_TOKEN: "test-token-not-a-real-secret",
        GITHUB_OWNER: "example",
        GITHUB_REPO: "catalogue",
        GITHUB_BRANCH: "main",
        PRODUCTS_FILE_PATH: "src/content/products.json",
      },
      "{}\n",
      [],
      "a".repeat(40),
      mockedFetch,
    );

    expect(result.commitSha).toBe("e".repeat(40));
    expect(refReads).toBe(2);
    const update = requests.find((request) => request.init?.method === "PATCH");
    expect(JSON.parse(String(update?.init?.body))).toMatchObject({ force: false });

    const unrelatedCommitFetch = (async (
      input: RequestInfo | URL,
      init?: RequestInit,
    ) => {
      const url = String(input);
      if (url.includes("/git/ref/heads/")) {
        return Response.json({ object: { sha: "f".repeat(40) } });
      }
      return mockedFetch(input, init);
    }) as typeof fetch;
    const unrelatedResult = await publishCatalogueCommit(
      {
        GITHUB_TOKEN: "test-token-not-a-real-secret",
        GITHUB_OWNER: "example",
        GITHUB_REPO: "catalogue",
        GITHUB_BRANCH: "main",
        PRODUCTS_FILE_PATH: "src/content/products.json",
      },
      "{}\n",
      [],
      "a".repeat(40),
      unrelatedCommitFetch,
      "9".repeat(40),
    );
    expect(unrelatedResult.previousCommitSha).toBe("f".repeat(40));

    let conflictRefReads = 0;
    const conflictFetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      if (url.includes("/git/ref/heads/")) {
        conflictRefReads += 1;
        return Response.json({
          object: { sha: (conflictRefReads === 1 ? "a" : "f").repeat(40) },
        });
      }
      return mockedFetch(input, init);
    }) as typeof fetch;

    await expect(
      publishCatalogueCommit(
        {
          GITHUB_TOKEN: "test-token-not-a-real-secret",
          GITHUB_OWNER: "example",
          GITHUB_REPO: "catalogue",
          GITHUB_BRANCH: "main",
        },
        "{}\n",
        [],
        "a".repeat(40),
        conflictFetch,
      ),
    ).rejects.toMatchObject({
      latestVersion: {
        commitSha: "f".repeat(40),
        contentSha: "9".repeat(40),
      },
    });
  });
});
