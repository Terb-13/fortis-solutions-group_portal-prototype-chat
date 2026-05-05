import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateId,
  type UIMessage,
} from "ai";

import { buildFortisKnowledgeBlockForChat } from "@/lib/knowledge/chat-context";
import { composeProxiedUserPayload } from "@/lib/chat/build-backend-message";

/** Pro / Fluid: up to 300s; Hobby caps lower — see Vercel plan limits. */
export const maxDuration = 300;

/**
 * Troubleshooting (portal vs curl):
 * - Set `FORTIS_CHAT_BACKEND_URL` to the FastAPI base that handles POST `/chat`, e.g.
 *   https://fortis-solutions-prototype-chat.vercel.app/chat (no typos / stale preview URLs).
 * - This route forwards `conversation_id` from the client session; the Python service may load
 *   persisted flow state for that id, so behavior can differ from curl tests that omit it.
 * - Set `FORTIS_CHAT_DEBUG_PROXY=1` to log outbound URL, conversation id, message length/previews,
 *   and parsed reply metadata to Vercel/host logs (disable when done).
 */

function debugProxyEnabled(): boolean {
  const v = process.env.FORTIS_CHAT_DEBUG_PROXY?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

/**
 * FastAPI `POST /chat` URL (must be the Python backend, not this Next.js app).
 * Normalizes missing `https://` and adds `/chat` when only the origin is given.
 */
function resolveBackendUrl(): string | null {
  const raw = process.env.FORTIS_CHAT_BACKEND_URL?.trim();
  if (raw) {
    const withScheme = /^https?:\/\//i.test(raw)
      ? raw
      : `https://${raw.replace(/^\/+/, "")}`;
    try {
      const u = new URL(withScheme);
      if (!u.pathname || u.pathname === "/") {
        u.pathname = "/chat";
      }
      return u.toString();
    } catch {
      return null;
    }
  }
  if (process.env.NODE_ENV === "development") {
    return "http://127.0.0.1:8000/chat";
  }
  return null;
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
    id?: string;
    conversation_id?: string;
    session_id?: string;
  };

  const messages = body.messages ?? [];

  const lastMessage = messages[messages.length - 1];
  const userText =
    (lastMessage?.parts?.find((p) => p.type === "text") as { text?: string })
      ?.text ||
    "";

  if (!userText.trim()) {
    return new Response(JSON.stringify({ error: "No message provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const knowledgeBlock = await buildFortisKnowledgeBlockForChat();
  const legacyLatestOnly = process.env.FORTIS_CHAT_TRANSCRIPT === "false";
  const messageForBackend = legacyLatestOnly
    ? knowledgeBlock.trim()
      ? `[Fortis knowledge base — use to answer accurately; do not quote this header.]\n\n${knowledgeBlock}\n\n----\n\nUser message:\n${userText}`
      : userText
    : composeProxiedUserPayload({
        knowledgeBlock,
        messages,
        fallbackLatestUserText: userText,
      });

  const conversationId =
    body.conversation_id ??
    body.session_id ??
    body.id ??
    lastMessage?.id ??
    undefined;

  const backendUrl = resolveBackendUrl();
  if (!backendUrl) {
    return new Response(
      JSON.stringify({
        error:
          "Chat backend URL is not configured. Set FORTIS_CHAT_BACKEND_URL to your FastAPI deployment (POST /chat).",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream, text/plain, */*",
      },
      body: JSON.stringify({
        message: messageForBackend,
        conversation_id: conversationId,
      }),
      signal: req.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (debugProxyEnabled()) {
        console.info(
          "[fortis-chat-proxy] backend error",
          JSON.stringify({
            backendUrl,
            status: response.status,
            conversationId: conversationId ?? null,
            messageLen: messageForBackend.length,
            detailPreview: errorText.slice(0, 500),
          }),
        );
      }
      return new Response(
        JSON.stringify({
          error:
            "The assistant service returned an error. Please try again in a moment.",
          detail: errorText,
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const ctype = response.headers.get("content-type") ?? "";

    // FastAPI POST /chat returns JSON { reply, conversation_id }
    if (ctype.includes("application/json")) {
      const raw = await response.text();
      if (debugProxyEnabled()) {
        const hdr = (name: string) => response.headers.get(name) ?? null;
        let parsed: Record<string, unknown> | null = null;
        try {
          parsed = JSON.parse(raw) as Record<string, unknown>;
        } catch {
          parsed = null;
        }
        const reply =
          parsed && typeof parsed.reply === "string" ? parsed.reply : null;
        console.info(
          "[fortis-chat-proxy] json response",
          JSON.stringify({
            backendUrl,
            conversationId: conversationId ?? null,
            transcriptMode: legacyLatestOnly ? "latest-only" : "full",
            messageLen: messageForBackend.length,
            messageStart: messageForBackend.slice(0, 220),
            messageEnd: messageForBackend.slice(-220),
            xEstimateFlowBuild: hdr("x-estimate-flow-build"),
            replyLen: reply?.length ?? null,
            replyStart: reply ? reply.slice(0, 320) : null,
            estimate_id:
              parsed && "estimate_id" in parsed
                ? parsed.estimate_id
                : undefined,
            backendConversationId:
              parsed && typeof parsed.conversation_id === "string"
                ? parsed.conversation_id
                : undefined,
          }),
        );
      }
      const stream = createUIMessageStream({
        originalMessages: messages,
        execute: async ({ writer }) => {
          const textId = generateId();
          writer.write({ type: "text-start", id: textId });
          try {
            let delta = raw;
            try {
              const data = JSON.parse(raw) as { reply?: string };
              if (typeof data.reply === "string") delta = data.reply;
            } catch {
              /* use raw */
            }
            if (delta.length > 0) {
              writer.write({ type: "text-delta", id: textId, delta });
            }
          } finally {
            writer.write({ type: "text-end", id: textId });
          }
        },
      });
      return createUIMessageStreamResponse({ stream });
    }

    const stream = createUIMessageStream({
      originalMessages: messages,
      execute: async ({ writer }) => {
        const reader = response.body?.getReader();
        if (!reader) return;

        const textId = generateId();
        writer.write({ type: "text-start", id: textId });

        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const payload = trimmed.slice(5).trim();
              if (!payload || payload === "[DONE]") continue;
              try {
                const data = JSON.parse(payload) as { text?: string };
                if (data.text) {
                  writer.write({
                    type: "text-delta",
                    id: textId,
                    delta: data.text,
                  });
                }
              } catch {
                // ignore parse errors
              }
            }
          }
        } finally {
          writer.write({ type: "text-end", id: textId });
        }
      },
    });

    return createUIMessageStreamResponse({ stream });
  } catch (error) {
    console.error("Backend proxy error:", error);
    return new Response(
      JSON.stringify({
        error:
          "The assistant service returned an error. Please try again in a moment.",
      }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }
}
