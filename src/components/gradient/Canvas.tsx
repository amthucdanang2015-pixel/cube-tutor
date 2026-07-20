"use client";

import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { render } from "@/lib/gradient/render";
import { applyAnim } from "@/lib/gradient/anim";
import { ASPECTS, type Anim, type Design } from "@/lib/gradient/types";

export function Canvas({ design, anim, playing, time, onTime }: {
  design: Design; anim: Anim; playing: boolean; time: number; onTime?: (t: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef(time);
  const onTimeRef = useRef(onTime);
  const reduceMotion = useReducedMotion();

  const fit = useCallback(() => {
    const canvas = canvasRef.current, wrap = wrapRef.current;
    if (!canvas || !wrap) return null;
    const [aw, ah] = ASPECTS[design.aspect];
    const ar = aw / ah;
    const maxW = wrap.clientWidth, maxH = wrap.clientHeight;
    let cw = maxW, ch = maxW / ar;
    if (ch > maxH) { ch = maxH; cw = maxH * ar; }
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const pw = Math.max(1, Math.round(cw * dpr)), ph = Math.max(1, Math.round(ch * dpr));
    canvas.style.width = `${cw}px`; canvas.style.height = `${ch}px`;
    if (canvas.width !== pw || canvas.height !== ph) { canvas.width = pw; canvas.height = ph; }
    return canvas;
  }, [design.aspect]);

  const paint = useCallback((t: number) => {
    const canvas = fit();
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) render(ctx, applyAnim(design, anim, t), canvas.width, canvas.height);
  }, [fit, design, anim]);

  useEffect(() => { onTimeRef.current = onTime; }, [onTime]);

  // Keep the latest externally-controlled time without making parent progress
  // reports restart the RAF. While paused (including reduced motion), paint the
  // exact scrubbed frame immediately.
  useEffect(() => {
    timeRef.current = time;
    if (!playing || reduceMotion) paint(time);
  }, [playing, paint, reduceMotion, time]);

  // Resume from the current normalized time instead of jumping back to zero.
  // `time` is intentionally read through a ref so onTime(setState) reports do
  // not tear down and recreate this animation loop.
  useEffect(() => {
    if (!playing || reduceMotion) return;
    let raf = 0;
    const start = performance.now();
    const startTime = timeRef.current;
    let lastReport = 0;
    const loop = (now: number) => {
      const elapsed = (now - start) / 1000 / Math.max(0.1, anim.duration);
      const t = (startTime + elapsed) % 1;
      timeRef.current = t;
      paint(t);
      if (now - lastReport > 90) {
        lastReport = now;
        onTimeRef.current?.(t);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [anim.duration, paint, playing, reduceMotion]);

  // resize
  useEffect(() => {
    const wrap = wrapRef.current; if (!wrap) return;
    const ro = new ResizeObserver(() => paint(timeRef.current));
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [paint]);

  return (
    <div ref={wrapRef} className="flex h-full w-full items-center justify-center p-5 lg:p-8">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={reduceMotion ? "AURORA gradient preview. Animation is paused because reduced motion is enabled." : "Animated AURORA gradient preview."}
        className="max-h-full max-w-full rounded-lg shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/5"
      >
        A generated gradient preview. Use the studio controls to adjust its colours, composition, and animation.
      </canvas>
    </div>
  );
}
