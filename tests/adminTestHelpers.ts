import type { Page } from "@playwright/test";

export const playwrightAdminKey = "playwright-admin-key";

export async function authenticateAdmin(page: Page, returnTo = "/admin/catalogue") {
  await page.goto(`/admin/login?returnTo=${encodeURIComponent(returnTo)}`);
  await page.getByLabel("Administrator access key", { exact: true }).fill(playwrightAdminKey);
  await page.getByRole("button", { name: "Sign In", exact: true }).click();
  await page.waitForURL(returnTo);
}
