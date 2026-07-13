import type { AdminEnvironment } from "./environment";
import type { RepositoryFile } from "./imagePreparation";

export type GitHubPublishResult = {
  commitSha: string;
  previousCommitSha: string;
  commitUrl: string;
};

export class GitHubConfigurationError extends Error {
  constructor() {
    super("GitHub publishing is not configured.");
    this.name = "GitHubConfigurationError";
  }
}

export class GitHubConflictError extends Error {
  constructor() {
    super("The repository branch changed during publishing.");
    this.name = "GitHubConflictError";
  }
}

export class GitHubApiError extends Error {
  constructor(readonly status: number) {
    super("The GitHub publishing request failed.");
    this.name = "GitHubApiError";
  }
}

export async function publishCatalogueCommit(
  environment: AdminEnvironment,
  catalogueJson: string,
  imageFiles: RepositoryFile[],
  expectedBaseSha?: string,
  fetchImplementation: typeof fetch = fetch,
): Promise<GitHubPublishResult> {
  const configuration = getGitHubConfiguration(environment);
  const repositoryFiles: RepositoryFile[] = [
    {
      path: normalizeRepositoryPath(configuration.productsFilePath),
      content: new TextEncoder().encode(catalogueJson),
    },
    ...imageFiles.map((file) => ({
      path: normalizeRepositoryPath(file.path),
      content: file.content,
    })),
  ];
  const client = createGitHubClient(configuration, fetchImplementation);
  const startingHead = await client.getBranchHead();

  if (expectedBaseSha && expectedBaseSha !== startingHead) {
    throw new GitHubConflictError();
  }

  const baseTreeSha = await client.getCommitTree(startingHead);
  const treeEntries: Array<{ path: string; mode: "100644"; type: "blob"; sha: string }> = [];

  for (const file of repositoryFiles) {
    const blobSha = await client.createBlob(file.content);
    treeEntries.push({ path: file.path, mode: "100644", type: "blob", sha: blobSha });
  }

  const treeSha = await client.createTree(baseTreeSha, treeEntries);
  const commitSha = await client.createCommit(treeSha, startingHead);
  const latestHead = await client.getBranchHead();

  if (latestHead !== startingHead) {
    throw new GitHubConflictError();
  }

  try {
    await client.updateBranch(commitSha);
  } catch (error) {
    if (error instanceof GitHubApiError && (error.status === 409 || error.status === 422)) {
      throw new GitHubConflictError();
    }
    throw error;
  }

  return {
    commitSha,
    previousCommitSha: startingHead,
    commitUrl: `https://github.com/${encodeURIComponent(configuration.owner)}/${encodeURIComponent(configuration.repo)}/commit/${commitSha}`,
  };
}

export function normalizeRepositoryPath(value: string) {
  const normalized = value.trim().replaceAll("\\", "/").replace(/^\/+|\/+$/g, "");
  const segments = normalized.split("/");

  if (
    !normalized ||
    segments.some((segment) => !segment || segment === "." || segment === "..") ||
    segments.some((segment) => !/^[A-Za-z0-9._-]+$/.test(segment))
  ) {
    throw new GitHubConfigurationError();
  }

  return normalized;
}

function getGitHubConfiguration(environment: AdminEnvironment) {
  const owner = environment.GITHUB_OWNER?.trim();
  const repo = environment.GITHUB_REPO?.trim();
  const branch = environment.GITHUB_BRANCH?.trim() || "main";
  const token = environment.GITHUB_TOKEN;
  const productsFilePath = environment.PRODUCTS_FILE_PATH?.trim() || "src/content/products.json";

  if (
    !owner ||
    !repo ||
    !token ||
    !/^[A-Za-z0-9_.-]+$/.test(owner) ||
    !/^[A-Za-z0-9_.-]+$/.test(repo) ||
    !/^[A-Za-z0-9._/-]+$/.test(branch) ||
    branch.includes("..")
  ) {
    throw new GitHubConfigurationError();
  }

  return { owner, repo, branch, token, productsFilePath };
}

function createGitHubClient(
  configuration: ReturnType<typeof getGitHubConfiguration>,
  fetchImplementation: typeof fetch,
) {
  const baseUrl = `https://api.github.com/repos/${encodeURIComponent(configuration.owner)}/${encodeURIComponent(configuration.repo)}`;
  const branchPath = configuration.branch.split("/").map(encodeURIComponent).join("/");

  async function request(path: string, init?: RequestInit) {
    let response: Response;
    try {
      response = await fetchImplementation(`${baseUrl}${path}`, {
        ...init,
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${configuration.token}`,
          "Content-Type": "application/json",
          "User-Agent": "nelytech-product-cms",
          "X-GitHub-Api-Version": "2022-11-28",
          ...init?.headers,
        },
      });
    } catch {
      throw new GitHubApiError(502);
    }

    if (!response.ok) throw new GitHubApiError(response.status);

    try {
      return (await response.json()) as Record<string, unknown>;
    } catch {
      throw new GitHubApiError(502);
    }
  }

  return {
    async getBranchHead() {
      const result = await request(`/git/ref/heads/${branchPath}`);
      const object = result.object;
      if (!isRecord(object) || typeof object.sha !== "string") throw new GitHubApiError(502);
      return object.sha;
    },
    async getCommitTree(commitSha: string) {
      const result = await request(`/git/commits/${encodeURIComponent(commitSha)}`);
      const tree = result.tree;
      if (!isRecord(tree) || typeof tree.sha !== "string") throw new GitHubApiError(502);
      return tree.sha;
    },
    async createBlob(content: Uint8Array) {
      const result = await request("/git/blobs", {
        method: "POST",
        body: JSON.stringify({ content: bytesToBase64(content), encoding: "base64" }),
      });
      if (typeof result.sha !== "string") throw new GitHubApiError(502);
      return result.sha;
    },
    async createTree(
      baseTree: string,
      tree: Array<{ path: string; mode: "100644"; type: "blob"; sha: string }>,
    ) {
      const result = await request("/git/trees", {
        method: "POST",
        body: JSON.stringify({ base_tree: baseTree, tree }),
      });
      if (typeof result.sha !== "string") throw new GitHubApiError(502);
      return result.sha;
    },
    async createCommit(tree: string, parent: string) {
      const result = await request("/git/commits", {
        method: "POST",
        body: JSON.stringify({
          message: "content(catalogue): update products from admin editor",
          tree,
          parents: [parent],
        }),
      });
      if (typeof result.sha !== "string") throw new GitHubApiError(502);
      return result.sha;
    },
    async updateBranch(commitSha: string) {
      await request(`/git/refs/heads/${branchPath}`, {
        method: "PATCH",
        body: JSON.stringify({ sha: commitSha, force: false }),
      });
    },
  };
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunkSize = 32_768;

  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }

  return btoa(binary);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
