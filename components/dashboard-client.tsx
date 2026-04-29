"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/animated-number";
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
import { Flag, MessagesSquare } from "lucide-react";

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
    setUpdateFaqId("");
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

  function saveFaqFromReview() {
    if (!reviewResult) return;
    const r = reviewResult.faqRecommendation;
    if (updateFaqId) {
      const baseIds = new Set(getBaselineFaqs().map((x) => x.id));
      if (baseIds.has(updateFaqId)) {
        updateBaselineFaq(updateFaqId, { question: r.question, answer: r.answer });
      } else {
        updateCustomFaq(updateFaqId, {
          question: r.question,
          answer: r.answer,
        });
      }
      setSaveMsg("Existing FAQ updated in local store.");
      toast.success("FAQ updated — saved to local store");
    } else {
      addCustomFaq({
        question: r.question,
        answer: r.answer,
        visible: newFaqPublished,
      });
      setSaveMsg(
        newFaqPublished
          ? "New FAQ saved (visible on site)."
          : "New FAQ saved as draft in local store.",
      );
      if (newFaqPublished) {
        toast.success("FAQ published — visible on FAQ page (local store)");
      } else {
        toast.success("FAQ saved as draft");
      }
    }
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
      const msg = data.wroteFile
        ? "Saved data/faqs.json (dev or ALLOW_FAQ_FILE_WRITE)."
        : data.message ?? "Downloaded faqs.json.";
      setSaveMsg(msg);
      toast.success(msg);
    } catch {
      setSaveMsg("Save request failed.");
      toast.error("Save request failed");
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
      <motion.div
        className="flex flex-wrap items-start justify-between gap-4 glass-panel p-6 md:p-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#4ade80]">
            Team
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-white md:text-3xl">
            Dashboard
          </h1>
          <p className="mt-2 max-w-xl text-sm text-zinc-500">
            {FORTIS.productName} — conversations and FAQs stay in your browser;
            export when you are ready.
          </p>
        </div>
        <Button
          variant="outline"
          className="border-white/10 bg-white/[0.04]"
          onClick={() => void logout()}
        >
          Sign out
        </Button>
      </motion.div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          whileHover={{ y: -4 }}
          className="will-change-transform"
        >
          <Card className="border-white/[0.08] glass-panel transition-[box-shadow] hover:shadow-[0_12px_40px_-16px_rgba(0,166,81,0.18)]">
            <CardHeader className="pb-2">
              <CardDescription>Total conversations</CardDescription>
              <CardTitle className="font-mono text-3xl tabular-nums text-[#4ade80]">
                <AnimatedNumber value={metrics.totalConversations} />
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-zinc-500">
              Assistant threads stored in this browser
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -4 }}
          className="will-change-transform"
        >
          <Card className="border-white/[0.08] glass-panel transition-[box-shadow] hover:shadow-[0_12px_40px_-16px_rgba(0,166,81,0.18)]">
            <CardHeader className="pb-2">
              <CardDescription>Corrections / FAQs added</CardDescription>
              <CardTitle className="font-mono text-3xl tabular-nums text-[#4ade80]">
                <AnimatedNumber value={metrics.correctionsTotal} />{" "}
                <span className="text-lg font-normal text-zinc-500">
                  / <AnimatedNumber value={metrics.faqsAdded} />
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-zinc-500">
              Message flags · custom FAQs in store
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileHover={{ y: -4 }}
          className="will-change-transform"
        >
          <Card className="border-white/[0.08] glass-panel transition-[box-shadow] hover:shadow-[0_12px_40px_-16px_rgba(0,166,81,0.18)]">
            <CardHeader className="pb-2">
              <CardDescription>Published FAQs vs hidden FAQs</CardDescription>
              <CardTitle className="font-mono text-3xl tabular-nums text-[#4ade80]">
                <AnimatedNumber value={metrics.published} />{" "}
                <span className="text-zinc-500">/</span>{" "}
                <AnimatedNumber value={metrics.hidden} />
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-zinc-500">
              Visible on site · draft or hidden
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Separator className="my-10" />

      {!selectedId ? (
        <div>
          <h2 className="font-heading text-lg font-semibold text-zinc-100">
            Conversations
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap a conversation to open the full thread.
          </p>
          {rows.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel relative overflow-hidden p-8 md:p-10"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[#00A651]/10 blur-3xl" />
          <MessagesSquare className="relative size-10 text-[#4ade80]" aria-hidden />
          <p className="relative mt-4 text-lg font-semibold text-white">
            No conversations yet
          </p>
          <p className="relative mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
            Open the assistant from any page and send a message — threads appear
            here for review and FAQ workflows.
          </p>
        </motion.div>
          ) : (
            <>
              <div className="mt-4 space-y-3 md:hidden">
                {rows.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => {
                      setSelectedId(r.id);
                      setSelectedMessageId(null);
                    }}
                    className="w-full rounded-2xl border border-border/80 bg-card p-4 text-left shadow-card transition hover:border-[#00A651]/30 hover:bg-white/[0.04]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="line-clamp-2 font-medium text-foreground">
                        {r.title}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {r.messages.length} msg
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {new Date(r.updatedAt).toLocaleString()}
                    </p>
                    <span
                      className={cn(
                        "mt-3 inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                        r.status === "needs_review"
                          ? "bg-amber-500/15 text-amber-200"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {r.status}
                      {(r.flags?.length ?? 0) > 0 ? " · flagged" : ""}
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-border/80 shadow-card md:block">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="bg-white/[0.06] text-zinc-200">
                    <tr>
                      <th className="p-3 font-semibold">Updated</th>
                      <th className="p-3 font-semibold">Preview</th>
                      <th className="p-3 font-semibold">Status</th>
                      <th className="p-3 font-semibold">Messages</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border bg-card">
                    {rows.map((r) => (
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
                                ? "bg-amber-500/15 text-amber-200"
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
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
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
          <h2 className="font-heading text-lg font-semibold text-zinc-100">
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
                        variant="ghost"
                        size="sm"
                        className="h-7 shrink-0 gap-1 px-2 text-xs text-muted-foreground hover:text-zinc-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          openFlagPanel(m.id);
                        }}
                      >
                        <Flag className="size-3.5" aria-hidden />
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
          className="flex w-full flex-col gap-0 overflow-y-auto border-l-white/10 p-0 sm:max-w-lg"
        >
          <SheetHeader className="border-b border-border/80 px-6 py-5 text-left">
            <SheetTitle className="font-heading text-zinc-100">
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
              <Label htmlFor="correction">
                Your correction (optional context for Grok)
              </Label>
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
              className="bg-[#00A651] text-white hover:bg-[#00A651]/90"
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
                <div className="space-y-3 rounded-lg border border-border/80 bg-muted/20 p-3">
                  <p className="text-xs font-medium text-foreground">
                    Create new FAQ
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      Hidden (draft)
                    </span>
                    <Switch
                      checked={newFaqPublished}
                      onCheckedChange={setNewFaqPublished}
                      aria-label="Published on site or hidden draft"
                    />
                    <span className="text-xs font-medium text-foreground">
                      Published on site
                    </span>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="faqid">Or update existing FAQ</Label>
                  <select
                    id="faqid"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={updateFaqId}
                    onChange={(e) => setUpdateFaqId(e.target.value)}
                  >
                    <option value="">— New FAQ (uses toggle above) —</option>
                    {adminFaqs.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.question.slice(0, 72)}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    {`Choose an existing FAQ to merge Grok's suggestion into it. Leave empty to create a new FAQ with the visibility above.`}
                  </p>
                </div>
                <Button
                  type="button"
                  className="w-full bg-[#00A651] text-white hover:bg-[#00A651]/90"
                  disabled={!reviewResult}
                  onClick={saveFaqFromReview}
                >
                  Save
                </Button>
              </div>
            )}
          </div>

          <SheetFooter className="border-t border-border/80 bg-muted/20 px-6 py-4">
            <p className="text-center text-xs text-muted-foreground">
              Export merged visible FAQs for the public site.
            </p>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={saveBusy}
              onClick={() => void saveJsonFile()}
            >
              {saveBusy ? "Exporting…" : "Export FAQs (JSON)"}
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
        <h2 className="font-heading text-lg font-semibold text-zinc-100">
          Export public FAQs
        </h2>
        <p className="text-sm text-muted-foreground">
          Download or write merged visible FAQs for the site (same as Export in
          the review panel).
        </p>
        <Button
          type="button"
          variant="outline"
          disabled={saveBusy}
          onClick={() => void saveJsonFile()}
        >
          {saveBusy ? "Exporting…" : "Export FAQs (JSON)"}
        </Button>
        {saveMsg && !sheetOpen && (
          <p className="text-sm text-muted-foreground">{saveMsg}</p>
        )}
      </div>
    </div>
  );
}
