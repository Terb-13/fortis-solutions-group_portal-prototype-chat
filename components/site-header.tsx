"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { FortisLogo } from "@/components/fortis-logo";
import { PortalStatusPill } from "@/components/portal-status-pill";
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
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-[#00A651]/12 text-[#4ade80]"
          : "text-zinc-400 hover:bg-white/[0.05] hover:text-zinc-100",
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
        "sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/75 shadow-[0_1px_0_rgba(0,166,81,0.06)] backdrop-blur-xl supports-[backdrop-filter]:bg-[#0a0a0a]/55",
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-3 md:gap-3 md:px-6">
        <FortisLogo className="min-w-0 shrink" compact />

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-1.5 md:flex md:px-1 lg:gap-2">
          {nav.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 md:gap-3">
          <div className="hidden md:block">
            <PortalStatusPill />
          </div>
          <Button
            type="button"
            size="sm"
            className="bg-[#00A651] px-3 font-semibold text-white shadow-lg shadow-[#00A651]/20 transition hover:bg-[#00A651]/90 md:px-4"
            onClick={() => setLoginOpen(true)}
          >
            Team Login
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "border-white/10 bg-white/[0.03] text-zinc-100 lg:hidden",
              )}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(100vw,20rem)] gap-0 border-l border-white/10 bg-[#0f0f0f] p-0"
            >
              <SheetHeader className="space-y-3 border-b border-white/10 px-4 py-4 text-left">
                <FortisLogo
                  variant="stacked"
                  className="max-w-full"
                  priority={false}
                />
                <div className="pt-1">
                  <PortalStatusPill className="w-full" />
                </div>
                <SheetTitle className="font-heading text-left text-sm text-zinc-400">
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
