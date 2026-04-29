"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FORTIS_IMAGES } from "@/lib/fortis-images";

/** Decorative pulse pins — approximate Utah / GA plant lanes + hub. */
const PINS = [
  { left: "22%", top: "38%", label: "Digital lane · UT" },
  { left: "74%", top: "54%", label: "Digital lane · GA" },
  { left: "48%", top: "44%", label: "Hub ops" },
] as const;

export function PlantMapInteractive() {
  return (
    <div className="relative mt-8 overflow-hidden rounded-2xl border border-white/[0.08] glass-panel">
      <div className="relative aspect-[21/9] min-h-[220px] w-full">
        <Image
          src="/images/plant-map.jpg"
          alt="United States map showing Fortis plant locations and coverage"
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/85 via-[#0a0a0a]/25 to-transparent" />
        {PINS.map((p, i) => (
          <motion.div
            key={p.label}
            className="absolute z-[2] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
            style={{ left: p.left, top: p.top }}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.45 }}
          >
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00A651]/50" />
              <span className="relative inline-flex h-3 w-3 rounded-full border border-[#00A651]/80 bg-[#00A651] shadow-[0_0_12px_rgba(0,166,81,0.65)]" />
            </span>
            <motion.span
              className="pointer-events-none whitespace-nowrap rounded-full border border-white/10 bg-black/55 px-2 py-0.5 text-[10px] font-medium text-zinc-300 shadow-lg backdrop-blur-md md:text-[11px]"
              animate={{ y: [0, -3, 0] }}
              transition={{
                duration: 4 + i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {p.label}
            </motion.span>
          </motion.div>
        ))}
        <div className="absolute bottom-6 left-6 right-6 flex flex-wrap items-end justify-between gap-4 md:left-10 md:right-10">
          <div className="relative h-10 w-40">
            <Image
              src={FORTIS_IMAGES.logoWhite}
              alt="Fortis white logo with map"
              fill
              className="object-contain object-left"
              sizes="160px"
            />
          </div>
          <p className="max-w-sm text-xs text-zinc-400">
            Coverage and readiness are directional—align with your Edge contact
            for account-specific scope.
          </p>
        </div>
      </div>
    </div>
  );
}
