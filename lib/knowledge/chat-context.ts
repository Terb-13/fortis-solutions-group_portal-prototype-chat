import { createSupabaseClient } from "@/lib/supabase/client";

const MAX_CHARS = 12000;

/**
 * Builds a compact text block of published knowledge + FAQs for the chat backend.
 * Uses the public anon key + RLS (published rows only).
 */
export async function buildFortisKnowledgeBlockForChat(): Promise<string> {
  try {
    const supabase = createSupabaseClient();
    const [kbRes, faqRes] = await Promise.all([
      supabase
        .from("fortis_knowledge")
        .select("title, content")
        .eq("published", true)
        .order("updated_at", { ascending: false })
        .limit(80),
      supabase
        .from("fortis_faq")
        .select("question, answer")
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .limit(80),
    ]);

    const parts: string[] = [];
    const rows = (kbRes.data ?? []) as { title: string | null; content: string }[];
    if (rows.length > 0) {
      parts.push("## Approved knowledge snippets");
      for (const r of rows) {
        const head = r.title?.trim() ? `### ${r.title.trim()}\n` : "";
        parts.push(`${head}${r.content.trim()}`);
      }
    }

    const faqs = (faqRes.data ?? []) as { question: string; answer: string }[];
    if (faqs.length > 0) {
      parts.push("## Published FAQ excerpts");
      for (const f of faqs) {
        parts.push(`Q: ${f.question.trim()}\nA: ${f.answer.trim()}`);
      }
    }

    let text = parts.join("\n\n").trim();
    if (text.length > MAX_CHARS) {
      text = `${text.slice(0, MAX_CHARS)}\n\n[Knowledge truncated for length]`;
    }
    return text;
  } catch {
    return "";
  }
}
