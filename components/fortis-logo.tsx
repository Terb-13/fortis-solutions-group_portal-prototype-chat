import Link from "next/link";
import { cn } from "@/lib/utils";

export function FortisLogo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-[#003087]/40 rounded-md", className)}
    >
      <div
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#003087] text-lg font-bold tracking-tight text-white shadow-sm"
        aria-hidden
      >
        F
      </div>
      <div className="text-left leading-tight">
        <div className="text-sm font-semibold text-[#003087]">
          Fortis Solutions Group
        </div>
        <div className="text-xs font-medium text-muted-foreground">
          Fortis Packaging Assistant
        </div>
      </div>
    </Link>
  );
}
