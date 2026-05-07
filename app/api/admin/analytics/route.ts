import { NextResponse } from "next/server";

import { isDashboardAuthenticated } from "@/lib/auth/dashboard-session";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

function monthStartUtcIso(reference = new Date()): string {
  const y = reference.getUTCFullYear();
  const m = reference.getUTCMonth();
  return new Date(Date.UTC(y, m, 1)).toISOString();
}

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

  const start = monthStartUtcIso();
  const supabase = getSupabaseAdmin();

  const [convRes, estRes] = await Promise.all([
    supabase
      .from("fortis_conversations")
      .select("*", { count: "exact", head: true })
      .gte("created_at", start),
    supabase
      .from("fortis_estimates")
      .select("*", { count: "exact", head: true })
      .gte("created_at", start),
  ]);

  const conversationsThisMonth = convRes.count ?? 0;
  const estimatesThisMonth = estRes.count ?? 0;

  const convToEst =
    conversationsThisMonth > 0
      ? Math.round((estimatesThisMonth / conversationsThisMonth) * 1000) / 10
      : 0;

  return NextResponse.json({
    conversationsThisMonth,
    estimatesThisMonth,
    conversionConversationToEstimatePercent: convToEst,
    /** Placeholder until orders are tracked in Supabase */
    conversionConversationToOrderPercent: null as number | null,
  });
}
