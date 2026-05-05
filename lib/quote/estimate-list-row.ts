import { mapEstimateRow } from "@/lib/quote/map-estimate-row";

export type EstimateListItem = {
  id: string;
  customerName: string;
  dateIso: string | null;
  total: number | null;
  status: string;
};

/**
 * Table row for admin estimates list (supports structured + legacy `payload` rows).
 */
export function estimateRowToListItem(row: Record<string, unknown>): EstimateListItem {
  const id = String(row.id ?? "");
  const status =
    typeof row.status === "string" && row.status.trim()
      ? row.status.trim()
      : "generated";

  const quote = mapEstimateRow(row);
  if (!quote) {
    return {
      id: id || "—",
      customerName: "—",
      dateIso: null,
      total: null,
      status,
    };
  }

  const customerName =
    quote.businessName !== "—"
      ? quote.businessName
      : quote.contactName !== "—"
        ? quote.contactName
        : "—";

  return {
    id: quote.id,
    customerName,
    dateIso: quote.createdAt ? quote.createdAt.toISOString() : null,
    total: quote.subtotal,
    status,
  };
}
