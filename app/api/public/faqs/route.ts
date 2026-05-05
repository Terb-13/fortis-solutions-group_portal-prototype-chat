import { NextResponse } from "next/server";

import type { FaqItem } from "@/lib/faqs";
import { createSupabaseClient } from "@/lib/supabase/client";

/**
 * Published FAQs from Supabase (anon + RLS). Safe to call from the public FAQ page.
 */
export async function GET() {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("fortis_faq")
      .select("id, question, answer, category, sort_order")
      .eq("published", true)
      .order("sort_order", { ascending: true });

    if (error) {
      return NextResponse.json({ items: [] as FaqItem[] });
    }

    const items: FaqItem[] = (data ?? []).map((r: Record<string, unknown>) => ({
      id: String(r.id),
      question: String(r.question ?? ""),
      answer: String(r.answer ?? ""),
      category: typeof r.category === "string" ? r.category : "Fortis Edge",
    }));

    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] as FaqItem[] });
  }
}
