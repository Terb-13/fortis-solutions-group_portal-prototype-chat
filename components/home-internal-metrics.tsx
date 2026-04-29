"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { loadConversations } from "@/lib/chat-storage";
import { getPublishedHiddenCounts } from "@/lib/faq-store";
import { AnimatedNumber } from "@/components/animated-number";

type Metrics = {
  totalConversations: number;
  corrections: number;
  published: number;
  hidden: number;
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

function MetricBlock({
  label,
  value,
  sub,
  progress,
}: {
  label: string;
  value: ReactNode;
  sub: string;
  progress?: number;
}) {
  return (
    <motion.div
      variants={item}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="glass-panel glass-panel-hover group relative flex flex-col overflow-hidden p-5 md:p-6"
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <div className="mt-2 font-mono text-3xl font-semibold tabular-nums text-white md:text-4xl">
        {value}
      </div>
      <p className="mt-1 text-xs text-zinc-500">{sub}</p>
      {progress != null && (
        <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#00A651] to-[#34d399]"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      )}
    </motion.div>
  );
}

export function HomeInternalMetrics() {
  const [m, setM] = useState<Metrics | null>(null);

  useEffect(() => {
    const rows = loadConversations();
    const corrections = rows.reduce((s, r) => s + (r.flags?.length ?? 0), 0);
    const { published, hidden } = getPublishedHiddenCounts();
    setM({
      totalConversations: rows.length,
      corrections,
      published,
      hidden,
    });
  }, []);

  const total = m ? m.published + m.hidden : 0;
  const publishedPct = total > 0 ? (m!.published / total) * 100 : 0;

  return (
    <motion.div
      className="mt-10 grid gap-4 sm:grid-cols-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <MetricBlock
        label="Total conversations"
        value={
          m != null ? (
            <AnimatedNumber value={m.totalConversations} />
          ) : (
            "—"
          )
        }
        sub="Local assistant threads in this browser"
      />
      <MetricBlock
        label="Corrections logged"
        value={
          m != null ? (
            <AnimatedNumber value={m.corrections} />
          ) : (
            "—"
          )
        }
        sub="Flags on assistant messages"
      />
      <MetricBlock
        label="FAQs: published / hidden"
        value={
          m != null ? (
            <>
              <AnimatedNumber value={m.published} />
              <span className="text-zinc-600"> / </span>
              <AnimatedNumber value={m.hidden} />
            </>
          ) : (
            "— / —"
          )
        }
        sub="Visible on site vs draft"
        progress={m != null ? publishedPct : undefined}
      />
    </motion.div>
  );
}
