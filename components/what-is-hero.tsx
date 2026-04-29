"use client";

import { motion } from "framer-motion";
import { FORTIS } from "@/lib/constants";
import { HeroBackdrop } from "@/components/hero-backdrop";

export function WhatIsHero() {
  return (
    <section className="relative min-h-[min(56dvh,520px)]">
      <HeroBackdrop greenGlow={false} />
      <div className="relative z-[1] mx-auto flex min-h-[min(56dvh,520px)] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 md:px-6 md:pb-20 md:pt-32">
        <motion.h1
          className="max-w-3xl text-4xl font-semibold tracking-tight text-white md:text-5xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          What is Fortis Edge?
        </motion.h1>
        <motion.p
          className="mt-4 max-w-2xl text-base text-zinc-400 md:text-lg"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
        >
          {FORTIS.subhead}
        </motion.p>
        <motion.p
          className="mt-6 max-w-xl text-pretty text-sm text-zinc-500 md:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
        >
          SBU for Tier 3 &amp; 4 — digital plants + portal. Fortis quality,
          unchanged.
        </motion.p>
      </div>
    </section>
  );
}
