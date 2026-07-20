"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { DESIGN_SYSTEMS, resolveStyle, type StyleOverrides } from "@/data/designSystems";
import { productBySlug, type FacetId } from "@/data/products";
import { ProductStage, StageControls, useSceneClock } from "../engine/ProductStage";
import { PromptDrawer } from "../engine/PromptDrawer";
import { StudioShell } from "../engine/StudioShell";
import { StyleRail } from "../engine/StyleRail";
import { encodeStyle } from "../engine/styleParams";
import { IconBtn, Kbd } from "../engine/ui";
import type { Device } from "../engine/contract";
import { CanonicalApp } from "./Flowtime";
import { FLOWTIME_SCENES, FLOWTIME_FACET_SCENE } from "./scenes";
import { ChevronLeft, ChevronRight, Sparkles, ExternalLink } from "lucide-react";
import Link from "next/link";

/* ============================================================================
 * Flowtime studio (D-013 → D-029). Rail = the shared style configurator.
 * Stage = the shared ProductStage running flowtime's showcase film. The only
 * flowtime-specific things here are its scenes, its app, and its device pin.
 * ==========================================================================*/

const P = productBySlug("flowtime");
const START = Math.max(0, DESIGN_SYSTEMS.findIndex((d) => d.slug === P.defaultStyle));

