import { expect, test, type Page, type Route } from "@playwright/test";

import { publishCatalogue } from "@/admin/api/adminApi";
import { rebaseCatalogueDraft } from "@/admin/publishing/catalogueMerge";
import {
  cloneCatalogueDraft,
  createPublishedCatalogueDraft,
  type CatalogueDraft,
} from "@/lib/adminCatalogueDraft";

import { authenticateAdmin } from "./adminTestHelpers";

const editorRoute = "/admin/catalogue/tn/4-digit-7-segment-display";
const localIntroduction = "Local draft introduction retained during repository recovery.";
const latestVersion = {
  commitSha: "c".repeat(40),
  contentSha: "d".repeat(40),
};

test.describe("Admin repository conflict recovery", () => {
  test("Stay in the Editor preserves the draft and a later submit conflicts visibly again", async ({
    page,
  }) => {
    await authenticateAdmin(page, editorRoute);
    await editIntroduction(page, localIntroduction);

    let publishCalls = 0;
    await page.route("**/api/admin/publish", async (route) => {
      publishCalls += 1;
      await fulfillConflict(route);
    });

    const submit = page.getByRole("button", { name: "Submit Changes" });
    await submit.click();
    const conflict = page.getByRole("dialog", { name: "The catalogue changed in GitHub" });
    await expect(conflict).toBeVisible();
    await expect(conflict).toContainText("Your unpublished work has not been removed");
    await expect(
      conflict.getByRole("button", { name: "Load Latest and Keep My Draft" }),
    ).toBeFocused();
    await expect(submit).toBeEnabled();
    await expect(submit).toHaveAttribute("aria-busy", "false");
    await expect(submit).toContainText("Submit Changes");

    await conflict.getByRole("button", { name: "Stay in the Editor" }).click();
    await expect(conflict).toHaveCount(0);
    await expect(submit).toBeEnabled();
    await expect(submit).toBeFocused();
    await expectDraftIntroduction(page, localIntroduction);

    await submit.click();
    await expect(conflict).toBeVisible();
    expect(publishCalls).toBe(2);
  });

  test("loads latest, rebases non-overlapping changes, and publishes from the new SHA", async ({
    page,
  }) => {
    await authenticateAdmin(page, editorRoute);
    await editIntroduction(page, localIntroduction);

    const latestDraft = createPublishedCatalogueDraft();
    latestDraft.categories[0].description =
      "Remote category description loaded from the latest GitHub revision.";
    latestDraft.updatedAt = "2026-07-14T09:00:00.000Z";
    let publishCalls = 0;
    let retriedSubmission:
      | { draft: CatalogueDraft; baseCommitSha?: string; baseContentSha?: string }
      | undefined;

    await page.route("**/api/admin/publish", async (route) => {
      publishCalls += 1;
      if (publishCalls === 1) {
        await fulfillConflict(route);
        return;
      }

      retriedSubmission = route.request().postDataJSON() as {
        draft: CatalogueDraft;
        baseCommitSha?: string;
        baseContentSha?: string;
      };
      await fulfillPublishSuccess(route);
    });
    await page.route("**/api/admin/catalogue/latest", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ draft: latestDraft, version: latestVersion }),
      }),
    );

    await page.getByRole("button", { name: "Submit Changes" }).click();
    const conflict = page.getByRole("dialog", { name: "The catalogue changed in GitHub" });
    await conflict.getByRole("button", { name: "Load Latest and Keep My Draft" }).click();
    await expect(conflict).toHaveCount(0);
    await expect(page.getByText("Unsaved changes", { exact: true })).toBeVisible();

    await page.getByRole("button", { name: "Submit Changes" }).click();
    await expect(
      page.getByRole("dialog", { name: "Changes submitted successfully" }),
    ).toBeVisible();
    expect(retriedSubmission?.baseCommitSha).toBe(latestVersion.commitSha);
    expect(retriedSubmission?.baseContentSha).toBe(latestVersion.contentSha);
    expect(retriedSubmission?.draft.categories[0].description).toBe(
      latestDraft.categories[0].description,
    );
    expect(getExampleProduct(retriedSubmission!.draft).detail.introduction).toBe(
      localIntroduction,
    );
  });

  test("reports overlapping edits and requires an explicit local-value decision", async ({
    page,
  }) => {
    await authenticateAdmin(page, editorRoute);
    await editIntroduction(page, localIntroduction);

    const latestDraft = createPublishedCatalogueDraft();
    getExampleProduct(latestDraft).detail.introduction =
      "A different introduction committed by another editor.";
    let publishCalls = 0;
    let retriedDraft: CatalogueDraft | undefined;

    await page.route("**/api/admin/publish", async (route) => {
      publishCalls += 1;
      if (publishCalls === 1) {
        await fulfillConflict(route);
        return;
      }
      retriedDraft = (route.request().postDataJSON() as { draft: CatalogueDraft }).draft;
      await fulfillPublishSuccess(route);
    });
    await page.route("**/api/admin/catalogue/latest", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ draft: latestDraft, version: latestVersion }),
      }),
    );

    await page.getByRole("button", { name: "Submit Changes" }).click();
    const conflict = page.getByRole("dialog", { name: "The catalogue changed in GitHub" });
    await conflict.getByRole("button", { name: "Load Latest and Keep My Draft" }).click();
    await expect(conflict).toContainText("Overlapping changes need your decision");
    await expect(conflict).toContainText("introduction");

    await conflict.getByRole("button", { name: "Keep My Draft Values" }).click();
    await page.getByRole("button", { name: "Submit Changes" }).click();
    await expect(
      page.getByRole("dialog", { name: "Changes submitted successfully" }),
    ).toBeVisible();
    expect(getExampleProduct(retriedDraft!).detail.introduction).toBe(localIntroduction);
  });

  test("keeps the recovery modal and draft usable when loading latest fails", async ({ page }) => {
    await authenticateAdmin(page, editorRoute);
    await editIntroduction(page, localIntroduction);
    await page.route("**/api/admin/publish", fulfillConflict);
    await page.route("**/api/admin/catalogue/latest", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          error: "REFRESH_FAILED",
          message: "The latest catalogue could not be loaded. Your draft is still available.",
        }),
      }),
    );

    await page.getByRole("button", { name: "Submit Changes" }).click();
    const conflict = page.getByRole("dialog", { name: "The catalogue changed in GitHub" });
    await conflict.getByRole("button", { name: "Load Latest and Keep My Draft" }).click();
    await expect(conflict).toBeVisible();
    await expect(conflict.getByRole("alert")).toContainText("could not be loaded");
    await expect(
      conflict.getByRole("button", { name: "Load Latest and Keep My Draft" }),
    ).toBeEnabled();
    await expectDraftIntroduction(page, localIntroduction);
  });
});

