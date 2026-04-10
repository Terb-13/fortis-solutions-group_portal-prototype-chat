import { FaqPageClient } from "@/components/faq-page-client";
import { FORTIS } from "@/lib/constants";

export const metadata = {
  title: `FAQ | ${FORTIS.productName}`,
  description: "Searchable Fortis Edge FAQs for Tier 3 & 4 programs and the portal.",
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <h1 className="font-heading text-3xl font-semibold text-[#003087] md:text-4xl">
        Frequently asked questions
      </h1>
      <p className="mt-4 text-muted-foreground">
        Seeded with eight canonical themes (expandable to 15+). Dashboard
        overrides apply when you publish from the FAQ builder.
      </p>
      <FaqPageClient />
    </div>
  );
}
