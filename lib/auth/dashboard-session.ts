import type { NextRequest } from "next/server";

export const DASHBOARD_AUTH_COOKIE = "fortis-dashboard-auth";

export function isDashboardAuthenticated(request: NextRequest | Request): boolean {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return false;
  const pairs = cookieHeader.split(";").map((p) => p.trim());
  for (const p of pairs) {
    if (p.startsWith(`${DASHBOARD_AUTH_COOKIE}=`)) {
      const v = p.slice(DASHBOARD_AUTH_COOKIE.length + 1);
      return v === "authenticated";
    }
  }
  return false;
}
