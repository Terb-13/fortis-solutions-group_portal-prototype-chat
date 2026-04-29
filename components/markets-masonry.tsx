"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export type MarketPhoto = {
  src: string;
  alt: string;
};

function PhotoCard({
  m,
  aspectClass,
  index,
}: {
  m: MarketPhoto;
  aspectClass: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-white/[0.08] glass-panel shadow-card-hover"
    >
      <div className={`relative w-full ${aspectClass}`}>
        <Image
          src={m.src}
          alt={m.alt}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 32vw, (min-width: 640px) 48vw, 100vw"
        />
      </div>
    </motion.div>
  );
}

export function MarketsMasonry({
  beverage,
  healthBeauty,
}: {
  beverage: readonly MarketPhoto[];
  healthBeauty: readonly MarketPhoto[];
}) {
  return (
    <>
      <p className="mt-8 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Beverage
      </p>
      <div className="mt-4 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {beverage.map((m, i) => (
          <PhotoCard key={m.src} m={m} aspectClass="aspect-[4/5]" index={i} />
        ))}
      </div>

      <p className="mt-10 text-xs font-semibold uppercase tracking-wider text-zinc-500">
        Health &amp; beauty
      </p>
      <div className="mt-4 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {healthBeauty.map((m, i) => (
          <PhotoCard
            key={m.src}
            m={m}
            aspectClass="aspect-[3/4] sm:aspect-[4/5]"
            index={i}
          />
        ))}
      </div>
    </>
  );
}
