import { NextResponse } from "next/server";
import {
  DASHBOARD_AUTH_COOKIE,
  DASHBOARD_SESSION_MAX_AGE_SECONDS,
  signDashboardSession,
} from "@/lib/auth/dashboard-session";

const ADMIN_PASSWORD =
  process.env.FORTIS_ADMIN_PASSWORD?.trim() || "fortis2026";

export async function POST(req: Request) {
  const { password } = (await req.json()) as { password?: string };
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const cookieValue = await signDashboardSession();
  if (!cookieValue) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DASHBOARD_AUTH_COOKIE, cookieValue, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DASHBOARD_SESSION_MAX_AGE_SECONDS,
  });
  return res;
}
