import Link from "next/link";
import { ProductExplorerClient } from "@/components/product-explorer-client";
import { getProducts } from "@/lib/products";
import { FORTIS } from "@/lib/constants";

export const metadata = {
  title: `Product Explorer | ${FORTIS.productName}`,
  description:
    "Interactive selector for Fortis pressure-sensitive labels, RFID, booklets, shrink sleeves, flexible packaging, and folding cartons.",
};

export default function ExplorerPage() {
  const products = getProducts();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <div className="mb-10 max-w-3xl space-y-3">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-[#003087] md:text-4xl">
          Packaging solutions explorer
        </h1>
        <p className="text-muted-foreground">
          Select a format to review specifications and RENEW™ indicators—clear
          product detail for stakeholder-ready conversations.
        </p>
      </div>
      <ProductExplorerClient products={products} />
      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-dashed border-border bg-muted/30 p-6">
        <div>
          <p className="font-medium text-foreground">Ready to move forward?</p>
          <p className="text-sm text-muted-foreground">
            Use the customer portal for next steps, or download the Edge brief.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/customer-portal"
            className="text-sm font-semibold text-[#003087] underline-offset-4 hover:underline"
          >
            Customer portal →
          </Link>
          <Link
            href="/resources/brief"
            className="text-sm font-semibold text-[#003087] underline-offset-4 hover:underline"
          >
            Edge brief PDF →
          </Link>
        </div>
      </div>
    </div>
  );
}