for (const failure of [
  { name: "400 invalid request response", status: 400, code: "INVALID_REQUEST" },
  {
    name: "422 validation response",
    status: 422,
    code: "VALIDATION_FAILED",
    fields: [{ path: "categories[0].name", message: "Review this field." }],
  },
  { name: "403 authorization response", status: 403, code: "INVALID_ORIGIN" },
  { name: "500 server response", status: 500, code: "PUBLISH_FAILED" },
]) {
  test(`recovers the submit control after a ${failure.name}`, async ({ page }) => {
    await authenticateAdmin(page, editorRoute);
    await editIntroduction(page, `${localIntroduction} ${failure.status}`);
    await page.route("**/api/admin/publish", (route) =>
      route.fulfill({
        status: failure.status,
        contentType: "application/json",
        body: JSON.stringify({
          error: failure.code,
          message: `Recoverable response ${failure.status}. Your draft has been preserved.`,
          ...(failure.fields ? { fields: failure.fields } : {}),
        }),
      }),
    );

    const submit = page.getByRole("button", { name: "Submit Changes" });
    await submit.click();
    await expect(page.getByRole("status")).toContainText(`Recoverable response ${failure.status}`);
    await expect(submit).toBeEnabled();
    await expect(submit).toContainText("Submit Changes");

    if (failure.fields) {
      await expect(submit).toHaveAttribute("aria-disabled", "false");
      await editIntroduction(page, `${localIntroduction} corrected`);
      await expect(submit).toHaveAttribute("aria-disabled", "false");
    }
  });
}

test("preserves the draft and provides a return-to-editor login path after 401", async ({ page }) => {
  await authenticateAdmin(page, editorRoute);
  await editIntroduction(page, localIntroduction);
  await page.route("**/api/admin/publish", (route) =>
    route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({
        error: "AUTHENTICATION_REQUIRED",
        message: "Your Admin session has expired. Sign in again to continue.",
      }),
    }),
  );

  await page.getByRole("button", { name: "Submit Changes" }).click();
  const expired = page.getByRole("dialog", { name: "Admin session expired" });
  await expect(expired).toContainText("draft is preserved");
  await expired.getByRole("button", { name: "Sign In Again" }).click();
  await expect(page).toHaveURL(/\/admin\/login\?returnTo=/);
  expect(new URL(page.url()).searchParams.get("returnTo")).toBe(editorRoute);
});

test("handles network and non-JSON failures without exposing raw HTML", async ({ page }) => {
  await authenticateAdmin(page, editorRoute);
  await editIntroduction(page, localIntroduction);
  const submit = page.getByRole("button", { name: "Submit Changes" });

  await page.route("**/api/admin/publish", (route) => route.abort("failed"));
  await submit.click();
  await expect(page.getByRole("status")).toContainText("could not be reached");
  await expect(submit).toBeEnabled();
  await page.unroute("**/api/admin/publish");

  await page.route("**/api/admin/publish", (route) =>
    route.fulfill({
      status: 500,
      contentType: "text/html",
      body: "<html><body>private upstream failure</body></html>",
    }),
  );
  await submit.click();
  await expect(page.getByRole("status")).toContainText("could not be completed");
  await expect(page.getByRole("status")).not.toContainText("private upstream failure");
  await expect(submit).toBeEnabled();
  await page.unroute("**/api/admin/publish");

  await page.route("**/api/admin/publish", (route) =>
    route.fulfill({
      status: 500,
      contentType: "text/plain",
      body: "The publishing service is temporarily unavailable.",
    }),
  );
  await submit.click();
  await expect(page.getByRole("status")).toContainText(
    "The publishing service is temporarily unavailable.",
  );
  await expect(submit).toBeEnabled();
  await page.unroute("**/api/admin/publish");

  await page.route("**/api/admin/publish", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ success: true }),
    }),
  );
  await submit.click();
  await expect(page.getByRole("status")).toContainText("invalid response");
  await expect(submit).toBeEnabled();
});

