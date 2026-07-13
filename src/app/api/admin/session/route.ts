import {
  createExpiredSessionCookie,
  getVerifiedAdminSession,
  shouldUseSecureCookie,
} from "@/server/admin/adminSession";
import { getAdminEnvironment } from "@/server/admin/environment";
import { jsonResponse } from "@/server/admin/http";

export const runtime = "edge";

export async function GET(request: Request) {
  const environment = getAdminEnvironment();
  const session = await getVerifiedAdminSession(request, environment.SESSION_SECRET);

  if (!session) {
    return jsonResponse(
      { authenticated: false },
      200,
      {
        "Set-Cookie": createExpiredSessionCookie(shouldUseSecureCookie(request)),
      },
    );
  }

  return jsonResponse({
    authenticated: true,
    role: session.role,
    expiresAt: session.expiresAt,
  });
}

