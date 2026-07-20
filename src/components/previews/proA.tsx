"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePointer, useTick } from "./_shared";

/* 11 — 3D product spin on scroll (CSS 3D) */
export function P3DSpin() {
  const reduce = useReducedMotion();
  const faces = [
    { t: "rotateY(0deg) translateZ(32px)", c: "#7c5cff" },
    { t: "rotateY(90deg) translateZ(32px)", c: "#22d3ee" },
    { t: "rotateY(180deg) translateZ(32px)", c: "#ec4899" },
    { t: "rotateY(270deg) translateZ(32px)", c: "#f59e0b" },
    { t: "rotateX(90deg) translateZ(32px)", c: "#10b981" },
    { t: "rotateX(-90deg) translateZ(32px)", c: "#6366f1" },
  ];
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: 600 }}>
      <motion.div
        className="relative h-16 w-16"
        style={{ transformStyle: "preserve-3d" }}
        animate={reduce ? {} : { rotateY: 360, rotateX: [0, 20, 0] }}
        transition={{ rotateY: { duration: 8, repeat: Infinity, ease: "linear" }, rotateX: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
      >
        {faces.map((f, i) => (
          <div key={i} className="absolute inset-0 rounded-md border border-white/20" style={{ transform: f.t, background: `${f.c}55`, backdropFilter: "blur(2px)" }} />
        ))}
      </motion.div>
    </div>
  );
}

/* 12 — Liquid gooey cursor */
export function PGooeyCursor() {
  const { ref, p, onMove, onLeave } = usePointer();
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="absolute inset-0 bg-[#0c0c0f]">
      <svg className="absolute h-0 w-0"><filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" /><feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" /></filter></svg>
      <div className="absolute inset-0" style={{ filter: "url(#goo)" }}>
        <div className="absolute h-9 w-9 rounded-full bg-accent" style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%`, transform: "translate(-50%,-50%)", transition: "left .25s, top .25s" }} />
        <div className="absolute h-6 w-6 rounded-full bg-accent2" style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%`, transform: "translate(-50%,-50%)", transition: "left .4s, top .4s" }} />
        <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/80" />
      </div>
    </div>
  );
}

