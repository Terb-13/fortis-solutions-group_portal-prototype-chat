import { NextResponse } from "next/server";

import { isDashboardAuthenticated } from "@/lib/auth/dashboard-session";
import { estimateRowToListItem } from "@/lib/quote/estimate-list-row";
import { getSupabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET(req: Request) {
  if (!isDashboardAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Supabase admin is not configured." },
      { status: 503 },
    );
  }

  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("fortis_estimates")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = (data ?? []) as Record<string, unknown>[];
  const estimates = rows.map(estimateRowToListItem);

  return NextResponse.json({ estimates, rawRows: rows });
}
