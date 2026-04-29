import Image from "next/image";
import Link from "next/link";
import { FORTIS } from "@/lib/constants";
import { FORTIS_IMAGES } from "@/lib/fortis-images";
import { cn } from "@/lib/utils";

const FOOTER_LOGO_ALT = "Fortis Solutions Group — white logo";

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn("border-t border-white/[0.06] bg-[#0a0a0a]/90", className)}
    >
      <div className="relative">
        <div
          className="pointer-events-none absolute inset-0 noise-overlay opacity-40"
          aria-hidden
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 md:px-6">
          <div className="glass-panel p-6 md:p-8">
            <div className="relative h-10 w-44 sm:h-11 sm:w-48">
              <Image
                src={FORTIS_IMAGES.logoWhite}
                alt={FOOTER_LOGO_ALT}
                fill
                className="object-contain object-left"
                sizes="(min-width: 640px) 12rem, 11rem"
              />
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-400">
              {FORTIS.tagline}
            </p>
            <p className="mt-4 text-sm text-zinc-500">
              Internal SBU updates and portal program status—confirm externally with
              your Fortis team for commercial details.
            </p>
            <p className="mt-5 text-xs text-zinc-600">
              {FORTIS.company}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Navigate
            </p>
            <ul className="mt-4 space-y-3 text-sm text-zinc-400">
              {[
                { href: "/customer-portal", label: "Customer Portal" },
                { href: "/timeline-roadmap", label: "Timeline" },
                { href: "/faq", label: "FAQ" },
                { href: "/assistant", label: "Assistant" },
                { href: "/resources/brief", label: "Brief (PDF)" },
                { href: "/dashboard", label: "Team dashboard" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="transition hover:text-[#4ade80]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/[0.06] py-5 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} {FORTIS.shortCompany} · Fortis Edge internal
        </div>
      </div>
    </footer>
  );
}
