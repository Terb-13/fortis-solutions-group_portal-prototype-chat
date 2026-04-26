import Image from "next/image";
import { Globe2, Layers, Rocket, Users } from "lucide-react";
import { FORTIS } from "@/lib/constants";
import { FORTIS_IMAGES } from "@/lib/fortis-images";

export const metadata = {
  title: `What is Fortis Edge? | ${FORTIS.productName}`,
  description: FORTIS.subhead,
};

const benefits = [
  {
    icon: Rocket,
    title: "Built for speed",
    text: "Digital HP lanes in Orem & Marietta for Tier 3 & 4 + low-quantity work.",
  },
  {
    icon: Globe2,
    title: "Portal-first",
    text: "Self-service for routine tasks; enterprise story stays intact.",
  },
  {
    icon: Layers,
    title: "Phased roadmap",
    text: "Proofing, FlexLink, split shipping—aligned to real plant readiness.",
  },
  {
    icon: Users,
    title: "1,100+ Fortis team",
    text: "National footprint; solutions discipline you expect from Fortis.",
  },
] as const;

const marketViz = [
  {
    src: "/images/Flavored-Water-andrew-kayani-_bQxQlLpoVY-unsplash.jpg",
    alt: "Beverage market — chilled bottled water and flavor lineup in ice",
  },
  {
    src: "/images/Bath-background-everdrop-gmbh-pIeHUhOwIMc-unsplash.jpg",
    alt: "Health and beauty market — bath and body care product styling",
  },
] as const;

export default function WhatIsFortisEdgePage() {
  return (
    <div>
      <section className="relative min-h-[min(70vh,520px)]">
        <div className="absolute inset-0">
          <Image
            src="/images/plant-map.jpg"
            alt="United States map showing Fortis plant locations and coverage"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-[#003087]/30" />
          <div className="absolute bottom-8 left-0 right-0 hidden translate-x-0 justify-center sm:flex sm:bottom-10 sm:justify-end sm:pr-6 md:pr-10">
            <div className="relative aspect-[2.4/1] w-[min(60vw,280px)] opacity-90 sm:w-[min(32vw,320px)]">
              <Image
                src={FORTIS_IMAGES.logoReverse}
                alt="Fortis reverse logo over plant coverage map"
                fill
                className="object-contain object-left sm:object-right"
                sizes="(min-width: 768px) 20rem, 60vw"
              />
            </div>
          </div>
        </div>
        <div className="relative mx-auto flex min-h-[min(70vh,520px)] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 md:px-6 md:pb-20">
          <h1 className="max-w-3xl font-heading text-4xl font-semibold tracking-tight text-[#003087] md:text-5xl">
            What is Fortis Edge?
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
            {FORTIS.subhead}
          </p>
          <p className="mt-6 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
            SBU for Tier 3 &amp; 4 — digital plants + portal. Fortis quality,
            unchanged.
          </p>
        </div>
      </section>

      <section className="section-y mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <h2 className="font-heading text-2xl font-semibold text-[#003087]">
              Markets in motion
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              High-velocity categories pair with the Fortis Edge digital story—
              beverage and health &amp; beauty lead the shelf conversation while
              other segments follow the same program discipline.
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Use the plant map in the hero as your geographic anchor, then
              connect teams to the portal roadmap and proofing calendar.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {marketViz.map((m) => (
              <div
                key={m.src}
                className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card"
              >
                <div className="relative aspect-[4/5] w-full">
                  <Image
                    src={m.src}
                    alt={m.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 40vw, 100vw"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y mx-auto max-w-7xl border-t border-border/50 px-4 md:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-border/80 bg-card p-6 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#003087]/8 text-[#003087]">
                <Icon className="size-6" strokeWidth={1.75} />
              </div>
              <h2 className="mt-4 font-heading text-lg font-semibold text-[#003087]">
                {title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
