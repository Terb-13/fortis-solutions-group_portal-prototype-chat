"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import type { FaqItem } from "@/lib/faqs";

export function FaqSearch({ items }: { items: FaqItem[] }) {
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
    <div>
      <div className="mx-auto max-w-xl">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search questions, answers, or categories…"
          className="h-11"
        />
      </div>
      <p className="mt-3 text-center text-sm text-muted-foreground">
        Showing {filtered.length} of {items.length} entries
      </p>
      <ul className="mt-10 space-y-4">
        {filtered.map((f) => (
          <li
            key={f.id}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-[#F5A623]">
              {f.category}
            </p>
            <h2 className="mt-2 font-heading text-lg font-semibold text-[#003087]">
              {f.question}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {f.answer}
            </p>
          </li>
        ))}
      </ul>
      {filtered.length === 0 && (
        <p className="mt-8 text-center text-muted-foreground">
          No matches—try a shorter keyword.
        </p>
      )}
    </div>
  );
}
