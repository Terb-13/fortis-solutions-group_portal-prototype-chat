export type StoredMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type ConversationStatus = "active" | "archived" | "needs_review";

export type MessageFlag = {
  messageId: string;
  correctionNote?: string;
  createdAt: string;
};

export type ConversationRecord = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: StoredMessage[];
  status: ConversationStatus;
  /** Assistant messages flagged for review */
  flags?: MessageFlag[];
};

const KEY = "fortis-edge-assistant-conversations";
export const ACTIVE_SESSION_KEY = "fortis-edge-session-id";

function safeParse(raw: string | null): ConversationRecord[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return (data as ConversationRecord[]).map((r) => ({
      ...r,
      status: r.status ?? "active",
      flags: r.flags ?? [],
    }));
  } catch {
    return [];
  }
}

export function loadConversations(): ConversationRecord[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(KEY));
}

export function saveConversations(rows: ConversationRecord[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(rows));
}

export function upsertConversation(record: ConversationRecord) {
  const all = loadConversations();
  const prev = all.find((r) => r.id === record.id);
  const rows = all.filter((r) => r.id !== record.id);
  rows.unshift({
    ...record,
    createdAt: prev?.createdAt ?? record.createdAt,
    status: record.status ?? prev?.status ?? "active",
    flags: record.flags ?? prev?.flags ?? [],
  });
  saveConversations(rows.slice(0, 80));
}

export function updateConversation(
  id: string,
  patch: Partial<Pick<ConversationRecord, "status" | "flags" | "messages" | "updatedAt">>,
) {
  const all = loadConversations();
  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) return;
  const cur = all[idx];
  all[idx] = {
    ...cur,
    ...patch,
    updatedAt: patch.updatedAt ?? new Date().toISOString(),
  };
  saveConversations(all);
}

export function getActiveSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_SESSION_KEY);
}

export function setActiveSessionId(id: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACTIVE_SESSION_KEY, id);
}

export function newSessionId(): string {
  return crypto.randomUUID();
}

/** @deprecated legacy custom FAQ append — use faq-store */
export function appendCustomFaqs(entries: { question: string; answer: string }[]) {
  if (typeof window === "undefined") return;
  const existing = loadCustomFaqs();
  const next = [
    ...entries.map((e, i) => ({
      id: `custom-${Date.now()}-${i}`,
      question: e.question,
      answer: e.answer,
      visible: true,
    })),
    ...existing,
  ];
  localStorage.setItem("fortis-edge-custom-faqs", JSON.stringify(next));
}

export function loadCustomFaqs(): {
  id: string;
  question: string;
  answer: string;
  visible?: boolean;
}[] {
  if (typeof window === "undefined") return [];
  try {
    const raw =
      localStorage.getItem("fortis-edge-custom-faqs") ??
      localStorage.getItem("fortis-custom-faqs");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as {
      id: string;
      question: string;
      answer: string;
      visible?: boolean;
    }[];
    return parsed.map((p) => ({ ...p, visible: p.visible ?? true }));
  } catch {
    return [];
  }
}
