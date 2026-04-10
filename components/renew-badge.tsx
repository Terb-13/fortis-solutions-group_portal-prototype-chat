import Image from "next/image";
import { cn } from "@/lib/utils";

export function RenewBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-[#00A651]/40 bg-[#00A651]/10 px-2.5 py-0.5 text-xs font-semibold text-[#00A651]",
        className,
      )}
    >
      <Image
        src="/images/renew-badge.png"
        alt=""
        width={14}
        height={14}
        className="h-3.5 w-3.5"
      />
      RENEW™ Sustainable Packaging
    </span>
  );
}
