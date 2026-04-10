import Link from "next/link";
import { FORTIS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function FortisLogo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "flex items-center gap-3 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[#003087]/40",
        className,
      )}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#003087] text-xs font-bold tracking-tighter text-white shadow-sm"
        aria-hidden
      >
        FE
      </div>
      <div className="text-left leading-tight">
        <div className="text-sm font-semibold text-[#003087]">
          {FORTIS.company}
        </div>
        <div className="text-xs font-medium text-muted-foreground">
          Small Business Unit
        </div>
      </div>
    </Link>
  );
}
