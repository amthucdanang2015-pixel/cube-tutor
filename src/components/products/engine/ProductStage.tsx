"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { BrowserChrome, PhoneChrome, TabletChrome } from "@/components/redesigns/_chrome";
import type { DesignSystem } from "@/data/designSystems";
import { Monitor, MousePointer2, Pause, Play, Repeat, Smartphone, Tablet } from "lucide-react";
import { STAGE_BG, type Device, type Scene, type StageFrame } from "./contract";

/* ============================================================================
 * ProductStage (D-029) — the director, for ANY product.
 *
 * Before D-029 this file imported flowtime's CanonicalApp directly, so the
 * "shared" stage could only ever render one product — which is exactly why
 * Card Studio grew its own bespoke stage and drifted. The stage now takes a
 * render prop and knows nothing about what it is showing.
 *
 * The studio owns the single scene clock (`useSceneClock`); the stage renders
 * the product, the device frame, the ghost cursor and the sweep chip.
 * ==========================================================================*/

export function ProductStage({
  ds, scene, playing, devicePin, frame = "device", chromeUrl, replayKey, children,
}: {
  ds: DesignSystem;
  scene: Scene;
  playing: boolean;
  /** null = follow the scene's sweep; a device = pin it (overrides the sweep) */
  devicePin?: Device | null;
  frame?: StageFrame;
  chromeUrl?: string;
  replayKey?: string | number;
  /** the product, built for the device the stage decided on */
  children: (device: Device) => React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const [sweep, setSweep] = useState<Device>("desktop");

  // a scene may sweep the frame through devices (flowtime's "responsive" beat)
  useEffect(() => {
    if (devicePin || !scene.sweep) { setSweep("desktop"); return; }
    setSweep(scene.sweep[0][1]);
    if (reduceMotion) return;
    const timers = scene.sweep.slice(1).map(([at, d]) => setTimeout(() => setSweep(d), at));
    return () => timers.forEach(clearTimeout);
  }, [scene.key, scene.sweep, ds.slug, devicePin, reduceMotion]);

  const device: Device = devicePin ?? (scene.sweep ? sweep : "desktop");

  // replayKey remounts the product when a facet changes, so the change performs (D-014)
  const demo = <Fragment key={replayKey}>{children(device)}</Fragment>;

  const framed =
    frame === "free" ? (
      demo
    ) : device === "desktop" ? (
      <div className="h-full w-full"><BrowserChrome url={chromeUrl ?? ds.slug}>{demo}</BrowserChrome></div>
    ) : device === "tablet" ? (
      <div className="h-[94%] max-w-full" style={{ aspectRatio: "3/4.1" }}><TabletChrome>{demo}</TabletChrome></div>
    ) : (
      <div className="h-[94%] max-w-full" style={{ aspectRatio: "9/19" }}><PhoneChrome statusDark={ds.mode === "light"}>{demo}</PhoneChrome></div>
    );

  return (
    /* THE stage container — identical to the live page's (D-029). One place. */
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl border border-line" style={{ background: STAGE_BG }}>
      <motion.div key={device} initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 26 }} className="relative flex h-full w-full items-center justify-center">
        {framed}

        {/* ghost cursor demos interactions */}
        <AnimatePresence>
          {scene.cursor && playing && !reduceMotion && (
            <motion.div
              key={`cur-${scene.key}-${ds.slug}`}
              className="pointer-events-none absolute z-30"
              initial={{ left: "85%", top: "85%", opacity: 0 }}
              animate={{
                left: scene.cursor.map(([x]) => `${x}%`),
                top: scene.cursor.map(([, y]) => `${y}%`),
                opacity: 1,
                transition: { duration: scene.ms / 1000 - 0.4, times: scene.cursor.map((_, i) => (i + 1) / (scene.cursor!.length + 0.2)), ease: "easeInOut" },
              }}
              exit={{ opacity: 0 }}
            >
              <MousePointer2 className="h-4 w-4 fill-white text-black drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]" />
              <motion.span className="absolute -left-2 -top-2 h-8 w-8 rounded-full border-2" style={{ borderColor: ds.t.accent }}
                animate={{ scale: [0, 1.4], opacity: [0.8, 0] }} transition={{ duration: 0.7, delay: Math.max(0.3, scene.ms / 1000 - 0.9) }} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* device chip during a sweep */}
        <AnimatePresence>
          {scene.sweep && !devicePin && (
            <motion.span key={device} initial={reduceMotion ? false : { opacity: 0, x: "-50%", y: 8 }} animate={{ opacity: 1, x: "-50%", y: 0 }} exit={reduceMotion ? { opacity: 1, x: "-50%" } : { opacity: 0, x: "-50%" }} transition={reduceMotion ? { duration: 0 } : undefined} className="absolute bottom-3 left-1/2 z-30 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-semibold capitalize text-white/80 backdrop-blur">
              {device}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

/**
 * THE scene clock. One per studio. At the end of the last beat the studio
 * decides what happens next (loop, or auto-tour to the next design language).
 */
export function useSceneClock(scenes: Scene[], playing: boolean, onLoopEnd: () => void) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      if (idx === scenes.length - 1) onLoopEnd();
      else setIdx(idx + 1);
    }, scenes[idx].ms);
    return () => clearTimeout(t);
  }, [idx, playing, scenes, onLoopEnd]);

  /** jump to a scene by key; no-op if this product has no such scene */
  const seek = useCallback((key: string) => {
    const i = scenes.findIndex((s) => s.key === key);
    if (i >= 0) setIdx(i);
  }, [scenes]);

  return { sceneIdx: idx, setSceneIdx: setIdx, seek };
}

