import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  generateId,
  type UIMessage,
} from "ai";
import { textFromUIMessage } from "@/lib/message-text";

export const maxDuration = 60;

const BACKEND_URL =
  process.env.FORTIS_CHAT_BACKEND_URL ||
  "https://fortis-solutions-prototype-chat.vercel.app/chat";

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
  const sessionFromTransport = body.session_id ?? body.id;

  let lastUser: UIMessage | undefined;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") {
      lastUser = messages[i];
      break;
    }
  }

  const userText = lastUser ? textFromUIMessage(lastUser).trim() : "";

  if (!userText) {
    return new Response(JSON.stringify({ error: "No message provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const upstreamPayload: { message: string; session_id?: string } = {
    message: userText,
  };
  const sid =
    sessionFromTransport != null &&
    String(sessionFromTransport).trim() !== ""
      ? String(sessionFromTransport)
      : lastUser?.id;
  if (sid) upstreamPayload.session_id = sid;

  try {
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream, application/json, text/plain, */*",
      },
      body: JSON.stringify(upstreamPayload),
      signal: req.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({
          error:
            "The assistant service returned an error. Please try again in a moment.",
          detail: errorText.slice(0, 800),
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const ctype = response.headers.get("content-type") ?? "";

    if (ctype.includes("application/json")) {
      const raw = await response.text();
      const jsonStream = createUIMessageStream({
        originalMessages: messages,
        execute: async ({ writer }) => {
          const textId = generateId();
          writer.write({ type: "text-start", id: textId });
          try {
            let delta = raw;
            try {
              const data = JSON.parse(raw) as Record<string, unknown>;
              if (typeof data.text === "string") delta = data.text;
              else if (typeof data.message === "string") delta = data.message;
              else if (typeof data.content === "string") delta = data.content;
            } catch {
              /* use raw string */
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
      });
      return createUIMessageStreamResponse({ stream: jsonStream });
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
              const payloadStr = trimmed.slice(5).trim();
              if (payloadStr === "[DONE]" || payloadStr === "") continue;
              try {
                const data = JSON.parse(payloadStr) as { text?: string };
                if (data.text) {
                  writer.write({
                    type: "text-delta",
                    id: textId,
                    delta: data.text,
                  });
                }
              } catch {
                /* ignore parse errors */
              }
            }
          }

          if (buffer.trim()) {
            const trimmed = buffer.trim();
            if (trimmed.startsWith("data:")) {
              const payloadStr = trimmed.slice(5).trim();
              if (payloadStr && payloadStr !== "[DONE]") {
                try {
                  const data = JSON.parse(payloadStr) as { text?: string };
                  if (data.text) {
                    writer.write({
                      type: "text-delta",
                      id: textId,
                      delta: data.text,
                    });
                  }
                } catch {
                  /* ignore */
                }
              }
            }
          }
        } finally {
          writer.write({ type: "text-end", id: textId });
        }
      },
      onError: (error) =>
        error instanceof Error ? error.message : "Assistant stream failed.",
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
