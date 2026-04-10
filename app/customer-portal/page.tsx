import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { FORTIS } from "@/lib/constants";
import { getPortalContent } from "@/lib/portal-data";
import { cn } from "@/lib/utils";

export const metadata = {
  title: `The Customer Portal | ${FORTIS.productName}`,
  description:
    "One platform for Tier 3 & 4 — roadmap, integrations, and live status.",
};

export default function CustomerPortalPage() {
  const portal = getPortalContent();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <section className="rounded-2xl border border-border bg-gradient-to-br from-[#003087]/5 to-background p-8 md:p-12">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-[#003087] md:text-4xl">
          One platform. All tiers. Zero phone/email for routine tasks.
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
          Fortis Edge concentrates Tier 3 &amp; 4 workflows into transparent,
          self-service paths while Tier 1 &amp; 2 retain enterprise-scale
          orchestration. The April 2026 portal update is live—pair it with the
          roadmap for proofing, FlexLink, and split shipping.
        </p>
      </section>

      <h2 className="font-heading mt-14 text-2xl font-semibold text-[#003087]">
        Tier 1 &amp; 2 vs Tier 3 &amp; 4
      </h2>
      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-muted/80">
            <tr>
              <th className="p-4 font-semibold">Dimension</th>
              <th className="p-4 font-semibold">Tier 1 &amp; 2</th>
              <th className="p-4 font-semibold">Tier 3 &amp; 4 (Fortis Edge)</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {portal.tierComparison.map((row) => (
              <tr key={row.dimension}>
                <td className="p-4 font-medium">{row.dimension}</td>
                <td className="p-4 text-muted-foreground">{row.tier12}</td>
                <td className="p-4 text-muted-foreground">{row.tier34}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="font-heading mt-14 text-2xl font-semibold text-[#003087]">
        Current status — April 2026 portal update (live)
      </h2>
      <ul className="mt-4 list-inside list-disc space-y-2 text-muted-foreground">
        {portal.liveFeaturesApril2026.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>

      <h2 className="font-heading mt-14 text-2xl font-semibold text-[#003087]">
        Portal experience (placeholders)
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Replace with production screenshots when available.
      </p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
          <Image
            src="/images/portal-screenshot-1.png"
            alt="Portal screenshot placeholder 1"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
          <Image
            src="/images/portal-screenshot-2.png"
            alt="Portal screenshot placeholder 2"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <h3 className="mt-10 font-heading text-lg font-semibold text-[#003087]">
        Target system architecture
      </h3>
      <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-xl border bg-muted">
        <Image
          src="/images/system-architecture.png"
          alt="System architecture diagram placeholder"
          fill
          className="object-contain p-4"
        />
      </div>

      <h2 className="font-heading mt-14 text-2xl font-semibold text-[#003087]">
        Roadmap — Phase 1 / 2 / 3
      </h2>
      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-muted/80">
            <tr>
              <th className="p-4 font-semibold">Phase</th>
              <th className="p-4 font-semibold">Window</th>
              <th className="p-4 font-semibold">Highlights</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {portal.roadmapPhases.map((p) => (
              <tr key={p.phase}>
                <td className="p-4 font-medium">{p.phase}</td>
                <td className="p-4 text-muted-foreground">{p.window}</td>
                <td className="p-4 text-muted-foreground">
                  <ul className="list-inside list-disc">
                    {p.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="font-heading mt-14 text-2xl font-semibold text-[#003087]">
        Radius / Infigo / LabelTraxx integration status
      </h2>
      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/80">
            <tr>
              <th className="p-4 font-semibold">System</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {portal.integrations.map((i) => (
              <tr key={i.system}>
                <td className="p-4 font-medium">{i.system}</td>
                <td className="p-4 text-muted-foreground">{i.status}</td>
                <td className="p-4 text-muted-foreground">{i.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/timeline-roadmap"
          className={cn(
            buttonVariants(),
            "bg-[#003087] text-white hover:bg-[#003087]/90",
          )}
        >
          Open Timeline &amp; Roadmap
        </Link>
        <Link
          href="/faq"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Read FAQ
        </Link>
      </div>
    </div>
  );
}