/* 13 — Kinetic typography loop */
export function PKineticType() {
  const words = ["real", "fast", "yours", "shipped"];
  const tick = useTick(1500);
  const w = words[tick % words.length];
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <span className="text-sm uppercase tracking-widest text-white/40">Build something</span>
      <div className="relative h-12 overflow-hidden" style={{ perspective: 400 }}>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={w}
            initial={{ rotateX: -90, opacity: 0, filter: "blur(8px)" }}
            animate={{ rotateX: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ rotateX: 90, opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="block bg-gradient-to-r from-accent to-accent2 bg-clip-text text-4xl font-bold text-transparent"
          >
            {w}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* 14 — Drag-to-explore physics gallery */
export function PDragGallery() {
  const reduce = useReducedMotion();
  const items = ["#7c5cff", "#22d3ee", "#ec4899", "#f59e0b", "#10b981", "#6366f1"];
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute left-2 top-2 flex gap-2"
        animate={reduce ? {} : { x: [0, -90, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        drag="x"
        dragConstraints={{ left: -120, right: 20 }}
      >
        {[...items, ...items].map((c, i) => (
          <div key={i} className="h-20 w-16 shrink-0 rounded-lg border border-white/15" style={{ background: `linear-gradient(135deg, ${c}, ${c}44)`, transform: `rotate(${(i % 3) - 1}deg)` }} />
        ))}
      </motion.div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-2 py-0.5 text-[9px] text-white/50">drag to fling</div>
    </div>
  );
}

/* 15 — Morphing SVG blob */
export function PMorphBlob() {
  const reduce = useReducedMotion();
  const shapes = [
    "M58,-58C72,-44,78,-22,77,-1C76,20,68,40,54,54C40,68,20,76,-2,78C-24,80,-48,76,-62,62C-76,48,-80,24,-79,1C-78,-22,-72,-44,-58,-58C-44,-72,-22,-78,0,-78C22,-78,44,-72,58,-58Z",
    "M48,-52C58,-38,58,-19,60,1C62,21,66,42,57,55C48,68,26,73,3,70C-20,67,-40,56,-55,40C-70,24,-80,3,-76,-16C-72,-35,-54,-52,-35,-61C-16,-70,4,-71,22,-67C40,-63,38,-66,48,-52Z",
  ];
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="-100 -100 200 200" className="h-32 w-32">
        <defs><linearGradient id="bg15" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#7c5cff" /><stop offset="100%" stopColor="#22d3ee" /></linearGradient></defs>
        <motion.path fill="url(#bg15)" animate={reduce ? {} : { d: shapes }} transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }} />
      </svg>
      <span className="absolute text-xs font-semibold mix-blend-overlay">morph</span>
    </div>
  );
}

/* 16 — Terminal / code reveal */
export function PTerminal() {
  const lines = ["$ ship --real", "› building product...", "› adding traction ✓", "✓ live in prod"];
  const [shown, setShown] = useState("");
  const [li, setLi] = useState(0);
  useEffect(() => {
    let ci = 0;
    const id = setInterval(() => {
      const line = lines[li];
      if (ci <= line.length) { setShown(line.slice(0, ci)); ci++; }
      else { setLi((p) => (p + 1) % lines.length); ci = 0; setShown(""); }
    }, 70);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [li]);
  return (
    <div className="absolute inset-0 bg-[#07090a] p-4 font-mono text-[11px] leading-relaxed text-emerald-400" style={{ textShadow: "0 0 6px rgba(16,185,129,0.5)" }}>
      <div className="absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(0deg,#0f0,#0f0_1px,transparent_1px,transparent_3px)]" />
      {lines.slice(0, li).map((l, i) => <div key={i} className="opacity-60">{l}</div>)}
      <div>{shown}<span className="ml-0.5 inline-block h-3 w-1.5 animate-pulse bg-emerald-400 align-middle" /></div>
    </div>
  );
}

/* 17 — Image trail on mouse move */
export function PImageTrail() {
  const { ref, p, onMove, onLeave } = usePointer();
  const [trail, setTrail] = useState<{ id: number; x: number; y: number; c: string }[]>([]);
  const colors = ["#7c5cff", "#22d3ee", "#ec4899", "#f59e0b"];
  useEffect(() => {
    const id = Date.now() + Math.random();
    setTrail((t) => [...t.slice(-6), { id, x: p.x, y: p.y, c: colors[Math.floor(p.x * 4) % 4] }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Math.round(p.x * 14), Math.round(p.y * 14)]);
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="absolute inset-0 overflow-hidden bg-[#0b0b0e]">
      <AnimatePresence>
        {trail.map((t) => (
          <motion.div key={t.id} initial={{ scale: 0.4, opacity: 0.9 }} animate={{ scale: 1, opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}
            className="absolute h-10 w-8 rounded-md" style={{ left: `${t.x * 100}%`, top: `${t.y * 100}%`, transform: "translate(-50%,-50%)", background: `linear-gradient(135deg, ${t.c}, ${t.c}33)` }} />
        ))}
      </AnimatePresence>
      <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-semibold text-white/80">move me</span>
    </div>
  );
}

/* 18 — Scroll-triggered stat choreography */
export function PStats() {
  const tick = useTick(40);
  const phase = tick % 90;
  const mk = (target: number) => Math.round(Math.min(1, phase / 60) * target);
  const stats = [{ v: 312, s: "%", l: "signups" }, { v: 4, s: "x", l: "retention" }, { v: 18, s: "d", l: "to launch" }];
  return (
    <div className="absolute inset-0 flex items-center justify-around px-3">
      {stats.map((st, i) => (
        <div key={i} className="text-center">
          <div className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-2xl font-bold text-transparent tabular-nums">{mk(st.v)}{st.s}</div>
          <div className="mx-auto mt-1 h-1 w-12 overflow-hidden rounded-full bg-white/10">
            <div className="h-full bg-accent2" style={{ width: `${Math.min(100, (phase / 60) * 100)}%`, transition: "width .1s" }} />
          </div>
          <div className="mt-1 text-[9px] text-white/40">{st.l}</div>
        </div>
      ))}
    </div>
  );
}

/* 19 — Glassmorphism floating UI */
export function PGlass() {
  const { ref, p, onMove, onLeave } = usePointer();
  const dx = (p.x - 0.5) * 2;
  const dy = (p.y - 0.5) * 2;
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 animate-drift bg-[conic-gradient(from_90deg,#7c5cff,#22d3ee,#ec4899,#7c5cff)] opacity-50 blur-xl" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="absolute left-1/2 top-1/2 rounded-xl border border-white/25 bg-white/10 backdrop-blur-md"
          style={{ width: `${60 - i * 12}%`, height: `${55 - i * 10}%`, transform: `translate(calc(-50% + ${dx * (i + 1) * 10}px), calc(-50% + ${dy * (i + 1) * 10}px))`, transition: "transform .2s", zIndex: 3 - i }}>
          <div className="m-2 h-1.5 w-1/2 rounded bg-white/50" />
        </div>
      ))}
    </div>
  );
}

/* 20 — Neo-brutalist interactive landing */
export function PBrutalist() {
  const tick = useTick(1400);
  const pressed = tick % 2 === 1;
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#f4e7c1]">
      <div className="-rotate-2 border-2 border-black bg-[#ff5c5c] px-3 py-1 text-sm font-black uppercase text-black" style={{ boxShadow: "3px 3px 0 #000" }}>SHIP IT</div>
      <motion.div animate={{ x: pressed ? 4 : 0, y: pressed ? 4 : 0, boxShadow: pressed ? "0px 0px 0 #000" : "4px 4px 0 #000" }}
        className="border-2 border-black bg-[#7c5cff] px-4 py-1.5 text-sm font-black uppercase text-white">CLICK</motion.div>
      <div className="absolute bottom-1 w-full -rotate-1 border-y-2 border-black bg-[repeating-linear-gradient(45deg,#000,#000_6px,#f5d020_6px,#f5d020_12px)] py-0.5 text-center text-[8px] font-black text-black">▲ LOUD UI ▲ LOUD UI ▲</div>
    </div>
  );
}
