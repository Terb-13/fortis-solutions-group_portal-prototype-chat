import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FORTIS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata = {
  title: `Products & Services | ${FORTIS.productName}`,
  description:
    "Fortis Edge portal scope — digital HP labels in Orem & Marietta; full catalog via Fortis teams.",
};

const products = [
  {
    title: "Pressure-sensitive labels",
    badge: "Portal live",
    badgeClass: "border-0 bg-[#00A651] text-white hover:bg-[#00A651]/90",
    img: "/images/pressure-sensitive-labels.jpg",
  },
  {
    title: "Renew™ sustainable",
    badge: "ESG",
    badgeClass: "border-0 bg-[#003087] text-white",
    img: "/images/renew-badge.png",
  },
  {
    title: "Shrink sleeves",
    badge: "Catalog",
    badgeClass: "",
    img: "/images/before-after-card.jpg",
  },
  {
    title: "Flexible packaging",
    badge: "Catalog",
    badgeClass: "",
    img: "/images/orem-marietta-press.jpg",
  },
  {
    title: "Folding cartons",
    badge: "Catalog",
    badgeClass: "",
    img: "/images/fortis-edge-hero.jpg",
  },
  {
    title: "Applicators & extended content",
    badge: "Catalog",
    badgeClass: "",
    img: "/images/plant-map.jpg",
  },
] as const;

export default function ProductsServicesPage() {
  return (
    <div className="section-y mx-auto max-w-7xl px-4 md:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-4xl font-semibold text-[#003087] md:text-5xl">
          Products &amp; services
        </h1>
        <p className="mt-4 text-muted-foreground">
          Portal starts with digital HP labels. Everything else stays with your
          Fortis team.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <article
            key={p.title}
            className="group overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card shadow-card-hover"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <Image
                src={p.img}
                alt=""
                fill
                className={cn(
                  "object-cover transition duration-500 group-hover:scale-[1.04]",
                  p.img.endsWith("renew-badge.png") && "object-contain p-8",
                )}
              />
            </div>
            <div className="flex flex-wrap items-start justify-between gap-2 p-5">
              <h2 className="font-heading text-lg font-semibold text-[#003087]">
                {p.title}
              </h2>
              <Badge
                variant="outline"
                className={cn(
                  "shrink-0",
                  p.badgeClass ||
                    "border-[#003087]/20 text-muted-foreground",
                )}
              >
                {p.badge}
              </Badge>
            </div>
          </article>
        ))}
      </div>

      <p className="mx-auto mt-12 max-w-2xl text-center text-sm text-muted-foreground">
        Full catalog: shrink, flex, cartons, applicators, RFID—program by
        program. Confirm scope with your Fortis contact.
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
  );
}
