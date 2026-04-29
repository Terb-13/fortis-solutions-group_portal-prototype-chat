"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import type { FaqItem } from "@/lib/faqs";

export function FaqSearch({
  items,
  onRefresh,
}: {
  items: FaqItem[];
  onRefresh?: () => void;
}) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(
      (f) =>
        f.question.toLowerCase().includes(s) ||
        f.answer.toLowerCase().includes(s) ||
        f.category.toLowerCase().includes(s),
    );
  }, [items, q]);

  return (
    <div className="space-y-8">
      <motion.div
        className="relative mx-auto max-w-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-zinc-500"
          aria-hidden
        />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search FAQs instantly…"
          className="h-12 rounded-xl border-white/10 bg-white/[0.04] pl-11 text-zinc-100 placeholder:text-zinc-600 shadow-inner"
        />
      </motion.div>
      <motion.div
        className="flex flex-wrap items-center justify-center gap-3 text-sm text-zinc-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <span>
          {filtered.length} of {items.length}
        </span>
        {onRefresh && (
          <button
            type="button"
            className="font-medium text-[#4ade80] underline-offset-4 hover:underline"
            onClick={() => onRefresh()}
          >
            Refresh
          </button>
        )}
      </motion.div>

      <motion.div
        key={q.trim() || "__all__"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.22 }}
      >
        <Accordion
          multiple={false}
          defaultValue={[]}
          className="mx-auto max-w-3xl divide-y divide-white/[0.06] overflow-hidden rounded-2xl border border-white/[0.08] glass-panel"
        >
          {filtered.map((f, i) => (
            <AccordionItem
              key={f.id}
              value={f.id}
              className="border-0 px-1 animate-fade-up [animation-fill-mode:both]"
              style={{
                animationDelay: `${Math.min(i * 45, 360)}ms`,
              }}
            >
              <AccordionTrigger className="px-5 py-5 text-left hover:no-underline">
                <span className="flex flex-col gap-1 text-left">
                  <span className="text-xs font-bold uppercase tracking-wide text-[#4ade80]">
                    {f.category}
                  </span>
                  <span className="text-base font-semibold text-zinc-100 md:text-lg">
                    {f.question}
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5 pt-0 text-zinc-400">
                {f.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>

      {filtered.length === 0 && (
        <p className="text-center text-zinc-500">
          No matches—try another keyword.
        </p>
      )}
    </div>
  );
}
