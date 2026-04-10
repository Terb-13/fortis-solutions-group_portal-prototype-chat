import Image from "next/image";
import Link from "next/link";
import { AnnouncementTicker } from "@/components/announcement-ticker";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FORTIS, FORTIS_CORE_STORY_VERBATIM } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata = {
  title: `Home | ${FORTIS.productName}`,
  description: `${FORTIS.tagline} ${FORTIS.subhead}`,
};

const beforeAfter = [
  {
    title: "Status & coordination",
    before: "Phone tags and inbox threads for routine order questions.",
    after:
      "Portal-first visibility with clear digital handoffs for Tier 3 & 4 teams.",
  },
  {
    title: "Speed to quote",
    before: "Slower cycles when every change requires manual routing.",
    after:
      "Structured estimate and RFP paths aligned to digital speed plants.",
  },
  {
    title: "Proofing clarity",
    before: "Opaque review steps across email attachments.",
    after:
      "Online proofing rollout targeted for Orem (Mar 1, 2026) on the roadmap.",
  },
] as const;

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background to-muted/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 md:items-center md:px-6 md:py-16">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F5A623]">
              {FORTIS.company}
            </p>
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-[#003087] md:text-5xl">
              {FORTIS.tagline}
            </h1>
            <p className="text-lg text-muted-foreground">{FORTIS.subhead}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {FORTIS_CORE_STORY_VERBATIM}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/customer-portal"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-[#003087] text-white hover:bg-[#003087]/90",
                )}
              >
                Explore the Customer Portal
              </Link>
              <Link
                href="/what-is-fortis-edge"
                className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
              >
                What is Fortis Edge?
              </Link>
            </div>
          </div>
          <div className="relative space-y-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted shadow-sm">
              <Image
                src="/images/fortis-edge-hero.jpg"
                alt="Fortis Edge hero placeholder"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src="/images/orem-marietta-press.jpg"
                alt="Orem and Marietta HP Digital Press placeholder"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Placeholder imagery — replace with brand-approved Fortis Edge
              assets.
            </p>
          </div>
        </div>
      </section>

      <AnnouncementTicker />

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="mb-10 max-w-3xl">
          <h2 className="font-heading text-2xl font-semibold text-[#003087] md:text-3xl">
            Before vs. after (teaser)
          </h2>
          <p className="mt-2 text-muted-foreground">
            Snapshot aligned to the Fortis Edge sales narrative—digital speed
            without giving up Fortis quality.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {beforeAfter.map((c) => (
            <Card key={c.title} className="border-border/80">
              <CardHeader>
                <CardTitle className="text-lg text-[#003087]">{c.title}</CardTitle>
                <CardDescription>Before / After</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-destructive/90">Before</p>
                  <p className="text-muted-foreground">{c.before}</p>
                </div>
                <div>
                  <p className="font-semibold text-[#00A651]">After</p>
                  <p className="text-muted-foreground">{c.after}</p>
                </div>
                <div className="relative aspect-[3/2] overflow-hidden rounded-lg border bg-muted">
                  <Image
                    src="/images/before-after-card.jpg"
                    alt=""
                    fill
                    className="object-cover opacity-80"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <h2 className="font-heading text-xl font-semibold text-[#003087]">
              Quick actions
            </h2>
            <p className="text-sm text-muted-foreground">
              Jump to the pages your teams use most.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/customer-portal"
              className={cn(buttonVariants({ variant: "secondary" }))}
            >
              Customer Portal
            </Link>
            <Link
              href="/timeline-roadmap"
              className={cn(buttonVariants({ variant: "secondary" }))}
            >
              Timeline &amp; Roadmap
            </Link>
            <Link
              href="/faq"
              className={cn(buttonVariants({ variant: "secondary" }))}
            >
              FAQ
            </Link>
            <Link
              href="/assistant"
              className={cn(
                buttonVariants({ variant: "secondary" }),
                "border border-[#003087]/30 bg-[#003087]/5 text-[#003087]",
              )}
            >
              Fortis Edge Assistant
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
