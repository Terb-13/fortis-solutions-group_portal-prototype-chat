import Link from "next/link";
import { FortisLogo } from "@/components/fortis-logo";
import { buttonVariants } from "@/components/ui/button";
import { FORTIS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,48,135,0.08),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(0,166,81,0.06),transparent_45%)]"
        aria-hidden
      />
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 md:flex-row md:items-center md:justify-between md:px-6 md:py-24">
        <div className="max-w-xl space-y-6">
          <FortisLogo />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F5A623]">
            {FORTIS.company}
          </p>
          <h1 className="font-heading text-4xl font-semibold tracking-tight text-[#003087] md:text-5xl">
            {FORTIS.productName}
          </h1>
          <p className="text-lg text-muted-foreground text-balance">
            {FORTIS.tagline}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Explore Fortis packaging formats, generate a branded proposal PDF,
            and chat with the Packaging Assistant powered by Grok—aligned to
            Fortis lead times, color management, and RENEW™ sustainable options.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/explorer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-[#003087] text-white hover:bg-[#003087]/90",
              )}
            >
              Explore Packaging Solutions
            </Link>
            <Link
              href="/assistant"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
            >
              Talk to Packaging Assistant
            </Link>
          </div>
        </div>
        <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#00A651]/15 blur-2xl" />
          <h2 className="font-heading text-lg font-semibold text-[#003087]">
            Why brands choose Fortis
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>Industry-leading lead times and quality control</li>
            <li>Disciplined color management across formats</li>
            <li>
              RENEW™ sustainable packaging supporting the circular economy
            </li>
            <li>Strategic U.S. locations and 1,100+ team members</li>
          </ul>
          <Link
            href="/proposal"
            className={cn(
              buttonVariants({ variant: "link" }),
              "mt-6 h-auto px-0 text-[#003087]",
            )}
          >
            Build a proposal PDF →
          </Link>
        </div>
      </section>
    </div>
  );
}
