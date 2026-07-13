import {
  constantTimeSecretEqual,
  createAdminSession,
  createSessionCookie,
  shouldUseSecureCookie,
} from "@/server/admin/adminSession";
import { getAdminEnvironment } from "@/server/admin/environment";
import {
  errorResponse,
  hasAcceptableBodySize,
  hasJsonContentType,
  isSameOriginRequest,
  jsonResponse,
} from "@/server/admin/http";

export const runtime = "edge";

const invalidLoginMessage = "The access key is incorrect.";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return errorResponse("INVALID_ORIGIN", "The request could not be accepted.", 403);
  }

  if (!hasJsonContentType(request) || !hasAcceptableBodySize(request, 2_048)) {
    return errorResponse("INVALID_CREDENTIALS", invalidLoginMessage, 401);
  }

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > 2_048) {
      return errorResponse("INVALID_CREDENTIALS", invalidLoginMessage, 401);
    }
    body = JSON.parse(rawBody);
  } catch {
    return errorResponse("INVALID_CREDENTIALS", invalidLoginMessage, 401);
  }

  const key =
    typeof body === "object" && body !== null && "key" in body
      ? (body as { key?: unknown }).key
      : undefined;

  if (typeof key !== "string" || key.length < 1 || key.length > 256) {
    return errorResponse("INVALID_CREDENTIALS", invalidLoginMessage, 401);
  }

  const environment = getAdminEnvironment();
  if (!environment.ADMIN_KEY || !environment.SESSION_SECRET || environment.SESSION_SECRET.length < 32) {
    console.error("Admin authentication is not configured correctly.");
    return errorResponse(
      "AUTHENTICATION_UNAVAILABLE",
      "Admin sign in is temporarily unavailable.",
      503,
    );
  }

  if (!(await constantTimeSecretEqual(key, environment.ADMIN_KEY))) {
    return errorResponse("INVALID_CREDENTIALS", invalidLoginMessage, 401);
  }

  const session = await createAdminSession(environment.SESSION_SECRET);
  return jsonResponse(
    {
      authenticated: true,
      role: session.payload.role,
      expiresAt: session.payload.expiresAt,
    },
    200,
    {
      "Set-Cookie": createSessionCookie(
        session.token,
        shouldUseSecureCookie(request),
      ),
    },
  );
}
