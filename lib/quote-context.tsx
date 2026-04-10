"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Product } from "@/lib/products";

export type QuoteLine = {
  productId: string;
  name: string;
  qty: number;
  notes?: string;
};

type QuoteContextValue = {
  lines: QuoteLine[];
  addProduct: (product: Product, qty?: number) => void;
  removeLine: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clear: () => void;
};

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<QuoteLine[]>([]);

  const addProduct = useCallback((product: Product, qty = 1) => {
    setLines((prev) => {
      const hit = prev.find((l) => l.productId === product.id);
      if (hit) {
        return prev.map((l) =>
          l.productId === product.id
            ? { ...l, qty: l.qty + qty }
            : l,
        );
      }
      return [
        ...prev,
        { productId: product.id, name: product.name, qty, notes: "" },
      ];
    });
  }, []);

  const removeLine = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const updateQty = useCallback((productId: string, qty: number) => {
    setLines((prev) =>
      prev.map((l) =>
        l.productId === productId ? { ...l, qty: Math.max(1, qty) } : l,
      ),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({ lines, addProduct, removeLine, updateQty, clear }),
    [lines, addProduct, removeLine, updateQty, clear],
  );

  return (
    <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>
  );
}

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used within QuoteProvider");
  return ctx;
}
