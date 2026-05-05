import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/admin")) {
    const auth = request.cookies.get("fortis-dashboard-auth");
    if (auth?.value !== "authenticated") {
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
  const auth = request.cookies.get("fortis-dashboard-auth");
  if (auth?.value !== "authenticated") {
    return NextResponse.redirect(new URL("/dashboard/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/api/admin/:path*"],
};
