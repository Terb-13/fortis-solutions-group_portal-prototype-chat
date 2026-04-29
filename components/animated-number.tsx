"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

type AnimatedNumberProps = {
  value: number;
  className?: string;
  format?: (n: number) => string;
};

export function AnimatedNumber({
  value,
  className,
  format = (n) => String(n),
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const from = fromRef.current;
    const controls = animate(from, value, {
      duration: 0.85,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
      onComplete: () => {
        fromRef.current = value;
      },
    });
    return () => controls.stop();
  }, [value]);

  return <span className={className}>{format(display)}</span>;
}
