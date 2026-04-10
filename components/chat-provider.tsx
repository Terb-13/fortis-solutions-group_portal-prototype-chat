"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { textFromUIMessage } from "@/lib/message-text";
import { upsertConversation } from "@/lib/chat-storage";

const CHAT_ID = "fortis-edge-assistant";
const STORAGE_KEY = "fortis-edge-chat-active";

type FortisChatContextValue = ReturnType<typeof useChat>;

const FortisChatContext = createContext<FortisChatContextValue | null>(null);

function readStoredMessages(): UIMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as UIMessage[];
  } catch {
    return [];
  }
}

export function FortisChatProvider({ children }: { children: React.ReactNode }) {
  const hydrated = useRef(false);

  const onFinish = useCallback(
    ({ messages }: { messages: UIMessage[] }) => {
      const stored = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: textFromUIMessage(m),
        }));
      const title =
        stored.find((m) => m.role === "user")?.content.slice(0, 72) ??
        "Fortis Edge conversation";
      const now = new Date().toISOString();
      upsertConversation({
        id: CHAT_ID,
        title,
        createdAt: now,
        updatedAt: now,
        messages: stored,
      });
    },
    [],
  );

  const chat = useChat({
    id: CHAT_ID,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onFinish,
  });

  const { messages, setMessages } = chat;

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    const stored = readStoredMessages();
    if (stored.length > 0) setMessages(stored);
  }, [setMessages]);

  useEffect(() => {
    if (messages.length === 0) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  return (
    <FortisChatContext.Provider value={chat}>
      {children}
    </FortisChatContext.Provider>
  );
}

export function useFortisChat() {
  const ctx = useContext(FortisChatContext);
  if (!ctx) {
    throw new Error("useFortisChat must be used within FortisChatProvider");
  }
  return ctx;
}
