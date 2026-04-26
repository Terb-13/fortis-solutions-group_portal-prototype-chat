import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Candy, PartyPopper, Snowflake, Sparkles } from "lucide-react";
import { AnnouncementTicker } from "@/components/announcement-ticker";
import { buttonVariants } from "@/components/ui/button";
import { FORTIS_IMAGES } from "@/lib/fortis-images";
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

const seasonalThemes = [
  {
    key: "ribbon",
    label: "Ribbon & gift presentation",
    body: "Satin ribbon vector artwork for premium seasonal packaging (Adobe Illustrator).",
    icon: Candy,
    file: "/images/red-ribbon-vector-illustration-with-shiny-satin_23330134.ai",
  },
  {
    key: "winter",
    label: "Winter & holidays",
    body: "Snowflake illustration for limited-run winter labels and retail kits.",
    icon: Snowflake,
    file: "/images/snowflake_017.ai",
  },
  {
    key: "cinco",
    label: "Cinco de Mayo & celebrations",
    body: "Fiesta and celebration art direction for on-trend program packaging.",
    icon: PartyPopper,
    file: "/images/cinco-de-mayo-concept.ai",
  },
] as const;

const accentMarkets = [
  {
    src: "/images/Flavored-Water-andrew-kayani-_bQxQlLpoVY-unsplash.jpg",
    title: "Beverage",
    alt: "Chilled bottled water and flavored beverage lineup on ice",
  },
  {
    src: "/images/Coffee-Background_4dWz9H7d8OM-unsplash.jpg",
    title: "Coffee & tea",
    alt: "Barista-poured coffee in branded cups and sleeves",
  },
  {
    src: "/images/micheile-henderson-I2lF6gNn5Zo-unsplash.jpg",
    title: "Health & beauty",
    alt: "Premium health and beauty product flat lay and packaging",
  },
] as const;

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[min(100dvh,920px)]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#00255c] via-[#003087]/95 to-background" />
          <div className="absolute inset-0 flex items-center justify-center px-4 pt-6">
            <div className="relative aspect-[2.6/1] w-[min(92vw,720px)] opacity-[0.14] sm:w-[min(80vw,820px)]">
              <Image
                src={FORTIS_IMAGES.logoReverse}
                alt="Fortis Solutions Group reverse mark — large watermark for dark hero"
                fill
                className="object-contain"
                sizes="(min-width: 1024px) 720px, 90vw"
              />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-[#001a40]/40" />
        </div>
        <div className="relative mx-auto flex min-h-[min(100dvh,920px)] max-w-7xl flex-col justify-end px-4 pb-20 pt-28 md:px-6 md:pb-28 md:pt-32">
          <div className="mb-6 flex max-w-3xl flex-col items-start gap-5 md:flex-row md:items-end md:gap-10">
            <div className="relative h-20 w-56 sm:h-24 sm:w-64">
              <Image
                src={FORTIS_IMAGES.logoWhite}
                alt="Fortis Solutions Group — primary wordmark for Fortis Edge"
                fill
                priority
                className="object-contain object-left"
                sizes="(min-width: 640px) 16rem, 14rem"
              />
            </div>
            <p className="text-xs text-white/70 md:max-w-xs md:text-right md:text-sm">
              Large-format hero mark with digital-first color system — consistent
              with the Fortis brand center.
            </p>
          </div>
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
        <div className="grid gap-8 lg:grid-cols-3 lg:items-end">
          <div className="lg:col-span-2">
            <h2 className="font-heading text-2xl font-semibold text-[#003087] md:text-3xl">
              Markets at a glance
            </h2>
            <p className="mt-2 text-muted-foreground">
              Beverage, coffee, and health &amp; beauty—subtle program accents.
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {accentMarkets.map((a) => (
            <div
              key={a.title}
              className="group overflow-hidden rounded-2xl border border-border/80 bg-card shadow-md shadow-black/5"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={a.src}
                  alt={a.alt}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003087]/50 to-transparent" />
                <p className="absolute bottom-3 left-4 font-heading text-sm font-semibold text-white drop-shadow">
                  {a.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-y border-t border-border/60 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-heading text-2xl font-semibold text-[#003087] md:text-3xl">
              Seasonal &amp; special occasion packaging
            </h2>
            <p className="mt-3 text-muted-foreground">
              Program-ready art direction—photo hero plus vector concepts for
              limited runs.
            </p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card">
              <div className="relative aspect-[4/3] w-full sm:aspect-[5/3]">
                <Image
                  src="/images/gift-with-label.jpg"
                  alt="Labeled gift box with kraft paper and string—seasonal retail packaging"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
              </div>
              <div className="p-5">
                <p className="font-heading text-sm font-semibold text-[#003087]">
                  Gift, ribbon &amp; retail
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Hero photography for e‑commerce and in-store takeovers.
                </p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:grid-rows-3">
              {seasonalThemes.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.key}
                    className="flex flex-1 flex-col justify-between gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#003087]/8 text-[#003087]">
                        <Icon className="size-5" strokeWidth={1.75} />
                      </div>
                      <div>
                        <p className="font-heading text-sm font-semibold text-[#003087]">
                          {s.label}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {s.body}
                        </p>
                      </div>
                    </div>
                    <a
                      href={s.file}
                      className="text-xs font-semibold text-[#003087] underline-offset-2 hover:underline"
                      download
                    >
                      Vector source (AI)
                    </a>
                  </div>
                );
              })}
            </div>
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
                  alt="Stylized before and after comparison graphic for process improvement"
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
