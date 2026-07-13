declare module "*.css" {}

interface CloudflareEnv {
  ADMIN_KEY?: string;
  SESSION_SECRET?: string;
  GITHUB_TOKEN?: string;
  GITHUB_OWNER?: string;
  GITHUB_REPO?: string;
  GITHUB_BRANCH?: string;
  PRODUCTS_FILE_PATH?: string;
  PRODUCT_IMAGES_PATH?: string;
  E2E_GITHUB_MOCK_MODE?: string;
}
