"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ChevronDown,
  Clock,
  Globe,
  HelpCircle,
  Home,
  Info,
  Menu,
  Package,
  TrendingUp,
} from "lucide-react";
import { AdminLoginDialog } from "@/components/admin-login-dialog";
import { FortisLogo } from "@/components/fortis-logo";
import { PortalStatusPill } from "@/components/portal-status-pill";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const primaryNav: readonly {
  href: string;
  label: string;
  Icon: LucideIcon;
}[] = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/what-is-fortis-edge", label: "What is Edge?", Icon: Info },
  { href: "/benefits-impact", label: "Benefits", Icon: TrendingUp },
  { href: "/timeline-roadmap", label: "Roadmap", Icon: Clock },
];

const moreNav: readonly {
  href: string;
  label: string;
  Icon: LucideIcon;
}[] = [
  { href: "/customer-portal", label: "Portal", Icon: Globe },
  { href: "/products-services", label: "Products", Icon: Package },
  { href: "/faq", label: "FAQ", Icon: HelpCircle },
];

function NavLink({
  href,
  label,
  Icon,
  onNavigate,
}: {
  href: string;
  label: string;
  Icon: LucideIcon;
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
        "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-medium tracking-tight transition-colors md:px-3.5 md:py-2",
        onNavigate && "w-full max-w-none justify-start rounded-xl",
        active
          ? "bg-[#00A651]/12 text-[#86efac] ring-1 ring-inset ring-[#00A651]/22 shadow-[0_0_0_1px_rgba(0,166,81,0.08)]"
          : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100",
      )}
    >
      <Icon
        className={cn(
          "size-[15px] shrink-0 opacity-80 md:size-4",
          active && "text-[#4ade80]/95 opacity-100",
        )}
        aria-hidden
        strokeWidth={1.75}
      />
      <span>{label}</span>
    </Link>
  );
}

function MoreMenuDesktop() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const dismiss = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) dismiss();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, dismiss]);

  useEffect(() => {
    dismiss();
  }, [pathname, dismiss]);

  const moreActive = moreNav.some((item) =>
    item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
  );

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium tracking-tight transition-colors md:px-4",
          open || moreActive
            ? "bg-white/[0.06] text-zinc-100 ring-1 ring-inset ring-white/10"
            : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100",
        )}
      >
        More
        <ChevronDown
          className={cn(
            "size-4 opacity-70 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
          strokeWidth={1.75}
        />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute left-0 top-[calc(100%+0.5rem)] z-50 min-w-[13.5rem] rounded-xl border border-white/10 bg-[#121212]/95 p-1.5 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.65)] backdrop-blur-xl backdrop-saturate-150 ring-1 ring-white/[0.06]"
        >
          {moreNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] font-medium text-zinc-300 transition-colors hover:bg-white/[0.06] hover:text-zinc-50"
            >
              <item.Icon className="size-4 shrink-0 opacity-80" aria-hidden />
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function SiteHeader({ className }: { className?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-white/[0.07] bg-[#0a0a0a]/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_32px_-16px_rgba(0,0,0,0.45)] backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-[#0a0a0a]/42",
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3.5 md:gap-6 md:px-8 md:py-4">
        <FortisLogo className="min-w-0 shrink-0" compact />

        <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex md:gap-2 lg:gap-3">
          {primaryNav.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              Icon={item.Icon}
            />
          ))}
          <MoreMenuDesktop />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 md:gap-3">
          <div className="hidden lg:block">
            <PortalStatusPill />
          </div>
          <Button
            type="button"
            size="sm"
            className="bg-[#00A651] px-3.5 font-semibold text-white shadow-lg shadow-[#00A651]/18 transition hover:bg-[#00A651]/90 md:px-5"
            onClick={() => setLoginOpen(true)}
          >
            Admin Login
          </Button>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "border-white/10 bg-white/[0.03] text-zinc-100 md:hidden",
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
                {primaryNav.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    Icon={item.Icon}
                    onNavigate={() => setMobileOpen(false)}
                  />
                ))}
                <p className="px-3 pt-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                  More
                </p>
                {moreNav.map((item) => (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    Icon={item.Icon}
                    onNavigate={() => setMobileOpen(false)}
                  />
                ))}
                <Button
                  type="button"
                  className="mt-4 h-11 w-full bg-[#00A651] font-semibold text-white shadow-md shadow-[#00A651]/15 hover:bg-[#00A651]/90"
                  onClick={() => {
                    setMobileOpen(false);
                    setLoginOpen(true);
                  }}
                >
                  Admin Login
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <AdminLoginDialog
        open={loginOpen}
        onOpenChange={setLoginOpen}
        showTrigger={false}
      />
    </header>
  );
}
