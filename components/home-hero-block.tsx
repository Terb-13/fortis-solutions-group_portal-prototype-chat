"use client";

import { motion } from "framer-motion";
import { ArrowRight, Radio } from "lucide-react";
import Link from "next/link";
import { FORTIS } from "@/lib/constants";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeroBackdrop } from "@/components/hero-backdrop";
import { FORTIS_IMAGES } from "@/lib/fortis-images";
import Image from "next/image";

export function HomeHeroBlock() {
  return (
    <section className="relative min-h-[min(88dvh,860px)] overflow-hidden">
      <HeroBackdrop />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative aspect-[2.4/1] w-[min(70vw,520px)] opacity-[0.1] sm:w-[min(60vw,640px)]">
          <Image
            src={FORTIS_IMAGES.logoReverse}
            alt="Watermarked Fortis reverse logo"
            fill
            className="object-contain"
            priority
            sizes="(min-width: 1024px) 640px, 70vw"
          />
        </div>
      </div>
      <div className="relative z-[1] mx-auto flex min-h-[min(88dvh,860px)] max-w-7xl flex-col justify-end px-4 pb-16 pt-32 md:px-6 md:pb-24 md:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-300"
        >
          <Radio className="size-3.5 text-[#4ade80]" aria-hidden />
          Fortis Edge · SBU &amp; portal ops
        </motion.div>
        <motion.h1
          className="mt-6 max-w-[22ch] font-sans text-[clamp(2rem,5vw,3.75rem)] font-semibold leading-[1.06] tracking-tight text-white"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          Edge-ready ops.
          <span className="mt-2 block bg-gradient-to-br from-white via-zinc-100 to-zinc-500 bg-clip-text text-transparent">
            SBU clarity at speed.
          </span>
        </motion.h1>
        <motion.p
          className="mt-5 max-w-xl text-base leading-relaxed text-zinc-400 md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
        >
          {FORTIS.subhead}
        </motion.p>
        <motion.div
          className="mt-8 flex flex-wrap gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
        >
          <Link
            href="/customer-portal"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-12 border-0 bg-[#00A651] px-8 text-white shadow-lg shadow-[#00A651]/25 transition hover:bg-[#00A651]/90",
            )}
          >
            Open command center
            <ArrowRight className="ml-2 size-4" />
          </Link>
          <Link
            href="/what-is-fortis-edge"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "h-12 border-white/10 bg-white/[0.04] text-zinc-100 hover:bg-white/[0.08]",
            )}
          >
            What is Fortis Edge?
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
