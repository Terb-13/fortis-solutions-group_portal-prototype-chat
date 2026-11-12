export function formatUsd(amount: number | null | undefined): string {
  if (amount == null || Number.isNaN(amount)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(amount);
}

const MIN_UNIT_DECIMALS = 2;
const MAX_UNIT_DECIMALS = 5;

function roundToDigits(value: number, digits: number): number {
  const factor = 10 ** digits;
  return Math.round(value * factor + Math.sign(value) * 1e-10) / factor;
}

function toCents(value: number): number {
  return Math.round(value * 100 + Math.sign(value) * 1e-8);
}

function decimalsThatMatch(quantity: number, basis: number, targetCents: number): number | null {
  for (let digits = MIN_UNIT_DECIMALS; digits <= MAX_UNIT_DECIMALS; digits += 1) {
    if (toCents(quantity * roundToDigits(basis, digits)) === targetCents) return digits;
  }
  return null;
}

function formatUnitAmount(amount: number, digits: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: MIN_UNIT_DECIMALS,
    maximumFractionDigits: digits,
  }).format(roundToDigits(amount, digits));
}

/**
 * Unit price with 2–5 decimals, trailing zeros trimmed, so qty × shown unit
 * matches the line total. Uses the stored unit when that precision is enough,
 * otherwise line total ÷ qty (0.0154 × 5,000 is $77.00; $0.01544 × 5,000 is $77.20).
 */
export function formatUnitPrice(
  quantity: number,
  unitPrice: number | null | undefined,
  lineTotal: number | null | undefined,
): string {
  const hasQty = Number.isFinite(quantity) && quantity !== 0;
  const hasTotal = lineTotal != null && Number.isFinite(lineTotal);
  const hasUnit = unitPrice != null && Number.isFinite(unitPrice);
  if (!hasUnit && !(hasTotal && hasQty)) return "—";

  if (hasTotal && hasQty) {
    const target = toCents(lineTotal);
    if (hasUnit) {
      const fromStored = decimalsThatMatch(quantity, unitPrice, target);
      if (fromStored != null) return formatUnitAmount(unitPrice, fromStored);
    }
    const implied = lineTotal / quantity;
    const fromTotal = decimalsThatMatch(quantity, implied, target) ?? MAX_UNIT_DECIMALS;
    return formatUnitAmount(implied, fromTotal);
  }

  return formatUnitAmount(unitPrice as number, MAX_UNIT_DECIMALS);
}

/**
 * Bill-to name or company worth printing.
 * Skips yes/no, blanks, and values longer than 60 characters.
 * Also skips 6+ words: the bad company on the lab quote is a 47-character
 * product sentence, so a 60-character cap alone would still print it.
 */
export function looksLikeQuoteParty(value: string): boolean {
  const trimmed = value.trim().replace(/[.!?]+$/g, "").trim();
  if (!trimmed || trimmed === "—") return false;
  if (/^(yes|no)$/i.test(trimmed)) return false;
  if (trimmed.length > 60) return false;
  if (trimmed.split(/\s+/).length >= 6) return false;
  return true;
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
