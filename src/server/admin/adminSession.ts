import { getCookie } from "./http";

export const ADMIN_SESSION_COOKIE = "nelytech_admin_session";
export const ADMIN_SESSION_DURATION_SECONDS = 4 * 60 * 60;

export type AdminSessionPayload = {
  role: "admin";
  issuedAt: number;
  expiresAt: number;
  nonce: string;
};

const encoder = new TextEncoder();

export async function createAdminSession(
  secret: string,
  now = Date.now(),
): Promise<{ token: string; payload: AdminSessionPayload }> {
  const issuedAt = Math.floor(now / 1000);
  const payload: AdminSessionPayload = {
    role: "admin",
    issuedAt,
    expiresAt: issuedAt + ADMIN_SESSION_DURATION_SECONDS,
    nonce: crypto.randomUUID(),
  };
  const encodedPayload = encodeBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await sign(encodedPayload, secret);

  return { token: `${encodedPayload}.${encodeBase64Url(signature)}`, payload };
}

export async function verifyAdminSession(
  token: string | undefined,
  secret: string | undefined,
  now = Date.now(),
): Promise<AdminSessionPayload | null> {
  if (!token || !secret || secret.length < 32) return null;

  const [encodedPayload, encodedSignature, extra] = token.split(".");
  if (!encodedPayload || !encodedSignature || extra) return null;

  try {
    const actualSignature = decodeBase64Url(encodedSignature);
    const expectedSignature = await sign(encodedPayload, secret);
    if (!constantTimeBytesEqual(actualSignature, expectedSignature)) return null;

    const payload = JSON.parse(
      new TextDecoder().decode(decodeBase64Url(encodedPayload)),
    ) as Partial<AdminSessionPayload>;
    const currentTime = Math.floor(now / 1000);

    if (
      payload.role !== "admin" ||
      !Number.isInteger(payload.issuedAt) ||
      !Number.isInteger(payload.expiresAt) ||
      typeof payload.nonce !== "string" ||
      payload.nonce.length < 8 ||
      (payload.issuedAt as number) > currentTime + 60 ||
      (payload.expiresAt as number) <= currentTime ||
      (payload.expiresAt as number) - (payload.issuedAt as number) >
        ADMIN_SESSION_DURATION_SECONDS
    ) {
      return null;
    }

    return payload as AdminSessionPayload;
  } catch {
    return null;
  }
}

export async function getVerifiedAdminSession(request: Request, secret: string | undefined) {
  return verifyAdminSession(getCookie(request, ADMIN_SESSION_COOKIE), secret);
}

export async function constantTimeSecretEqual(left: string, right: string) {
  const [leftDigest, rightDigest] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(left)),
    crypto.subtle.digest("SHA-256", encoder.encode(right)),
  ]);

  return constantTimeBytesEqual(new Uint8Array(leftDigest), new Uint8Array(rightDigest));
}

export function createSessionCookie(token: string, secure: boolean) {
  return [
    `${ADMIN_SESSION_COOKIE}=${token}`,
    "HttpOnly",
    secure ? "Secure" : "",
    "SameSite=Strict",
    "Path=/",
    `Max-Age=${ADMIN_SESSION_DURATION_SECONDS}`,
  ]
    .filter(Boolean)
    .join("; ");
}

export function createExpiredSessionCookie(secure: boolean) {
  return [
    `${ADMIN_SESSION_COOKIE}=`,
    "HttpOnly",
    secure ? "Secure" : "",
    "SameSite=Strict",
    "Path=/",
    "Max-Age=0",
    "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
  ]
    .filter(Boolean)
    .join("; ");
}

function isProductionRequest(requestUrl: string) {
  return new URL(requestUrl).protocol === "https:";
}

export function shouldUseSecureCookie(request: Request) {
  return isProductionRequest(request.url);
}

async function sign(encodedPayload: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(encodedPayload)));
}

function constantTimeBytesEqual(left: Uint8Array, right: Uint8Array) {
  const maximumLength = Math.max(left.length, right.length);
  let difference = left.length ^ right.length;

  for (let index = 0; index < maximumLength; index += 1) {
    difference |= (left[index] ?? 0) ^ (right[index] ?? 0);
  }

  return difference === 0;
}

function encodeBase64Url(bytes: Uint8Array) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value: string) {
  if (!/^[A-Za-z0-9_-]+$/.test(value)) throw new Error("Invalid base64url value");
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(
    Math.ceil(value.length / 4) * 4,
    "=",
  );
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}
