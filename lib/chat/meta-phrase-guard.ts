/**
 * Client-side safety net: meta / health-check prompts should not surface estimate
 * wizard copy if the model mis-fires. Pair with prior user message + assistant heuristics.
 */

const META_PHRASE_SUBSTRINGS = [
  "what can you do",
  "are you working now",
  "still not",
  "tell me what you do",
  "what else can you do",
  "are you broken",
] as const;

export function userMessageContainsMetaPhrase(userText: string): boolean {
  const t = userText.toLowerCase();
  return META_PHRASE_SUBSTRINGS.some((p) => t.includes(p));
}

export function assistantTextLooksLikeEstimateWizard(text: string): boolean {
  const t = text.toLowerCase();
  if (/\bstep\s*\d+\s*\/\s*\d+/.test(t)) return true;
  if (t.includes("got it") && t.includes("quick ship")) return true;
  if (t.includes("collect a structured") && t.includes("estimate")) return true;
  return false;
}

/** Shown when we suppress wizard-shaped replies for meta phrases. */
export const META_PHRASE_FALLBACK_REPLY = `I'm the **Fortis Edge** packaging assistant. I can help with:

- **Program context** — Tier 3 & Tier 4, FlexLink, digital plants (Orem / Marietta), and how offerings fit together  
- **Portal & workflows** — what the portal is for, typical steps, and who to loop in for exceptions  
- **Roadmap & integrations** — high-level timing language for Radius, Infigo, LabelTraxx, and related topics  
- **Logistics concepts** — split shipping, proofing expectations, and similar operational questions  

Ask a specific Fortis Edge or portal question, or say **Quick Ship** / **estimate** when you want to walk through a structured shipping estimate.`;
