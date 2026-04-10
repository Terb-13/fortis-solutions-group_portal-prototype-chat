import {
  Factory,
  Headphones,
  LineChart,
  Settings2,
} from "lucide-react";
import { FORTIS } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: `Benefits & Impact | ${FORTIS.productName}`,
  description: "Role-based benefits for Sales, CX, Ops, and Plants.",
};

const roles = {
  Sales: {
    icon: LineChart,
    items: [
      "Sharper Tier 3 & 4 narrative",
      "Portal proof points",
      "Roadmap you can quote",
    ],
  },
  CX: {
    icon: Headphones,
    items: [
      "Less noise on routine status",
      "Clear escalation path",
      "Aligned to April 2026 portal",
    ],
  },
  Ops: {
    icon: Settings2,
    items: [
      "Digital handoffs",
      "FlexLink / split shipping targets",
      "Orem + Marietta alignment",
    ],
  },
  Plants: {
    icon: Factory,
    items: [
      "HP lanes for low-quantity",
      "Proofing tied to Orem",
      "Integration milestones grounded",
    ],
  },
} as const;

const tableRows = [
  {
    area: "Engagement",
    before: "Email + phone loops",
    after: "Portal-first + escalation",
  },
  {
    area: "Visibility",
    before: "Opaque on small SKUs",
    after: "Order visibility (enabled)",
  },
  {
    area: "Proofing",
    before: "Attachments",
    after: "Online proofing (Orem Mar 1)",
  },
  {
    area: "Fulfillment",
    before: "Single path",
    after: "Split + FlexLink targets",
  },
] as const;

export default function BenefitsImpactPage() {
  return (
    <div className="section-y mx-auto max-w-6xl px-4 md:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-4xl font-semibold text-[#003087] md:text-5xl">
          Benefits &amp; impact
        </h1>
        <p className="mt-4 text-muted-foreground">
          By role—then the Tier 3 &amp; 4 shift in one glance.
        </p>
      </div>

      <Tabs defaultValue="Sales" className="mt-12">
        <TabsList className="flex h-auto w-full flex-wrap justify-center gap-2 bg-muted/50 p-2 md:justify-start">
          {(Object.keys(roles) as (keyof typeof roles)[]).map((r) => {
            const Icon = roles[r].icon;
            return (
              <TabsTrigger
                key={r}
                value={r}
                className="gap-2 rounded-lg px-4 py-2.5 data-[state=active]:bg-[#003087] data-[state=active]:text-white"
              >
                <Icon className="size-4" />
                {r}
              </TabsTrigger>
            );
          })}
        </TabsList>
        {(Object.keys(roles) as (keyof typeof roles)[]).map((r) => {
          const { icon: Icon, items } = roles[r];
          return (
            <TabsContent key={r} value={r} className="mt-6">
              <div className="rounded-2xl border border-border/80 bg-card p-8 shadow-card md:p-10">
                <div className="flex items-center gap-3 text-[#003087]">
                  <Icon className="size-8" strokeWidth={1.5} />
                  <h2 className="font-heading text-2xl font-semibold">{r}</h2>
                </div>
                <ul className="mt-6 grid gap-4 sm:grid-cols-3">
                  {items.map((x) => (
                    <li
                      key={x}
                      className="flex gap-3 rounded-xl border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground"
                    >
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00A651]" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      <h2 className="mt-20 text-center font-heading text-2xl font-semibold text-[#003087] md:text-3xl">
        Tier 3 &amp; 4 — before / after
      </h2>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-border/80 shadow-card">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="bg-[#003087] text-white">
            <tr>
              <th className="p-4 font-semibold">Area</th>
              <th className="p-4 font-semibold">Before</th>
              <th className="p-4 font-semibold">After</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {tableRows.map((row) => (
              <tr key={row.area} className="transition hover:bg-muted/40">
                <td className="p-4 font-medium text-foreground">{row.area}</td>
                <td className="p-4 text-muted-foreground">{row.before}</td>
                <td className="p-4 text-muted-foreground">{row.after}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
