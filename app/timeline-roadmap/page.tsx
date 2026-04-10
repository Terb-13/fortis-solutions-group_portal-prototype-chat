import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { FORTIS } from "@/lib/constants";
import { getPortalContent } from "@/lib/portal-data";
import { cn } from "@/lib/utils";

export const metadata = {
  title: `Timeline & Roadmap | ${FORTIS.productName}`,
  description:
    "Phase 2 milestones: FlexLink, online proofing, split shipping, integrations.",
};

const year = 2026;
const jan1 = new Date(year, 0, 1).getTime();
const dec31 = new Date(year, 11, 31).getTime();

function barForDate(isoDate: string) {
  const t = new Date(isoDate).getTime();
  const p = ((t - jan1) / (dec31 - jan1)) * 100;
  const left = Math.min(92, Math.max(2, p));
  return { marginLeft: `${left}%`, width: "18%" };
}

export default function TimelineRoadmapPage() {
  const portal = getPortalContent();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <h1 className="font-heading text-3xl font-semibold text-[#003087] md:text-4xl">
        Timeline &amp; Roadmap
      </h1>
      <p className="mt-4 max-w-3xl text-muted-foreground">
        Gantt-style view for {year} program targets. Dates are directional—align
        with your Fortis Edge contact for account readiness.
      </p>

      <div className="mt-10 rounded-xl border bg-card p-6">
        <div className="mb-6 flex justify-between text-xs font-medium text-muted-foreground">
          <span>Jan</span>
          <span>Apr</span>
          <span>Jul</span>
          <span>Oct</span>
          <span>Dec</span>
        </div>
        <div className="space-y-5">
          {portal.milestones.map((m) => (
            <div key={m.name}>
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2 text-sm">
                <span className="font-medium text-foreground">{m.name}</span>
                <span className="text-xs text-muted-foreground">{m.date}</span>
              </div>
              <div className="relative h-9 rounded-md bg-muted">
                <div
                  className={cn(
                    "absolute top-1/2 h-6 -translate-y-1/2 rounded-md",
                    m.type === "live" ? "bg-[#00A651]" : "bg-[#003087]",
                  )}
                  style={barForDate(m.date)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <h2 className="font-heading mt-14 text-2xl font-semibold text-[#003087]">
        Phase 2 milestone list
      </h2>
      <ul className="mt-4 list-inside list-disc space-y-2 text-muted-foreground">
        <li>Online proofing — March 1, 2026 (Orem target)</li>
        <li>FlexLink — March 15, 2026 target</li>
        <li>Split shipping — April 30, 2026 target</li>
        <li>April 2026 portal update — live</li>
      </ul>

      <div className="mt-10 rounded-xl border border-dashed bg-muted/30 p-6">
        <p className="font-medium text-foreground">Phase 2 Project Plan</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Attach your internal Phase 2 project plan (PDF / Confluence) for
          stakeholders. This page stays synchronized with Customer Portal
          milestones.
        </p>
        <Link
          href="/customer-portal"
          className={cn(
            buttonVariants({ variant: "link" }),
            "mt-2 h-auto px-0",
          )}
        >
          View portal architecture &amp; integrations →
        </Link>
      </div>
    </div>
  );
}
