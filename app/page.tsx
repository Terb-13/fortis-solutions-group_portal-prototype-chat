import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Candy, PartyPopper, Snowflake } from "lucide-react";
import { AnnouncementTicker } from "@/components/announcement-ticker";
import { HomeHeroBlock } from "@/components/home-hero-block";
import { HomeInternalMetrics } from "@/components/home-internal-metrics";
import { HomeWhatsNew } from "@/components/home-whats-new";
import { buttonVariants } from "@/components/ui/button";
import { FORTIS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata = {
  title: `Home | ${FORTIS.productName}`,
  description: `${FORTIS.tagline} ${FORTIS.subhead}`,
};

const seasonalThemes = [
  {
    key: "ribbon",
    label: "Ribbon & gift",
    body: "Satin ribbon vector (AI).",
    icon: Candy,
    file: "/images/red-ribbon-vector-illustration-with-shiny-satin_23330134.ai",
  },
  {
    key: "winter",
    label: "Winter",
    body: "Snowflake illustration (AI).",
    icon: Snowflake,
    file: "/images/snowflake_017.ai",
  },
  {
    key: "cinco",
    label: "Cinco & celebrations",
    body: "Fiesta art direction (AI).",
    icon: PartyPopper,
    file: "/images/cinco-de-mayo-concept.ai",
  },
] as const;

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <HomeHeroBlock />

      <section className="section-y border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                Internal pulse
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                Live metrics from this browser (assistant + FAQ store)
              </p>
            </div>
          </div>
          <HomeInternalMetrics />
          <HomeWhatsNew />
        </div>
      </section>

      <section className="section-y border-t border-white/[0.06] bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            Seasonal &amp; special occasion
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Program-ready art — photo hero + vector master files.
          </p>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="glass-panel group overflow-hidden">
              <div className="relative aspect-[4/3] w-full sm:aspect-[5/3]">
                <Image
                  src="/images/gift-with-label.jpg"
                  alt="Labeled gift box with kraft paper and string—seasonal retail packaging"
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.02]"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
              </div>
              <div className="border-t border-white/[0.06] p-5">
                <p className="text-sm font-semibold text-zinc-200">
                  Gift, ribbon &amp; retail
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  E‑commerce and in-store takeovers
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {seasonalThemes.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.key}
                    className="glass-panel flex flex-col justify-between gap-2 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00A651]/15 text-[#4ade80]">
                        <Icon className="size-4" strokeWidth={1.75} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-200">
                          {s.label}
                        </p>
                        <p className="mt-0.5 text-xs text-zinc-500">{s.body}</p>
                      </div>
                    </div>
                    <a
                      href={s.file}
                      className="text-xs font-medium text-[#4ade80] hover:underline"
                      download
                    >
                      Vector (AI) →
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            Go deeper
          </h2>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/customer-portal"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-12 border-0 bg-[#00A651] px-10 text-white shadow-lg shadow-[#00A651]/20",
              )}
            >
              Portal
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link
              href="/what-is-fortis-edge"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "h-12 border-white/10 bg-white/[0.04] text-zinc-100",
              )}
            >
              Program overview
            </Link>
          </div>
        </div>
      </section>

      <AnnouncementTicker />
    </div>
  );
}
