import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { AnnouncementTicker } from "@/components/announcement-ticker";
import { buttonVariants } from "@/components/ui/button";
import { FORTIS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata = {
  title: `Home | ${FORTIS.productName}`,
  description: `${FORTIS.tagline} ${FORTIS.subhead}`,
};

const beforeAfter = [
  {
    title: "Status",
    before: "Email loops & phone tags.",
    after: "Portal visibility & digital handoffs.",
  },
  {
    title: "Quotes",
    before: "Manual routing per change.",
    after: "Structured digital paths.",
  },
  {
    title: "Proofing",
    before: "Attachments everywhere.",
    after: "Online proofing on roadmap (Orem).",
  },
] as const;

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[min(100dvh,920px)]">
        <div className="absolute inset-0">
          <Image
            src="/images/fortis-edge-hero.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#003087]/88 via-[#003087]/50 to-background" />
        </div>
        <div className="relative mx-auto flex min-h-[min(100dvh,920px)] max-w-7xl flex-col justify-end px-4 pb-20 pt-28 md:px-6 md:pb-28 md:pt-32">
          <div className="max-w-2xl animate-fade-up">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-white/90 ring-1 ring-white/20 backdrop-blur-sm">
              <Sparkles className="size-3.5 text-[#00E676]" aria-hidden />
              {FORTIS.shortCompany}
            </p>
            <h1 className="font-heading text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
              {FORTIS.tagline}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/88 md:text-xl">
              {FORTIS.subhead}
            </p>
          </div>
        </div>
      </section>

      <section className="section-y mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-semibold text-[#003087] md:text-4xl">
            Before → after
          </h2>
          <p className="mt-3 text-muted-foreground">
            Tier 3 &amp; 4 — faster, clearer, digital-first.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {beforeAfter.map((c, i) => (
            <div
              key={c.title}
              className="group overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card shadow-card-hover"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src="/images/before-after-card.jpg"
                  alt=""
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003087]/40 to-transparent" />
              </div>
              <div className="space-y-3 p-6">
                <h3 className="font-heading text-lg font-semibold text-[#003087]">
                  {c.title}
                </h3>
                <div className="grid gap-3 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-red-600/90">
                      Before
                    </p>
                    <p className="mt-1 text-muted-foreground">{c.before}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#00A651]">
                      After
                    </p>
                    <p className="mt-1 text-muted-foreground">{c.after}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <AnnouncementTicker />

      <section className="section-y border-t border-border/60 bg-muted/20">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-4 text-center md:px-6">
          <h2 className="font-heading text-2xl font-semibold text-[#003087] md:text-3xl">
            Go deeper
          </h2>
          <div className="flex w-full max-w-xl flex-col gap-4 sm:max-w-none sm:flex-row sm:justify-center">
            <Link
              href="/customer-portal"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-14 min-w-[220px] flex-1 bg-[#00A651] px-10 text-base font-semibold text-white shadow-lg shadow-black/15 transition hover:bg-[#00A651]/90 sm:flex-initial",
              )}
            >
              Explore the portal
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link
              href="/what-is-fortis-edge"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-14 min-w-[220px] flex-1 border-[#003087]/25 bg-card px-10 text-base font-semibold text-[#003087] shadow-sm transition hover:bg-[#003087]/5 sm:flex-initial",
              )}
            >
              What is Fortis Edge?
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
