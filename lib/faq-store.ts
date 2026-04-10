import type { FaqItem } from "@/lib/faqs";
import baselineFaqs from "@/data/faqs.json";

const STORE_KEY = "fortis-edge-faq-store";

export type FaqStoreState = {
  /** Baseline FAQ ids hidden on public /faq */
  hiddenBaselineIds: string[];
  /** Partial overrides for baseline entries */
  baselineEdits: Record<string, { question?: string; answer?: string; category?: string }>;
  /** New FAQs created from dashboard */
  customFaqs: Array<{
    id: string;
    question: string;
    answer: string;
    category?: string;
    visible: boolean;
  }>;
};

const defaultState = (): FaqStoreState => ({
  hiddenBaselineIds: [],
  baselineEdits: {},
  customFaqs: [],
});

export function loadFaqStore(): FaqStoreState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return migrateLegacyCustomFaqs();
    return { ...defaultState(), ...JSON.parse(raw) } as FaqStoreState;
  } catch {
    return defaultState();
  }
}

function migrateLegacyCustomFaqs(): FaqStoreState {
  const state = defaultState();
  try {
    const legacy =
      localStorage.getItem("fortis-edge-custom-faqs") ??
      localStorage.getItem("fortis-custom-faqs");
    if (!legacy) return state;
    const arr = JSON.parse(legacy) as {
      id: string;
      question: string;
      answer: string;
      visible?: boolean;
    }[];
    state.customFaqs = arr.map((c) => ({
      ...c,
      visible: c.visible ?? true,
      category: "Custom",
    }));
  } catch {
    /* ignore */
  }
  return state;
}

export function saveFaqStore(state: FaqStoreState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

export function getBaselineFaqs(): FaqItem[] {
  return baselineFaqs as FaqItem[];
}

/** Merged list for public FAQ page (respects visibility + hidden) */
export function getPublicFaqs(): FaqItem[] {
  const store = loadFaqStore();
  const base = getBaselineFaqs();
  const out: FaqItem[] = [];
  for (const b of base) {
    if (store.hiddenBaselineIds.includes(b.id)) continue;
    const edit = store.baselineEdits[b.id];
    out.push({
      ...b,
      ...edit,
    });
  }
  for (const c of store.customFaqs) {
    if (!c.visible) continue;
    out.push({
      id: c.id,
      question: c.question,
      answer: c.answer,
      category: c.category ?? "Custom",
    });
  }
  return out;
}

/** All FAQs for dashboard dropdown (includes hidden) */
export function getAllFaqsForAdmin(): FaqItem[] {
  const store = loadFaqStore();
  const base = getBaselineFaqs();
  const merged: FaqItem[] = base.map((b) => ({
    ...b,
    ...store.baselineEdits[b.id],
  }));
  for (const c of store.customFaqs) {
    merged.push({
      id: c.id,
      question: c.question,
      answer: c.answer,
      category: c.category ?? "Custom",
    });
  }
  return merged;
}

export function addCustomFaq(entry: {
  question: string;
  answer: string;
  visible: boolean;
  category?: string;
}) {
  const store = loadFaqStore();
  const id = `custom-${Date.now()}`;
  store.customFaqs.unshift({
    id,
    question: entry.question,
    answer: entry.answer,
    visible: entry.visible,
    category: entry.category ?? "Custom",
  });
  saveFaqStore(store);
  return id;
}

export function updateBaselineFaq(
  id: string,
  patch: { question?: string; answer?: string },
) {
  const store = loadFaqStore();
  store.baselineEdits[id] = { ...store.baselineEdits[id], ...patch };
  saveFaqStore(store);
}

export function setBaselineHidden(id: string, hidden: boolean) {
  const store = loadFaqStore();
  const set = new Set(store.hiddenBaselineIds);
  if (hidden) set.add(id);
  else set.delete(id);
  store.hiddenBaselineIds = [...set];
  saveFaqStore(store);
}

export function exportMergedFaqsJson(): string {
  const store = loadFaqStore();
  const merged = getAllFaqsForAdmin().map((f) => ({
    ...f,
    _hidden: store.hiddenBaselineIds.includes(f.id),
  }));
  return JSON.stringify(merged, null, 2);
}

/** Payload for `data/faqs.json` — visible FAQs only (public site). */
export function buildPublicFaqsExport(): FaqItem[] {
  return getPublicFaqs();
}

export function updateCustomFaq(
  id: string,
  patch: Partial<{
    question: string;
    answer: string;
    visible: boolean;
    category: string;
  }>,
) {
  const store = loadFaqStore();
  const idx = store.customFaqs.findIndex((c) => c.id === id);
  if (idx === -1) return;
  store.customFaqs[idx] = { ...store.customFaqs[idx], ...patch };
  saveFaqStore(store);
}
