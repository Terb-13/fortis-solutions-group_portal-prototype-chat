import { Activity } from "lucide-react";
import { PORTAL_ROLLOUT } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function PortalStatusPill({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex max-w-full items-center gap-2 rounded-full border border-[#00A651]/30 bg-[#00A651]/[0.08] px-2.5 py-1 pl-2 text-[11px] font-semibold text-[#00E676] shadow-[0_0_20px_-8px_rgba(0,166,81,0.5)] md:text-xs",
        className,
      )}
    >
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00A651] opacity-40" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00A651]" />
      </span>
      <Activity className="size-3 shrink-0 opacity-80" aria-hidden />
      <span className="min-w-0 truncate">
        <span className="text-zinc-300">Portal</span>{" "}
        <span className="text-white">{PORTAL_ROLLOUT.version}</span>
        <span className="text-zinc-500"> · </span>
        {PORTAL_ROLLOUT.percent}% rolled out
      </span>
    </div>
  );
}
