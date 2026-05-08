import { NextResponse } from "next/server";
import { z } from "zod";

import { isDashboardAuthenticated } from "@/lib/auth/dashboard-session";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

const bodySchema = z.object({
  conversationId: z.string().uuid().optional(),
  assistantMessageId: z.string().optional(),
  improvedBotResponse: z.string().min(1),
  applyKnowledge: z.boolean(),
  faq: z
    .object({
      action: z.enum(["new", "edit"]),
      targetFaqId: z.string().optional(),
      question: z.string(),
      answer: z.string(),
    })
    .optional(),
  applyFaq: z.boolean(),
});

export async function POST(req: Request) {
  if (!(await isDashboardAuthenticated(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Supabase admin is not configured." },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid body.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const b = parsed.data;
  const supabase = getSupabaseAdmin();

  if (b.applyFaq && (!b.faq || !b.faq.question?.trim())) {
    return NextResponse.json(
      { error: "FAQ payload required when applyFaq is true." },
      { status: 400 },
    );
  }

  const now = new Date().toISOString();

  if (b.applyKnowledge) {
    const { error } = await supabase.from("fortis_knowledge").insert({
      title: "Revised assistant reply (operator approved)",
      content: b.improvedBotResponse,
      source: "admin_training",
      published: true,
      created_at: now,
      updated_at: now,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  let faqId: string | null = null;
  if (b.applyFaq && b.faq) {
    const f = b.faq;
    if (f.action === "edit" && f.targetFaqId?.trim()) {
      faqId = f.targetFaqId.trim();
      const { error } = await supabase
        .from("fortis_faq")
        .update({
          question: f.question,
          answer: f.answer,
          category: "Operator",
          published: true,
          updated_at: now,
        })
        .eq("id", faqId);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      faqId = `faq-${crypto.randomUUID()}`;
      const { error } = await supabase.from("fortis_faq").insert({
        id: faqId,
        question: f.question,
        answer: f.answer,
        category: "Operator",
        published: true,
        sort_order: 0,
        created_at: now,
        updated_at: now,
      });
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ ok: true, faqId });
}
