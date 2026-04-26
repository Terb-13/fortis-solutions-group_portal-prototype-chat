import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FORTIS } from "@/lib/constants";
import { FORTIS_IMAGES } from "@/lib/fortis-images";
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

export default function ProductsServicesPage() {
  return (
    <div>
      <div className="section-y mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-heading text-4xl font-semibold text-[#003087] md:text-5xl">
            Products &amp; services
          </h1>
          <p className="mt-4 text-muted-foreground">
            Portal-led digital scope — full Fortis catalog with your team.
          </p>
        </div>
      </div>

      <section className="section-y border-t border-border/50 bg-muted/15">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="font-heading text-2xl font-semibold text-[#003087] md:text-3xl">
            Folding cartons
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Hymes lock automatic bottom—structural rigidity for e‑commerce and
            retail.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-md">
              <div className="relative aspect-[4/3] w-full sm:aspect-[3/2]">
                <Image
                  src={FORTIS_IMAGES.hymesLock01}
                  alt="Fortis Edge Hymes lock automatic bottom folding carton view one"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 40vw, 100vw"
                  priority
                />
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-md">
              <div className="relative aspect-[4/3] w-full sm:aspect-[3/2]">
                <Image
                  src={FORTIS_IMAGES.hymesLock02}
                  alt="Fortis Edge Hymes lock automatic bottom folding carton view two"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 40vw, 100vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="font-heading text-2xl font-semibold text-[#003087] md:text-3xl">
            Flexible packaging
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Premium sachet and flex formats—DALL·E concept mock for program
            visualization.
          </p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card">
            <div className="relative aspect-[21/9] w-full min-h-[200px] sm:aspect-[2.2/1]">
              <Image
                src={FORTIS_IMAGES.flexSachetHero}
                alt="Premium health and beauty sachet flexible packaging design mockup"
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority
              />
            </div>
            <p className="p-4 text-sm text-muted-foreground">
              Shrink, flex, cartons, applicators — program by program. Confirm
              scope with your Fortis contact.
            </p>
          </div>
        </div>
      </section>

      <div className="section-y mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="text-center font-heading text-2xl font-semibold text-[#003087] md:text-3xl">
          Full catalog (samples)
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {otherProducts.map((p) => (
            <article
              key={p.title}
              className="group overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card shadow-card-hover"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
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
                <h2 className="font-heading text-lg font-semibold text-[#003087]">
                  {p.title}
                </h2>
                <Badge
                  variant="outline"
                  className="shrink-0 border-0 bg-[#003087]/8 text-xs font-semibold text-[#003087]"
                >
                  Digital Only
                </Badge>
              </div>
            </article>
          ))}
        </div>
      </div>

      <section className="section-y border-t border-border/50 bg-muted/10">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-center font-heading text-2xl font-semibold text-[#003087] md:text-3xl">
            Markets we serve
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
            Beverage and health &amp; beauty programs—masonry mix for rapid
            scanning.
          </p>

          <p className="mt-8 font-heading text-sm font-semibold text-[#003087]">
            Beverage
          </p>
          <div className="mt-4 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {marketBeverage.map((m) => (
              <div
                key={m.src}
                className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm"
              >
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={m.src}
                    alt={m.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-10 font-heading text-sm font-semibold text-[#003087]">
            Health &amp; beauty
          </p>
          <div className="mt-4 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {marketHealthBeauty.map((m) => (
              <div
                key={m.src}
                className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm"
              >
                <div className="relative aspect-[3/4] w-full sm:aspect-[4/5]">
                  <Image
                    src={m.src}
                    alt={m.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-y mx-auto max-w-7xl px-4 pb-8 md:px-6">
        <p className="mx-auto max-w-2xl text-center text-sm text-muted-foreground">
          Shrink, flex, cartons, applicators — program by program. Confirm scope
          with your Fortis contact.
        </p>
        <div className="mt-10 flex justify-center">
          <Link
            href="/customer-portal"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-[#003087] text-white hover:bg-[#003087]/90",
            )}
          >
            Portal roadmap
          </Link>
        </div>
      </div>
    </div>
  );
}
