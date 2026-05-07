import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isDashboardAuthenticated } from "@/lib/auth/dashboard-session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/admin")) {
    if (!(await isDashboardAuthenticated(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }
  if (pathname === "/dashboard/login") {
    return NextResponse.next();
  }
  if (!(await isDashboardAuthenticated(request))) {
    return NextResponse.redirect(new URL("/dashboard/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/api/admin/:path*"],
};
