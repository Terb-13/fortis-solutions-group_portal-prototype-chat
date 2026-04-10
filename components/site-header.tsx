"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { FortisLogo } from "@/components/fortis-logo";
import { TeamLoginDialog } from "@/components/team-login-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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

function NavLink({
  href,
  children,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active =
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-[#003087]/10 text-[#003087]"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

export function SiteHeader({ className }: { className?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-border/60 bg-background/90 shadow-[0_1px_0_rgba(0,48,135,0.06)] backdrop-blur-md supports-[backdrop-filter]:bg-background/85",
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 md:gap-4 md:px-6">
        <FortisLogo className="min-w-0 shrink" />

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex xl:gap-1"
          aria-label="Primary"
        >
          {nav.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Button
            type="button"
            size="sm"
            className="bg-[#00A651] px-3 font-semibold text-white shadow-sm transition hover:bg-[#00A651]/90 md:px-4"
            onClick={() => setLoginOpen(true)}
          >
            Team Login
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "lg:hidden",
              )}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[min(100vw,20rem)] gap-0 p-0">
              <SheetHeader className="border-b px-4 py-4 text-left">
                <SheetTitle className="font-heading text-[#003087]">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <nav
                className="flex flex-col gap-1 p-3"
                aria-label="Mobile primary"
              >
                {nav.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    onNavigate={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
                <Button
                  type="button"
                  className="mt-3 h-11 w-full bg-[#00A651] font-semibold text-white hover:bg-[#00A651]/90"
                  onClick={() => {
                    setMobileOpen(false);
                    setLoginOpen(true);
                  }}
                >
                  Team Login
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <TeamLoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        showTrigger={false}
      />
    </header>
  );
}
