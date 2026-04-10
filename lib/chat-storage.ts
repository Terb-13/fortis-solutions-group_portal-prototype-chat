export type StoredMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type ConversationRecord = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: StoredMessage[];
};

const KEY = "fortis-packaging-assistant-conversations";

function safeParse(raw: string | null): ConversationRecord[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data as ConversationRecord[];
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
  });
  saveConversations(rows.slice(0, 50));
}

export function appendCustomFaqs(entries: { question: string; answer: string }[]) {
  if (typeof window === "undefined") return;
  const existing = loadCustomFaqs();
  const next = [
    ...entries.map((e, i) => ({
      id: `custom-${Date.now()}-${i}`,
      question: e.question,
      answer: e.answer,
    })),
    ...existing,
  ];
  localStorage.setItem("fortis-custom-faqs", JSON.stringify(next));
}

export function loadCustomFaqs(): { id: string; question: string; answer: string }[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("fortis-custom-faqs");
    if (!raw) return [];
    return JSON.parse(raw) as { id: string; question: string; answer: string }[];
  } catch {
    return [];
  }
}
