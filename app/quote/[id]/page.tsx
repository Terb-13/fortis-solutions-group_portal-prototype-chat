import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { QuoteDocument } from "@/components/quote/QuoteDocument";
import { QuoteConfigurationError, QuoteFetchError } from "@/components/quote/QuoteStates";
import { loadEstimateForQuote } from "@/lib/quote/load-estimate";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { absolute: "Your quote | Fortis Solutions Group" },
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function QuotePage({ params }: PageProps) {
  const { id } = await params;
  const result = await loadEstimateForQuote(id);

  if (result.ok) {
    return <QuoteDocument quote={result.quote} />;
  }
  if (result.reason === "not-configured") {
    return <QuoteConfigurationError />;
  }
  if (result.reason === "fetch-error") {
    return <QuoteFetchError />;
  }
  notFound();
}
