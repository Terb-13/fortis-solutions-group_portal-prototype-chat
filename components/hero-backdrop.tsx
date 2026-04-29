"use client";

import { motion } from "framer-motion";

/** Subtle grid + noise + optional green glow for hero sections. */
export function HeroBackdrop({
  className = "",
  greenGlow = true,
}: {
  className?: string;
  greenGlow?: boolean;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,166,81,0.14),transparent)]" />
      <div
        className="animate-gradient-shift absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(125deg, transparent 0%, rgba(0,166,81,0.08) 35%, rgba(59,130,246,0.06) 55%, transparent 75%)",
        }}
      />
      {greenGlow && (
        <motion.div
          className="absolute -right-32 top-0 h-[500px] w-[500px] rounded-full bg-[#00A651]/[0.07] blur-[100px]"
          animate={{ opacity: [0.5, 0.85, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <div className="absolute inset-0 grid-mesh opacity-40" />
      <div className="absolute inset-0 noise-overlay" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/50 to-[#0a0a0a]" />
    </div>
  );
}
