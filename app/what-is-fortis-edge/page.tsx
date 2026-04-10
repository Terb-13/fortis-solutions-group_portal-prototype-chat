import Image from "next/image";
import { Globe2, Layers, Rocket, Users } from "lucide-react";
import { FORTIS } from "@/lib/constants";

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

export default function WhatIsFortisEdgePage() {
  return (
    <div>
      <section className="relative min-h-[min(70vh,520px)]">
        <div className="absolute inset-0">
          <Image
            src="/images/plant-map.jpg"
            alt=""
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-[#003087]/30" />
        </div>
        <div className="relative mx-auto flex min-h-[min(70vh,520px)] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 md:px-6 md:pb-20">
          <h1 className="max-w-3xl font-heading text-4xl font-semibold tracking-tight text-[#003087] md:text-5xl">
            What is Fortis Edge?
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl">
            {FORTIS.subhead}
          </p>
          <p className="mt-6 max-w-2xl text-pretty text-muted-foreground">
            The Small Business Unit for Tier 3 &amp; 4—digital plants plus a
            modern portal without diluting Fortis quality or integrations.
          </p>
        </div>
      </section>

      <section className="section-y mx-auto max-w-7xl px-4 md:px-6">
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
