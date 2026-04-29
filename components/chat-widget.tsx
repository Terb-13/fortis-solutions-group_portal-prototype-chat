"use client";

import { MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ChatPanel } from "@/components/chat-panel";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FORTIS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className={cn(
          buttonVariants({ size: "icon-lg" }),
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full border border-white/10 bg-[#111] p-0 text-white shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-2 ring-[#00A651]/40 transition hover:scale-[1.03] hover:bg-zinc-900",
        )}
        aria-label="Open Fortis Edge Assistant chat"
      >
        <MessageCircle className="h-6 w-6" />
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-full flex-col gap-0 border-l border-white/10 bg-[#0a0a0a] p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-white/10 px-6 py-4 text-left">
          <div className="flex items-start justify-between gap-2">
            <div>
              <SheetTitle>{FORTIS.productName} Assistant</SheetTitle>
              <SheetDescription>
                Grok-powered guidance for Tier 3 &amp; 4 programs, portal
                workflows, and roadmap timing.
              </SheetDescription>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Link
            href="/assistant"
            onClick={() => setOpen(false)}
            className={cn(
              buttonVariants({ variant: "link" }),
              "h-auto px-0 text-xs",
            )}
          >
            Open full assistant page
          </Link>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-4 py-4">
          <ChatPanel compact className="h-full" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
