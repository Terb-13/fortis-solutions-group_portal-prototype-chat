import Image from "next/image";
import { WhatIsBenefits } from "@/components/what-is-benefits";
import { WhatIsHero } from "@/components/what-is-hero";
import { PlantMapInteractive } from "@/components/plant-map-interactive";
import { FORTIS } from "@/lib/constants";

export const metadata = {
  title: `What is Fortis Edge? | ${FORTIS.productName}`,
  description: FORTIS.subhead,
};

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
      <WhatIsHero />

      <section className="section-y border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white md:text-3xl">
                Definition
              </h2>
              <p className="text-sm leading-relaxed text-zinc-400">
                Fortis Edge is the SBU for Tier 3 &amp; 4—digital speed plants
                plus a customer portal—so teams get predictable digital
                handoffs without losing the Fortis enterprise story.
              </p>
              <p className="text-sm leading-relaxed text-zinc-500">
                The map shows plant coverage; market photography below grounds
                the program in beverage and health &amp; beauty—two lead
                categories for Edge messaging.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {marketViz.map((m) => (
                <div
                  key={m.src}
                  className="glass-panel group overflow-hidden"
                >
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src={m.src}
                      alt={m.alt}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                      sizes="(min-width: 1024px) 24vw, (min-width: 640px) 40vw, 100vw"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-y border-t border-white/[0.06] bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-center text-2xl font-semibold text-white md:text-3xl">
            Why it matters
          </h2>
          <WhatIsBenefits />
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-xl font-semibold text-white">Plant footprint</h2>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Interactive context for Orem &amp; Marietta digital lanes (static
            preview).
          </p>
          <PlantMapInteractive />
        </div>
      </section>
    </div>
  );
}
