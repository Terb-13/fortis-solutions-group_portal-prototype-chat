import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { z } from "zod";
import { fortisModel } from "@/lib/ai";
import { FORTIS_SYSTEM_PROMPT } from "@/lib/fortis-system-prompt";

export const maxDuration = 60;

const reviewSchema = z.object({
  improvedBotResponse: z.string(),
  faqRecommendation: z.object({
    action: z.enum(["new", "edit"]),
    targetFaqId: z.string().optional(),
    question: z.string(),
    answer: z.string(),
    rationale: z.string().optional(),
  }),
});

export async function POST(req: Request) {
  if (!process.env.XAI_API_KEY) {
    return NextResponse.json(
      { error: "Missing XAI_API_KEY." },
      { status: 503 },
    );
  }

  const body = (await req.json()) as {
    botMessage?: string;
    correctionNote?: string;
    conversationExcerpt?: string;
  };

  if (!body.botMessage?.trim()) {
    return NextResponse.json({ error: "botMessage required." }, { status: 400 });
  }

  const { object } = await generateObject({
    model: fortisModel,
    schema: reviewSchema,
    system: `${FORTIS_SYSTEM_PROMPT}

You help Fortis Edge operators improve assistant replies and maintain FAQs.
When the user provides a correction note about a bot message, propose:
1) A clearer, accurate replacement bot response (professional, Tier 3/4 + portal aligned).
2) A FAQ recommendation — either a NEW FAQ or an EDIT to an existing FAQ (infer targetFaqId only if clearly matching a known FAQ theme).`,
    prompt: `Original bot message:
---
${body.botMessage}
---

Optional conversation context:
${body.conversationExcerpt ?? "(none)"}

Reviewer correction / intent:
${body.correctionNote ?? "(none)"}

Return structured JSON only.`,
  });

  return NextResponse.json({ result: object });
}
