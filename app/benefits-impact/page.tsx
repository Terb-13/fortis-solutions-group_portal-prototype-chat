import { FORTIS } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: `Benefits & Impact | ${FORTIS.productName}`,
  description: "Role-based benefits for Sales, CX, Ops, and Plants.",
};

const roles = {
  Sales: [
    "Faster, cleaner stories for Tier 3 & 4 prospects",
    "Portal proof points for digital speed plants",
    "Roadmap clarity for proofing & integrations",
  ],
  CX: [
    "Fewer routine tickets when status is visible",
    "Clear escalation path for exceptions",
    "Consistent answers aligned to April 2026 portal update",
  ],
  Ops: [
    "Digital handoffs reduce manual routing",
    "Targets for FlexLink and split shipping improve planning",
    "Plant alignment between Orem and Marietta",
  ],
  Plants: [
    "HP Digital Press lanes tuned for low-quantity work",
    "Proofing targets tied to Orem readiness",
    "Integration milestones that respect production reality",
  ],
} as const;

export default function BenefitsImpactPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      <h1 className="font-heading text-3xl font-semibold text-[#003087] md:text-4xl">
        Benefits &amp; Impact
      </h1>
      <p className="mt-4 max-w-3xl text-muted-foreground">
        Fortis Edge benefits land differently by role. Use the tabs to align
        internal conversations; the before/after table summarizes the Tier 3
        &amp; 4 shift.
      </p>

      <Tabs defaultValue="Sales" className="mt-10">
        <TabsList className="flex h-auto flex-wrap justify-start gap-1">
          {(Object.keys(roles) as (keyof typeof roles)[]).map((r) => (
            <TabsTrigger key={r} value={r}>
              {r}
            </TabsTrigger>
          ))}
        </TabsList>
        {(Object.keys(roles) as (keyof typeof roles)[]).map((r) => (
          <TabsContent key={r} value={r} className="mt-6 rounded-xl border bg-card p-6">
            <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
              {roles[r].map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>

      <h2 className="font-heading mt-14 text-2xl font-semibold text-[#003087]">
        Before / After (Tier 3 &amp; 4)
      </h2>
      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-muted/80 text-foreground">
            <tr>
              <th className="p-4 font-semibold">Area</th>
              <th className="p-4 font-semibold">Before</th>
              <th className="p-4 font-semibold">After (Fortis Edge)</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <tr>
              <td className="p-4 font-medium">Engagement</td>
              <td className="p-4 text-muted-foreground">
                Ad-hoc email + phone loops
              </td>
              <td className="p-4 text-muted-foreground">
                Portal-first routines with clear escalation
              </td>
            </tr>
            <tr>
              <td className="p-4 font-medium">Visibility</td>
              <td className="p-4 text-muted-foreground">
                Opaque status for smaller SKUs
              </td>
              <td className="p-4 text-muted-foreground">
                Order visibility paths for enabled accounts
              </td>
            </tr>
            <tr>
              <td className="p-4 font-medium">Proofing</td>
              <td className="p-4 text-muted-foreground">
                Attachment sprawl
              </td>
              <td className="p-4 text-muted-foreground">
                Online proofing rollout (Orem target Mar 1, 2026)
              </td>
            </tr>
            <tr>
              <td className="p-4 font-medium">Fulfillment options</td>
              <td className="p-4 text-muted-foreground">
                Single-path shipping assumptions
              </td>
              <td className="p-4 text-muted-foreground">
                Split shipping target Apr 30, FlexLink target Mar 15
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
