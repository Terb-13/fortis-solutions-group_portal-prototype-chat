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

const phase2 = [
  { label: "Online proofing (Orem)", date: "Mar 1, 2026" },
  { label: "FlexLink", date: "Mar 15, 2026" },
  { label: "Split shipping", date: "Apr 30, 2026" },
  { label: "April portal update", date: "Live" },
] as const;

export default function TimelineRoadmapPage() {
  const portal = getPortalContent();

  return (
    <div className="section-y mx-auto max-w-7xl px-4 md:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-4xl font-semibold text-[#003087] md:text-5xl">
          Timeline &amp; roadmap
        </h1>
        <p className="mt-4 text-muted-foreground">
          Directional dates—confirm with your Fortis Edge contact.
        </p>
      </div>

      <div className="mt-16 overflow-x-auto pb-4">
        <div className="relative mx-auto min-w-[720px] max-w-5xl px-4">
          <div className="absolute left-8 right-8 top-7 h-0.5 bg-border md:left-12 md:right-12" />
          <div className="relative flex justify-between gap-2">
            {portal.milestones.map((m) => (
              <div
                key={m.name}
                className="flex max-w-[22%] flex-col items-center text-center"
              >
                <div
                  className={cn(
                    "relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 border-background text-xs font-bold shadow-md",
                    m.type === "live"
                      ? "bg-[#00A651] text-white"
                      : "bg-[#003087] text-white",
                  )}
                >
                  {m.type === "live" ? "✓" : "→"}
                </div>
                <p className="mt-4 text-xs font-semibold leading-snug text-[#003087]">
                  {m.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{m.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-dashed border-[#003087]/25 bg-[#003087]/[0.03] p-8 text-center">
        <h2 className="font-heading text-lg font-semibold text-[#003087]">
          Phase 2 at a glance
        </h2>
        <ul className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground">
          {phase2.map((x) => (
            <li key={x.label}>
              <span className="font-medium text-foreground">{x.label}</span> —{" "}
              {x.date}
            </li>
          ))}
        </ul>
        <Link
          href="/customer-portal"
          className={cn(
            buttonVariants({ variant: "link" }),
            "mt-4 h-auto text-[#00A651]",
          )}
        >
          Portal detail →
        </Link>
      </div>
    </div>
  );
}
