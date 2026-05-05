"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { AnimatedNumber } from "@/components/animated-number";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  loadConversations,
  updateConversation,
  type ConversationRecord,
  type MessageFlag,
  type StoredMessage,
} from "@/lib/chat-storage";
import {
  buildPublicFaqsExport,
  getPublishedHiddenCounts,
  loadFaqStore,
} from "@/lib/faq-store";
import type { FaqItem } from "@/lib/faqs";
import type { EstimateListItem } from "@/lib/quote/estimate-list-row";
import { mapEstimateRow } from "@/lib/quote/map-estimate-row";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Calculator,
  Flag,
  LayoutDashboard,
  MessagesSquare,
} from "lucide-react";

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

type AdminSection = "training" | "estimates" | "analytics";

function normalizeMessageFlag(f: unknown): MessageFlag | null {
  if (!f || typeof f !== "object") return null;
  const o = f as Record<string, unknown>;
  if (typeof o.messageId !== "string") return null;
  return {
    messageId: o.messageId,
    correctionNote: typeof o.correctionNote === "string" ? o.correctionNote : undefined,
    createdAt: typeof o.createdAt === "string" ? o.createdAt : new Date().toISOString(),
  };
}

function normalizeConversation(raw: unknown): ConversationRecord | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string") return null;
  const messagesRaw = o.messages;
  const messages: StoredMessage[] = [];
  if (Array.isArray(messagesRaw)) {
    for (const m of messagesRaw) {
      if (!m || typeof m !== "object") continue;
      const msg = m as Record<string, unknown>;
      if (typeof msg.id !== "string") continue;
      if (msg.role !== "user" && msg.role !== "assistant") continue;
      if (typeof msg.content !== "string") continue;
      messages.push({
        id: msg.id,
        role: msg.role,
        content: msg.content,
      });
    }
  }
  const statusRaw = o.status;
  const status =
    statusRaw === "active" || statusRaw === "archived" || statusRaw === "needs_review"
      ? statusRaw
      : "active";
  const flagsRaw = o.flags;
  const flags: MessageFlag[] = Array.isArray(flagsRaw)
    ? (flagsRaw.map(normalizeMessageFlag).filter(Boolean) as MessageFlag[])
    : [];

  return {
    id: o.id,
    title: typeof o.title === "string" ? o.title : "",
    createdAt: typeof o.createdAt === "string" ? o.createdAt : new Date().toISOString(),
    updatedAt: typeof o.updatedAt === "string" ? o.updatedAt : new Date().toISOString(),
    messages,
    status,
    flags,
  };
}

