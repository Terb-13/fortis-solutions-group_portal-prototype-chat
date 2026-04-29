import { BenefitsRoleTabs } from "@/components/benefits-role-tabs";
import { FORTIS } from "@/lib/constants";

export const metadata = {
  title: `Benefits & Impact | ${FORTIS.productName}`,
  description: "Role-based benefits for Sales, CX, Ops, and Plants.",
};

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
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[min(55vh,520px)] bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,rgba(0,166,81,0.11),transparent)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 grid-mesh opacity-[0.22]" aria-hidden />
      <div className="relative section-y mx-auto max-w-6xl px-4 md:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
          Benefits &amp; impact
        </h1>
        <p className="mt-4 text-zinc-500">
          By role—then the Tier 3 &amp; 4 shift in one glance.
        </p>
      </div>

      <BenefitsRoleTabs />

      <h2 className="mt-20 text-center text-2xl font-semibold text-white md:text-3xl">
        Tier 3 &amp; 4 — before / after
      </h2>
      <div className="mt-8 overflow-x-auto rounded-2xl border border-white/[0.08] glass-panel">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead className="border-b border-white/[0.08] bg-white/[0.04] text-zinc-300">
            <tr>
              <th className="p-4 font-semibold">Area</th>
              <th className="p-4 font-semibold">Before</th>
              <th className="p-4 font-semibold">After</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06] bg-[#0f0f0f]">
            {tableRows.map((row) => (
              <tr key={row.area} className="transition hover:bg-white/[0.03]">
                <td className="p-4 font-medium text-zinc-200">{row.area}</td>
                <td className="p-4 text-zinc-500">{row.before}</td>
                <td className="p-4 text-zinc-400">{row.after}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  );
}
