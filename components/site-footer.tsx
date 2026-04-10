import Link from "next/link";
import { FORTIS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "border-t border-border/60 bg-muted/30",
        className,
      )}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
        <div>
          <p className="font-heading text-sm font-semibold text-[#003087]">
            Explore
          </p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li>
              <Link
                href="/customer-portal"
                className="transition hover:text-[#003087]"
              >
                Customer Portal
              </Link>
            </li>
            <li>
              <Link
                href="/timeline-roadmap"
                className="transition hover:text-[#003087]"
              >
                Timeline
              </Link>
            </li>
            <li>
              <Link href="/faq" className="transition hover:text-[#003087]">
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="/assistant"
                className="transition hover:text-[#003087]"
              >
                Assistant
              </Link>
            </li>
            <li>
              <Link
                href="/resources/brief"
                className="transition hover:text-[#003087]"
              >
                Brief (PDF)
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-heading text-sm font-semibold text-[#003087]">
            Contact
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Commercial questions: your Fortis representative. This site is a
            Tier 3 &amp; 4 positioning prototype.
          </p>
          <p className="mt-6 text-xs text-muted-foreground">
            {FORTIS.company}
          </p>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {FORTIS.shortCompany} · Fortis Edge demo
      </div>
    </footer>
  );
}
