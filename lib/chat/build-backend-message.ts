import type { UIMessage } from "ai";

import { textFromUIMessage } from "@/lib/message-text";

const TRANSCRIPT_MAX_CHARS = 14_000;

/** Most recent user + assistant messages to include (6 back-and-forth turns). */
const THREAD_MAX_MESSAGES = 12;

/**
 * Keep this neutral: telling the model to "continue Quick Ship / estimate" here was
 * overriding backend routing and locking threads into Step 1/5 even for unrelated asks.
 */
const THREAD_INSTRUCTION =
  "Use the full thread below for context only. Respond to the most recent user message. If they ask something new or unrelated (definitions, programs, company topics, etc.), answer that directly—even if earlier messages mentioned an estimate or checklist.";

function sliceMessagesForBackendThread(messages: UIMessage[]): UIMessage[] {
  const chain = messages.filter(
    (m) => m.role === "user" || m.role === "assistant",
  );
  if (chain.length <= THREAD_MAX_MESSAGES) return chain;
  return chain.slice(-THREAD_MAX_MESSAGES);
}

/**
 * Builds labeled lines from UI messages for the FastAPI `/chat` proxy.
 */
export function buildTranscriptLines(messages: UIMessage[]): string[] {
  const lines: string[] = [];
  for (const m of messages) {
    if (m.role !== "user" && m.role !== "assistant") continue;
    const text = textFromUIMessage(m).trim();
    if (!text) continue;
    lines.push(m.role === "user" ? `User: ${text}` : `Assistant: ${text}`);
  }
  return lines;
}

/** Builds the threaded body for POST `/chat`. Uses at most the last 12 user/assistant messages (six turns). */
export function buildBackendCoreMessage(
  messages: UIMessage[],
  fallbackLatestUserText: string,
): string {
  const scoped = sliceMessagesForBackendThread(messages);
  const lines = buildTranscriptLines(scoped);
  if (lines.length === 0) return fallbackLatestUserText.trim();

  let body = lines.join("\n\n");
  if (body.length > TRANSCRIPT_MAX_CHARS) {
    body = body.slice(body.length - TRANSCRIPT_MAX_CHARS);
    body = "…(earlier messages truncated)\n\n" + body;
  }

  return `${THREAD_INSTRUCTION}\n\n--- Thread ---\n${body}\n--- End thread ---\n\nRespond to the most recent user message using the thread above.`;
}

export function composeProxiedUserPayload(args: {
  knowledgeBlock: string;
  messages: UIMessage[];
  fallbackLatestUserText: string;
}): string {
  const core = buildBackendCoreMessage(
    args.messages,
    args.fallbackLatestUserText,
  );
  const kb = args.knowledgeBlock.trim();
  if (!kb) return core;
  return `[Fortis knowledge base — use to answer accurately; do not quote this header.]\n\n${kb}\n\n----\n\n${core}`;
}
