import { NextResponse } from "next/server";
import { z } from "zod";

import { isDashboardAuthenticated } from "@/lib/auth/dashboard-session";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

const bodySchema = z.object({
  flags: z.array(
    z.object({
      messageId: z.string(),
      correctionNote: z.string().optional(),
      createdAt: z.string(),
    }),
  ),
  status: z.enum(["active", "archived", "needs_review"]).optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, context: Params) {
  if (!isDashboardAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Supabase admin is not configured." },
      { status: 503 },
    );
  }

  const { id } = await context.params;
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

  const supabase = getSupabaseAdmin();
  const patch: Record<string, unknown> = {
    flags: parsed.data.flags,
    updated_at: new Date().toISOString(),
  };
  if (parsed.data.status) patch.status = parsed.data.status;

  const { error } = await supabase.from("fortis_conversations").update(patch).eq("id", id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
