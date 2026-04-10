import { createXai } from "@ai-sdk/xai";

const xai = createXai({
  apiKey: process.env.XAI_API_KEY ?? "",
});

export const fortisModel = xai("grok-4");
