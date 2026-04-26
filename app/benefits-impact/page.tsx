import Image from "next/image";
import { Factory, Headphones, LineChart, Settings2 } from "lucide-react";
import { FORTIS } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata = {
  title: `Benefits & Impact | ${FORTIS.productName}`,
  description: "Role-based benefits for Sales, CX, Ops, and Plants.",
};

const roles = {
  Sales: {
    icon: LineChart,
    image: {
      src: "/images/wine-bottle-50574.jpg",
      alt: "Retail wine bottle with premium label and capsule — on-shelf program example",
    },
    items: [
      "Sharper Tier 3 & 4 narrative",
      "Portal proof points",
      "Roadmap you can quote",
    ],
  },
  CX: {
    icon: Headphones,
    image: {
      src: "/images/akram-huseyn-pA3_Ry7VYcs-unsplash.jpg",
      alt: "Skincare and cosmetics set — health and beauty customer experience example",
    },
    items: [
      "Less noise on routine status",
      "Clear escalation path",
      "Aligned to April 2026 portal",
    ],
  },
  Ops: {
    icon: Settings2,
    image: {
      src: "/images/Beer-Display.jpg",
      alt: "Retail beer display and branded cartons — in-store display operations",
    },
    items: [
      "Digital handoffs",
      "FlexLink / split shipping targets",
      "Orem + Marietta alignment",
    ],
  },
  Plants: {
    icon: Factory,
    image: {
      src: "/images/micheile-henderson-I2lF6gNn5Zo-unsplash.jpg",
      alt: "Premium health and beauty packaging flat lay for plant-ready programs",
    },
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
        <TabsList className="flex h-auto w-full max-w-full flex-nowrap justify-start gap-2 overflow-x-auto overflow-y-hidden bg-muted/50 p-2 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-wrap md:justify-center [&::-webkit-scrollbar]:hidden">
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
          const { icon: Icon, items, image } = roles[r];
          return (
            <TabsContent key={r} value={r} className="mt-6">
              <div className="grid gap-6 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-card md:grid-cols-2">
                <div className="relative min-h-[220px] w-full sm:min-h-[280px]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    priority={r === "Sales"}
                  />
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 text-[#003087]">
                    <Icon className="size-8" strokeWidth={1.5} />
                    <h2 className="font-heading text-2xl font-semibold">{r}</h2>
                  </div>
                  <ul className="mt-6 grid gap-4">
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
