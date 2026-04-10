"use client";

import { useEffect, useState } from "react";
import { FaqSearch } from "@/components/faq-search";
import { getPublicFaqs } from "@/lib/faq-store";
import type { FaqItem } from "@/lib/faqs";

export function FaqPageClient() {
  const [items, setItems] = useState<FaqItem[]>([]);

  useEffect(() => {
    setItems(getPublicFaqs());
  }, []);

  return (
    <FaqSearch
      items={items}
      onRefresh={() => setItems(getPublicFaqs())}
    />
  );
}
