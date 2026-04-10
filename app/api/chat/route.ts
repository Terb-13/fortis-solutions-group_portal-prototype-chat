import { convertToModelMessages, streamText, type UIMessage } from "ai";
import baselineFaqs from "@/data/faqs.json";
import { fortisModel } from "@/lib/ai";
import { FORTIS_SYSTEM_PROMPT } from "@/lib/fortis-system-prompt";

const FAQ_CANONICAL = (baselineFaqs as { question: string; answer: string }[])
  .map((f) => `Q: ${f.question}\nA: ${f.answer}`)
  .join("\n\n");

export const maxDuration = 60;

export async function POST(req: Request) {
  if (!process.env.XAI_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          "Missing XAI_API_KEY. Add it to your environment to enable the Packaging Assistant.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  const body = (await req.json()) as { messages: UIMessage[] };
  const messages = body.messages ?? [];
  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: fortisModel,
    system: `${FORTIS_SYSTEM_PROMPT}

Canonical FAQ entries (align answers with these when applicable):
${FAQ_CANONICAL}`,
    messages: modelMessages,
  });

  return result.toUIMessageStreamResponse();
}