/** Timeline UI: play/pause + one segment per scene with a live progress fill. */
export function SceneRail({ scenes, ds, playing, setPlaying, current, onSeek }: { scenes: Scene[]; ds: DesignSystem; playing: boolean; setPlaying: (v: boolean) => void; current: number; onSeek: (i: number) => void }) {
  return (
    <div className="flex items-center gap-2.5">
      <button onClick={() => setPlaying(!playing)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-ink transition hover:bg-white/90" aria-label={playing ? "Pause demo" : "Play demo"}>
        {playing ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 translate-x-px" />}
      </button>
      <div className="flex flex-1 items-center gap-1">
        {scenes.map((s, i) => (
          <button key={s.key} onClick={() => onSeek(i)} className="group relative h-3 flex-1" title={s.label} aria-label={`Scene: ${s.label}`}>
            <span className="absolute inset-x-0 top-1 h-1 overflow-hidden rounded-full bg-white/10">
              {i < current && <span className="absolute inset-0" style={{ background: ds.t.accent, opacity: 0.8 }} />}
              {i === current && playing && (
                <motion.span key={`${ds.slug}-${current}`} className="absolute inset-y-0 left-0" style={{ background: ds.t.accent }} initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: scenes[i].ms / 1000, ease: "linear" }} />
              )}
              {i === current && !playing && <span className="absolute inset-y-0 left-0 w-1/2" style={{ background: ds.t.accent }} />}
            </span>
          </button>
        ))}
      </div>
      <span className="w-24 shrink-0 text-right text-[10px] uppercase tracking-wider text-white/40">{scenes[current].label}</span>
    </div>
  );
}

/**
 * Device pin (D-029/D-031): Auto · Desktop · Tablet · Mobile. Preview any
 * product at any size; "Auto" (null) hands control back to the scene sweep or
 * the real viewport. ONE component, so every studio's pill is pixel-identical.
 */
export function DevicePin({ value, onChange }: { value: Device | null; onChange: (d: Device | null) => void }) {
  return (
    <div className="flex shrink-0 rounded-full border border-line p-0.5">
      {([[null, "Auto", Repeat], ["desktop", "", Monitor], ["tablet", "", Tablet], ["mobile", "", Smartphone]] as [Device | null, string, typeof Monitor][]).map(([val, label, Icon]) => (
        <button key={String(val)} onClick={() => onChange(val)} aria-label={val ? `Pin ${val}` : "Auto device"} aria-pressed={value === val}
          className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-medium transition ${value === val ? "bg-white text-ink" : "text-white/50 hover:text-white"}`}>
          <Icon className="h-3.5 w-3.5" />{label}
        </button>
      ))}
    </div>
  );
}

/**
 * THE below-stage control row (D-031): timeline on the left, device pin on the
 * right. Every studio renders exactly this, so the two products stay 1-to-1 by
 * construction — the device pin is not an optional extra a product can forget.
 * Pass `onDevice` (with `device`) to show the pin; omit both to hide it.
 */
export function StageControls({ scenes, ds, playing, setPlaying, current, onSeek, device, onDevice }: {
  scenes: Scene[]; ds: DesignSystem; playing: boolean; setPlaying: (v: boolean) => void;
  current: number; onSeek: (i: number) => void;
  device?: Device | null; onDevice?: (d: Device | null) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-3">
      <div className="min-w-0 flex-1"><SceneRail scenes={scenes} ds={ds} playing={playing} setPlaying={setPlaying} current={current} onSeek={onSeek} /></div>
      {onDevice && <DevicePin value={device ?? null} onChange={onDevice} />}
    </div>
  );
}
