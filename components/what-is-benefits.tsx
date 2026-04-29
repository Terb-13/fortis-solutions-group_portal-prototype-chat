"use client";

import { motion } from "framer-motion";
import { Globe2, Layers, Rocket, Users } from "lucide-react";

const benefits = [
  {
    icon: Rocket,
    title: "Built for speed",
    text: "Digital HP lanes in Orem & Marietta for Tier 3 & 4 + low-quantity work.",
  },
  {
    icon: Globe2,
    title: "Portal-first",
    text: "Self-service for routine tasks; enterprise story stays intact.",
  },
  {
    icon: Layers,
    title: "Phased roadmap",
    text: "Proofing, FlexLink, split shipping—aligned to real plant readiness.",
  },
  {
    icon: Users,
    title: "1,100+ Fortis team",
    text: "National footprint; solutions discipline you expect from Fortis.",
  },
] as const;

export function WhatIsBenefits() {
  return (
    <motion.div
      className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {benefits.map(({ icon: Icon, title, text }) => (
        <motion.div
          key={title}
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
          className="glass-panel glass-panel-hover p-6"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#00A651]/12 text-[#4ade80]">
            <Icon className="size-5" strokeWidth={1.75} />
          </div>
          <h2 className="mt-4 text-base font-semibold text-white">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500">{text}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
