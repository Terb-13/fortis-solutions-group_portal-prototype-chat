"use client";

import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Factory, Headphones, LineChart, Settings2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

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

type RoleKey = keyof typeof roles;
const keys = Object.keys(roles) as RoleKey[];

function TabPanel({ r }: { r: RoleKey }) {
  const { icon: Icon, items, image } = roles[r];
  return (
    <motion.div
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="grid overflow-hidden rounded-2xl border border-white/[0.08] glass-panel md:grid-cols-2"
    >
      <div className="relative min-h-[240px] w-full sm:min-h-[300px]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 50vw, 100vw"
          priority={r === "Sales"}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/50 to-transparent md:bg-gradient-to-t" />
      </div>
      <div className="flex flex-col justify-center p-6 md:p-10">
        <div className="flex items-center gap-3 text-[#4ade80]">
          <Icon className="size-8" strokeWidth={1.5} />
          <h2 className="text-2xl font-semibold text-white">{r}</h2>
        </div>
        <ul className="mt-6 grid gap-3">
          {items.map((x) => (
            <li
              key={x}
              className="flex gap-3 rounded-xl border border-dashed border-white/10 bg-white/[0.03] p-4 text-sm text-zinc-400"
            >
              <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00A651]" />
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export function BenefitsRoleTabs() {
  const [active, setActive] = useState<RoleKey>("Sales");

  return (
    <div className="mt-12">
      <LayoutGroup id="benefits-role-tabs">
        <div className="flex w-full flex-nowrap gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-wrap md:justify-center [&::-webkit-scrollbar]:hidden">
          {keys.map((r) => {
            const Icon = roles[r].icon;
            const isOn = active === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => setActive(r)}
                className={cn(
                  "relative flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors",
                  isOn
                    ? "border-transparent text-[#ecfccb]"
                    : "border-white/[0.08] bg-white/[0.03] text-zinc-400 hover:border-white/15 hover:text-zinc-200",
                )}
              >
                {isOn && (
                  <motion.span
                    layoutId="benefits-tab-bg"
                    className="absolute inset-0 rounded-xl border border-[#00A651]/35 bg-[#00A651]/18 shadow-[0_0_28px_-12px_rgba(0,166,81,0.55)]"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 32,
                    }}
                  />
                )}
                <Icon className="relative z-[1] size-4" />
                <span className="relative z-[1]">{r}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>

      <div className="relative mt-8 min-h-[320px]">
        <AnimatePresence mode="wait">
          <TabPanel key={active} r={active} />
        </AnimatePresence>
      </div>
    </div>
  );
}
