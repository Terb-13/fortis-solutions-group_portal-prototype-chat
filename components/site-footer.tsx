import Link from "next/link";
import { FORTIS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "border-t border-border bg-muted/40 text-sm text-muted-foreground",
        className,
      )}
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 md:px-6">
        <div>
          <p className="font-heading text-sm font-semibold text-foreground">
            Resources
          </p>
          <ul className="mt-4 space-y-2">
            <li>
              <Link href="/customer-portal" className="hover:text-foreground">
                Customer Portal overview
              </Link>
            </li>
            <li>
              <Link href="/timeline-roadmap" className="hover:text-foreground">
                Timeline &amp; roadmap
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:text-foreground">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/resources/brief" className="hover:text-foreground">
                PDF stakeholder brief (demo)
              </Link>
            </li>
            <li>
              <Link href="/assistant" className="hover:text-foreground">
                Fortis Edge Assistant (Grok)
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-foreground">
                Demo dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-heading text-sm font-semibold text-foreground">
            Contact
          </p>
          <p className="mt-4 max-w-md text-pretty">
            For Fortis Edge commercial questions, reach your Fortis Solutions
            Group representative. This prototype illustrates portal positioning
            for Tier 3 &amp; Tier 4 programs—confirm live capabilities with your
            account team.
          </p>
          <p className="mt-4 text-xs">
            {FORTIS.company} · {FORTIS.tagline}
          </p>
        </div>
      </div>
      <div className="border-t border-border/80 py-4 text-center text-xs">
        © {new Date().getFullYear()} {FORTIS.shortCompany}. Fortis Edge demo
        prototype.
      </div>
    </footer>
  );
}
