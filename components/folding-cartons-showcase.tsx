"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { FORTIS_IMAGES } from "@/lib/fortis-images";

export function FoldingCartonsShowcase() {
  const shots = [
    {
      src: FORTIS_IMAGES.hymesLock01,
      alt:
        "Fortis Edge Hymes lock automatic bottom folding carton structural view one",
    },
    {
      src: FORTIS_IMAGES.hymesLock02,
      alt:
        "Fortis Edge Hymes lock automatic bottom folding carton structural view two",
    },
  ] as const;

  return (
    <div className="mt-8 grid gap-5 md:grid-cols-2">
      {shots.map((s, i) => (
        <motion.div
          key={s.src}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.5,
            delay: i * 0.12,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{ y: -4 }}
          className="glass-panel overflow-hidden"
        >
          <div className="relative aspect-[4/3] w-full sm:aspect-[3/2]">
            <Image
              src={s.src}
              alt={s.alt}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 40vw, 100vw"
              priority={i === 0}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
