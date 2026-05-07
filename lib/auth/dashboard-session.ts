import type { NextRequest } from "next/server";

export const DASHBOARD_AUTH_COOKIE = "fortis-dashboard-auth";
export const DASHBOARD_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const TEXT_ENCODER = new TextEncoder();

function getSecretBytes(): Uint8Array | null {
  const raw = process.env.FORTIS_DASHBOARD_SESSION_SECRET;
  if (!raw) return null;
  const bytes = TEXT_ENCODER.encode(raw);
  if (bytes.length < 32) return null;
  return bytes;
}

async function importHmacKey(
  secret: Uint8Array,
  usage: KeyUsage,
): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    secret as BufferSource,
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage],
  );
}

function toBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array | null {
  try {
    const padded =
      s.replace(/-/g, "+").replace(/_/g, "/") +
      "===".slice((s.length + 3) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch {
    return null;
  }
}

export async function signDashboardSession(): Promise<string | null> {
  const secret = getSecretBytes();
  if (!secret) return null;
  const exp = Math.floor(Date.now() / 1000) + DASHBOARD_SESSION_MAX_AGE_SECONDS;
  const expStr = String(exp);
  const key = await importHmacKey(secret, "sign");
  const sigBuf = await crypto.subtle.sign(
    "HMAC",
    key,
    TEXT_ENCODER.encode(expStr) as BufferSource,
  );
  return `${expStr}.${toBase64Url(sigBuf)}`;
}

export async function isDashboardAuthenticated(
  request: NextRequest | Request,
): Promise<boolean> {
  const secret = getSecretBytes();
  if (!secret) return false;

  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return false;

  let raw: string | null = null;
  for (const pair of cookieHeader.split(";")) {
    const trimmed = pair.trim();
    if (trimmed.startsWith(`${DASHBOARD_AUTH_COOKIE}=`)) {
      raw = trimmed.slice(DASHBOARD_AUTH_COOKIE.length + 1);
      break;
    }
  }
  if (!raw) return false;

  const dot = raw.indexOf(".");
  if (dot <= 0 || dot === raw.length - 1) return false;

  const expStr = raw.slice(0, dot);
  const sigB64 = raw.slice(dot + 1);

  if (!/^\d+$/.test(expStr)) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp)) return false;

  const sig = fromBase64Url(sigB64);
  if (!sig) return false;

  const key = await importHmacKey(secret, "verify");
  const ok = await crypto.subtle.verify(
    "HMAC",
    key,
    sig as BufferSource,
    TEXT_ENCODER.encode(expStr) as BufferSource,
  );
  if (!ok) return false;

  if (exp <= Math.floor(Date.now() / 1000)) return false;

  return true;
}
