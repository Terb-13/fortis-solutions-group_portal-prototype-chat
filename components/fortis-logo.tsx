import Image from "next/image";
import Link from "next/link";
import { FORTIS } from "@/lib/constants";
import { FORTIS_IMAGES } from "@/lib/fortis-images";
import { cn } from "@/lib/utils";

const ALT = "Fortis Solutions Group — Fortis Edge wordmark";

type FortisLogoProps = {
  className?: string;
  variant?: "default" | "stacked" | "white" | "black" | "rgb";
  compact?: boolean;
  priority?: boolean;
};

export function FortisLogo({
  className,
  variant = "default",
  compact = false,
  priority = true,
}: FortisLogoProps) {
  const isStacked = variant === "stacked";

  const { src, widthClass, heightClass } = isStacked
    ? {
        src: FORTIS_IMAGES.logoStacked,
        widthClass: "w-[100px] sm:w-[120px]",
        heightClass: "h-14 sm:h-16",
      }
    : variant === "white" || variant === "default"
      ? {
          src: FORTIS_IMAGES.logoWhite,
          widthClass: compact ? "w-[108px] sm:w-[120px]" : "w-[120px] sm:w-[135px]",
          heightClass: "h-8 sm:h-9",
        }
      : variant === "black"
        ? {
            src: FORTIS_IMAGES.logoBlack,
            widthClass: compact ? "w-[108px] sm:w-[120px]" : "w-[120px] sm:w-[135px]",
            heightClass: "h-8 sm:h-9",
          }
        : {
            src: FORTIS_IMAGES.logoRgb,
            widthClass: compact ? "w-[120px] sm:w-[128px]" : "w-[128px] sm:w-[140px]",
            heightClass: "h-8 sm:h-9",
          };

  return (
    <Link
      href="/"
      className={cn(
        "group flex min-w-0 max-w-full items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#00A651]/50",
        isStacked && "flex-col items-start gap-1",
        className,
      )}
    >
      <div className={cn("relative shrink-0", widthClass, heightClass, "drop-shadow-sm")}>
        <Image
          src={src}
          alt={ALT}
          fill
          priority={priority}
          className="object-contain object-left"
          sizes={compact ? "120px" : "140px"}
        />
      </div>
      {!isStacked && (
        <div className="min-w-0 text-left leading-tight">
          <div className="truncate text-sm font-semibold text-zinc-100 md:max-w-none">
            {FORTIS.productName}
          </div>
          <div className="hidden text-xs font-medium text-zinc-500 sm:block">
            {FORTIS.shortCompany} · Internal
          </div>
        </div>
      )}
    </Link>
  );
}
