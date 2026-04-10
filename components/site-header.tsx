import Link from "next/link";
import { FortisLogo } from "@/components/fortis-logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "/explorer", label: "Explorer" },
  { href: "/assistant", label: "Assistant" },
  { href: "/proposal", label: "Proposal" },
  { href: "/dashboard", label: "Dashboard" },
] as const;

export function SiteHeader({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <FortisLogo />
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/explorer"
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden bg-[#003087] text-white hover:bg-[#003087]/90 sm:inline-flex",
            )}
          >
            Explore
          </Link>
          <Link
            href="/assistant"
            className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
          >
            Chat
          </Link>
        </div>
      </div>
    </header>
  );
}
