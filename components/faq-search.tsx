"use client";

import { useMemo, useState } from "react";
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
      <div className="relative mx-auto max-w-xl">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search FAQs…"
          className="h-12 rounded-xl border-border/80 bg-card pl-11 shadow-sm"
        />
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
        <span>
          {filtered.length} of {items.length}
        </span>
        {onRefresh && (
          <button
            type="button"
            className="font-medium text-[#00A651] underline-offset-4 hover:underline"
            onClick={() => onRefresh()}
          >
            Refresh
          </button>
        )}
      </div>

      <Accordion
        multiple={false}
        defaultValue={[]}
        className="mx-auto max-w-3xl divide-y divide-border rounded-2xl border border-border/80 bg-card shadow-card"
      >
        {filtered.map((f) => (
          <AccordionItem key={f.id} value={f.id} className="border-0 px-1">
            <AccordionTrigger className="px-5 py-5 text-left hover:no-underline">
              <span className="flex flex-col gap-1 text-left">
                <span className="text-xs font-bold uppercase tracking-wide text-[#00A651]">
                  {f.category}
                </span>
                <span className="font-heading text-base font-semibold text-[#003087] md:text-lg">
                  {f.question}
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5 pt-0 text-muted-foreground">
              {f.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground">
          No matches—try another keyword.
        </p>
      )}
    </div>
  );
}
