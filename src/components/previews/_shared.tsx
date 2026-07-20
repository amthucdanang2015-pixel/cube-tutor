"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

export { useReducedMotion };

/** Dotted-grid background layer used by several previews. */
export function DotGrid({ opacity = 0.08 }: { opacity?: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:22px_22px]"
      style={{ opacity }}
    />
  );
}

/** Tracks normalized pointer position (0..1) over a container; falls back to a
 *  slow auto-orbit when idle or on touch so previews are always "alive". */
export function usePointer(autoOrbit = true) {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState({ x: 0.5, y: 0.45, active: false });

  useEffect(() => {
    if (!autoOrbit) return;
    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 0.012;
      setP((prev) =>
        prev.active
          ? prev
          : { x: 0.5 + Math.cos(t) * 0.32, y: 0.45 + Math.sin(t * 1.3) * 0.28, active: false },
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoOrbit]);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setP({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height, active: true });
  }
  function onLeave() {
    setP((prev) => ({ ...prev, active: false }));
  }
  return { ref, p, onMove, onLeave };
}

/** Re-fires a value on an interval — handy for replaying entrance loops. */
export function useTick(intervalMs: number, max = Number.MAX_SAFE_INTEGER) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((v) => (v + 1) % max), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, max]);
  return n;
}
