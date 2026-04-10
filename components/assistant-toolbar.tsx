"use client";

import { Button } from "@/components/ui/button";
import { useFortisChat } from "@/components/chat-provider";

export function AssistantToolbar() {
  const { startNewConversation } = useFortisChat();
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      <Button type="button" variant="outline" onClick={() => startNewConversation()}>
        New conversation
      </Button>
      <p className="text-xs text-muted-foreground self-center">
        Starts a fresh thread and saves the current one to your dashboard history.
      </p>
    </div>
  );
}
