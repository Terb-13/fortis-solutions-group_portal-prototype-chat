"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, Gauge, Radio } from "lucide-react";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { HeroBackdrop } from "@/components/hero-backdrop";
import { getPortalContent } from "@/lib/portal-data";
import { cn } from "@/lib/utils";

type Portal = ReturnType<typeof getPortalContent>;

function RingProgress({ value, label }: { value: number; label: string }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-24 w-24">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 80 80">
          <title>{label}</title>
          <circle
            cx="40"
            cy="40"
            r={r}
            className="fill-none stroke-white/[0.08]"
            strokeWidth="8"
          />
          <motion.circle
            cx="40"
            cy="40"
            r={r}
            className="fill-none stroke-[#00A651]"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeDasharray={c}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-mono text-lg font-semibold text-white">
          {value}%
        </span>
      </div>
      <span className="text-center text-xs text-zinc-500">{label}</span>
    </div>
  );
}

function PortalScreenshotFrame({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <motion.div
      layout
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="ring-glass-frame group overflow-hidden rounded-[var(--radius-xl)]"
    >
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#080808]/90 px-3 py-2.5 backdrop-blur-md">
        <span
          className="size-2.5 rounded-full bg-[#ff5f56]/90 shadow-inner"
          aria-hidden
        />
        <span
          className="size-2.5 rounded-full bg-[#ffbd2e]/90 shadow-inner"
          aria-hidden
        />
        <span
          className="size-2.5 rounded-full bg-[#27c93f]/85 shadow-inner"
          aria-hidden
        />
        <span className="ml-2 truncate font-mono text-[10px] tracking-tight text-zinc-500">
          fortis-edge.portal · live preview
        </span>
      </div>
      <div className="relative aspect-video overflow-hidden bg-black/40">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition duration-700 group-hover:scale-[1.02]"
          sizes="(min-width: 768px) 40vw, 100vw"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />
      </div>
    </motion.div>
  );
}

export function CustomerPortalView({ portal }: { portal: Portal }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div>
      <section className="relative min-h-[min(64vh,560px)] overflow-hidden">
        <HeroBackdrop />
        <div className="relative z-[1] mx-auto flex min-h-[min(64vh,560px)] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 md:px-6 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#4ade80]"
          >
            <Radio className="size-3.5" />
            Command center
          </motion.div>
          <motion.h1
            className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-white md:text-5xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            The Customer Portal
          </motion.h1>
          <motion.p
            className="mt-5 max-w-2xl text-zinc-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            One platform. Clear tiers. April 2026 update is live for
            self-service and visibility.
          </motion.p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { v: 92, l: "Order visibility" },
              { v: 87, l: "Portal rollout" },
              { v: 78, l: "Integration readiness" },
            ].map((x) => (
              <motion.div
                key={x.l}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className="glass-panel flex items-center py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
              >
                <RingProgress value={x.v} label={x.l} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="mb-6 flex items-center justify-between gap-2">
            <h2 className="text-2xl font-semibold text-white">Live status</h2>
            <Gauge className="size-5 text-[#4ade80]" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {portal.liveFeaturesApril2026.map((x) => (
              <motion.div
                key={x}
                whileHover={{ y: -2 }}
                className="flex items-start gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 backdrop-blur-sm"
              >
                <Check className="mt-0.5 size-4 shrink-0 text-[#4ade80]" />
                <span className="text-sm text-zinc-400">{x}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y border-t border-white/[0.06] bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-center text-2xl font-semibold text-white">
            Tier comparison
          </h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {portal.tierComparison.map((row) => (
              <div
                key={row.dimension}
                className="glass-panel glass-panel-hover p-6 md:p-8"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-[#4ade80]">
                  {row.dimension}
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold text-zinc-500">
                      Tier 1 &amp; 2
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">{row.tier12}</p>
                  </div>
                  <div className="rounded-xl border border-[#00A651]/20 bg-[#00A651]/[0.06] p-4">
                    <p className="text-xs font-semibold text-[#4ade80]">
                      Tier 3 &amp; 4
                    </p>
                    <p className="mt-1 text-sm text-zinc-200">{row.tier34}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-center text-2xl font-semibold text-white">
            Portal surfaces
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[
              {
                src: "/images/portal-screenshot-1.png",
                alt: "Fortis Edge portal dashboard screenshot one",
              },
              {
                src: "/images/portal-screenshot-2.png",
                alt: "Fortis Edge portal dashboard screenshot two",
              },
            ].map((s) => (
              <PortalScreenshotFrame key={s.src} src={s.src} alt={s.alt} />
            ))}
          </div>
          <h3 className="mt-12 text-lg font-semibold text-white">Architecture</h3>
          <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-2xl border border-white/[0.08] glass-panel">
            <Image
              src="/images/system-architecture.png"
              alt="System architecture diagram for the Fortis Edge portal"
              fill
              className="object-contain p-4 md:p-8"
            />
          </div>
        </div>
      </section>

      <section className="section-y border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="text-center text-2xl font-semibold text-white">
            Roadmap
          </h2>
          <div className="mt-8 space-y-3">
            {portal.roadmapPhases.map((p, i) => (
              <div
                key={p.phase}
                className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex((prev) => (prev === i ? null : i))
                  }
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-white/[0.04]"
                >
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#4ade80]">
                      {p.phase}
                    </p>
                    <p className="text-sm text-zinc-500">{p.window}</p>
                  </div>
                  <ChevronDown
                    className={cn(
                      "size-5 shrink-0 text-zinc-500 transition",
                      openIndex === i && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-white/[0.06]"
                    >
                      <ul className="space-y-2 px-5 py-4 text-sm text-zinc-400">
                        {p.highlights.map((h) => (
                          <li key={h} className="flex gap-2">
                            <span className="text-[#00A651]">·</span>
                            {h}
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <h3 className="mt-12 text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Integrations
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {portal.integrations.map((i) => (
              <div
                key={i.system}
                className="glass-panel p-5 transition hover:border-[#00A651]/20"
              >
                <p className="font-semibold text-zinc-200">{i.system}</p>
                <p className="mt-1 text-xs font-medium text-[#4ade80]">
                  {i.status}
                </p>
                <p className="mt-2 text-sm text-zinc-500">{i.notes}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              href="/timeline-roadmap"
              className={cn(
                buttonVariants({ size: "lg" }),
                "border-0 bg-[#00A651] text-white shadow-lg shadow-[#00A651]/20",
              )}
            >
              Timeline
              <ArrowRight className="ml-2 size-4" />
            </Link>
            <Link
              href="/faq"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "border-white/10 bg-white/[0.04] text-zinc-100",
              )}
            >
              FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
