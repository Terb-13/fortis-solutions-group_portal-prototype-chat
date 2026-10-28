import "server-only";

import { mapEstimateRow, type QuoteDisplay } from "@/lib/quote/map-estimate-row";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Columns rendered by the public quote page. */
const PUBLIC_ESTIMATE_COLUMNS = [
  "id",
  "business_name",
  "contact_name",
  "email",
  "phone",
  "address",
  "items",
  "subtotal",
  "notes",
  "created_at",
  "valid_until",
].join(", ");

export type LoadEstimateResult =
  | { ok: false; reason: "invalid-id" }
  | { ok: false; reason: "not-configured" }
  | { ok: false; reason: "fetch-error"; message: string }
  | { ok: false; reason: "not-found" }
  | { ok: true; quote: QuoteDisplay };

/**
 * Loads one estimate for the public quote page.
 * Service role, server-only. Rejects anything that is not a UUID before querying.
 */
export async function loadEstimateForQuote(id: string): Promise<LoadEstimateResult> {
  const trimmed = id.trim();
  if (!UUID_RE.test(trimmed)) {
    return { ok: false, reason: "invalid-id" };
  }

  if (!isSupabaseAdminConfigured()) {
    return { ok: false, reason: "not-configured" };
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("fortis_estimates")
    .select(PUBLIC_ESTIMATE_COLUMNS)
    .eq("id", trimmed)
    .maybeSingle();

  if (error) {
    return { ok: false, reason: "fetch-error", message: error.message };
  }

  const quote = mapEstimateRow(data as Record<string, unknown> | null);
  if (!quote) {
    return { ok: false, reason: "not-found" };
  }

  return { ok: true, quote };
}
