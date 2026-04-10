"use client";

import type { UIMessage } from "ai";
import { Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { textFromUIMessage } from "@/lib/message-text";
import { cn } from "@/lib/utils";
import { useFortisChat } from "@/components/chat-provider";

function Bubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = textFromUIMessage(message);
  if (!text.trim()) return null;
  return (
    <div
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
          isUser
            ? "bg-[#003087] text-white"
            : "border border-border bg-card text-card-foreground",
        )}
      >
        <p className="whitespace-pre-wrap">{text}</p>
      </div>
    </div>
  );
}

export function ChatPanel({
  className,
  compact,
}: {
  className?: string;
  compact?: boolean;
}) {
  const { messages, sendMessage, status, error, clearError } = useFortisChat();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    await sendMessage({ text });
  }

  return (
    <div className={cn("flex h-full min-h-0 flex-col gap-3", className)}>
      <ScrollArea
        className={cn(
          "min-h-0 flex-1 rounded-xl border border-border bg-muted/30 p-4",
          compact ? "h-[320px]" : "h-[min(560px,70vh)]",
        )}
      >
        <div className="flex flex-col gap-3 pr-2">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground">
            Ask about Fortis Edge, Orem/Marietta digital plants, Tier 3 &amp;
            4 portal paths, proofing targets, FlexLink, split shipping, or
            Radius / Infigo / LabelTraxx.
            </p>
          )}
          {messages.map((m) => (
            <Bubble key={m.id} message={m} />
          ))}
          {busy && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Packaging Assistant is thinking…
            </div>
          )}
          {error && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error.message}
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 pl-2 text-destructive"
                onClick={() => clearError()}
              >
                Dismiss
              </Button>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
      <form onSubmit={onSubmit} className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your packaging question…"
          rows={compact ? 2 : 3}
          className="min-h-[44px] resize-none sm:flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void onSubmit(e);
            }
          }}
        />
        <Button
          type="submit"
          disabled={busy || !input.trim()}
          className="bg-[#003087] text-white hover:bg-[#003087]/90 sm:h-11"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
