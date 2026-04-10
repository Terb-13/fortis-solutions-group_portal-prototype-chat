import { ChatPanel } from "@/components/chat-panel";
import { FORTIS } from "@/lib/constants";

export const metadata = {
  title: `Packaging Assistant | ${FORTIS.productName}`,
  description:
    "Grok-powered Fortis Packaging Assistant for labels, sleeves, flexible packaging, cartons, and sustainability.",
};

export default function AssistantPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <div className="mb-8 space-y-2">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-[#003087]">
          Packaging Assistant
        </h1>
        <p className="text-muted-foreground">
          Powered by Grok (xAI) with Fortis positioning, product coverage, portal
          themes, and Gold Seal / CTM applicator context. Use the floating widget
          on any page for the same conversation.
        </p>
      </div>
      <ChatPanel />
    </div>
  );
}
