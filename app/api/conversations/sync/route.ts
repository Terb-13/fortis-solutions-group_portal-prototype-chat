import { NextResponse } from "next/server";
import { z } from "zod";

import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase/admin";
import { remapFlagsMessageIds, resolveMessageDbId } from "@/lib/chat/resolve-message-db-id";

function isPostgresUndefinedColumn(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    String((err as { code: unknown }).code) === "42703"
  );
}

const SCHEMA_HINT =
  "Apply supabase/migrations/20260505140000_fortis_conversations_legacy_backfill.sql in Supabase (adds `flags` and other columns when the table pre-existed).";

const messageSchema = z.object({
  id: z.string().min(1),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

const bodySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  messages: z.array(messageSchema),
  /** Omit to keep existing flags in Supabase (e.g. operator review flags). */
  status: z.enum(["active", "archived", "needs_review"]).optional(),
  flags: z
    .array(
      z.object({
        messageId: z.string(),
        correctionNote: z.string().optional(),
        createdAt: z.string(),
      }),
    )
    .optional(),
});

/** Public: syncs assistant thread to Supabase for the admin dashboard (service role). */
export async function POST(req: Request) {
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Supabase admin is not configured." },
      { status: 503 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid body.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const b = parsed.data;
  const supabase = getSupabaseAdmin();

  const { data: existing, error: readErr } = await supabase
    .from("fortis_conversations")
    .select("*")
    .eq("id", b.id)
    .maybeSingle();

  if (readErr) {
    console.error("fortis_conversations read:", readErr);
    const status = isPostgresUndefinedColumn(readErr) ? 503 : 500;
    return NextResponse.json(
      {
        ok: false,
        error: readErr.message,
        ...(isPostgresUndefinedColumn(readErr) ? { hint: SCHEMA_HINT } : {}),
      },
      { status },
    );
  }

  const flagsJson = remapFlagsMessageIds(
    b.flags ?? (Array.isArray(existing?.flags) ? existing?.flags : []) ?? [],
    b.id,
  );
  const statusValue =
    b.status ??
    (typeof existing?.status === "string" ? existing.status : null) ??
    "active";

  const { error: convErr } = await supabase.from("fortis_conversations").upsert(
    {
      id: b.id,
      channel: "portal",
      channel_ref: null,
      title: b.title.slice(0, 500),
      status: statusValue,
      flags: flagsJson,
      created_at: b.createdAt,
      updated_at: b.updatedAt,
    },
    { onConflict: "id" },
  );

  if (convErr) {
    console.error("fortis_conversations upsert:", convErr);
    const status = isPostgresUndefinedColumn(convErr) ? 503 : 500;
    return NextResponse.json(
      {
        ok: false,
        error: convErr.message,
        ...(isPostgresUndefinedColumn(convErr) ? { hint: SCHEMA_HINT } : {}),
      },
      { status },
    );
  }

  const { error: delErr } = await supabase
    .from("fortis_messages")
    .delete()
    .eq("conversation_id", b.id);

  if (delErr) {
    console.error("fortis_messages delete:", delErr);
    return NextResponse.json(
      { ok: false, error: delErr.message },
      { status: 500 },
    );
  }

  if (b.messages.length > 0) {
    const rows = b.messages.map((m, i) => ({
      id: resolveMessageDbId(b.id, m.id),
      conversation_id: b.id,
      role: m.role,
      content: m.content,
      message_index: i,
      created_at: b.updatedAt,
    }));

    const { error: insErr } = await supabase.from("fortis_messages").insert(rows);
    if (insErr) {
      console.error("fortis_messages insert:", insErr);
      return NextResponse.json(
        { ok: false, error: insErr.message },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ ok: true });
}
