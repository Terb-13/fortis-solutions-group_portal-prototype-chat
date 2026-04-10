"use client";

import Link from "next/link";
import { pdf } from "@react-pdf/renderer";
import { useMemo, useState } from "react";
import { FortisProposalPdfDocument } from "@/components/proposal-pdf-document";
import type { ProposalPdfInput } from "@/components/proposal-pdf-document";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuote } from "@/lib/quote-context";
import { cn } from "@/lib/utils";

export default function ProposalPage() {
  const { lines, removeLine, updateQty } = useQuote();
  const [company, setCompany] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectName, setProjectName] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const data: ProposalPdfInput = useMemo(
    () => ({
      company,
      contact,
      email,
      phone,
      projectName,
      notes,
      lines: lines.map((l) => ({
        name: l.name,
        qty: l.qty,
        notes: l.notes,
      })),
    }),
    [company, contact, email, phone, projectName, notes, lines],
  );

  async function downloadPdf() {
    setBusy(true);
    try {
      const generatedAt = new Date().toLocaleString();
      const blob = await pdf(
        <FortisProposalPdfDocument data={data} generatedAt={generatedAt} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Fortis-Packaging-Proposal-V1.pdf";
      a.click();
      URL.revokeObjectURL(url);
      window.location.href = "/thank-you";
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <div className="mb-8 space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-[#003087]">
          Fortis Packaging Proposal V.1
        </h1>
        <p className="text-muted-foreground">
          Complete the form to download a branded PDF. Applicator programs
          (Gold Seal &amp; CTM) and RENEW™ sustainability can be referenced with
          your Fortis team during program definition.
        </p>
      </div>

      {lines.length > 0 && (
        <div className="mb-8 rounded-xl border border-border bg-muted/30 p-4">
          <p className="text-sm font-semibold text-foreground">Quote lines</p>
          <ul className="mt-3 space-y-3">
            {lines.map((l) => (
              <li
                key={l.productId}
                className="flex flex-wrap items-center gap-3 text-sm"
              >
                <span className="flex-1 font-medium">{l.name}</span>
                <label className="flex items-center gap-2">
                  <span className="text-muted-foreground">Qty</span>
                  <Input
                    type="number"
                    min={1}
                    className="h-9 w-20"
                    value={l.qty}
                    onChange={(e) =>
                      updateQty(l.productId, Number(e.target.value) || 1)
                    }
                  />
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLine(l.productId)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
          <Link
            href="/explorer"
            className={cn(
              buttonVariants({ variant: "link" }),
              "mt-2 h-auto px-0",
            )}
          >
            Add more from explorer →
          </Link>
        </div>
      )}

      <div className="space-y-5">
        <div className="grid gap-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Brand or legal entity"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="contact">Contact name</Label>
          <Input
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
        <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="project">Project name</Label>
          <Input
            id="project"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="SKU, launch, or program name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="notes">Notes for Fortis</Label>
          <Textarea
            id="notes"
            rows={5}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Volumes, substrates, decoration, sustainability targets, applicator needs…"
          />
        </div>
        <Button
          type="button"
          size="lg"
          disabled={busy}
          className="w-full bg-[#003087] text-white hover:bg-[#003087]/90"
          onClick={() => void downloadPdf()}
        >
          {busy ? "Building PDF…" : "Download PDF & continue"}
        </Button>
      </div>
    </div>
  );
}
