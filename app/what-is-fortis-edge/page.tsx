import Image from "next/image";
import { FORTIS, FORTIS_CORE_STORY_VERBATIM } from "@/lib/constants";

export const metadata = {
  title: `What is Fortis Edge? | ${FORTIS.productName}`,
  description: FORTIS.subhead,
};

export default function WhatIsFortisEdgePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <h1 className="font-heading text-3xl font-semibold text-[#003087] md:text-4xl">
        What is Fortis Edge?
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">{FORTIS.subhead}</p>

      <div className="mt-10 max-w-none space-y-6">
        <h2 className="font-heading text-xl text-[#003087]">Definition</h2>
        <p>
          Fortis Edge is the Small Business Unit of Fortis Solutions Group,
          purpose-built for Tier 3 and Tier 4 customers and low-quantity orders.
          It connects dedicated digital speed plants—HP Digital Press capacity in{" "}
          <strong>Orem, UT</strong> and <strong>Marietta, GA</strong>—with a
          modern customer portal so routine work moves faster while Fortis
          quality, color management, and solutions discipline stay intact.
        </p>

        <h2 className="font-heading mt-10 text-xl text-[#003087]">Why now</h2>
        <p>
          Small and emerging brands expect consumer-grade digital experiences.
          Fortis Edge meets that expectation with transparent status, phased
          roadmap delivery (proofing, FlexLink, split shipping), and integration
          alignment to Radius, Infigo, and LabelTraxx—without diluting the Fortis
          enterprise story.
        </p>

        <h2 className="font-heading mt-10 text-xl text-[#003087]">
          Key stats (illustrative)
        </h2>
        <ul className="list-disc pl-6 text-muted-foreground">
          <li>1,100+ Fortis team members nationwide</li>
          <li>Strategic U.S. plant network including Orem &amp; Marietta digital lanes</li>
          <li>Tier 3 &amp; 4 focus: higher changeover, smaller order profiles</li>
        </ul>

        <h2 className="font-heading mt-10 text-xl text-[#003087]">
          Fortis core story (verbatim)
        </h2>
        <p className="text-muted-foreground">{FORTIS_CORE_STORY_VERBATIM}</p>
      </div>

      <div className="relative mt-12 aspect-[16/9] overflow-hidden rounded-xl border border-border bg-muted">
        <Image
          src="/images/plant-map.jpg"
          alt="Plant map placeholder"
          fill
          className="object-cover"
        />
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Placeholder map — replace with approved geography / plant graphic.
      </p>
    </div>
  );
}
