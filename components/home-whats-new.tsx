"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const cards = [
  {
    src: "/images/gift-with-label.jpg",
    title: "Holiday retail hero",
    desc: "Gift wrap · ribbon cues · POS moments",
    alt: "Labeled gift box with kraft paper and string—seasonal retail packaging",
  },
  {
    src: "/images/micheile-henderson-I2lF6gNn5Zo-unsplash.jpg",
    title: "H&B Valentine palette",
    desc: "Shelf-ready tubes · premium finishes",
    alt: "Premium health and beauty flat lay and packaging",
  },
  {
    src: "/images/Flavored-Water-andrew-kayani-_bQxQlLpoVY-unsplash.jpg",
    title: "Beverage summer reset",
    desc: "Chilled case blocks · seasonal flavors",
    alt: "Chilled bottled water and flavored beverage lineup on ice",
  },
  {
    src: "/images/Coffee-Background_4dWz9H7d8OM-unsplash.jpg",
    title: "Winter warm beverages",
    desc: "Sleeves · café takeover kits",
    alt: "Barista-poured coffee in branded cups and sleeves",
  },
] as const;

export function HomeWhatsNew() {
  return (
    <div className="relative -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:thin] md:mx-0 md:px-0">
      {cards.map((c, i) => (
        <motion.div
          key={c.title}
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
          className="w-[min(18rem,78vw)] shrink-0"
        >
          <div className="glass-panel glass-panel-hover group overflow-hidden">
            <div className="relative aspect-[16/10] w-full">
              <Image
                src={c.src}
                alt={c.alt}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                sizes="(min-width: 768px) 18rem, 78vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-sm font-semibold text-white">{c.title}</p>
                <p className="text-xs text-zinc-400">{c.desc}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
