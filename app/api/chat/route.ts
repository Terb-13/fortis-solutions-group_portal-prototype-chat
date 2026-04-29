import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateId,
  type UIMessage,
  type UIMessageStreamWriter,
} from "ai";
import { textFromUIMessage } from "@/lib/message-text";

export const maxDuration = 60;

/** Fortis CS agent (FastAPI). Override with FORTIS_CHAT_BACKEND_URL if deployed elsewhere. */
const DEFAULT_CHAT_BACKEND =
  process.env.FORTIS_CHAT_BACKEND_URL ?? "https://fortis-chat.vercel.app/chat";

function latestUserMessageText(messages: UIMessage[]): string | null {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.role !== "user") continue;
    const t = textFromUIMessage(m).trim();
    if (t.length > 0) return t;
  }
  return null;
}

function extractTextFromJsonPayload(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value !== "object") return "";
  const o = value as Record<string, unknown>;
  const direct = ["content", "text", "message", "token", "delta", "response"];
  for (const key of direct) {
    const v = o[key];
    if (typeof v === "string" && v.length > 0) return v;
  }
  const choices = o.choices;
  if (Array.isArray(choices) && choices[0] && typeof choices[0] === "object") {
    const c0 = choices[0] as Record<string, unknown>;
    const delta = c0.delta;
    if (delta && typeof delta === "object") {
      const d = delta as Record<string, unknown>;
      if (typeof d.content === "string") return d.content;
    }
    if (typeof c0.message === "object" && c0.message) {
      const msg = c0.message as Record<string, unknown>;
      if (typeof msg.content === "string") return msg.content;
    }
  }
  return "";
}

/** Parse one SSE block (may contain multiple `data:` lines). */
function extractTextFromSseBlock(block: string): string {
  let out = "";
  for (const rawLine of block.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line.startsWith("data:")) continue;
    const payload = line.slice(5).trim();
    if (payload === "[DONE]" || payload === "") continue;
    try {
      const parsed = JSON.parse(payload) as unknown;
      out += extractTextFromJsonPayload(parsed);
    } catch {
      out += payload;
    }
  }
  return out;
}

async function pipeUpstreamToWriter(
  body: ReadableStream<Uint8Array>,
  contentType: string | null,
  writer: UIMessageStreamWriter,
  textId: string,
): Promise<void> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let sseMode = Boolean(contentType?.toLowerCase().includes("event-stream"));

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    if (
      !sseMode &&
      buffer.length === 0 &&
      chunk.trimStart().startsWith("data:")
    ) {
      sseMode = true;
    }

    if (!sseMode) {
      if (chunk.length > 0) {
        writer.write({
          type: "text-delta",
          id: textId,
          delta: chunk,
        });
      }
      continue;
    }

    buffer += chunk;
    const parts = buffer.split(/\r?\n\r?\n/);
    buffer = parts.pop() ?? "";
    for (const block of parts) {
      const text = extractTextFromSseBlock(block);
      if (text.length > 0) {
        writer.write({
          type: "text-delta",
          id: textId,
          delta: text,
        });
      }
    }
  }

  if (sseMode && buffer.trim().length > 0) {
    const text = extractTextFromSseBlock(buffer);
    if (text.length > 0) {
      writer.write({
        type: "text-delta",
        id: textId,
        delta: text,
      });
    }
  }
}

export async function POST(req: Request) {
  let parsed: unknown;
  try {
    parsed = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = parsed as {
    messages?: UIMessage[];
    session_id?: string;
    id?: string;
  };

  const messages = body.messages ?? [];
  const sessionId = body.session_id ?? body.id;

  const message = latestUserMessageText(messages);
  if (!message) {
    return new Response(
      JSON.stringify({
        error:
          "No user message with text was found. Type a message and try again.",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const upstreamPayload: { message: string; session_id?: string } = {
    message,
  };
  if (sessionId != null && String(sessionId).length > 0) {
    upstreamPayload.session_id = String(sessionId);
  }

  let upstream: Response;
  try {
    upstream = await fetch(DEFAULT_CHAT_BACKEND, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream, application/json, text/plain, */*",
      },
      body: JSON.stringify(upstreamPayload),
      signal: req.signal,
      cache: "no-store",
    });
  } catch (err) {
    console.error("[chat proxy] upstream fetch failed:", err);
    return new Response(
      JSON.stringify({
        error:
          "The Fortis assistant is temporarily unavailable. Please try again shortly.",
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "");
    console.error("[chat proxy] upstream HTTP error:", upstream.status, detail);
    return new Response(
      JSON.stringify({
        error:
          "The assistant service returned an error. Please try again in a moment.",
        detail: detail.slice(0, 800),
      }),
      {
        status: 502,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const ctype = upstream.headers.get("content-type") ?? "";

  if (ctype.includes("application/json")) {
    let raw: string;
    try {
      raw = await upstream.text();
    } catch (err) {
      console.error("[chat proxy] failed to read JSON body:", err);
      return new Response(
        JSON.stringify({
          error:
            "Could not read the assistant response. Please try again shortly.",
        }),
        {
          status: 502,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const jsonStream = createUIMessageStream({
      originalMessages: messages,
      execute: async ({ writer }) => {
        const textId = generateId();
        writer.write({ type: "text-start", id: textId });
        try {
          let delta = raw;
          try {
            const parsed = JSON.parse(raw) as unknown;
            delta =
              extractTextFromJsonPayload(parsed) ||
              (typeof parsed === "string" ? parsed : raw);
          } catch {
            /* use raw text */
          }
          if (delta.length > 0) {
            writer.write({
              type: "text-delta",
              id: textId,
              delta,
            });
          }
        } finally {
          writer.write({ type: "text-end", id: textId });
        }
      },
      onError: (error) =>
        error instanceof Error ? error.message : "Assistant response failed.",
    });
    return createUIMessageStreamResponse({ stream: jsonStream });
  }

  const upstreamBody = upstream.body;
  if (!upstreamBody) {
    return new Response(
      JSON.stringify({
        error: "The assistant returned an empty response.",
      }),
      {
        status: 502,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const stream = createUIMessageStream({
    originalMessages: messages,
    execute: async ({ writer }) => {
      const textId = generateId();
      writer.write({ type: "text-start", id: textId });
      try {
        await pipeUpstreamToWriter(upstreamBody, ctype || null, writer, textId);
      } catch (err) {
        console.error("[chat proxy] stream error:", err);
        writer.write({
          type: "error",
          errorText:
            err instanceof Error
              ? err.message
              : "The assistant stream was interrupted. Please try again.",
        });
      } finally {
        writer.write({ type: "text-end", id: textId });
      }
    },
    onError: (error) =>
      error instanceof Error ? error.message : "Assistant stream failed.",
  });

  return createUIMessageStreamResponse({ stream });
}
