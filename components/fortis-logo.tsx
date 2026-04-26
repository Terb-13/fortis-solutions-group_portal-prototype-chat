import Image from "next/image";
import Link from "next/link";
import { FORTIS } from "@/lib/constants";
import { FORTIS_IMAGES } from "@/lib/fortis-images";
import { cn } from "@/lib/utils";

const ALT = "Fortis Solutions Group primary logo";

type FortisLogoProps = {
  className?: string;
  /** Horizontal RGB wordmark (header / most placements). */
  variant?: "default" | "stacked" | "white" | "black";
  /** Shorter logo width on very narrow viewports. */
  compact?: boolean;
  /** Prefer `false` for non-LCP instances (e.g. mobile menu). */
  priority?: boolean;
};

export function FortisLogo({
  className,
  variant = "default",
  compact = false,
  priority = true,
}: FortisLogoProps) {
  const isStacked = variant === "stacked";
  const { src, widthClass, heightClass } =
    variant === "white"
      ? {
          src: FORTIS_IMAGES.logoWhite,
          widthClass: compact ? "w-[108px] sm:w-[120px]" : "w-[120px] sm:w-[135px]",
          heightClass: isStacked ? "h-14 sm:h-16" : "h-8 sm:h-9",
        }
      : variant === "black"
        ? {
            src: FORTIS_IMAGES.logoBlack,
            widthClass: compact ? "w-[108px] sm:w-[120px]" : "w-[120px] sm:w-[135px]",
            heightClass: isStacked ? "h-14 sm:h-16" : "h-8 sm:h-9",
          }
        : isStacked
          ? {
              src: FORTIS_IMAGES.logoStacked,
              widthClass: "w-[100px] sm:w-[120px]",
              heightClass: "h-14 sm:h-16",
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
        "group flex min-w-0 max-w-full items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#003087]/35",
        isStacked && "flex-col items-start gap-1",
        className,
      )}
    >
      <div
        className={cn(
          "relative shrink-0",
          widthClass,
          heightClass,
          (variant === "default" || variant === "black") && "drop-shadow-sm",
        )}
      >
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
          <div className="truncate text-sm font-semibold text-[#003087] md:max-w-none">
            {FORTIS.productName}
          </div>
          <div className="hidden text-xs font-medium text-muted-foreground sm:block">
            {FORTIS.shortCompany} · SBU
          </div>
        </div>
      )}
    </Link>
  );
}
