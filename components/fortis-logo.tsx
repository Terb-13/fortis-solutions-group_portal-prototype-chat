import Link from "next/link";
import { FORTIS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function FortisLogo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group flex min-w-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#003087]/35",
        className,
      )}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#003087] text-xs font-bold tracking-tight text-white shadow-md ring-1 ring-black/5 transition group-hover:shadow-lg"
        aria-hidden
      >
        FE
      </div>
      <div className="min-w-0 text-left leading-tight">
        <div className="truncate text-sm font-semibold text-[#003087] md:max-w-none">
          {FORTIS.productName}
        </div>
        <div className="hidden text-xs font-medium text-muted-foreground sm:block">
          {FORTIS.shortCompany} · SBU
        </div>
      </div>
    </Link>
  );
}
