"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  appendCustomFaqs,
  loadConversations,
  loadCustomFaqs,
  type ConversationRecord,
} from "@/lib/chat-storage";
import { FORTIS } from "@/lib/constants";

export default function DashboardPage() {
  const router = useRouter();
  const [rows, setRows] = useState<ConversationRecord[]>([]);
  const [customFaqs, setCustomFaqs] = useState(loadCustomFaqs());
  const [analyzeBusy, setAnalyzeBusy] = useState(false);
  const [analyzeResult, setAnalyzeResult] = useState<string | null>(null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  useEffect(() => {
    setRows(loadConversations());
    setCustomFaqs(loadCustomFaqs());
  }, []);

  function refresh() {
    setRows(loadConversations());
    setCustomFaqs(loadCustomFaqs());
  }

  const transcript = useMemo(() => {
    return rows
      .map((r) => {
        const body = r.messages
          .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
          .join("\n");
        return `--- ${r.title} ---\n${body}`;
      })
      .join("\n\n");
  }, [rows]);

  async function analyze() {
    setAnalyzeBusy(true);
    setAnalyzeError(null);
    setAnalyzeResult(null);
    try {
      const res = await fetch("/api/dashboard/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      const data = (await res.json()) as {
        faqs?: { question: string; answer: string }[];
        raw?: string;
        parseError?: boolean;
        error?: string;
      };
      if (!res.ok) {
        setAnalyzeError(data.error ?? "Analysis failed.");
        return;
      }
      if (data.faqs?.length) {
        const text = JSON.stringify({ faqs: data.faqs }, null, 2);
        setAnalyzeResult(text);
        appendCustomFaqs(data.faqs);
        refresh();
        return;
      }
      if (data.raw) {
        setAnalyzeResult(data.raw);
        return;
      }
      setAnalyzeError("No FAQ output returned.");
    } catch {
      setAnalyzeError("Network error.");
    } finally {
      setAnalyzeBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/dashboard/login");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-[#003087]">
            Fortis Edge demo dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Conversation history from the Fortis Edge Assistant (stored locally
            in this browser) and Grok-powered FAQ drafting.
          </p>
        </div>
        <Button variant="outline" onClick={() => void logout()}>
          Sign out
        </Button>
      </div>

      <Separator className="my-8" />

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            onClick={() => void analyze()}
            disabled={analyzeBusy || !transcript.trim()}
            className="bg-[#00A651] text-white hover:bg-[#00A651]/90"
          >
            {analyzeBusy ? "Analyzing…" : "Analyze with Grok & Create New FAQ"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => refresh()}>
            Refresh history
          </Button>
        </div>
        {analyzeError && (
          <p className="text-sm text-destructive">{analyzeError}</p>
        )}
        {analyzeResult && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Grok output</p>
            <Textarea readOnly rows={12} value={analyzeResult} />
          </div>
        )}
      </div>

      <Separator className="my-8" />

      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="font-heading text-lg font-semibold text-[#003087]">
            Conversations
          </h2>
          <ScrollArea className="mt-4 h-[min(420px,50vh)] rounded-xl border border-border p-4">
            {rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No saved conversations yet. Chat with the Fortis Edge Assistant,
                then return here—history updates after each assistant reply
                completes.
              </p>
            ) : (
              <ul className="space-y-6">
                {rows.map((r) => (
                  <li key={r.id}>
                    <p className="text-sm font-semibold">{r.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(r.updatedAt).toLocaleString()}
                    </p>
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      {r.messages.slice(-6).map((m) => (
                        <li key={m.id}>
                          <span className="font-medium text-foreground">
                            {m.role}:
                          </span>{" "}
                          {m.content.slice(0, 240)}
                          {m.content.length > 240 ? "…" : ""}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </div>
        <div>
          <h2 className="font-heading text-lg font-semibold text-[#003087]">
            Custom FAQs (this browser)
          </h2>
          <ScrollArea className="mt-4 h-[min(420px,50vh)] rounded-xl border border-border p-4">
            {customFaqs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Generated FAQs from Grok analysis will appear here for quick
                reference—alongside the baseline FAQs bundled with {FORTIS.productName}.
              </p>
            ) : (
              <ul className="space-y-4">
                {customFaqs.map((f) => (
                  <li key={f.id}>
                    <p className="text-sm font-semibold">{f.question}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {f.answer}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
