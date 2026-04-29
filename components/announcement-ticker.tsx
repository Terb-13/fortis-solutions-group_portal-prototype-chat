const items = [
  "April 2026 portal update live",
  "Online proofing — Mar 1 target (Orem)",
  "FlexLink — Mar 15 target",
  "Split shipping — Apr 30 target",
  "Orem + Marietta digital HP lanes",
] as const;

export function AnnouncementTicker() {
  const line = items.join(" · ");
  return (
    <div className="border-y border-white/[0.06] bg-[#00A651]/[0.06] py-3 text-sm">
      <div className="relative overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          <span className="inline-flex items-center gap-3 px-4 md:px-6">
            <span className="shrink-0 rounded-full bg-[#00A651] px-2.5 py-0.5 text-xs font-bold tracking-wide text-white">
              Live
            </span>
            <span className="font-medium text-zinc-300">{line}</span>
          </span>
          <span
            className="inline-flex items-center gap-3 px-4 md:px-6"
            aria-hidden
          >
            <span className="shrink-0 rounded-full bg-[#00A651] px-2.5 py-0.5 text-xs font-bold tracking-wide text-white">
              Live
            </span>
            <span className="font-medium text-zinc-300">{line}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
