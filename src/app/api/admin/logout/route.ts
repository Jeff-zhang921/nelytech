import {
  createExpiredSessionCookie,
  shouldUseSecureCookie,
} from "@/server/admin/adminSession";
import { errorResponse, isSameOriginRequest, jsonResponse } from "@/server/admin/http";

export const runtime = "edge";

export function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return errorResponse("INVALID_ORIGIN", "The request could not be accepted.", 403);
  }

  return jsonResponse(
    { success: true },
    200,
    {
      "Set-Cookie": createExpiredSessionCookie(shouldUseSecureCookie(request)),
    },
  );
}
