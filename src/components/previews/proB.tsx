"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DotGrid, useTick } from "./_shared";

/* 21 — Parallax long-scroll story */
export function PParallax() {
  const reduce = useReducedMotion();
  const layer = (depth: number, c: string, h: string) => (
    <motion.div className="absolute inset-x-0 rounded-full blur-md" style={{ background: c, height: h, bottom: `${depth * 8}%` }}
      animate={reduce ? {} : { y: [0, -depth * 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
  );
  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#1a1633] to-[#0a0a0b]">
      {layer(3, "#7c5cff44", "30%")}
      {layer(2, "#22d3ee33", "22%")}
      {layer(1, "#ec489955", "16%")}
      <div className="absolute right-2 top-2 flex flex-col gap-1">{[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-white/40" />)}</div>
      <motion.div className="absolute left-4 top-5 text-lg font-semibold text-white/90" animate={reduce ? {} : { y: [0, -6, 0] }} transition={{ duration: 5, repeat: Infinity }}>Act I</motion.div>
    </div>
  );
}

/* 22 — Generative particle field (canvas) */
export function PParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    let raf = 0; let t = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => { cv.width = cv.offsetWidth * dpr; cv.height = cv.offsetHeight * dpr; };
    resize();
    const N = 46;
    const pts = Array.from({ length: N }, () => ({ x: Math.random(), y: Math.random(), s: Math.random() * 0.4 + 0.2 }));
    const draw = () => {
      t += 0.01;
      if (cv.width !== Math.round(cv.offsetWidth * dpr)) resize();
      ctx.clearRect(0, 0, cv.width, cv.height);
      pts.forEach((p, i) => {
        const x = (p.x + Math.cos(t + i) * 0.04) * cv.width;
        const y = (p.y + Math.sin(t * 1.2 + i) * 0.04) * cv.height;
        const r = (1.5 + Math.sin(t * 2 + i) * 1) * p.s * dpr * 2;
        ctx.beginPath(); ctx.arc(x, y, Math.max(0.5, r), 0, Math.PI * 2);
        ctx.fillStyle = i % 2 ? "rgba(34,211,238,0.8)" : "rgba(124,92,255,0.8)";
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <div className="absolute inset-0 bg-[#08080c]"><canvas ref={canvasRef} className="h-full w-full" /></div>;
}

/* 23 — Hover-expand list */
export function PExpandList() {
  const tick = useTick(1400);
  const active = tick % 4;
  const items = ["Discover", "Build", "Launch", "Grow"];
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-1 p-4">
      {items.map((it, i) => (
        <motion.div key={i} animate={{ height: active === i ? 40 : 18, backgroundColor: active === i ? "rgba(124,92,255,0.18)" : "rgba(255,255,255,0.03)" }}
          className="flex items-center gap-2 overflow-hidden rounded-lg border border-white/10 px-3">
          <motion.span animate={{ scale: active === i ? 1.05 : 1, color: active === i ? "#fff" : "rgba(255,255,255,0.5)" }} className="text-sm font-semibold">{it}</motion.span>
          {active === i && <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="ml-auto h-6 w-10 rounded bg-gradient-to-br from-accent to-accent2" />}
        </motion.div>
      ))}
    </div>
  );
}

/* 24 — Split-flap / departure board */
export function PSplitFlap() {
  const words = ["DEPART", "ARRIVE", "ONTIME", "BOARD."];
  const tick = useTick(1700);
  const target = words[tick % words.length];
  return (
    <div className="absolute inset-0 flex items-center justify-center gap-1">
      {target.split("").map((ch, i) => <Flap key={i} ch={ch} delay={i * 70} cycle={tick} />)}
    </div>
  );
}
function Flap({ ch, delay, cycle }: { ch: string; delay: number; cycle: number }) {
  const [disp, setDisp] = useState(ch);
  useEffect(() => {
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ.";
    let n = 0;
    const id = setTimeout(() => {
      const iv = setInterval(() => {
        n++;
        if (n > 6) { setDisp(ch); clearInterval(iv); }
        else setDisp(glyphs[Math.floor(Math.random() * glyphs.length)]);
      }, 45);
    }, delay);
    return () => clearTimeout(id);
  }, [ch, delay, cycle]);
  return <span className="flex h-8 w-5 items-center justify-center rounded-sm bg-[#1a1a1d] font-mono text-sm font-bold text-white/90 shadow-inner" style={{ borderTop: "1px solid #333", borderBottom: "1px solid #000" }}>{disp}</span>;
}

/* 25 — Infinite zoom / recursive reveal */
export function PInfiniteZoom() {
  const reduce = useReducedMotion();
  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {[0, 1, 2].map((i) => (
        <motion.div key={i} className="absolute left-1/2 top-1/2 rounded-2xl border border-white/15"
          style={{ width: "60%", height: "60%", x: "-50%", y: "-50%", background: i % 2 ? "radial-gradient(circle,#7c5cff44,transparent)" : "radial-gradient(circle,#22d3ee44,transparent)" }}
          animate={reduce ? {} : { scale: [0.2 + i * 0.6, 4], opacity: [0, 1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeIn", delay: i * 1.33 }} />
      ))}
      <DotGrid opacity={0.05} />
    </div>
  );
}

/* 26 — Magnetic dock / floating nav */
export function PDock() {
  const tick = useTick(70);
  const focus = (Math.sin(tick * 0.06) * 0.5 + 0.5) * 5;
  return (
    <div className="absolute inset-0 flex items-end justify-center pb-5">
      <div className="flex items-end gap-1.5 rounded-2xl border border-white/12 bg-white/5 px-3 py-2 backdrop-blur-md">
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const d = Math.abs(i - focus);
          const scale = Math.max(1, 1.9 - d * 0.5);
          const colors = ["#7c5cff", "#22d3ee", "#ec4899", "#f59e0b", "#10b981", "#6366f1"];
          return <div key={i} className="rounded-lg" style={{ width: 18, height: 18, background: colors[i], transform: `scale(${scale}) translateY(${-(scale - 1) * 8}px)`, transition: "transform .15s" }} />;
        })}
      </div>
    </div>
  );
}

/* 27 — Reveal-on-drag before/after */
export function PBeforeAfter() {
  const reduce = useReducedMotion();
  const tick = useTick(40);
  const pos = reduce ? 50 : 50 + Math.sin(tick * 0.05) * 35;
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-1 bg-[#111] p-2 opacity-60">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="rounded bg-white/10" />)}</div>
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)`, background: "linear-gradient(135deg,#7c5cff,#22d3ee)" }}>
        <div className="grid h-full grid-cols-3 grid-rows-2 gap-1 p-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="rounded bg-white/30" />)}</div>
      </div>
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_white]" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 left-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black/40 backdrop-blur" />
      </div>
      <span className="absolute left-2 top-2 text-[9px] font-bold text-white/70">BEFORE</span>
      <span className="absolute right-2 top-2 text-[9px] font-bold text-white">AFTER</span>
    </div>
  );
}

/* 28 — Particle logo assembly (canvas) */
export function PLogoAssembly() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext("2d"); if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let raf = 0;
    function start() {
      if (!cv || !ctx) return;
      if (!cv.offsetWidth || !cv.offsetHeight) { raf = requestAnimationFrame(start); return; }
      cv.width = cv.offsetWidth * dpr; cv.height = cv.offsetHeight * dpr;
      const off = document.createElement("canvas"); off.width = cv.width; off.height = cv.height;
      const octx = off.getContext("2d")!;
      octx.fillStyle = "#fff"; octx.font = `bold ${cv.height * 0.5}px sans-serif`; octx.textAlign = "center"; octx.textBaseline = "middle";
      octx.fillText("REAL", cv.width / 2, cv.height / 2);
      const data = octx.getImageData(0, 0, cv.width, cv.height).data;
      const targets: { x: number; y: number }[] = [];
      for (let y = 0; y < cv.height; y += 5 * dpr) for (let x = 0; x < cv.width; x += 5 * dpr) if (data[(y * cv.width + x) * 4 + 3] > 128) targets.push({ x, y });
      const parts = targets.map((t) => ({ x: Math.random() * cv.width, y: Math.random() * cv.height, tx: t.x, ty: t.y }));
      let frame = 0;
      const draw = () => {
        frame++;
        ctx.clearRect(0, 0, cv.width, cv.height);
        const reset = frame % 200 === 0;
        parts.forEach((p) => {
          if (reset) { p.x = Math.random() * cv.width; p.y = Math.random() * cv.height; }
          p.x += (p.tx - p.x) * 0.06; p.y += (p.ty - p.y) * 0.06;
          ctx.fillStyle = "rgba(124,92,255,0.9)"; ctx.fillRect(p.x, p.y, 2 * dpr, 2 * dpr);
        });
        raf = requestAnimationFrame(draw);
      };
      draw();
    }
    start();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <div className="absolute inset-0 bg-[#08080c]"><canvas ref={canvasRef} className="h-full w-full" /></div>;
}

/* 29 — Scroll-snap sections w/ theme shift */
export function PThemeShift() {
  const themes = [
    { bg: "#0a0a0b", a: "#7c5cff" }, { bg: "#0f1a1c", a: "#22d3ee" },
    { bg: "#1c0f17", a: "#ec4899" }, { bg: "#1a160a", a: "#f59e0b" },
  ];
  const tick = useTick(1500);
  const th = themes[tick % themes.length];
  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-2" animate={{ backgroundColor: th.bg }} transition={{ duration: 0.8 }}>
      <motion.div className="h-10 w-10 rounded-xl" animate={{ backgroundColor: th.a }} transition={{ duration: 0.8 }} />
      <motion.div className="h-1.5 w-20 rounded-full" animate={{ backgroundColor: th.a, opacity: 0.5 }} transition={{ duration: 0.8 }} />
      <div className="absolute bottom-2 flex gap-1">{themes.map((t, i) => <motion.span key={i} className="h-1 rounded-full" animate={{ width: tick % themes.length === i ? 12 : 4, backgroundColor: t.a }} />)}</div>
    </motion.div>
  );
}

/* 30 — AI command-palette hero */
export function PCommandPalette() {
  const queries = ["ship product", "fix retention", "launch on X", "find PMF"];
  const [typed, setTyped] = useState("");
  const [qi, setQi] = useState(0);
  useEffect(() => {
    let ci = 0; const q = queries[qi];
    const id = setInterval(() => {
      if (ci <= q.length) { setTyped(q.slice(0, ci)); ci++; }
      else { setTimeout(() => { setQi((p) => (p + 1) % queries.length); }, 700); clearInterval(id); }
    }, 90);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qi]);
  const rows = ["Rebuild the UI", "Add motion polish", "Write launch thread", "Set up pSEO"];
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[#0b0b10] p-4">
      <DotGrid opacity={0.05} />
      <div className="w-full max-w-[80%] overflow-hidden rounded-xl border border-white/15 bg-black/60 backdrop-blur-md">
        <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
          <span className="text-white/40">⌘</span>
          <span className="text-sm text-white/90">{typed}<span className="ml-0.5 inline-block h-3 w-0.5 animate-pulse bg-accent2 align-middle" /></span>
        </div>
        <div className="p-1.5">
          {rows.map((r, i) => (
            <motion.div key={r} layout className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs ${i === 0 ? "bg-accent/20 text-white" : "text-white/55"}`}>
              <span className="h-2.5 w-2.5 rounded-sm bg-gradient-to-br from-accent to-accent2" />{r}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
