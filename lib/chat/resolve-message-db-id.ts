import { createHash } from "node:crypto";

/** UUID v4 pattern (any variant letter in version nibble accepted for incoming data). */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Stable UUID derived from conversation + client message id so:
 * - Supabase `fortis_messages.id uuid` accepts the value
 * - The same client id always maps to the same row id (sync idempotent)
 */
export function toDeterministicMessageUuid(
  conversationId: string,
  clientMessageId: string,
): string {
  const input = `${conversationId}\0${clientMessageId}`;
  const hash = createHash("sha256").update(input, "utf8").digest();
  const b = Buffer.from(hash.subarray(0, 16));
  b[6] = (b[6]! & 0x0f) | 0x40; // version 4
  b[8] = (b[8]! & 0x3f) | 0x80; // RFC 4122 variant
  const hex = b.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

/** Use plain UUID when the client already sent one; otherwise map nanoid → uuid. */
export function resolveMessageDbId(
  conversationId: string,
  clientMessageId: string,
): string {
  if (UUID_RE.test(clientMessageId)) return clientMessageId.toLowerCase();
  return toDeterministicMessageUuid(conversationId, clientMessageId);
}

/** Remap operator flags so messageId matches `fortis_messages.id` after sync. */
export function remapFlagsMessageIds(
  flags: unknown,
  conversationId: string,
): unknown[] {
  if (!Array.isArray(flags)) return [];
  return flags.map((f) => {
    if (!f || typeof f !== "object") return f;
    const o = f as Record<string, unknown>;
    const mid = o.messageId;
    if (typeof mid !== "string") return f;
    return {
      ...o,
      messageId: resolveMessageDbId(conversationId, mid),
    };
  });
}
