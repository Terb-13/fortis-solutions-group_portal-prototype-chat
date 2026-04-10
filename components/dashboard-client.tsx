"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  loadConversations,
  updateConversation,
  type ConversationRecord,
} from "@/lib/chat-storage";
import {
  addCustomFaq,
  buildPublicFaqsExport,
  getAllFaqsForAdmin,
  getBaselineFaqs,
  updateBaselineFaq,
  updateCustomFaq,
} from "@/lib/faq-store";
import { FORTIS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type ReviewResult = {
  improvedBotResponse: string;
  faqRecommendation: {
    action: "new" | "edit";
    targetFaqId?: string;
    question: string;
    answer: string;
    rationale?: string;
  };
};

export function DashboardClient() {
  const router = useRouter();
  const [rows, setRows] = useState<ConversationRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [correctionNote, setCorrectionNote] = useState("");
  const [reviewBusy, setReviewBusy] = useState(false);
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [newFaqVisible, setNewFaqVisible] = useState(true);
  const [updateFaqId, setUpdateFaqId] = useState<string>("");
  const [saveBusy, setSaveBusy] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [faqTick, setFaqTick] = useState(0);

  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkResult, setBulkResult] = useState<string | null>(null);
  const [bulkError, setBulkError] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setRows(loadConversations());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const selected = useMemo(
    () => rows.find((r) => r.id === selectedId) ?? null,
    [rows, selectedId],
  );

  const selectedAssistantMessage = useMemo(() => {
    if (!selected || !selectedMessageId) return null;
    return selected.messages.find(
      (m) => m.id === selectedMessageId && m.role === "assistant",
    );
  }, [selected, selectedMessageId]);

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

  async function runBulkAnalyze() {
    setBulkBusy(true);
    setBulkError(null);
    setBulkResult(null);
    try {
      const res = await fetch("/api/dashboard/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      const data = (await res.json()) as {
        faqs?: { question: string; answer: string }[];
        raw?: string;
        error?: string;
      };
      if (!res.ok) {
        setBulkError(data.error ?? "Analysis failed.");
        return;
      }
      if (data.faqs?.length) {
        for (const f of data.faqs) {
          addCustomFaq({ question: f.question, answer: f.answer, visible: true });
        }
        setBulkResult(`Added ${data.faqs.length} FAQ(s) to the store (visible).`);
        setFaqTick((x) => x + 1);
        refresh();
        return;
      }
      if (data.raw) setBulkResult(data.raw);
    } catch {
      setBulkError("Network error.");
    } finally {
      setBulkBusy(false);
    }
  }

  async function runReview() {
    if (!selectedAssistantMessage) return;
    setReviewBusy(true);
    setReviewError(null);
    setReviewResult(null);
    try {
      const excerpt = selected?.messages
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n");
      const res = await fetch("/api/dashboard/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          botMessage: selectedAssistantMessage.content,
          correctionNote,
          conversationExcerpt: excerpt,
        }),
      });
      const data = (await res.json()) as {
        result?: ReviewResult;
        error?: string;
      };
      if (!res.ok) {
        setReviewError(data.error ?? "Review failed.");
        return;
      }
        if (data.result) {
        setReviewResult(data.result);
        if (selectedId && selectedMessageId) {
          const prev = selected?.flags ?? [];
          const nextFlags = [
            ...prev.filter((f) => f.messageId !== selectedMessageId),
            {
              messageId: selectedMessageId,
              correctionNote,
              createdAt: new Date().toISOString(),
            },
          ];
          updateConversation(selectedId, {
            status: "needs_review",
            flags: nextFlags,
          });
          refresh();
        }
      }
    } catch {
      setReviewError("Network error.");
    } finally {
      setReviewBusy(false);
    }
  }

  function applyCreateFaq() {
    if (!reviewResult) return;
    const r = reviewResult.faqRecommendation;
    addCustomFaq({
      question: r.question,
      answer: r.answer,
      visible: newFaqVisible,
    });
    setSaveMsg("FAQ added to store (local).");
    setFaqTick((x) => x + 1);
    refresh();
  }

  function applyUpdateFaq() {
    if (!reviewResult || !updateFaqId) return;
    const r = reviewResult.faqRecommendation;
    const baseIds = new Set(getBaselineFaqs().map((x) => x.id));
    if (baseIds.has(updateFaqId)) {
      updateBaselineFaq(updateFaqId, { question: r.question, answer: r.answer });
    } else {
      updateCustomFaq(updateFaqId, {
        question: r.question,
        answer: r.answer,
      });
    }
    setSaveMsg("FAQ updated in store (local).");
    setFaqTick((x) => x + 1);
    refresh();
  }

  async function saveJsonFile() {
    setSaveBusy(true);
    setSaveMsg(null);
    try {
      const faqs = buildPublicFaqsExport();
      const res = await fetch("/api/faqs/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ faqs }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        wroteFile?: boolean;
        download?: string;
        message?: string;
      };
      if (data.download && !data.wroteFile) {
        const blob = new Blob([data.download], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "faqs.json";
        a.click();
        URL.revokeObjectURL(url);
      }
      setSaveMsg(
        data.wroteFile
          ? "Saved data/faqs.json (dev or ALLOW_FAQ_FILE_WRITE)."
          : data.message ?? "Downloaded faqs.json.",
      );
    } catch {
      setSaveMsg("Save request failed.");
    } finally {
      setSaveBusy(false);
    }
  }

  const adminFaqs = useMemo(() => {
    void faqTick;
    return getAllFaqsForAdmin();
  }, [faqTick]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/dashboard/login");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-border/80 bg-card p-6 shadow-card md:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#00A651]">
            Team
          </p>
          <h1 className="mt-1 font-heading text-2xl font-semibold text-[#003087] md:text-3xl">
            Conversations &amp; FAQ builder
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            {FORTIS.productName} — stored in-browser. Export merges public FAQs;
            dev can write <code className="text-xs">data/faqs.json</code>.
          </p>
        </div>
        <Button variant="outline" onClick={() => void logout()}>
          Sign out
        </Button>
      </div>

      <Separator className="my-10" />

      <div className="space-y-3 rounded-2xl border border-dashed border-[#003087]/20 bg-[#003087]/[0.03] p-5 md:p-6">
        <p className="text-sm font-medium text-foreground">Bulk transcript</p>
        <p className="text-xs text-muted-foreground">
          Analyze all saved conversations and add suggested FAQs (visible).
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            className="bg-[#00A651] text-white hover:bg-[#00A651]/90"
            disabled={bulkBusy || !transcript.trim()}
            onClick={() => void runBulkAnalyze()}
          >
            {bulkBusy ? "Analyzing…" : "Analyze with Grok (bulk)"}
          </Button>
        </div>
        {bulkError && <p className="text-sm text-destructive">{bulkError}</p>}
        {bulkResult && (
          <Textarea readOnly rows={6} className="text-xs" value={bulkResult} />
        )}
      </div>

      <Separator className="my-10" />

      {!selectedId ? (
        <div>
          <h2 className="font-heading text-lg font-semibold text-[#003087]">
            Conversations
          </h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-border/80 shadow-card">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-[#003087] text-white">
                <tr>
                  <th className="p-3 font-semibold">Updated</th>
                  <th className="p-3 font-semibold">Preview</th>
                  <th className="p-3 font-semibold">Status</th>
                  <th className="p-3 font-semibold">Messages</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-6 text-muted-foreground">
                      No conversations yet. Use the Assistant, then refresh.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr
                      key={r.id}
                      className="cursor-pointer transition hover:bg-muted/50"
                      onClick={() => {
                        setSelectedId(r.id);
                        setSelectedMessageId(null);
                      }}
                    >
                      <td className="p-3 whitespace-nowrap text-xs text-muted-foreground">
                        {new Date(r.updatedAt).toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span className="line-clamp-2 font-medium">
                          {r.title}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            r.status === "needs_review"
                              ? "bg-amber-100 text-amber-900"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {r.status}
                          {(r.flags?.length ?? 0) > 0 ? " · flagged" : ""}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {r.messages.length}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Button
            type="button"
            variant="ghost"
            className="px-0"
            onClick={() => {
              setSelectedId(null);
              setSelectedMessageId(null);
              setSheetOpen(false);
            }}
          >
            ← Back to list
          </Button>
          <h2 className="font-heading text-lg font-semibold text-[#003087]">
            Thread
          </h2>
          <ScrollArea className="h-[min(520px,60vh)] rounded-2xl border border-border/80 bg-card p-4 shadow-inner">
            <div className="space-y-3 pr-4">
              {selected?.messages.map((m) =>
                m.role === "assistant" ? (
                  <button
                    key={m.id}
                    type="button"
                    className={cn(
                      "w-full rounded-lg border border-border bg-card px-3 py-2 text-left text-sm transition-colors hover:border-[#003087]/40",
                      selectedMessageId === m.id ? "ring-2 ring-[#003087]" : "",
                    )}
                    onClick={() => setSelectedMessageId(m.id)}
                  >
                    <span className="text-xs font-semibold uppercase text-muted-foreground">
                      assistant
                    </span>
                    <p className="mt-1 whitespace-pre-wrap">{m.content}</p>
                  </button>
                ) : (
                  <div
                    key={m.id}
                    className="rounded-lg border border-transparent bg-muted/50 px-3 py-2 text-sm"
                  >
                    <span className="text-xs font-semibold uppercase text-muted-foreground">
                      user
                    </span>
                    <p className="mt-1 whitespace-pre-wrap">{m.content}</p>
                  </div>
                ),
              )}
            </div>
          </ScrollArea>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={!selectedAssistantMessage}
              onClick={() => setSheetOpen(true)}
            >
              Flag for review
            </Button>
          </div>
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="flex w-full flex-col gap-4 overflow-y-auto border-l-[#003087]/10 sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="font-heading text-[#003087]">
              Flag for review
            </SheetTitle>
            <SheetDescription>
              Add a correction note, run Grok to propose an improved reply and
              FAQ update, then apply actions.
            </SheetDescription>
          </SheetHeader>
          {selectedAssistantMessage && (
            <div className="rounded-lg border bg-muted/40 p-3 text-xs">
              <p className="font-semibold text-foreground">Selected</p>
              <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
                {selectedAssistantMessage.content}
              </p>
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="correction">Correction note</Label>
            <Textarea
              id="correction"
              rows={4}
              value={correctionNote}
              onChange={(e) => setCorrectionNote(e.target.value)}
              placeholder="What should the bot have said instead?"
            />
          </div>
          <Button
            type="button"
            className="bg-[#003087] text-white hover:bg-[#003087]/90"
            disabled={reviewBusy || !selectedAssistantMessage}
            onClick={() => void runReview()}
          >
            {reviewBusy ? "Analyzing…" : "Analyze with Grok"}
          </Button>
          {reviewError && (
            <p className="text-sm text-destructive">{reviewError}</p>
          )}
          {reviewResult && (
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-foreground">
                  Improved bot response
                </p>
                <Textarea
                  readOnly
                  rows={6}
                  className="mt-1 text-xs"
                  value={reviewResult.improvedBotResponse}
                />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  FAQ recommendation (JSON)
                </p>
                <Textarea
                  readOnly
                  rows={8}
                  className="mt-1 font-mono text-xs"
                  value={JSON.stringify(reviewResult.faqRecommendation, null, 2)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border/80 bg-muted/30 px-3 py-2">
                <span className="text-xs text-muted-foreground">Hidden</span>
                <Switch
                  checked={newFaqVisible}
                  onCheckedChange={setNewFaqVisible}
                  aria-label="Toggle FAQ visibility on public site"
                />
                <span className="text-xs font-medium text-foreground">
                  Visible on site
                </span>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="faqid">Update existing FAQ (optional)</Label>
                <select
                  id="faqid"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  value={updateFaqId}
                  onChange={(e) => setUpdateFaqId(e.target.value)}
                >
                  <option value="">— Select —</option>
                  {adminFaqs.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.question.slice(0, 72)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="secondary" onClick={applyCreateFaq}>
                  Create new FAQ
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={!updateFaqId}
                  onClick={applyUpdateFaq}
                >
                  Update existing FAQ
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Separator className="my-10" />

      <div className="space-y-3">
        <h2 className="font-heading text-lg font-semibold text-[#003087]">
          Save merged FAQs to JSON
        </h2>
        <p className="text-sm text-muted-foreground">
          Writes public-visible FAQs to data/faqs.json in development (or when
          ALLOW_FAQ_FILE_WRITE=true). Otherwise downloads a file.
        </p>
        <Button
          type="button"
          disabled={saveBusy}
          onClick={() => void saveJsonFile()}
        >
          {saveBusy ? "Saving…" : "Save changes (export / write file)"}
        </Button>
        {saveMsg && <p className="text-sm text-muted-foreground">{saveMsg}</p>}
      </div>
    </div>
  );
}
