export function formatUsd(amount: number | null | undefined): string {
  if (amount == null || Number.isNaN(amount)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(amount);
}

export function formatUnitPrice(
  quantity: number,
  unitPrice: number | null | undefined,
  lineTotal: number | null | undefined,
): string {
  if (Number.isFinite(quantity) && quantity !== 0 && lineTotal != null && Number.isFinite(lineTotal)) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 5,
    }).format(lineTotal / quantity);
  }
  return formatUsd(unitPrice);
}

// Delete after the chat contact-field fix ships (owner: Digital Engineer).
export function looksLikeQuoteParty(value: string): string | undefined {
  const trimmed = value.trim().replace(/[.!?]+$/g, "").trim();
  if (!trimmed || trimmed === "—") return undefined;
  if (/^(yes|no)$/i.test(trimmed)) return undefined;
  if (trimmed.length > 60) return undefined;
  if (trimmed.split(/\s+/).length >= 6) return undefined;
  return trimmed;
}

export function formatQty(qty: number): string {
  if (!Number.isFinite(qty)) return "—";
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(qty);
}

export function formatLongDate(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(d);
}
