import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
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
    <div>
      <section className="relative min-h-[min(72vh,640px)] overflow-hidden border-b border-border/60">
        <div className="absolute inset-0">
          <Image
            src="/images/orem-marietta-press.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#003087]/92 via-[#003087]/80 to-[#001a44]/95" />
        </div>
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#00A651]/25 blur-3xl" />
        <div className="relative mx-auto flex min-h-[min(72vh,640px)] max-w-7xl flex-col justify-end px-4 py-20 text-white md:px-6 md:py-28">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
            The Customer Portal
          </p>
          <h1 className="mt-4 max-w-3xl font-heading text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            One platform. Clear tiers. Less friction.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/85">
            Tier 3 &amp; 4 self-service where it fits; Tier 1 &amp; 2 keep
            enterprise orchestration. April 2026 update is live.
          </p>
        </div>
      </section>

      <section className="section-y mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="text-center font-heading text-2xl font-semibold text-[#003087] md:text-3xl">
          Tier comparison
        </h2>
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {portal.tierComparison.map((row) => (
            <div
              key={row.dimension}
              className="rounded-2xl border border-border/80 bg-card p-6 shadow-card md:p-8"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-[#00A651]">
                {row.dimension}
              </p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">
                    Tier 1 &amp; 2
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {row.tier12}
                  </p>
                </div>
                <div className="rounded-xl bg-[#003087]/[0.04] p-4">
                  <p className="text-xs font-semibold text-[#003087]">
                    Tier 3 &amp; 4
                  </p>
                  <p className="mt-1 text-sm text-foreground">{row.tier34}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border/60 bg-muted/30 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="font-heading text-2xl font-semibold text-[#003087] md:text-3xl">
            In the portal now
          </h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {portal.liveFeaturesApril2026.map((x) => (
              <li
                key={x}
                className="flex items-start gap-3 rounded-xl border border-border/80 bg-card px-4 py-3 text-sm shadow-sm"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-[#00A651]" />
                <span className="text-muted-foreground">{x}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="text-center font-heading text-2xl font-semibold text-[#003087] md:text-3xl">
          Product screenshots
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="group overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card">
            <div className="relative aspect-video">
              <Image
                src="/images/portal-screenshot-1.png"
                alt="Portal"
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </div>
          <div className="group overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card">
            <div className="relative aspect-video">
              <Image
                src="/images/portal-screenshot-2.png"
                alt="Portal"
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>

        <h3 className="mt-16 font-heading text-xl font-semibold text-[#003087]">
          Architecture
        </h3>
        <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card">
          <Image
            src="/images/system-architecture.png"
            alt="System architecture"
            fill
            className="object-contain p-4 md:p-8"
          />
        </div>
      </section>

      <section className="border-t border-border/60 bg-muted/20 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-center font-heading text-2xl font-semibold text-[#003087] md:text-3xl">
            Roadmap phases
          </h2>
          <div className="mt-10 flex flex-col gap-4 md:flex-row md:gap-0 md:overflow-x-auto md:pb-4">
            {portal.roadmapPhases.map((p, i) => (
              <div
                key={p.phase}
                className="relative flex min-w-0 flex-1 flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-card md:min-w-[240px] md:rounded-none md:border-y md:border-l md:first:rounded-l-2xl md:last:rounded-r-2xl md:last:border-r"
              >
                {i < portal.roadmapPhases.length - 1 && (
                  <div
                    className="absolute right-0 top-1/2 hidden h-6 w-px -translate-y-1/2 bg-border md:block"
                    aria-hidden
                  />
                )}
                <p className="text-xs font-bold uppercase tracking-wide text-[#00A651]">
                  {p.phase}
                </p>
                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  {p.window}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex gap-2">
                      <span className="text-[#003087]">·</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="mt-16 font-heading text-lg font-semibold text-[#003087]">
            Integrations
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {portal.integrations.map((i) => (
              <div
                key={i.system}
                className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm"
              >
                <p className="font-semibold text-foreground">{i.system}</p>
                <p className="mt-1 text-xs font-medium text-[#00A651]">
                  {i.status}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{i.notes}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              href="/timeline-roadmap"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-[#00A651] text-white hover:bg-[#00A651]/90",
              )}
            >
              Timeline
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link
              href="/faq"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
            >
              FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