test("suppresses duplicate submits while one publish request is active", async ({ page }) => {
  await authenticateAdmin(page, editorRoute);
  await editIntroduction(page, localIntroduction);
  let calls = 0;
  await page.route("**/api/admin/publish", async (route) => {
    calls += 1;
    await new Promise((resolve) => setTimeout(resolve, 250));
    await fulfillPublishSuccess(route);
  });

  await page.getByRole("button", { name: "Submit Changes" }).evaluate((button) => {
    (button as HTMLButtonElement).click();
    (button as HTMLButtonElement).click();
  });
  await expect(
    page.getByRole("dialog", { name: "Changes submitted successfully" }),
  ).toBeVisible();
  expect(calls).toBe(1);
});

test("aborts a timed-out publish request and returns a recoverable error", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = ((_input: RequestInfo | URL, init?: RequestInit) =>
    new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => {
        reject(new DOMException("Aborted", "AbortError"));
      });
    })) as typeof fetch;

  try {
    await expect(
      publishCatalogue(createPublishedCatalogueDraft(), undefined, { timeoutMs: 20 }),
    ).rejects.toMatchObject({
      code: "REQUEST_TIMEOUT",
      status: 408,
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("three-way merge uses IDs and reports overlapping values", () => {
  const base = createPublishedCatalogueDraft();
  const local = cloneCatalogueDraft(base);
  const latest = cloneCatalogueDraft(base);
  getExampleProduct(local).detail.introduction = localIntroduction;
  getExampleProduct(latest).detail.suitableFor = "Remote use-case update.";

  const cleanMerge = rebaseCatalogueDraft(base, local, latest);
  expect(cleanMerge.conflicts).toEqual([]);
  expect(getExampleProduct(cleanMerge.draft).detail.introduction).toBe(localIntroduction);
  expect(getExampleProduct(cleanMerge.draft).detail.suitableFor).toBe("Remote use-case update.");

  getExampleProduct(latest).detail.introduction = "Remote competing introduction.";
  const overlap = rebaseCatalogueDraft(base, local, latest);
  expect(overlap.conflicts.some((conflict) => conflict.path.endsWith(".introduction"))).toBe(
    true,
  );
  expect(getExampleProduct(overlap.draft).detail.introduction).toBe(localIntroduction);
});

async function editIntroduction(page: Page, value: string) {
  await page.getByRole("button", { name: "Edit Product Summary" }).click();
  const editor = page.getByRole("dialog", { name: "Edit Product Summary" });
  await editor.getByLabel(/^Main introduction/).fill(value);
  await editor.getByRole("button", { name: "Save Section" }).click();
}

async function expectDraftIntroduction(page: Page, value: string) {
  const storedValue = await page.evaluate(() => {
    const stored = localStorage.getItem("nelytech.admin.catalogue-draft.v1");
    if (!stored) return undefined;
    const draft = JSON.parse(stored) as CatalogueDraft;
    return getStoredExampleProduct(draft)?.detail.introduction;

    function getStoredExampleProduct(catalogue: CatalogueDraft) {
      return catalogue.categories
        .flatMap((category) => [
          ...category.products,
          ...category.subcategories.flatMap((subcategory) => subcategory.products),
        ])
        .find((product) => product.slug === "4-digit-7-segment-display");
    }
  });
  expect(storedValue).toBe(value);
}

async function fulfillConflict(route: Route) {
  await route.fulfill({
    status: 409,
    contentType: "application/json",
    body: JSON.stringify({
      error: "REPOSITORY_CONFLICT",
      message: "The catalogue changed in GitHub while you were editing. Your draft has been preserved.",
      latestVersion,
    }),
  });
}

async function fulfillPublishSuccess(route: Route) {
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      success: true,
      commitSha: "e".repeat(40),
      contentSha: "f".repeat(40),
      previousCommitSha: latestVersion.commitSha,
      commitUrl: `https://github.com/example/catalogue/commit/${"e".repeat(40)}`,
      publishedAt: "2026-07-14T10:00:00.000Z",
      images: [],
    }),
  });
}

function getExampleProduct(draft: CatalogueDraft) {
  const product = draft.categories
    .flatMap((category) => [
      ...category.products,
      ...category.subcategories.flatMap((subcategory) => subcategory.products),
    ])
    .find((item) => item.slug === "4-digit-7-segment-display");
  if (!product) throw new Error("The example product is missing from the catalogue fixture.");
  return product;
}
