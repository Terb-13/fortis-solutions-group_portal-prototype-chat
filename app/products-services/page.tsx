import Image from "next/image";
import Link from "next/link";
import { Candy, PartyPopper, Snowflake } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FORTIS } from "@/lib/constants";
import { FORTIS_IMAGES } from "@/lib/fortis-images";
import { FoldingCartonsShowcase } from "@/components/folding-cartons-showcase";
import { MarketsMasonry } from "@/components/markets-masonry";
import { cn } from "@/lib/utils";

export const metadata = {
  title: `Products & Services | ${FORTIS.productName}`,
  description:
    "Fortis Edge portal scope — digital HP labels in Orem & Marietta; full catalog via Fortis teams.",
};

const otherProducts = [
  {
    title: "Pressure-sensitive labels",
    img: "/images/pressure-sensitive-labels.jpg",
    alt: "Pressure-sensitive label rolls on press — premium bottle labeling",
  },
  {
    title: "Renew™ sustainable",
    img: "/images/renew-badge.png",
    alt: "Fortis Renew sustainable packaging program mark",
  },
  {
    title: "Shrink sleeves",
    img: "/images/shrink-sleeves.jpg",
    alt: "Colorful shrink sleeve packaging samples on a table",
  },
  {
    title: "Booklets & extended content",
    img: "/images/booklets-coupons.jpg",
    alt: "Folded booklet and coupon label formats",
  },
  {
    title: "RFID & intelligent labels",
    img: "/images/rfid-labels.jpg",
    alt: "RFID inlay and smart label construction detail",
  },
  {
    title: "Applicators & extended content",
    img: "/images/plant-map.jpg",
    alt: "U.S. plant locations map for applicator and fulfillment programs",
  },
] as const;

const marketBeverage = [
  {
    src: "/images/Flavored-Water-andrew-kayani-_bQxQlLpoVY-unsplash.jpg",
    alt: "Flavored water and still beverages in an ice display",
  },
  {
    src: "/images/Beer-Display.jpg",
    alt: "Retail beer display with branded cartons and cases",
  },
  {
    src: "/images/wine-bottle-50574.jpg",
    alt: "Single premium wine bottle with label and capsule detail",
  },
  {
    src: "/images/Coffee-Background_4dWz9H7d8OM-unsplash.jpg",
    alt: "Coffee and café beverage packaging context",
  },
] as const;

const marketHealthBeauty = [
  {
    src: "/images/Bath-background-everdrop-gmbh-pIeHUhOwIMc-unsplash.jpg",
    alt: "Health and beauty bath and personal care product styling",
  },
  {
    src: "/images/akram-huseyn-pA3_Ry7VYcs-unsplash.jpg",
    alt: "Skincare and cosmetics product arrangement with soft light",
  },
  {
    src: "/images/micheile-henderson-I2lF6gNn5Zo-unsplash.jpg",
    alt: "Premium health and beauty flat lay with tubes and glass packaging",
  },
] as const;

const seasonalVectors = [
  {
    label: "Ribbon & satin",
    icon: Candy,
    file: "/images/red-ribbon-vector-illustration-with-shiny-satin_23330134.ai",
  },
  {
    label: "Winter snowflake",
    icon: Snowflake,
    file: "/images/snowflake_017.ai",
  },
  {
    label: "Cinco & fiesta",
    icon: PartyPopper,
    file: "/images/cinco-de-mayo-concept.ai",
  },
] as const;

export default function ProductsServicesPage() {
  return (
    <div>
      <div className="section-y mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Products &amp; services
          </h1>
          <p className="mt-4 text-zinc-500">
            Portal-led digital scope — full Fortis catalog with your team.
          </p>
        </div>
      </div>

      <section className="section-y border-t border-white/[0.06] bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            Folding cartons
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Hymes lock automatic bottom—structural rigidity for e‑commerce and
            retail.
          </p>
          <FoldingCartonsShowcase />
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            Flexible packaging
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Premium sachet flex—DALL·E concept mock for program visualization.
          </p>
          <div className="mt-8 overflow-hidden glass-panel">
            <div className="relative min-h-[200px] w-full aspect-[21/9] sm:aspect-[2.2/1]">
              <Image
                src={FORTIS_IMAGES.flexSachetHero}
                alt="Premium health and beauty sachet flexible packaging design mockup"
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority
              />
            </div>
            <p className="border-t border-white/[0.06] p-4 text-sm text-zinc-500">
              Shrink, flex, cartons, applicators — program by program. Confirm
              scope with your Fortis contact.
            </p>
          </div>
        </div>
      </section>

      <section className="section-y border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-2xl font-semibold text-white md:text-3xl">
            Seasonal &amp; special occasion packaging
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Holiday photography plus Illustrator masters for fast-turn programs.
          </p>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <div className="glass-panel overflow-hidden">
              <div className="relative aspect-[4/3] w-full sm:aspect-[5/3]">
                <Image
                  src="/images/gift-with-label.jpg"
                  alt="Labeled gift box with kraft paper and string—seasonal retail packaging"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                />
              </div>
              <div className="border-t border-white/[0.06] p-4 text-sm text-zinc-400">
                Gift, ribbon &amp; retail hero — use in seasonal briefs.
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {seasonalVectors.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="flex flex-col justify-between gap-2 glass-panel p-4"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#00A651]/12 text-[#4ade80]">
                        <Icon className="size-4" />
                      </div>
                      <p className="text-sm font-medium text-zinc-200">
                        {s.label}
                      </p>
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

      <div className="section-y mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="text-center text-2xl font-semibold text-white md:text-3xl">
          Full catalog (samples)
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {otherProducts.map((p) => (
            <article
              key={p.title}
              className="group glass-panel glass-panel-hover overflow-hidden"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-zinc-900/50">
                <Image
                  src={p.img}
                  alt={p.alt}
                  fill
                  className={cn(
                    "object-cover transition duration-500 group-hover:scale-[1.04]",
                    p.img.endsWith("renew-badge.png") && "object-contain p-8",
                  )}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                />
              </div>
              <div className="flex flex-wrap items-start justify-between gap-2 p-5">
                <h2 className="text-lg font-semibold text-zinc-100">{p.title}</h2>
                <Badge
                  variant="outline"
                  className="shrink-0 border-0 bg-[#00A651]/10 text-xs font-semibold text-[#4ade80]"
                >
                  Digital Only
                </Badge>
              </div>
            </article>
          ))}
        </div>
      </div>

      <section className="section-y border-t border-white/[0.06] bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-center text-2xl font-semibold text-white md:text-3xl">
            Markets we serve
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-zinc-500">
            Beverage and health &amp; beauty — masonry mix for program scanning.
          </p>

          <MarketsMasonry beverage={marketBeverage} healthBeauty={marketHealthBeauty} />
        </div>
      </section>

      <div className="section-y mx-auto max-w-7xl px-4 pb-12 md:px-6">
        <p className="mx-auto max-w-2xl text-center text-sm text-zinc-500">
          Shrink, flex, cartons, applicators — program by program. Confirm scope
          with your Fortis contact.
        </p>
        <div className="mt-10 flex justify-center">
          <Link
            href="/customer-portal"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-[#00A651] text-white shadow-lg shadow-[#00A651]/20 hover:bg-[#00A651]/90",
            )}
          >
            Portal roadmap
          </Link>
        </div>
      </div>
    </div>
  );
}
