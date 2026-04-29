"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { getPortalContent } from "@/lib/portal-data";
import { cn } from "@/lib/utils";

type Portal = ReturnType<typeof getPortalContent>;

function formatMilestoneDate(iso: string, type: string) {
  if (type === "live") return "Live";
  try {
    return new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

const phase2 = [
  { label: "Online proofing (Orem)", date: "Mar 1, 2026" },
  { label: "FlexLink", date: "Mar 15, 2026" },
  { label: "Split shipping", date: "Apr 30, 2026" },
  { label: "April portal update", date: "Live" },
] as const;

export function TimelineRoadmapClient({ portal }: { portal: Portal }) {
  const total = portal.milestones.length;
  const liveCount = portal.milestones.filter((m) => m.type === "live").length;
  const progress = total > 0 ? (liveCount / total) * 100 : 0;

  return (
    <div className="section-y mx-auto max-w-7xl px-4 md:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
          Timeline &amp; roadmap
        </h1>
        <p className="mt-4 text-zinc-500">
          Directional dates — confirm with your Fortis Edge contact.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-lg">
        <div className="flex justify-between text-xs text-zinc-500">
          <span>Progress</span>
          <span>{Math.round(progress)}% live</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#00A651] to-[#34d399]"
            initial={{ width: 0 }}
            whileInView={{ width: `${progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="mt-16 overflow-x-auto pb-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="relative mx-auto min-w-[min(100%,780px)] max-w-5xl px-2 md:px-4">
          <div className="absolute left-8 right-8 top-8 h-[3px] overflow-hidden rounded-full bg-white/[0.08] md:left-12 md:right-12">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00A651] to-emerald-400"
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </div>
          <div className="relative flex justify-between gap-2">
            {portal.milestones.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group relative z-10 flex max-w-[24%] min-w-[5.5rem] flex-col items-center text-center"
              >
                <div
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#0a0a0a] text-[10px] font-bold uppercase tracking-wide shadow-lg transition group-hover:scale-105",
                    m.type === "live"
                      ? "bg-[#00A651] text-white ring-2 ring-[#00A651]/40"
                      : "bg-zinc-800 text-zinc-300 ring-2 ring-white/10",
                  )}
                >
                  {m.type === "live" ? "●" : "○"}
                </div>
                <p className="mt-4 text-xs font-semibold leading-snug text-zinc-200">
                  {m.name}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {formatMilestoneDate(m.date, m.type)}
                </p>
                <span
                  className={cn(
                    "mt-2 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                    m.type === "live"
                      ? "bg-[#00A651]/20 text-[#4ade80]"
                      : "bg-white/[0.06] text-zinc-500",
                  )}
                >
                  {m.type === "live" ? "Live" : "Target"}
                </span>
                <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-3 w-[min(92vw,240px)] -translate-x-1/2 rounded-xl border border-white/[0.12] bg-[#101010]/95 px-4 py-3 text-left opacity-0 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-all duration-200 translate-y-1 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#4ade80]">
                    Owner
                  </p>
                  <p className="mt-1 text-xs font-medium text-zinc-100">
                    {m.owner ?? "TBD"}
                  </p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                    Date
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-zinc-300">
                    {m.type === "live"
                      ? "Live now"
                      : formatMilestoneDate(m.date, m.type)}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-zinc-600">
                    {m.date}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-3xl glass-panel p-8 text-center">
        <h2 className="text-lg font-semibold text-white">Phase 2 at a glance</h2>
        <ul className="mt-4 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-zinc-500">
          {phase2.map((x) => (
            <li key={x.label}>
              <span className="font-medium text-zinc-300">{x.label}</span> —{" "}
              {x.date}
            </li>
          ))}
        </ul>
        <Link
          href="/customer-portal"
          className={cn(
            buttonVariants({ variant: "link" }),
            "mt-4 h-auto text-[#4ade80]",
          )}
        >
          Portal command center →
        </Link>
      </div>
    </div>
  );
}
