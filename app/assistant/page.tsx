import { AssistantToolbar } from "@/components/assistant-toolbar";
import { ChatPanel } from "@/components/chat-panel";
import { FORTIS } from "@/lib/constants";

export const metadata = {
  title: `Fortis Edge Assistant | ${FORTIS.productName}`,
  description:
    "Fortis Edge assistant for Tier 3 & 4 programs, portal capabilities, and roadmap.",
};

export default function AssistantPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <div className="mb-8 space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-[#003087]">
          Fortis Edge Assistant
        </h1>
        <p className="text-muted-foreground">
          Guidance on Fortis Edge definitions, portal workflows, Tier 3 &amp; 4
          programs, integrations, and roadmap dates. The floating widget on every
          page continues this same conversation.
        </p>
      </div>
      <AssistantToolbar />
      <ChatPanel />
    </div>
  );
}
