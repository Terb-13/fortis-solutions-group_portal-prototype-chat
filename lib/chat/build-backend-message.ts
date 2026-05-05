import type { UIMessage } from "ai";

import { textFromUIMessage } from "@/lib/message-text";

const TRANSCRIPT_MAX_CHARS = 14_000;

const THREAD_INSTRUCTION =
  "Use the full thread below for continuity. Continue in-progress flows (for example Quick Ship / estimate intake) from where you left off—advance steps when appropriate and do not restart from Step 1 unless the user clearly starts over.";

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

export function buildBackendCoreMessage(
  messages: UIMessage[],
  fallbackLatestUserText: string,
): string {
  const lines = buildTranscriptLines(messages);
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
