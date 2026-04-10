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
  newSessionId,
  setActiveSessionId,
  upsertConversation,
} from "@/lib/chat-storage";
import { textFromUIMessage } from "@/lib/message-text";

const DEFAULT_SESSION = "fortis-edge-session";

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
  const [sessionId, setSessionId] = useState(DEFAULT_SESSION);
  const sessionIdRef = useRef(sessionId);
  sessionIdRef.current = sessionId;
  const hydrated = useRef(false);

  const onFinish = useCallback(({ messages }: { messages: UIMessage[] }) => {
    persistConversationRow(sessionIdRef.current, messages);
  }, []);

  const chat = useChat({
    id: sessionId,
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onFinish,
  });

  const { messages, setMessages } = chat;

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    try {
      let raw = localStorage.getItem(messagesStorageKey(DEFAULT_SESSION));
      if (!raw) {
        raw = localStorage.getItem("fortis-edge-chat-active");
        if (raw) {
          localStorage.setItem(messagesStorageKey(DEFAULT_SESSION), raw);
          localStorage.removeItem("fortis-edge-chat-active");
        }
      }
      if (raw) {
        const parsed = JSON.parse(raw) as UIMessage[];
        if (parsed.length > 0) setMessages(parsed);
      }
    } catch {
      /* ignore */
    }
    setActiveSessionId(sessionIdRef.current);
  }, [setMessages]);

  useEffect(() => {
    if (messages.length === 0) return;
    localStorage.setItem(
      messagesStorageKey(sessionId),
      JSON.stringify(messages),
    );
    setActiveSessionId(sessionId);
  }, [messages, sessionId]);

  const startNewConversation = useCallback(() => {
    const sid = sessionIdRef.current;
    if (messages.length > 0) {
      persistConversationRow(sid, messages);
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
