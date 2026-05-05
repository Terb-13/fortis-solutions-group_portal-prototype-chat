"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  loadConversations,
  newSessionId,
  setActiveSessionId,
  upsertConversation,
} from "@/lib/chat-storage";
import { textFromUIMessage } from "@/lib/message-text";

function messagesStorageKey(sessionId: string) {
  return `fortis-edge-chat-active-${sessionId}`;
}

function persistConversationRow(sessionId: string, messages: UIMessage[]) {
  const stored = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      id: m.id,
      role: m.role as "user" | "assistant",
      content: textFromUIMessage(m),
    }));
  if (stored.length === 0) return;
  const title =
    stored.find((m) => m.role === "user")?.content.slice(0, 72) ??
    "Fortis Edge conversation";
  const now = new Date().toISOString();
  upsertConversation({
    id: sessionId,
    title,
    createdAt: now,
    updatedAt: now,
    messages: stored,
    status: "active",
  });
}

type ChatExtras = {
  sessionId: string;
  startNewConversation: () => void;
};

type FortisChatContextValue = ReturnType<typeof useChat> & ChatExtras;

const FortisChatContext = createContext<FortisChatContextValue | null>(null);

export function FortisChatProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState(() => newSessionId());
  const sessionIdRef = useRef(sessionId);
  sessionIdRef.current = sessionId;

  const onFinish = useCallback(({ messages }: { messages: UIMessage[] }) => {
    persistConversationRow(sessionIdRef.current, messages);
    const row = loadConversations().find((r) => r.id === sessionIdRef.current);
    if (row) {
      void fetch("/api/conversations/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: row.id,
          title: row.title,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          messages: row.messages,
          status: row.status,
        }),
      }).catch(() => {
        /* sync is best-effort */
      });
    }
  }, []);

  const chat = useChat({
    id: sessionId,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onFinish,
  });

  const { messages, setMessages } = chat;

  useEffect(() => {
    setActiveSessionId(sessionId);
  }, [sessionId]);

  useEffect(() => {
    try {
      localStorage.removeItem("fortis-edge-chat-active");
      localStorage.removeItem(
        messagesStorageKey("fortis-edge-session"),
      );
    } catch {
      /* ignore */
    }
  }, []);

  const startNewConversation = useCallback(() => {
    const sid = sessionIdRef.current;
    if (messages.length > 0) {
      persistConversationRow(sid, messages);
      const row = loadConversations().find((r) => r.id === sid);
      if (row) {
        void fetch("/api/conversations/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: row.id,
            title: row.title,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            messages: row.messages,
            status: row.status,
          }),
        }).catch(() => {
          /* best-effort */
        });
      }
    }
    const next = newSessionId();
    setSessionId(next);
    sessionIdRef.current = next;
    setActiveSessionId(next);
    setMessages([]);
    try {
      localStorage.removeItem(messagesStorageKey(sid));
    } catch {
      /* ignore */
    }
  }, [messages, setMessages]);

  const value = useMemo(
    () => ({
      ...chat,
      sessionId,
      startNewConversation,
    }),
    [chat, sessionId, startNewConversation],
  );

  return (
    <FortisChatContext.Provider value={value}>
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
