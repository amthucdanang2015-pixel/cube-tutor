"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DotGrid, usePointer, useTick } from "./_shared";

/* 1 — Magnetic cursor-reactive type */
export function PMagneticType() {
  const { ref, p, onMove, onLeave } = usePointer();
  const letters = "REAL".split("");
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="absolute inset-0 flex items-center justify-center">
      <div className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 animate-drift rounded-full bg-[conic-gradient(from_0deg,#7c5cff55,#22d3ee33,#ec489933,#7c5cff55)] blur-2xl" />
      <div className="relative flex">
        {letters.map((l, i) => {
          const lx = (i + 0.5) / letters.length;
          const dx = (p.x - lx) * 90;
          const dy = (p.y - 0.5) * 70;
          const d = Math.hypot(p.x - lx, p.y - 0.5);
          const push = Math.max(0, 1 - d * 2.2);
          return (
            <motion.span
              key={i}
              animate={{ x: -dx * push, y: -dy * push, scale: 1 + push * 0.12 }}
              transition={{ type: "spring", stiffness: 150, damping: 12 }}
              className="bg-gradient-to-br from-white to-white/50 bg-clip-text text-[18cqw] font-bold leading-none tracking-tighter text-transparent"
              style={{ fontSize: "clamp(2.5rem, 22cqw, 9rem)" }}
            >
              {l}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
}

/* 2 — Horizontal scroll story */
export function PHorizontalStory() {
  const panels = ["#7c5cff", "#22d3ee", "#ec4899", "#f59e0b"];
  const reduce = useReducedMotion();
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="flex h-full"
        animate={reduce ? {} : { x: ["0%", "-75%", "-75%", "0%"] }}
        transition={{ duration: 9, times: [0, 0.45, 0.55, 1], repeat: Infinity, ease: "easeInOut" }}
      >
        {panels.map((c, i) => (
          <div key={i} className="relative flex h-full w-full shrink-0 items-end p-4" style={{ background: `linear-gradient(135deg, ${c}33, transparent)` }}>
            <div className="absolute right-4 top-3 h-10 w-10 rounded-lg" style={{ background: c, filter: "blur(2px)" }} />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-white/40">Scene {i + 1}</div>
              <div className="text-lg font-semibold text-white/90">Parallax</div>
            </div>
          </div>
        ))}
      </motion.div>
      <div className="absolute left-4 right-4 top-3 h-0.5 overflow-hidden rounded-full bg-white/10">
        <motion.div className="h-full bg-white/70" animate={reduce ? {} : { width: ["0%", "100%", "100%", "0%"] }} transition={{ duration: 9, times: [0, 0.45, 0.55, 1], repeat: Infinity, ease: "easeInOut" }} />
      </div>
    </div>
  );
}

/* 3 — Staggered card grid reveal */
export function PStaggerGrid() {
  const tick = useTick(2600);
  const cells = Array.from({ length: 6 });
  return (
    <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-2 p-4">
      {cells.map((_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        return (
          <motion.div
            key={`${tick}-${i}`}
            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.5, delay: (col + row) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-lg border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent"
          />
        );
      })}
    </div>
  );
}

/* 4 — Animated gradient SaaS hero */
export function PGradientHero() {
  const reduce = useReducedMotion();
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 animate-drift bg-[linear-gradient(120deg,#7c5cff,#22d3ee,#ec4899,#7c5cff)] bg-[length:200%_200%] opacity-40" style={{ animation: "gradpan 8s ease infinite" }} />
      <DotGrid opacity={0.06} />
      <motion.div
        animate={reduce ? {} : { y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/15 bg-black/40 p-3 shadow-2xl backdrop-blur-md"
      >
        <div className="flex gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-400" /><span className="h-2 w-2 rounded-full bg-amber-400" /><span className="h-2 w-2 rounded-full bg-emerald-400" /></div>
        <div className="mt-2 h-2 w-2/3 rounded bg-white/40" />
        <div className="mt-1.5 h-2 w-1/2 rounded bg-white/20" />
        <div className="mt-2.5 h-5 w-20 rounded-md bg-gradient-to-r from-accent to-accent2" />
      </motion.div>
    </div>
  );
}

/* 5 — Text mask reveal on scroll */
export function PTextReveal() {
  const words = ["Ship", "something", "real,", "not", "generic", "slop", "—", "make", "it", "yours."];
  const tick = useTick(380);
  const lit = tick % (words.length + 4);
  return (
    <div className="absolute inset-0 flex items-center p-5">
      <p className="flex flex-wrap gap-x-2 gap-y-1 font-serif text-xl leading-snug">
        {words.map((w, i) => (
          <span key={i} className="transition-colors duration-500" style={{ color: i < lit ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.18)" }}>
            {w}
          </span>
        ))}
      </p>
    </div>
  );
}

/* 6 — Bento with live micro-interactions */
export function PBento() {
  const reduce = useReducedMotion();
  const tick = useTick(40);
  const display = Math.min(99, Math.round((tick % 120) * 0.9));
  return (
    <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-2 p-3">
      <div className="col-span-1 row-span-1 flex flex-col justify-center rounded-lg border border-white/10 bg-white/[0.04] px-3">
        <div className="text-xl font-bold text-white tabular-nums">{display}%</div>
        <div className="text-[9px] text-white/40">activation</div>
      </div>
      <div className="col-span-2 row-span-1 flex items-end gap-1 rounded-lg border border-white/10 bg-white/[0.04] p-2">
        <svg viewBox="0 0 100 30" className="h-full w-full">
          <motion.path d="M0 26 L20 18 L40 22 L60 8 L80 14 L100 2" fill="none" stroke="#22d3ee" strokeWidth="2"
            animate={reduce ? {} : { pathLength: [0, 1] }} transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }} />
        </svg>
      </div>
      <div className="col-span-2 row-span-1 flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3">
        <motion.div className="flex h-4 w-8 items-center rounded-full bg-accent/40 px-0.5" animate={reduce ? {} : { backgroundColor: ["rgba(124,92,255,0.2)", "rgba(124,92,255,0.6)"] }} transition={{ duration: 1.4, repeat: Infinity, repeatType: "reverse" }}>
          <motion.span className="h-3 w-3 rounded-full bg-white" animate={reduce ? {} : { x: [0, 14, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }} />
        </motion.div>
        <div className="text-[9px] text-white/40">auto-deploy</div>
      </div>
      <div className="col-span-1 row-span-1 flex items-center justify-center rounded-lg border border-white/10 bg-gradient-to-br from-accent/20 to-accent2/10">
        <motion.div className="h-6 w-6 rounded-full border-2 border-accent2" animate={reduce ? {} : { rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} style={{ borderTopColor: "transparent" }} />
      </div>
    </div>
  );
}

/* 7 — Shared-element page morph */
export function PMorphCard() {
  const tick = useTick(2200);
  const expanded = tick % 2 === 1;
  return (
    <div className="absolute inset-0 flex items-center justify-center p-4">
      <motion.div
        layout
        animate={{ width: expanded ? "90%" : "44%", height: expanded ? "78%" : "52%" }}
        transition={{ type: "spring", stiffness: 200, damping: 26 }}
        className="overflow-hidden rounded-xl border border-white/12 bg-gradient-to-br from-accent/25 to-accent2/15"
      >
        <motion.div layout className="h-1/2 w-full bg-white/10" />
        <motion.div layout className="space-y-1.5 p-3">
          <div className="h-2 w-2/3 rounded bg-white/40" />
          {expanded && <div className="h-2 w-1/2 rounded bg-white/20" />}
        </motion.div>
      </motion.div>
    </div>
  );
}

/* 8 — Sticky scroll feature */
export function PStickyFeature() {
  const tick = useTick(1600);
  const active = tick % 4;
  const colors = ["#7c5cff", "#22d3ee", "#ec4899", "#f59e0b"];
  return (
    <div className="absolute inset-0 grid grid-cols-2 gap-3 p-4">
      <div className="flex flex-col justify-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <motion.span className="h-1.5 rounded-full" animate={{ width: active === i ? 20 : 8, backgroundColor: active === i ? "#fff" : "rgba(255,255,255,0.25)" }} />
            <motion.div className="h-1.5 flex-1 rounded-full" animate={{ backgroundColor: active === i ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.12)" }} />
          </div>
        ))}
      </div>
      <div className="relative overflow-hidden rounded-xl border border-white/10">
        {colors.map((c, i) => (
          <motion.div key={i} className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${c}66, transparent)` }}
            animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.06 }} transition={{ duration: 0.5 }} />
        ))}
      </div>
    </div>
  );
}

/* 9 — Velocity-reactive marquee */
export function PVelocityMarquee() {
  const rowA = ["stagger", "spring", "parallax", "morph", "scrub"];
  const rowB = ["crossfade", "magnetic", "kinetic", "layout", "inertia"];
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-2 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
      <div className="flex -skew-x-6 overflow-hidden">
        <div className="flex shrink-0 animate-marquee items-center gap-5 pr-5">
          {[...rowA, ...rowA].map((w, i) => <span key={i} className="whitespace-nowrap text-sm font-semibold uppercase tracking-widest text-white/70">{w} <span className="text-accent">/</span></span>)}
        </div>
      </div>
      <div className="flex skew-x-6 overflow-hidden">
        <div className="flex shrink-0 items-center gap-5 pr-5" style={{ animation: "marquee 22s linear infinite reverse" }}>
          {[...rowB, ...rowB].map((w, i) => <span key={i} className="whitespace-nowrap text-sm font-semibold uppercase tracking-widest text-white/30">{w} <span className="text-accent2">/</span></span>)}
        </div>
      </div>
    </div>
  );
}

/* 10 — Cursor-following spotlight dark hero */
export function PSpotlight() {
  const { ref, p, onMove, onLeave } = usePointer();
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="absolute inset-0 bg-[#08080a]">
      <DotGrid opacity={0.12} />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-2xl font-bold text-transparent">find the light</span>
      </div>
      <div className="pointer-events-none absolute inset-0 transition-[background] duration-100"
        style={{ background: `radial-gradient(180px circle at ${p.x * 100}% ${p.y * 100}%, transparent, rgba(8,8,10,0.92) 65%)` }} />
      <div className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(150px circle at ${p.x * 100}% ${p.y * 100}%, rgba(124,92,255,0.18), transparent 70%)` }} />
    </div>
  );
}
