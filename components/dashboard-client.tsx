"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
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
  getPublishedHiddenCounts,
  loadFaqStore,
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
  const [newFaqPublished, setNewFaqPublished] = useState(true);
  const [updateFaqId, setUpdateFaqId] = useState<string>("");
  const [saveBusy, setSaveBusy] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [faqTick, setFaqTick] = useState(0);

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

  const metrics = useMemo(() => {
    void faqTick;
    const totalConversations = rows.length;
    const correctionsTotal = rows.reduce(
      (sum, r) => sum + (r.flags?.length ?? 0),
      0,
    );
    const { published, hidden } = getPublishedHiddenCounts();
    const faqsAdded = loadFaqStore().customFaqs.length;
    return {
      totalConversations,
      correctionsTotal,
      faqsAdded,
      published,
      hidden,
    };
  }, [rows, faqTick]);

  function openFlagPanel(messageId: string) {
    setSelectedMessageId(messageId);
    setCorrectionNote("");
    setReviewResult(null);
    setReviewError(null);
    setSheetOpen(true);
  }

  function handleSheetOpenChange(open: boolean) {
    setSheetOpen(open);
    if (!open) {
      setReviewResult(null);
      setReviewError(null);
      setCorrectionNote("");
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
          setFaqTick((x) => x + 1);
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
      visible: newFaqPublished,
    });
    setSaveMsg("New FAQ saved to local store.");
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
    setSaveMsg("FAQ update saved to local store.");
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

  const faq = reviewResult?.faqRecommendation;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-14">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-border/80 bg-card p-6 shadow-card md:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#00A651]">
            Team
          </p>
          <h1 className="mt-1 font-heading text-2xl font-semibold text-[#003087] md:text-3xl">
            Dashboard
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            {FORTIS.productName} — conversations and FAQs stay in your browser;
            export when you are ready.
          </p>
        </div>
        <Button variant="outline" onClick={() => void logout()}>
          Sign out
        </Button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card className="border-border/80 shadow-card">
          <CardHeader className="pb-2">
            <CardDescription>Total conversations</CardDescription>
            <CardTitle className="font-heading text-3xl tabular-nums text-[#003087]">
              {metrics.totalConversations}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Stored assistant threads
          </CardContent>
        </Card>
        <Card className="border-border/80 shadow-card">
          <CardHeader className="pb-2">
            <CardDescription>Corrections / FAQs added</CardDescription>
            <CardTitle className="font-heading text-3xl tabular-nums text-[#003087]">
              {metrics.correctionsTotal}{" "}
              <span className="text-lg font-normal text-muted-foreground">
                / {metrics.faqsAdded}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Flags · custom FAQs in store
          </CardContent>
        </Card>
        <Card className="border-border/80 shadow-card">
          <CardHeader className="pb-2">
            <CardDescription>Published vs hidden FAQs</CardDescription>
            <CardTitle className="font-heading text-3xl tabular-nums text-[#003087]">
              {metrics.published}{" "}
              <span className="text-muted-foreground">/</span>{" "}
              {metrics.hidden}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            On site · draft / hidden
          </CardContent>
        </Card>
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
                      No conversations yet. Use the site assistant, then refresh.
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
            <div className="space-y-4 pr-4">
              {selected?.messages.map((m) =>
                m.role === "assistant" ? (
                  <div
                    key={m.id}
                    className="rounded-lg border border-border bg-card px-3 py-3 text-left text-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <span className="text-xs font-semibold uppercase text-muted-foreground">
                        Assistant
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-7 shrink-0 text-xs"
                        onClick={() => openFlagPanel(m.id)}
                      >
                        Flag this response
                      </Button>
                    </div>
                    <p className="mt-2 whitespace-pre-wrap">{m.content}</p>
                  </div>
                ) : (
                  <div
                    key={m.id}
                    className="rounded-lg border border-transparent bg-muted/50 px-3 py-2 text-sm"
                  >
                    <span className="text-xs font-semibold uppercase text-muted-foreground">
                      User
                    </span>
                    <p className="mt-1 whitespace-pre-wrap">{m.content}</p>
                  </div>
                ),
              )}
            </div>
          </ScrollArea>
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent
          side="right"
          showCloseButton
          className="flex w-full flex-col gap-0 overflow-y-auto border-l-[#003087]/15 p-0 sm:max-w-lg"
        >
          <SheetHeader className="border-b border-border/80 px-6 py-5 text-left">
            <SheetTitle className="font-heading text-[#003087]">
              Review assistant response
            </SheetTitle>
            <SheetDescription>
              Add what was wrong and run Grok for an improved reply and FAQ
              suggestion.
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-1 flex-col gap-4 px-6 py-4">
            {selectedAssistantMessage && (
              <div className="rounded-lg border bg-muted/40 p-3 text-xs">
                <p className="font-semibold text-foreground">Flagged message</p>
                <p className="mt-2 max-h-40 overflow-y-auto whitespace-pre-wrap text-muted-foreground">
                  {selectedAssistantMessage.content}
                </p>
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="correction">Your correction</Label>
              <Textarea
                id="correction"
                rows={4}
                value={correctionNote}
                onChange={(e) => setCorrectionNote(e.target.value)}
                placeholder="This was said incorrectly. It should say…"
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
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-foreground">
                    Recommended improved response
                  </p>
                  <Textarea
                    readOnly
                    rows={5}
                    className="mt-1 text-xs"
                    value={reviewResult.improvedBotResponse}
                  />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Suggested FAQ ({faq?.action === "edit" ? "update" : "new"})
                  </p>
                  {faq && (
                    <div className="mt-2 space-y-2 rounded-lg border border-border/80 bg-muted/20 p-3 text-xs">
                      <p>
                        <span className="font-medium text-foreground">
                          Q:{" "}
                        </span>
                        {faq.question}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">
                          A:{" "}
                        </span>
                        <span className="text-muted-foreground">
                          {faq.answer}
                        </span>
                      </p>
                      {faq.rationale && (
                        <p className="text-muted-foreground italic">
                          {faq.rationale}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border/80 bg-muted/30 px-3 py-2">
                  <span className="text-xs text-muted-foreground">
                    Hidden (draft)
                  </span>
                  <Switch
                    checked={newFaqPublished}
                    onCheckedChange={setNewFaqPublished}
                    aria-label="Toggle published on site or hidden draft"
                  />
                  <span className="text-xs font-medium text-foreground">
                    Published on site
                  </span>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="faqid">Update existing FAQ</Label>
                  <select
                    id="faqid"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={updateFaqId}
                    onChange={(e) => setUpdateFaqId(e.target.value)}
                  >
                    <option value="">— Select FAQ —</option>
                    {adminFaqs.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.question.slice(0, 72)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={applyCreateFaq}
                  >
                    Create new FAQ
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    disabled={!updateFaqId}
                    onClick={applyUpdateFaq}
                  >
                    Update existing FAQ
                  </Button>
                </div>
              </div>
            )}
          </div>

          <SheetFooter className="border-t border-border/80 bg-muted/20 px-6 py-4">
            <Button
              type="button"
              className="w-full"
              disabled={saveBusy}
              onClick={() => void saveJsonFile()}
            >
              {saveBusy ? "Saving…" : "Save — export public FAQs (JSON)"}
            </Button>
            {saveMsg && (
              <p className="text-center text-xs text-muted-foreground">
                {saveMsg}
              </p>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Separator className="my-10" />

      <div className="space-y-3 rounded-2xl border border-border/80 bg-card p-6 shadow-card">
        <h2 className="font-heading text-lg font-semibold text-[#003087]">
          Export public FAQs
        </h2>
        <p className="text-sm text-muted-foreground">
          Download or write merged visible FAQs for the site (same as Save in
          the review panel).
        </p>
        <Button
          type="button"
          disabled={saveBusy}
          onClick={() => void saveJsonFile()}
        >
          {saveBusy ? "Saving…" : "Save — export public FAQs (JSON)"}
        </Button>
        {saveMsg && !sheetOpen && (
          <p className="text-sm text-muted-foreground">{saveMsg}</p>
        )}
      </div>
    </div>
  );
}
