"use client";

import { pdf } from "@react-pdf/renderer";
import { useState } from "react";
import { FortisEdgeBriefPdfDocument } from "@/components/fortis-edge-pdf-document";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FORTIS } from "@/lib/constants";

export default function ResourcesBriefPage() {
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [busy, setBusy] = useState(false);

  async function download() {
    setBusy(true);
    try {
      const generatedAt = new Date().toLocaleString();
      const blob = await pdf(
        <FortisEdgeBriefPdfDocument
          name={name}
          org={org}
          generatedAt={generatedAt}
        />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Fortis-Edge-Brief.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12 md:px-6">
      <h1 className="font-heading text-3xl font-semibold text-[#003087]">
        Resources — PDF brief
      </h1>
      <p className="mt-4 text-muted-foreground">
        Download a branded {FORTIS.productName} stakeholder brief generated with{" "}
        @react-pdf/renderer (optional name / organization on the cover).
      </p>
      <div className="mt-8 space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name (optional)</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="org">Organization (optional)</Label>
          <Input id="org" value={org} onChange={(e) => setOrg(e.target.value)} />
        </div>
        <Button
          type="button"
          className="w-full bg-[#003087] text-white hover:bg-[#003087]/90"
          disabled={busy}
          onClick={() => void download()}
        >
          {busy ? "Building PDF…" : "Download PDF brief"}
        </Button>
      </div>
    </div>
  );
}
