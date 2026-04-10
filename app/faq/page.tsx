import { FaqPageClient } from "@/components/faq-page-client";
import { FORTIS } from "@/lib/constants";

export const metadata = {
  title: `FAQ | ${FORTIS.productName}`,
  description:
    "Searchable Fortis Edge FAQs for Tier 3 & 4 programs and the portal.",
};

export default function FaqPage() {
  return (
    <div className="section-y mx-auto max-w-4xl px-4 md:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-4xl font-semibold text-[#003087] md:text-5xl">
          FAQ
        </h1>
        <p className="mt-4 text-muted-foreground">
          Searchable answers—dashboard publishes override the public list.
        </p>
      </div>
      <div className="mt-14">
        <FaqPageClient />
      </div>
    </div>
  );
}