export function StyleStudio() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(START);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [autoTour, setAutoTour] = useState(true);
  const [ov, setOv] = useState<StyleOverrides>({});
  const [devicePin, setDevicePin] = useState<Device | null>(null);

  const base = DESIGN_SYSTEMS[active % DESIGN_SYSTEMS.length];
  const ds = useMemo(() => resolveStyle(base, ov), [base, ov]);
  const customized = Object.values(ov).some(Boolean);

  const [goSignal, setGoSignal] = useState(0);
  const go = useCallback((dir: number) => {
    setActive((i) => (i + dir + DESIGN_SYSTEMS.length) % DESIGN_SYSTEMS.length);
    setOv({});
    setGoSignal((n) => n + 1);
  }, []);

  // at the end of the film: auto-tour to the next language, or loop this one
  const onLoopEnd = useCallback(() => {
    if (reduceMotion) { setPlaying(false); return; }
    if (autoTour && !customized) go(1);
    else setSceneIdx(0);
  }, [autoTour, customized, go, reduceMotion]); // eslint-disable-line react-hooks/exhaustive-deps -- scene-clock state setter is stable

  // Reduced-motion visitors start paused and never auto-tour, but can still
  // explicitly play one pass with the existing controls.
  const motionPlaying = playing;
  const { sceneIdx, setSceneIdx, seek } = useSceneClock(FLOWTIME_SCENES, motionPlaying, onLoopEnd);
  useEffect(() => { setSceneIdx(0); }, [goSignal, setSceneIdx]);
  useEffect(() => {
    if (reduceMotion) { setPlaying(false); setAutoTour(false); }
  }, [reduceMotion]);

  const pickStyle = useCallback((i: number) => { setActive(i); setOv({}); setSceneIdx(0); }, [setSceneIdx]);
  const patchStyle = useCallback((patch: Partial<StyleOverrides>) => setOv((o) => ({ ...o, ...patch })), []);

  // D-014: a facet edit replays the beat that best demonstrates it, then plays.
  const applyFacet = useCallback((patch: Partial<StyleOverrides>, facet: FacetId) => {
    setOv((o) => ({ ...o, ...patch }));
    seek(FLOWTIME_FACET_SCENE[facet]);
    setPlaying(!reduceMotion);
  }, [reduceMotion, seek]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (promptOpen || pickerOpen) { if (e.key === "Escape") { setPromptOpen(false); setPickerOpen(false); } return; }
      const target = e.target as HTMLElement | null;
      if (target?.closest("a, button, input, select, textarea, [contenteditable='true'], [role='button'], [role='slider']")) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); go(1); }
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      else if (e.key.toLowerCase() === "k") setPlaying((v) => !v);
      else if (e.key.toLowerCase() === "s") setPickerOpen(true);
      else if (e.key.toLowerCase() === "p" || e.key === "Enter") setPromptOpen(true);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, promptOpen, pickerOpen, reduceMotion]);

  const liveHref = `/playground/flowtime/live?${encodeStyle(base.slug, ov)}`;
  const replayKey = JSON.stringify(ov); // any facet change replays the scene (D-014)

  return (
    <>
      <StudioShell
        rail={
          <StyleRail
            intro="One living app, every design language worth shipping — plus the dials to make your own."
            facets={P.facets}
            active={active}
            setActive={pickStyle}
            ov={ov}
            patchStyle={patchStyle}
            applyFacet={applyFacet}
            resetAll={() => setOv({})}
            pickerOpen={pickerOpen}
            setPickerOpen={setPickerOpen}
            autoTour={reduceMotion ? undefined : { on: autoTour, toggle: () => setAutoTour((v) => !v) }}
            kbdHints={<><Kbd>↑↓</Kbd> style <Kbd>S</Kbd> browse <Kbd>K</Kbd> play <Kbd>P</Kbd> prompt</>}
          />
        }
        stage={
          <>
            <div className="flex flex-wrap items-end justify-between gap-3 pb-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: ds.t.accent }} />
                  <span className="text-[11px] uppercase tracking-widest text-white/45">{ds.mode} · {ds.type}</span>
                </div>
                <h2 className="mt-0.5 truncate text-2xl font-semibold tracking-tight">{ds.name}</h2>
              </div>
              <div className="flex items-center gap-2">
                <Link href={liveHref} className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm text-white/85 transition hover:border-white/30">
                  <ExternalLink className="h-4 w-4" /> Open live demo
                </Link>
                <button onClick={() => setPromptOpen(true)} className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-white/90">
                  <Sparkles className="h-4 w-4 text-accent" /> Get prompt
                </button>
                <div className="hidden gap-1 sm:flex">
                  <IconBtn onClick={() => go(-1)} label="Previous design language"><ChevronLeft className="h-4 w-4" /></IconBtn>
                  <IconBtn onClick={() => go(1)} label="Next design language"><ChevronRight className="h-4 w-4" /></IconBtn>
                </div>
              </div>
            </div>

            {/* the showcase: the product, running as a film */}
            <div className="h-[460px] shrink-0 sm:h-[540px]">
              <ProductStage ds={ds} scene={FLOWTIME_SCENES[sceneIdx]} playing={motionPlaying} devicePin={devicePin} frame={P.frame} chromeUrl={`flowtime.app · ${ds.slug}`} replayKey={replayKey}>
                {(device) => <CanonicalApp ds={ds} scene={FLOWTIME_SCENES[sceneIdx].key} device={device} mode="showcase" />}
              </ProductStage>
            </div>

            {/* timeline + device pin — the shared below-stage row (D-031) */}
            <StageControls scenes={FLOWTIME_SCENES} ds={ds} playing={motionPlaying} setPlaying={setPlaying} current={sceneIdx} onSeek={(i) => { setSceneIdx(i); setPlaying(!reduceMotion); }}
              device={devicePin} onDevice={P.devices ? setDevicePin : undefined} />

            {/* info */}
            <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_300px]">
              <div>
                <p className="max-w-2xl text-[14px] leading-relaxed text-white/70">{ds.blurb}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {ds.dna.map((d) => <span key={d} className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] text-white/60">{d}</span>)}
                </div>
              </div>
              <div className="rounded-2xl border border-line bg-white/[0.02] p-4">
                <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">Tokens</p>
                <div className="mt-2.5 flex gap-1.5">
                  {[ds.t.bg, ds.t.surface, ds.t.text, ds.t.muted, ds.t.accent].map((c, i) => (
                    <span key={i} className="h-8 flex-1 rounded-md ring-1 ring-white/10" style={{ background: c }} title={c} />
                  ))}
                </div>
                <p className="mt-2.5 text-[12px] leading-relaxed text-white/50">radius {ds.t.radius} · border {ds.t.borderW} · {ds.type}</p>
              </div>
            </div>

            <div className="mt-5 flex max-w-full flex-wrap items-center gap-3 rounded-2xl border border-line bg-gradient-to-br from-accent/12 to-accent2/10 p-4">
              <p className="flex-1 text-sm text-white/75">Want a design language like this built into your product?</p>
              <Link href="/work#intake" className="shrink-0 rounded-full bg-loop px-4 py-2 text-sm font-semibold text-ink transition hover:bg-loop/90">Get a Taste Review</Link>
            </div>
          </>
        }
      />

      <PromptDrawer open={promptOpen} onClose={() => setPromptOpen(false)} ds={ds} />
    </>
  );
}
