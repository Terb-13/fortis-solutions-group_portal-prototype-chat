import Link from "next/link";
import { FORTIS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "border-t border-border bg-muted/40 text-sm text-muted-foreground",
        className,
      )}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-start md:justify-between md:px-6">
        <div className="max-w-md space-y-2">
          <p className="font-semibold text-foreground">{FORTIS.company}</p>
          <p className="text-balance">{FORTIS.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/explorer" className="hover:text-foreground">
            Product explorer
          </Link>
          <Link href="/assistant" className="hover:text-foreground">
            Packaging Assistant
          </Link>
          <Link href="/proposal" className="hover:text-foreground">
            Proposal
          </Link>
          <Link href="/dashboard/login" className="hover:text-foreground">
            Dashboard
          </Link>
        </div>
      </div>
      <div className="border-t border-border/80 py-4 text-center text-xs">
        © {new Date().getFullYear()} {FORTIS.company}. Demo prototype.
      </div>
    </footer>
  );
}
