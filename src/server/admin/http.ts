export type ApiErrorBody = {
  error: string;
  message: string;
  fields?: Array<{ path: string; message: string }>;
};

const noStoreHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
};

export function jsonResponse(body: unknown, status = 200, headers?: HeadersInit) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...noStoreHeaders, ...headers },
  });
}

export function errorResponse(
  error: string,
  message: string,
  status: number,
  fields?: ApiErrorBody["fields"],
) {
  return jsonResponse({ error, message, ...(fields?.length ? { fields } : {}) }, status);
}

export function hasJsonContentType(request: Request) {
  return request.headers.get("content-type")?.split(";", 1)[0].trim() === "application/json";
}

export function hasMultipartContentType(request: Request) {
  return request.headers.get("content-type")?.toLowerCase().startsWith("multipart/form-data;");
}

export function hasAcceptableBodySize(request: Request, maximumBytes: number) {
  const contentLength = request.headers.get("content-length");
  if (!contentLength) return true;

  const parsedLength = Number(contentLength);
  return Number.isFinite(parsedLength) && parsedLength >= 0 && parsedLength <= maximumBytes;
}

export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);
    const requestUrl = new URL(request.url);
    if (originUrl.origin === requestUrl.origin) return true;

    const forwardedHost = request.headers.get("x-forwarded-host")?.split(",", 1)[0].trim();
    const host = forwardedHost || request.headers.get("host");
    const forwardedProtocol = request.headers
      .get("x-forwarded-proto")
      ?.split(",", 1)[0]
      .trim();
    const protocol = forwardedProtocol || requestUrl.protocol.replace(":", "");

    return Boolean(host) && originUrl.origin === `${protocol}://${host}`;
  } catch {
    return false;
  }
}

export function getCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return undefined;

  for (const cookie of cookieHeader.split(";")) {
    const separator = cookie.indexOf("=");
    if (separator === -1) continue;
    if (cookie.slice(0, separator).trim() !== name) continue;

    return cookie.slice(separator + 1).trim();
  }

  return undefined;
}
