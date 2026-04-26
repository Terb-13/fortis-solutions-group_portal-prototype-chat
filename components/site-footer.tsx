import Image from "next/image";
import Link from "next/link";
import { FORTIS } from "@/lib/constants";
import { FORTIS_IMAGES } from "@/lib/fortis-images";
import { cn } from "@/lib/utils";

const FOOTER_LOGO_ALT = "Fortis Solutions Group — white logo for dark background";

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "border-t border-border/60",
        className,
      )}
    >
      <div className="bg-[#0b1220] text-zinc-100">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-2 md:px-6">
          <div>
            <div className="relative h-10 w-44 sm:h-11 sm:w-48">
              <Image
                src={FORTIS_IMAGES.logoWhite}
                alt={FOOTER_LOGO_ALT}
                fill
                className="object-contain object-left"
                sizes="(min-width: 640px) 12rem, 11rem"
              />
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-300">
              {FORTIS.tagline}
            </p>
            <p className="mt-4 text-sm text-zinc-400">
              Commercial questions: your Fortis representative. This site is a
              Tier 3 &amp; 4 positioning prototype.
            </p>
            <p className="mt-5 text-xs text-zinc-500">
              {FORTIS.company}
            </p>
          </div>
          <div>
            <p className="font-heading text-sm font-semibold text-zinc-100">
              Explore
            </p>
            <ul className="mt-4 space-y-3 text-sm text-zinc-300">
              <li>
                <Link
                  href="/customer-portal"
                  className="transition hover:text-white"
                >
                  Customer Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/timeline-roadmap"
                  className="transition hover:text-white"
                >
                  Timeline
                </Link>
              </li>
              <li>
                <Link href="/faq" className="transition hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/assistant"
                  className="transition hover:text-white"
                >
                  Assistant
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/brief"
                  className="transition hover:text-white"
                >
                  Brief (PDF)
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-5 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} {FORTIS.shortCompany} · Fortis Edge demo
        </div>
      </div>
    </footer>
  );
}
