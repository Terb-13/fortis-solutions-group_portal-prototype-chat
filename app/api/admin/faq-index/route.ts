import { NextResponse } from "next/server";

import { isDashboardAuthenticated } from "@/lib/auth/dashboard-session";
import baselineFaqs from "@/data/faqs.json";
import type { FaqItem } from "@/lib/faqs";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  if (!(await isDashboardAuthenticated(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const baseline = baselineFaqs as FaqItem[];
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json({ baseline, supabase: [] as FaqItem[] });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("fortis_faq")
    .select("id, question, answer, category, published")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const supabaseFaqs: FaqItem[] = (data ?? []).map((r: Record<string, unknown>) => ({
    id: String(r.id),
    question: String(r.question ?? ""),
    answer: String(r.answer ?? ""),
    category: typeof r.category === "string" ? r.category : "Supabase",
  }));

  return NextResponse.json({ baseline, supabase: supabaseFaqs });
}
