import Link from "next/link";
import { FortisLogo } from "@/components/fortis-logo";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Home" },
  { href: "/what-is-fortis-edge", label: "What is Fortis Edge?" },
  { href: "/benefits-impact", label: "Benefits & Impact" },
  { href: "/customer-portal", label: "The Customer Portal" },
  { href: "/products-services", label: "Products & Services" },
  { href: "/timeline-roadmap", label: "Timeline & Roadmap" },
  { href: "/faq", label: "FAQ" },
] as const;

export function SiteHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/80 bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/90",
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 md:px-6">
        <div className="flex items-center gap-4">
          <FortisLogo />
        </div>
        <nav
          className="-mx-1 flex gap-1 overflow-x-auto pb-1 text-sm scrollbar-thin md:flex-wrap md:gap-0 md:overflow-visible"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-2.5 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:px-3"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
