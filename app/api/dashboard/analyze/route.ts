import { NextResponse } from "next/server";
import { generateText } from "ai";
import { fortisModel } from "@/lib/ai";
import { FORTIS_SYSTEM_PROMPT } from "@/lib/fortis-system-prompt";

export const maxDuration = 60;

export async function POST(req: Request) {
  if (!process.env.XAI_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          "Missing XAI_API_KEY. Add it to your environment to enable analysis.",
      }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }

  const { transcript } = (await req.json()) as { transcript?: string };
  if (!transcript?.trim()) {
    return NextResponse.json({ error: "No transcript provided." }, { status: 400 });
  }

  const { text } = await generateText({
    model: fortisModel,
    system: `${FORTIS_SYSTEM_PROMPT}

You are helping Fortis internal teams summarize customer conversations into FAQ-style knowledge.
Return ONLY valid JSON (no markdown fences) with this shape:
{"faqs":[{"question":"string","answer":"string"}]}
Rules:
- Produce 3 to 6 concise FAQ entries.
- Questions should read like real customer questions.
- Answers must be accurate to Fortis offerings and professional in tone.
- Do not mention conveyor belts or packaging-line metaphors.`,
    prompt: `Conversation transcript to analyze:\n\n${transcript.slice(0, 12000)}`,
  });

  try {
    const parsed = JSON.parse(text) as {
      faqs: { question: string; answer: string }[];
    };
    return NextResponse.json({ faqs: parsed.faqs ?? [] });
  } catch {
    return NextResponse.json({
      faqs: [],
      raw: text,
      parseError: true,
    });
  }
}
