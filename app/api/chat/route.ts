import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateId,
  type UIMessage,
} from "ai";

export const maxDuration = 60;

/** Default includes path `/chat`. Env often mistakenly omits `https://` — normalize so fetch() gets a valid URL. */
const DEFAULT_CHAT_BACKEND =
  "https://fortis-solutions-prototype-chat.vercel.app/chat";

function resolveBackendUrl(): string {
  const raw = process.env.FORTIS_CHAT_BACKEND_URL?.trim();
  if (!raw) return DEFAULT_CHAT_BACKEND;
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
    return DEFAULT_CHAT_BACKEND;
  }
}

const BACKEND_URL = resolveBackendUrl();

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

  const conversationId =
    body.conversation_id ??
    body.session_id ??
    body.id ??
    lastMessage?.id ??
    undefined;

  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/event-stream, text/plain, */*",
      },
      body: JSON.stringify({
        message: userText,
        conversation_id: conversationId,
      }),
      signal: req.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
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