const money = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function DashboardClient() {
  const router = useRouter();
  const [section, setSection] = useState<AdminSection>("training");

  const [rows, setRows] = useState<ConversationRecord[]>([]);
  const [dataSource, setDataSource] = useState<"supabase" | "local">("supabase");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [correctionNote, setCorrectionNote] = useState("");
  const [reviewBusy, setReviewBusy] = useState(false);
  const [reviewResult, setReviewResult] = useState<ReviewResult | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [applyKnowledge, setApplyKnowledge] = useState(true);
  const [applyFaq, setApplyFaq] = useState(true);
  const [approveBusy, setApproveBusy] = useState(false);
  const [updateFaqId, setUpdateFaqId] = useState<string>("");
  const [saveBusy, setSaveBusy] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [faqTick, setFaqTick] = useState(0);
  const [adminFaqs, setAdminFaqs] = useState<FaqItem[]>([]);

  const [estimates, setEstimates] = useState<EstimateListItem[]>([]);
  const [rawEstimateRows, setRawEstimateRows] = useState<Record<string, unknown>[]>([]);
  const [estimateQuery, setEstimateQuery] = useState("");
  const [estimateDetailOpen, setEstimateDetailOpen] = useState(false);
  const [selectedEstimateId, setSelectedEstimateId] = useState<string | null>(null);

  const [analytics, setAnalytics] = useState<{
    conversationsThisMonth: number;
    estimatesThisMonth: number;
    conversionConversationToEstimatePercent: number;
  } | null>(null);

  const refreshConversations = useCallback(async () => {
    const res = await fetch("/api/admin/conversations");
    if (res.ok) {
      const data = (await res.json()) as { conversations?: unknown[] };
      const list = (data.conversations ?? [])
        .map(normalizeConversation)
        .filter(Boolean) as ConversationRecord[];
      setRows(list);
      setDataSource("supabase");
      return;
    }
    if (res.status === 503) {
      setRows(loadConversations());
      setDataSource("local");
      toast.message("Supabase admin unavailable — showing this browser’s conversations.");
      return;
    }
    toast.error("Could not load conversations.");
  }, []);

  const loadFaqOptions = useCallback(async () => {
    const res = await fetch("/api/admin/faq-index");
    if (!res.ok) return;
    const data = (await res.json()) as { baseline?: FaqItem[]; supabase?: FaqItem[] };
    const merged = [...(data.supabase ?? []), ...(data.baseline ?? [])];
    setAdminFaqs(merged);
  }, []);

  const loadEstimates = useCallback(async () => {
    const res = await fetch("/api/admin/estimates");
    if (!res.ok) {
      if (res.status !== 503) toast.error("Could not load estimates.");
      setEstimates([]);
      setRawEstimateRows([]);
      return;
    }
    const data = (await res.json()) as {
      estimates?: EstimateListItem[];
      rawRows?: Record<string, unknown>[];
    };
    setEstimates(data.estimates ?? []);
    setRawEstimateRows(data.rawRows ?? []);
  }, []);

  const loadAnalytics = useCallback(async () => {
    const res = await fetch("/api/admin/analytics");
    if (!res.ok) {
      setAnalytics(null);
      return;
    }
    const data = (await res.json()) as {
      conversationsThisMonth: number;
      estimatesThisMonth: number;
      conversionConversationToEstimatePercent: number;
    };
    setAnalytics(data);
  }, []);

  useEffect(() => {
    void refreshConversations();
  }, [refreshConversations]);

  useEffect(() => {
    void loadFaqOptions();
  }, [loadFaqOptions]);

  useEffect(() => {
    if (section === "estimates") void loadEstimates();
  }, [section, loadEstimates]);

  useEffect(() => {
    if (section === "analytics") void loadAnalytics();
  }, [section, loadAnalytics]);

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

  const filteredEstimates = useMemo(() => {
    const q = estimateQuery.trim().toLowerCase();
    if (!q) return estimates;
    return estimates.filter((e) => e.customerName.toLowerCase().includes(q));
  }, [estimates, estimateQuery]);

  const selectedEstimateRow = useMemo(() => {
    if (!selectedEstimateId) return null;
    return (
      rawEstimateRows.find((r) => String(r.id) === selectedEstimateId) ?? null
    );
  }, [rawEstimateRows, selectedEstimateId]);

  const selectedQuoteDisplay = useMemo(
    () => mapEstimateRow(selectedEstimateRow as Record<string, unknown> | null),
    [selectedEstimateRow],
  );

  function openFlagPanel(messageId: string) {
    setSelectedMessageId(messageId);
    setCorrectionNote("");
    setReviewResult(null);
    setReviewError(null);
    setUpdateFaqId("");
    setApplyKnowledge(true);
    setApplyFaq(true);
    void loadFaqOptions();
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

  async function persistFlagsToRemote(
    conversationId: string,
    messageId: string,
    note: string,
  ) {
    const conv = rows.find((r) => r.id === conversationId);
    const prev = conv?.flags ?? [];
    const nextFlags: MessageFlag[] = [
      ...prev.filter((f) => f.messageId !== messageId),
      {
        messageId,
        correctionNote: note,
        createdAt: new Date().toISOString(),
      },
    ];
    const res = await fetch(`/api/admin/conversations/${conversationId}/flags`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flags: nextFlags, status: "needs_review" }),
    });
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(err.error ?? "Could not save flags.");
    }
    await refreshConversations();
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
          setFaqTick((x) => x + 1);
          if (dataSource === "supabase") {
            try {
              await persistFlagsToRemote(
                selectedId,
                selectedMessageId,
                correctionNote,
              );
            } catch (e) {
              setReviewError(
                e instanceof Error ? e.message : "Could not sync flags to Supabase.",
              );
              return;
            }
          } else {
            setRows(loadConversations());
          }
        }
      }
    } catch {
      setReviewError("Network error.");
    } finally {
      setReviewBusy(false);
    }
  }

  async function approveTrainingProposal() {
    if (!reviewResult || !selectedId || !selectedMessageId) return;
    if (!applyKnowledge && !applyFaq) {
      toast.error("Choose at least one: knowledge snippet or FAQ.");
      return;
    }
    setApproveBusy(true);
    try {
      let faqPayload = reviewResult.faqRecommendation;
      if (updateFaqId) {
        faqPayload = {
          ...reviewResult.faqRecommendation,
          action: "edit",
          targetFaqId: updateFaqId,
        };
      }
      const res = await fetch("/api/admin/training/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: selectedId,
          assistantMessageId: selectedMessageId,
          improvedBotResponse: reviewResult.improvedBotResponse,
          applyKnowledge,
          faq: applyFaq ? faqPayload : undefined,
          applyFaq,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        toast.error(data.error ?? "Could not apply training.");
        return;
      }
      toast.success("Approved — knowledge and FAQs are live for the assistant.");
      setReviewResult(null);
      setSheetOpen(false);
    } catch {
      toast.error("Network error while approving.");
    } finally {
      setApproveBusy(false);
    }
  }

  function rejectTrainingProposal() {
    setReviewResult(null);
    setSheetOpen(false);
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

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/dashboard/login");
    router.refresh();
  };

  const faq = reviewResult?.faqRecommendation;

  const navItem = (id: AdminSection, label: string, icon: ReactNode) => (
    <button
      key={id}
      type="button"
      onClick={() => setSection(id)}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition",
        section === id
          ? "bg-[#00A651]/15 text-white ring-1 ring-[#00A651]/35"
          : "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100",
      )}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <motion.div
        className="flex flex-wrap items-start justify-between gap-4 glass-panel p-6 md:p-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-[#4ade80]">
            Fortis Edge
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-white md:text-3xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Review assistant threads, curate training data in Supabase, monitor
            estimates, and track monthly engagement — all behind the team login.
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

      <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:gap-12">
        <aside className="glass-panel w-full shrink-0 p-3 lg:w-56">
          <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Navigate
          </p>
          <nav className="space-y-1">
            {navItem(
              "training",
              "Training & review",
              <MessagesSquare className="size-4 opacity-80" aria-hidden />,
            )}
            {navItem(
              "estimates",
              "Estimates",
              <Calculator className="size-4 opacity-80" aria-hidden />,
            )}
            {navItem(
              "analytics",
              "Analytics",
              <BarChart3 className="size-4 opacity-80" aria-hidden />,
            )}
          </nav>
          <Separator className="my-4 bg-white/10" />
          <div className="flex items-center gap-2 px-2 text-xs text-zinc-500">
            <LayoutDashboard className="size-3.5" aria-hidden />
            {dataSource === "supabase" ? "Live — Supabase" : "Local browser"}
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-8">
          {section === "training" && (
            <>
              {dataSource === "local" && (
                <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                  Set{" "}
                  <code className="rounded bg-black/20 px-1 text-xs">
                    SUPABASE_SERVICE_ROLE_KEY
                  </code>{" "}
                  on the server and apply the SQL migration in{" "}
                  <code className="rounded bg-black/20 px-1 text-xs">
                    supabase/migrations
                  </code>{" "}
                  to sync conversations organization-wide.
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="border-white/[0.08] glass-panel">
                  <CardHeader className="pb-2">
                    <CardDescription>Threads in view</CardDescription>
                    <CardTitle className="font-mono text-3xl tabular-nums text-[#4ade80]">
                      <AnimatedNumber value={metrics.totalConversations} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-zinc-500">
                    Conversation review queue
                  </CardContent>
                </Card>
                <Card className="border-white/[0.08] glass-panel">
                  <CardHeader className="pb-2">
                    <CardDescription>Flags / local FAQ edits</CardDescription>
                    <CardTitle className="font-mono text-3xl tabular-nums text-[#4ade80]">
                      <AnimatedNumber value={metrics.correctionsTotal} />{" "}
                      <span className="text-lg font-normal text-zinc-500">
                        / <AnimatedNumber value={metrics.faqsAdded} />
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-zinc-500">
                    Message flags · custom FAQs in this browser
                  </CardContent>
                </Card>
                <Card className="border-white/[0.08] glass-panel">
                  <CardHeader className="pb-2">
                    <CardDescription>Published vs hidden (local store)</CardDescription>
                    <CardTitle className="font-mono text-3xl tabular-nums text-[#4ade80]">
                      <AnimatedNumber value={metrics.published} />{" "}
                      <span className="text-zinc-500">/</span>{" "}
                      <AnimatedNumber value={metrics.hidden} />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-zinc-500">
                    Site FAQ page also merges Supabase published rows
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-lg font-semibold text-zinc-100">
                    Conversations (most recent first)
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Expand a thread, flag assistant replies, and route corrections
                    into Grok + Supabase training.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="border-white/10"
                  onClick={() => void refreshConversations()}
                >
                  Refresh
                </Button>
              </div>

              {!selectedId ? (
                <>
                  {rows.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-panel relative overflow-hidden p-8 md:p-10"
                    >
                      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-[#00A651]/10 blur-3xl" />
                      <MessagesSquare
                        className="relative size-10 text-[#4ade80]"
                        aria-hidden
                      />
                      <p className="relative mt-4 text-lg font-semibold text-white">
                        No conversations yet
                      </p>
                      <p className="relative mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
                        Open the assistant widget, send a message, and this list
                        will populate (synced to Supabase when configured).
                      </p>
                    </motion.div>
                  ) : (
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
                  )}
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
                </>
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

              <Separator className="my-8" />

              <div className="space-y-3 rounded-2xl border border-border/80 bg-card p-6 shadow-card">
                <h2 className="font-heading text-lg font-semibold text-zinc-100">
                  Export local FAQ overrides
                </h2>
                <p className="text-sm text-muted-foreground">
                  Download merged visible FAQs from this browser (separate from
                  Supabase publishing).
                </p>
                <Button
                  type="button"
                  variant="outline"
                  disabled={saveBusy}
                  onClick={() => void saveJsonFile()}
                >
                  {saveBusy ? "Exporting…" : "Export FAQs (JSON)"}
                </Button>
                {saveMsg && (
                  <p className="text-sm text-muted-foreground">{saveMsg}</p>
                )}
              </div>
            </>
          )}

          {section === "estimates" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-lg font-semibold text-zinc-100">
                  Estimates
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Search by customer or company name. Rows come from{" "}
                  <code className="rounded bg-white/5 px-1 text-xs">
                    fortis_estimates
                  </code>
                  .
                </p>
              </div>
              <div className="max-w-md">
                <Label htmlFor="est-q" className="text-xs text-zinc-400">
                  Filter
                </Label>
                <Input
                  id="est-q"
                  value={estimateQuery}
                  onChange={(e) => setEstimateQuery(e.target.value)}
                  placeholder="Customer name (placeholder for accounts)"
                  className="mt-1 border-white/10 bg-white/[0.04]"
                />
              </div>
              {filteredEstimates.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No estimates found for this filter.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-border/80 shadow-card">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="bg-white/[0.06] text-zinc-200">
                      <tr>
                        <th className="p-3 font-semibold">Estimate ID</th>
                        <th className="p-3 font-semibold">Customer</th>
                        <th className="p-3 font-semibold">Date</th>
                        <th className="p-3 font-semibold">Total</th>
                        <th className="p-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-card">
                      {filteredEstimates.map((e) => (
                        <tr
                          key={e.id}
                          className="cursor-pointer transition hover:bg-muted/50"
                          onClick={() => {
                            setSelectedEstimateId(e.id);
                            setEstimateDetailOpen(true);
                          }}
                        >
                          <td className="p-3 font-mono text-xs text-muted-foreground">
                            {e.id.slice(0, 8)}…
                          </td>
                          <td className="p-3 font-medium">{e.customerName}</td>
                          <td className="p-3 text-xs text-muted-foreground">
                            {e.dateIso
                              ? new Date(e.dateIso).toLocaleDateString()
                              : "—"}
                          </td>
                          <td className="p-3 tabular-nums">
                            {e.total != null ? money.format(e.total) : "—"}
                          </td>
                          <td className="p-3">
                            <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs">
                              {e.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {section === "analytics" && (
            <div className="space-y-6">
              <div>
                <h2 className="font-heading text-lg font-semibold text-zinc-100">
                  Analytics (this month, UTC)
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pulled from Supabase counts for conversations and estimates.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border-white/[0.08] glass-panel">
                  <CardHeader className="pb-2">
                    <CardDescription>Estimates generated</CardDescription>
                    <CardTitle className="font-mono text-3xl tabular-nums text-[#4ade80]">
                      <AnimatedNumber
                        value={analytics?.estimatesThisMonth ?? 0}
                      />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-zinc-500">
                    Rows created in{" "}
                    <code className="rounded bg-white/5 px-1">fortis_estimates</code>
                  </CardContent>
                </Card>
                <Card className="border-white/[0.08] glass-panel">
                  <CardHeader className="pb-2">
                    <CardDescription>Conversations</CardDescription>
                    <CardTitle className="font-mono text-3xl tabular-nums text-[#4ade80]">
                      <AnimatedNumber
                        value={analytics?.conversationsThisMonth ?? 0}
                      />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-zinc-500">
                    Threads synced to{" "}
                    <code className="rounded bg-white/5 px-1">
                      fortis_conversations
                    </code>
                  </CardContent>
                </Card>
                <Card className="border-white/[0.08] glass-panel">
                  <CardHeader className="pb-2">
                    <CardDescription>
                      Conversion — conversations → estimates
                    </CardDescription>
                    <CardTitle className="font-mono text-3xl tabular-nums text-[#4ade80]">
                      {analytics
                        ? `${analytics.conversionConversationToEstimatePercent}%`
                        : "—"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-zinc-500">
                    Estimates ÷ conversations (same month). Linkage per thread is
                    planned.
                  </CardContent>
                </Card>
                <Card className="border-white/[0.08] glass-panel">
                  <CardHeader className="pb-2">
                    <CardDescription>
                      Conversion — conversations → orders
                    </CardDescription>
                    <CardTitle className="font-mono text-3xl tabular-nums text-zinc-300">
                      8.1%
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-zinc-500">
                    Placeholder until order events are tracked in Supabase.
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

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
              Grok proposes a safer reply plus FAQ changes. Approve to write into
              Supabase (<code className="text-xs">fortis_knowledge</code>,{" "}
              <code className="text-xs">fortis_faq</code>
              ).
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
                        <span className="font-medium text-foreground">Q: </span>
                        {faq.question}
                      </p>
                      <p>
                        <span className="font-medium text-foreground">A: </span>
                        <span className="text-muted-foreground">{faq.answer}</span>
                      </p>
                      {faq.rationale && (
                        <p className="text-muted-foreground italic">{faq.rationale}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-3 rounded-lg border border-border/80 bg-muted/20 p-3">
                  <p className="text-xs font-medium text-foreground">
                    Apply to Supabase
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      Knowledge snippet
                    </span>
                    <Switch
                      checked={applyKnowledge}
                      onCheckedChange={setApplyKnowledge}
                      aria-label="Save approved reply to fortis_knowledge"
                    />
                    <span className="text-xs font-medium text-foreground">On</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs text-muted-foreground">FAQ row</span>
                    <Switch
                      checked={applyFaq}
                      onCheckedChange={setApplyFaq}
                      aria-label="Upsert FAQ in fortis_faq"
                    />
                    <span className="text-xs font-medium text-foreground">On</span>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="faqid">Map to existing FAQ (optional)</Label>
                  <select
                    id="faqid"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    value={updateFaqId}
                    onChange={(e) => setUpdateFaqId(e.target.value)}
                  >
                    <option value="">— Create new FAQ row —</option>
                    {adminFaqs.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.question.slice(0, 72)}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">
                    When set, approval updates that FAQ id in Supabase instead of
                    inserting a fresh key.
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    type="button"
                    className="flex-1 bg-[#00A651] text-white hover:bg-[#00A651]/90"
                    disabled={approveBusy}
                    onClick={() => void approveTrainingProposal()}
                  >
                    {approveBusy ? "Saving…" : "Approve proposal"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-white/10"
                    disabled={approveBusy}
                    onClick={rejectTrainingProposal}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </div>

          <SheetFooter className="border-t border-border/80 bg-muted/20 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={saveBusy}
              onClick={() => void saveJsonFile()}
            >
              {saveBusy ? "Exporting…" : "Export local FAQs (JSON)"}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={estimateDetailOpen} onOpenChange={setEstimateDetailOpen}>
        <DialogContent
          showCloseButton
          className="max-h-[90vh] max-w-2xl overflow-y-auto sm:max-w-3xl"
        >
          <DialogHeader>
            <DialogTitle>Estimate detail</DialogTitle>
            <DialogDescription>
              Structured view mapped from Supabase — same logic as customer quote
              pages.
            </DialogDescription>
          </DialogHeader>
          {selectedQuoteDisplay ? (
            <div className="space-y-4 text-sm">
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Business
                  </p>
                  <p className="text-foreground">{selectedQuoteDisplay.businessName}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Contact
                  </p>
                  <p className="text-foreground">{selectedQuoteDisplay.contactName}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Email
                  </p>
                  <p className="text-foreground">{selectedQuoteDisplay.email}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Phone
                  </p>
                  <p className="text-foreground">{selectedQuoteDisplay.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Ship to / address
                </p>
                <p className="text-foreground">{selectedQuoteDisplay.address}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Line items
                </p>
                <ul className="mt-2 space-y-2">
                  {selectedQuoteDisplay.lines.map((li, idx) => (
                    <li
                      key={`${li.sku}-${idx}`}
                      className="rounded-md border border-border/60 bg-card/40 px-3 py-2"
                    >
                      <p className="font-medium">{li.description}</p>
                      <p className="text-xs text-muted-foreground">
                        SKU {li.sku} · Qty {li.quantity}
                        {li.unitPrice != null
                          ? ` · ${money.format(li.unitPrice)} ea`
                          : ""}
                        {li.total != null ? ` · ${money.format(li.total)}` : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Subtotal
                  </p>
                  <p className="text-lg font-semibold text-[#4ade80]">
                    {selectedQuoteDisplay.subtotal != null
                      ? money.format(selectedQuoteDisplay.subtotal)
                      : "—"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Valid until
                  </p>
                  <p className="text-foreground">
                    {selectedQuoteDisplay.validUntil.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Notes
                </p>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {selectedQuoteDisplay.notes}
                </p>
              </div>
              <Link
                href={`/quote/${selectedQuoteDisplay.id}`}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "inline-flex w-full justify-center border-white/10",
                )}
              >
                Open printable quote page
              </Link>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Unable to map this row — check `fortis_estimates` shape.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
