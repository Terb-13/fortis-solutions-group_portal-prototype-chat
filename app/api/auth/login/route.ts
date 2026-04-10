import { NextResponse } from "next/server";

const COOKIE = "fortis-dashboard-auth";

export async function POST(req: Request) {
  const { password } = (await req.json()) as { password?: string };
  if (password !== "demo123") {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "authenticated", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
