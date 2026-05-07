import { NextResponse } from "next/server";

import { isDashboardAuthenticated } from "@/lib/auth/dashboard-session";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  if (!(await isDashboardAuthenticated(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Supabase admin is not configured." },
      { status: 503 },
    );
  }

  const supabase = getSupabaseAdmin();
  const { data: conversations, error: cErr } = await supabase
    .from("fortis_conversations")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(200);

  if (cErr) {
    return NextResponse.json({ error: cErr.message }, { status: 500 });
  }

  const ids = (conversations ?? []).map((c: { id: string }) => c.id);
  if (ids.length === 0) {
    return NextResponse.json({ conversations: [] });
  }

  const { data: messages, error: mErr } = await supabase
    .from("fortis_messages")
    .select("*")
    .in("conversation_id", ids)
    .order("message_index", { ascending: true });

  if (mErr) {
    return NextResponse.json({ error: mErr.message }, { status: 500 });
  }

  const byConv = new Map<string, typeof messages>();
  for (const m of messages ?? []) {
    const cid = m.conversation_id as string;
    if (!byConv.has(cid)) byConv.set(cid, []);
    byConv.get(cid)!.push(m);
  }

  const out = (conversations ?? []).map((c: Record<string, unknown>) => {
    const cid = c.id as string;
    const msgs = (byConv.get(cid) ?? []).map((row: Record<string, unknown>) => ({
      id: row.id as string,
      role: row.role as "user" | "assistant",
      content: row.content as string,
    }));
    return {
      id: cid,
      title: (c.title as string) ?? "",
      createdAt: c.created_at as string,
      updatedAt: c.updated_at as string,
      status: c.status as string,
      flags: (c.flags as unknown[]) ?? [],
      messages: msgs,
    };
  });

  return NextResponse.json({ conversations: out });
}
