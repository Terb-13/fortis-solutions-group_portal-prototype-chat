import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { FORTIS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata = {
  title: `Thank you | ${FORTIS.productName}`,
  description: "Thank you for using the Fortis Packaging Assistant proposal flow.",
};

export default function ThankYouPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center md:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F5A623]">
        {FORTIS.company}
      </p>
      <h1 className="mt-4 font-heading text-3xl font-semibold text-[#003087]">
        Proposal downloaded
      </h1>
      <p className="mt-4 text-muted-foreground">
        Thank you for exploring {FORTIS.productName}. Your Fortis team can refine
        scope, sustainability targets, and applicator alignment on follow-up.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/explorer"
          className={cn(
            buttonVariants(),
            "bg-[#003087] text-white hover:bg-[#003087]/90",
          )}
        >
          Back to explorer
        </Link>
        <Link
          href="/assistant"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Continue with Assistant
        </Link>
      </div>
    </div>
  );
}
