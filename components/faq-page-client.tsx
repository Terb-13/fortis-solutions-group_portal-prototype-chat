"use client";

import { useEffect, useState } from "react";
import { FaqSearch } from "@/components/faq-search";
import { getPublicFaqs } from "@/lib/faq-store";
import type { FaqItem } from "@/lib/faqs";

function mergeFaqs(remote: FaqItem[], local: FaqItem[]): FaqItem[] {
  const seen = new Set(remote.map((x) => x.id));
  const out = [...remote];
  for (const item of local) {
    if (!seen.has(item.id)) {
      out.push(item);
    }
  }
  return out;
}

export function FaqPageClient() {
  const [items, setItems] = useState<FaqItem[]>([]);

  useEffect(() => {
    const local = getPublicFaqs();
    void fetch("/api/public/faqs")
      .then((r) => r.json() as Promise<{ items?: FaqItem[] }>)
      .then((data) => {
        const remote = data.items ?? [];
        setItems(mergeFaqs(remote, local));
      })
      .catch(() => setItems(local));
  }, []);

  return (
    <FaqSearch
      items={items}
      onRefresh={() => {
        const local = getPublicFaqs();
        void fetch("/api/public/faqs")
          .then((r) => r.json() as Promise<{ items?: FaqItem[] }>)
          .then((data) => {
            const remote = data.items ?? [];
            setItems(mergeFaqs(remote, local));
          })
          .catch(() => setItems(local));
      }}
    />
  );
}
