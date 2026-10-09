"use client";

import { useEffect, useState } from "react";

/** Animates a number from 0 to `value` on mount (ease-out). */
export function CountUp({ value, decimals = 0, duration = 900, delay = 0 }: { value: number; decimals?: number; duration?: number; delay?: number }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = requestAnimationFrame(() => setShown(value));
      return () => cancelAnimationFrame(id);
    }
    let raf = 0;
    const start = performance.now() + delay;
    const tick = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - start) / duration));
      setShown(value * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, delay]);

  return <>{shown.toLocaleString("en", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</>;
}
