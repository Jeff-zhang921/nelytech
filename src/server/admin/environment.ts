import { getOptionalRequestContext } from "@cloudflare/next-on-pages";

export type AdminEnvironment = CloudflareEnv;

const environmentKeys = [
  "ADMIN_KEY",
  "SESSION_SECRET",
  "GITHUB_TOKEN",
  "GITHUB_OWNER",
  "GITHUB_REPO",
  "GITHUB_BRANCH",
  "PRODUCTS_FILE_PATH",
  "PRODUCT_IMAGES_PATH",
  "E2E_GITHUB_MOCK_MODE",
] as const;

export function getAdminEnvironment(): AdminEnvironment {
  const cloudflareContext = getOptionalRequestContext();
  const processEnvironment = Object.fromEntries(
    environmentKeys.map((key) => [key, process.env[key]]),
  ) as AdminEnvironment;

  return cloudflareContext
    ? { ...processEnvironment, ...cloudflareContext.env }
    : processEnvironment;
}
