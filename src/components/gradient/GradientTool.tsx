"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Canvas } from "./Canvas";
import { Slider, Segmented, Section, Field, Select } from "./controls";
import { reroll, generateDesign } from "@/lib/gradient/generate";
import { renderToCanvas } from "@/lib/gradient/render";
import { defaultAnim, randomizeAnim, newTrack, PARAMS, ANIM_PARAM_KEYS } from "@/lib/gradient/anim";
import { exportVideo } from "@/lib/gradient/mp4";
import { PRESETS } from "@/lib/gradient/presets";
import { ASPECTS, BLENDS, EFFECTS, LAYOUTS, EASES, type Design, type Layer, type Layout, type AspectKey, type Effect, type Blend, type Anim, type Track, type AnimParamKey } from "@/lib/gradient/types";
import { Shuffle, Lock, Download, Plus, X, Layers as LayersIcon, Play, Pause, Film, Wand2, SlidersHorizontal, History } from "lucide-react";

interface HistoryItem { seed: string; design: Design; thumb: string }
interface ExportMessage { kind: "success" | "error"; text: string }
function thumbOf(d: Design): HistoryItem {
  const [aw, ah] = ASPECTS[d.aspect];
  const long = 120;
  const tw = aw >= ah ? long : Math.round((long * aw) / ah);
  const th = ah >= aw ? long : Math.round((long * ah) / aw);
  return { seed: d.seed, design: d, thumb: renderToCanvas(d, tw, th).toDataURL() };
}

const glass = "rounded-2xl border border-white/10 bg-black/60 shadow-2xl backdrop-blur-xl";

export function GradientTool() {
  const reduceMotion = useReducedMotion();
  const [design, setDesign] = useState<Design>(() => generateDesign("#aurora"));
  const [anim, setAnim] = useState<Anim>(() => defaultAnim());
  const [playing, setPlaying] = useState(true);
  const [time, setTime] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [lockColours, setLockColours] = useState(false);
  const [lockStructure, setLockStructure] = useState(false);
  const [active, setActive] = useState(0);
  const [fmt, setFmt] = useState<"png" | "jpg">("png");
  const [res, setRes] = useState(2048);
  const [exporting, setExporting] = useState(false);
  const [vid, setVid] = useState<{ on: boolean; p: number }>({ on: false, p: 0 });
  const [exportMessage, setExportMessage] = useState<ExportMessage | null>(null);
  const [studioOpen, setStudioOpen] = useState(false);
  const [tuneOpen, setTuneOpen] = useState(false);
  const [presetThumbs, setPresetThumbs] = useState<string[]>([]);
  const [preset, setPreset] = useState<string | null>("aurora");

  // client-only init: apply the flagship preset (always looks great on land)
  useEffect(() => {
    const p = PRESETS[0];
    const d = p.build();
    setDesign(d); setAnim(p.anim); setHistory([thumbOf(d)]);
    setPresetThumbs(PRESETS.map((pr) => renderToCanvas(pr.build(), 64, 64).toDataURL()));
    if (window.matchMedia("(min-width: 1024px)").matches) { setStudioOpen(true); setTuneOpen(true); }
  }, []);

  const randomize = useCallback(() => {
    setPreset(null);
    setDesign((cur) => { const d = reroll(cur, { lockColours, lockStructure }); setHistory((h) => [thumbOf(d), ...h].slice(0, 24)); return d; });
  }, [lockColours, lockStructure]);

  function applyPreset(slug: string) {
    const p = PRESETS.find((x) => x.slug === slug);
    if (!p) return;
    const d = p.build();
    setPreset(slug); setDesign(d); setAnim(p.anim); setPlaying(true);
    setHistory((h) => [thumbOf(d), ...h].slice(0, 24));
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target?.closest("a, button, input, select, textarea, [contenteditable='true'], [role='button'], [role='slider']")) return;
      if (e.code === "Space") { e.preventDefault(); randomize(); }
      else if (e.key.toLowerCase() === "c") setLockColours((v) => !v);
      else if (e.key.toLowerCase() === "s") setLockStructure((v) => !v);
      else if (e.key.toLowerCase() === "k" && !reduceMotion) setPlaying((v) => !v);
      else if (e.key.toLowerCase() === "t") setTuneOpen((v) => !v);
      else if (e.key.toLowerCase() === "e") exportImage();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [randomize, design, fmt, res, reduceMotion]);

  const patch = (p: Partial<Design>) => { setPreset(null); setDesign((d) => ({ ...d, ...p })); };
  const patchRelief = (p: Partial<Design["relief"]>) => { setPreset(null); setDesign((d) => ({ ...d, relief: { ...d.relief, ...p } })); };
  const patchTransform = (p: Partial<Design["transform"]>) => setDesign((d) => ({ ...d, transform: { ...d.transform, ...p } }));
  const patchTreat = (p: Partial<Design["treatment"]>) => setDesign((d) => ({ ...d, treatment: { ...d.treatment, ...p } }));
  const patchLayer = (p: Partial<Layer>) => setDesign((d) => ({ ...d, layers: d.layers.map((l, i) => (i === active ? { ...l, ...p } : l)) }));
  const patchShape = (p: Partial<Layer["shape"]>) => patchLayer({ shape: { ...layer.shape, ...p } });
  const patchPalette = (p: Partial<Layer["palette"]>) => patchLayer({ palette: { ...layer.palette, ...p } });
  const layer = design.layers[Math.min(active, design.layers.length - 1)];

  const patchAnim = (p: Partial<Anim>) => setAnim((a) => ({ ...a, ...p }));
  const patchTrack = (id: string, p: Partial<Track>) => setAnim((a) => ({ ...a, tracks: a.tracks.map((tr) => (tr.id === id ? { ...tr, ...p } : tr)) }));
  const addTrack = () => { const used = new Set(anim.tracks.map((tr) => tr.param)); const next = ANIM_PARAM_KEYS.find((k) => !used.has(k)) ?? "hue"; setAnim((a) => ({ ...a, tracks: [...a.tracks, newTrack(next)] })); setPlaying(true); };
  const removeTrack = (id: string) => setAnim((a) => ({ ...a, tracks: a.tracks.filter((tr) => tr.id !== id) }));

  function addLayer() {
    if (design.layers.length >= 2) return;
    const extra = generateDesign(design.seed + "L").layers[0];
    extra.blend = "screen"; extra.opacity = 0.9;
    setDesign((d) => ({ ...d, layers: [...d.layers, extra] }));
    setActive(design.layers.length);
  }
  function removeLayer(i: number) { if (design.layers.length <= 1) return; setDesign((d) => ({ ...d, layers: d.layers.filter((_, j) => j !== i) })); setActive(0); }

  async function exportImage() {
    setExporting(true); setExportMessage(null);
    try {
      const [aw, ah] = ASPECTS[design.aspect]; const ar = aw / ah;
      const W = ar >= 1 ? res : Math.round(res * ar); const H = ar >= 1 ? Math.round(res / ar) : res;
      const c = renderToCanvas(design, W, H);
      const a = document.createElement("a"); a.href = c.toDataURL(fmt === "png" ? "image/png" : "image/jpeg", 0.95); a.download = `aurora-${design.seed.replace("#", "")}.${fmt}`; a.click();
      setExportMessage({ kind: "success", text: `${fmt.toUpperCase()} export started.` });
    } catch (error) {
      console.error(error);
      setExportMessage({ kind: "error", text: `Could not export the ${fmt.toUpperCase()} image. Try a smaller size or another browser.` });
    } finally { setTimeout(() => setExporting(false), 300); }
  }
  async function exportVid() {
    setVid({ on: true, p: 0 }); setPlaying(false); setExportMessage(null);
    try {
      const { blob, ext } = await exportVideo(design, anim, (p) => setVid({ on: true, p }));
      const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `aurora-${design.seed.replace("#", "")}.${ext}`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 4000);
      setExportMessage({ kind: "success", text: `Video exported as ${ext.toUpperCase()}.` });
    } catch (error) {
      console.error(error);
      setExportMessage({ kind: "error", text: "Could not export the video. This browser may not support video encoding; try a current Chromium browser." });
    } finally { setVid({ on: false, p: 0 }); }
  }

  const aspectOpts = useMemo(() => (Object.keys(ASPECTS) as AspectKey[]).map((k) => ({ value: k, label: k })), []);
  const isRadialish = layer.layout !== "linear";

  return (
    <div className="fixed inset-0 z-[60] bg-[#050507] text-white">
      {/* ---------- CANVAS (full-bleed, the hero) ---------- */}
      <div className="absolute inset-0">
        <Canvas design={design} anim={anim} playing={playing && !reduceMotion} time={time} onTime={setTime} />
      </div>

      {/* ---------- TOP BAR ---------- */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4">
        <Link href="/" className={`pointer-events-auto flex items-center gap-2 px-4 py-2 ${glass} transition hover:border-white/25`}>
          <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-[#ff5c33] via-[#a855f7] to-[#22d3ee]" />
          <h1 className="text-sm font-bold tracking-[0.18em]">AURORA</h1>
          <span className="hidden text-xs text-white/40 sm:inline">· Open Loop by TasteLoop</span>
        </Link>
        <div className="pointer-events-auto flex items-center gap-2">
          <span className={`hidden px-3 py-2 font-mono text-xs text-white/45 sm:block ${glass}`}>{ASPECTS[design.aspect].join("×")} · {design.seed}</span>
          {/* panels sit on opposite sides — they coexist on desktop; only small
              screens are mutually exclusive (they share the bottom sheet, D-022) */}
          <button onClick={() => { setStudioOpen((v) => !v); if (!window.matchMedia("(min-width: 1024px)").matches) setTuneOpen(false); }} className={`flex items-center gap-1.5 px-3.5 py-2 text-sm ${glass} transition hover:border-white/25 ${studioOpen ? "text-white" : "text-white/60"}`} aria-label="Toggle studio panel">
            <History className="h-4 w-4" /> Studio
          </button>
          <button onClick={() => { setTuneOpen((v) => !v); if (!window.matchMedia("(min-width: 1024px)").matches) setStudioOpen(false); }} className={`flex items-center gap-1.5 px-3.5 py-2 text-sm ${glass} transition hover:border-white/25 ${tuneOpen ? "text-white" : "text-white/60"}`} aria-label="Toggle tune panel">
            <SlidersHorizontal className="h-4 w-4" /> Tune <kbd className="rounded bg-white/10 px-1 text-[10px]">T</kbd>
          </button>
        </div>
      </div>

      {/* ---------- LEFT: STUDIO PANEL ---------- */}
      {studioOpen && (
        <aside className={`absolute z-20 flex flex-col overflow-hidden ${glass} inset-x-3 bottom-24 max-h-[60svh] lg:inset-x-auto lg:left-4 lg:top-16 lg:bottom-28 lg:max-h-none lg:w-[280px]`}>
          <div className="space-y-3 p-4">
            <button onClick={randomize} className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-ink transition hover:bg-white/90">
              <Shuffle className="h-4 w-4" /> Randomize <kbd className="ml-1 rounded bg-black/10 px-1.5 text-[10px]">Space</kbd>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <LockBtn label="Colours" on={lockColours} onClick={() => setLockColours((v) => !v)} />
              <LockBtn label="Structure" on={lockStructure} onClick={() => setLockStructure((v) => !v)} />
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4">
            <div className="grid grid-cols-4 gap-1.5 pb-3">
              {history.map((h, i) => (
                <button key={h.seed + i} onClick={() => setDesign(h.design)} title={h.seed} aria-label={`Restore design ${h.seed}`} className={`aspect-square overflow-hidden rounded-md ring-1 transition ${h.seed === design.seed ? "ring-[#ff5c33]" : "ring-white/10 hover:ring-white/30"}`}>
                  <img src={h.thumb} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2.5 border-t border-white/10 p-4">
            <div className="flex gap-2">
              <Segmented value={fmt} onChange={(v) => setFmt(v as "png" | "jpg")} options={[{ value: "png", label: "PNG" }, { value: "jpg", label: "JPG" }]} />
              <Segmented value={String(res)} onChange={(v) => setRes(Number(v))} options={[{ value: "2048", label: "2K" }, { value: "4096", label: "4K" }, { value: "8192", label: "8K" }]} />
            </div>
            <button onClick={exportImage} disabled={exporting} className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 py-2.5 text-sm font-semibold transition hover:border-white/30 disabled:opacity-50">
              <Download className="h-4 w-4" /> {exporting ? "Exporting…" : `Export ${fmt.toUpperCase()}`}
            </button>
            <button onClick={exportVid} disabled={vid.on} className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-white py-2.5 text-sm font-bold text-ink transition hover:bg-white/90 disabled:opacity-80">
              {vid.on && <span className="absolute inset-0 origin-left bg-[#ff5c33]/30" style={{ transform: `scaleX(${vid.p})` }} />}
              <span className="relative flex items-center gap-2"><Film className="h-4 w-4" /> {vid.on ? `Rendering ${Math.round(vid.p * 100)}%` : "Export video"}</span>
            </button>
            <p role={exportMessage?.kind === "error" ? "alert" : "status"} aria-live="polite" className={`min-h-4 text-[11px] leading-snug ${exportMessage?.kind === "error" ? "text-rose-300" : "text-emerald-300"}`}>
              {exportMessage?.text ?? ""}
            </p>
          </div>
        </aside>
      )}

      {/* ---------- RIGHT: TUNE PANEL ---------- */}
      {tuneOpen && (
        <aside className={`absolute z-20 overflow-y-auto ${glass} inset-x-3 bottom-24 max-h-[60svh] lg:inset-x-auto lg:right-4 lg:top-16 lg:bottom-28 lg:max-h-none lg:w-[320px]`}>
          <Section title="Animate">
            <button onClick={() => { setAnim(randomizeAnim()); setPlaying(true); }} className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#ff5c33] to-[#a855f7] py-2.5 text-[13px] font-semibold transition hover:opacity-90"><Wand2 className="h-4 w-4" /> Randomize animation</button>
            <div className="space-y-2.5">
              {anim.tracks.map((tr) => <TrackRow key={tr.id} track={tr} onChange={(p) => patchTrack(tr.id, p)} onRemove={() => removeTrack(tr.id)} />)}
            </div>
            <button onClick={addTrack} className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/15 py-2 text-[12px] text-white/55 transition hover:text-white"><Plus className="h-3.5 w-3.5" /> Add parameter</button>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <Field label={`Duration · ${anim.duration}s`}><Slider label="" value={anim.duration} min={2} max={20} step={1} fmt={() => ""} onChange={(v) => patchAnim({ duration: v })} /></Field>
              <Field label="FPS"><Segmented value={String(anim.fps)} onChange={(v) => patchAnim({ fps: Number(v) })} options={[{ value: "24", label: "24" }, { value: "30", label: "30" }, { value: "60", label: "60" }]} /></Field>
            </div>
            <Field label={`Video output · ${anim.size}p`}><Segmented value={String(anim.size)} onChange={(v) => patchAnim({ size: Number(v) })} options={[{ value: "720", label: "720" }, { value: "1080", label: "1080" }, { value: "1440", label: "1440" }, { value: "2160", label: "2K+" }]} /></Field>
          </Section>

          <Section title="Canvas" defaultOpen={false}>
            <Field label="Aspect ratio"><Select value={design.aspect} onChange={(v) => patch({ aspect: v as AspectKey })} options={aspectOpts} /></Field>
            <Field label="Layout"><Segmented value={layer.layout} onChange={(v) => patchLayer({ layout: v as Layout })} options={LAYOUTS.map((l) => ({ value: l, label: l[0].toUpperCase() + l.slice(1) }))} /></Field>
            {isRadialish && <Slider label="Inner radius" value={layer.shape.inner} min={0} max={0.7} onChange={(v) => patchShape({ inner: v })} />}
            <Slider label="Margin" value={layer.shape.margin} min={0} max={0.4} onChange={(v) => patchShape({ margin: v })} />
            <Field label="Background"><div className="flex items-center gap-2"><ColorRow label="Background colour" value={design.background} onChange={(v) => patch({ background: v })} /><label className="flex items-center gap-1.5 text-[12px] text-white/55"><input type="checkbox" checked={design.bgGradient} onChange={(e) => patch({ bgGradient: e.target.checked })} className="accent-[#ff5c33]" /> gradient</label>{design.bgGradient && <ColorRow label="Secondary background colour" value={design.background2} onChange={(v) => patch({ background2: v })} swatchOnly />}</div></Field>
          </Section>

          <Section title="Compose" defaultOpen={false}>
            <Slider label="Hue rotate" value={design.transform.hue} min={-180} max={180} step={1} fmt={(v) => `${Math.round(v)}°`} onChange={(v) => patchTransform({ hue: v })} />
            <Slider label="Rotate" value={design.transform.rotate} min={0} max={360} step={1} fmt={(v) => `${Math.round(v)}°`} onChange={(v) => patchTransform({ rotate: v })} />
            <Slider label="Scale" value={design.transform.scale} min={0.5} max={2} fmt={(v) => `${Math.round(v * 100)}%`} onChange={(v) => patchTransform({ scale: v })} />
            <Slider label="Offset X" value={design.transform.x} min={-0.4} max={0.4} onChange={(v) => patchTransform({ x: v })} />
            <Slider label="Offset Y" value={design.transform.y} min={-0.4} max={0.4} onChange={(v) => patchTransform({ y: v })} />
          </Section>

          <Section title="Relief, Glow & Grain" defaultOpen={false}>
            <Slider label="Top shadow" value={design.relief.topShadow} min={0} max={1} onChange={(v) => patchRelief({ topShadow: v })} />
            <Slider label="3D depth" value={design.relief.depth} min={0} max={1} onChange={(v) => patchRelief({ depth: v })} />
            <Slider label="Seam" value={design.relief.seam} min={0} max={0.2} step={0.001} onChange={(v) => patchRelief({ seam: v })} />
            <Slider label="Glow / bloom" value={design.glow} min={0} max={1} onChange={(v) => patch({ glow: v })} />
            <Slider label="Vignette" value={design.vignette} min={0} max={1} onChange={(v) => patch({ vignette: v })} />
            <Slider label="Grain" value={design.relief.grain} min={0} max={1} onChange={(v) => patchRelief({ grain: v })} />
          </Section>

          <Section title="Treatment" defaultOpen={false}>
            <Field label="Effect"><Select value={design.treatment.effect} onChange={(v) => patchTreat({ effect: v as Effect })} options={EFFECTS.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) }))} /></Field>
            {design.treatment.effect !== "none" && <><Slider label="Intensity" value={design.treatment.intensity} min={0} max={1} onChange={(v) => patchTreat({ intensity: v })} /><Slider label="Texture size" value={design.treatment.scale} min={1} max={12} step={0.5} onChange={(v) => patchTreat({ scale: v })} /></>}
          </Section>

          <Section title="Shape" defaultOpen={false}>
            <Slider label="Count" value={layer.shape.count} min={2} max={18} step={1} fmt={(v) => String(v)} onChange={(v) => patchShape({ count: Math.round(v) })} />
            {layer.layout === "orbit" && <Slider label="Spread" value={layer.shape.spread} min={0.2} max={1} onChange={(v) => patchShape({ spread: v })} />}
            <Slider label="Rotation" value={layer.shape.rotation} min={0} max={360} step={1} fmt={(v) => `${Math.round(v)}°`} onChange={(v) => patchShape({ rotation: v })} />
            <Slider label="Jitter" value={layer.shape.jitter} min={0} max={1} onChange={(v) => patchShape({ jitter: v })} />
            {isRadialish && <Slider label="Segments" value={layer.shape.segments} min={1} max={10} step={1} fmt={(v) => String(v)} onChange={(v) => patchShape({ segments: Math.round(v) })} />}
          </Section>

          <Section title="Colour" defaultOpen={false}>
            <Field label="Palette"><div className="flex flex-wrap gap-2">{layer.palette.colors.map((c, i) => <ColorRow key={i} label={`Palette colour ${i + 1}`} value={c} swatchOnly onChange={(v) => patchPalette({ colors: layer.palette.colors.map((x, j) => (j === i ? v : x)) })} />)}</div></Field>
            {layer.layout !== "orbit" && <Slider label="Angle" value={layer.palette.angle} min={0} max={360} step={15} fmt={(v) => `${v}°`} onChange={(v) => patchPalette({ angle: v })} />}
          </Section>

          <Section title="Layers" defaultOpen={false}>
            <div className="flex gap-1.5">
              {design.layers.map((_, i) => (
                <div key={i} className="flex flex-1 overflow-hidden rounded-lg border border-white/10">
                  <button type="button" onClick={() => setActive(i)} aria-label={`Select layer ${i + 1}`} aria-pressed={active === i} className={`flex flex-1 items-center justify-center gap-1.5 py-2 text-[12px] ${active === i ? "bg-white/[0.08] text-white" : "text-white/50"}`}>
                    <LayersIcon className="h-3.5 w-3.5" /> {i + 1}
                  </button>
                  {design.layers.length > 1 && <button type="button" onClick={() => removeLayer(i)} aria-label={`Remove layer ${i + 1}`} className="border-l border-white/10 px-2 text-white/40 hover:text-white"><X className="h-3 w-3" /></button>}
                </div>
              ))}
              {design.layers.length < 2 && <button type="button" onClick={addLayer} aria-label="Add layer" className="rounded-lg border border-dashed border-white/15 px-3 text-white/50 hover:text-white"><Plus className="h-3.5 w-3.5" /></button>}
            </div>
            <Field label="Blend"><Select value={layer.blend} onChange={(v) => patchLayer({ blend: v as Blend })} options={BLENDS.map((b) => ({ value: b, label: b[0].toUpperCase() + b.slice(1) }))} /></Field>
            <Slider label="Opacity" value={layer.opacity} min={0} max={1} onChange={(v) => patchLayer({ opacity: v })} />
          </Section>
        </aside>
      )}

      {/* ---------- BOTTOM DOCK — one row, Snapchat-style (D-023):
           play (the shutter) · time · preset carousel · seek line on the top edge.
           Single-height bar so it never overlays the side panels (they stop at bottom-28). */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center p-4">
        <div className={`pointer-events-auto relative flex w-full max-w-[860px] items-center gap-2.5 px-3 pb-2 pt-3 ${glass}`}>
          {/* seek — a slim line along the top edge of the dock */}
          <input type="range" min={0} max={1} step={0.001} value={time} onChange={(e) => { setPlaying(false); setTime(parseFloat(e.target.value)); }} aria-label="Timeline"
            className="absolute inset-x-4 -top-[5px] h-2.5 cursor-pointer appearance-none bg-transparent
              [&::-webkit-slider-runnable-track]:h-[3px] [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-white/15
              [&::-webkit-slider-thumb]:-mt-[4.5px] [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ff5c33]" />
          <button onClick={() => setPlaying((v) => !v)} disabled={!!reduceMotion}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-ink transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={reduceMotion ? "Animation disabled because reduced motion is enabled" : playing ? "Pause" : "Play"}>
            {playing && !reduceMotion ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 translate-x-px" />}
          </button>
          <span className="hidden w-14 shrink-0 font-mono text-[10.5px] tabular-nums text-white/50 sm:block">{(time * anim.duration).toFixed(1)}/{anim.duration.toFixed(0)}s</span>
          <span className="h-6 w-px shrink-0 bg-white/10" />
          {/* preset carousel — the lens strip */}
          <div className="scroll-slim flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto py-0.5">
            {PRESETS.map((p, i) => (
              <button key={p.slug} onClick={() => applyPreset(p.slug)} title={p.name} aria-label={`Preset ${p.name}`}
                className={`relative shrink-0 overflow-hidden rounded-lg ring-1 transition ${preset === p.slug ? "ring-2 ring-[#ff5c33]" : "ring-white/15 hover:ring-white/40"}`}>
                {presetThumbs[i] ? (
                  <img src={presetThumbs[i]} alt="" className="h-8 w-8 object-cover" />
                ) : (
                  <span className="block h-8 w-8 bg-white/10" />
                )}
              </button>
            ))}
          </div>
          <span className="hidden max-w-[110px] shrink-0 truncate text-right text-[11px] font-medium text-white/60 md:block">{preset ? PRESETS.find((p) => p.slug === preset)?.name : "Custom"}</span>
        </div>
      </div>
    </div>
  );
}

function TrackRow({ track, onChange, onRemove }: { track: Track; onChange: (p: Partial<Track>) => void; onRemove: () => void }) {
  const def = PARAMS[track.param];
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
      <div className="flex items-center gap-2">
        <select value={track.param} onChange={(e) => onChange({ param: e.target.value as AnimParamKey })} aria-label="Animation parameter" className="flex-1 appearance-none rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[12px] text-white/85 outline-none">
          {ANIM_PARAM_KEYS.map((k) => <option key={k} value={k} className="bg-[#16161a]">{PARAMS[k].label}</option>)}
        </select>
        <button onClick={() => onChange({ enabled: !track.enabled })} aria-label={`${track.enabled ? "Disable" : "Enable"} ${def.label} track`} aria-pressed={track.enabled} className={`h-5 w-9 rounded-full p-0.5 transition ${track.enabled ? "bg-[#ff5c33]" : "bg-white/15"}`}><span className={`block h-4 w-4 rounded-full bg-white transition ${track.enabled ? "translate-x-4" : ""}`} /></button>
        <button onClick={onRemove} aria-label={`Remove ${def.label} track`} className="text-white/30 hover:text-white"><X className="h-3.5 w-3.5" /></button>
      </div>
      <div className="mt-2 flex items-center gap-2 text-[11px]">
        <span className="text-white/40">From</span>
        <input type="number" value={round(track.from)} step={def.step} onChange={(e) => onChange({ from: parseFloat(e.target.value) || 0 })} aria-label={`${def.label} from value`} className="w-14 rounded border border-white/10 bg-black/30 px-1.5 py-1 font-mono text-white/80 outline-none" />
        <span className="text-white/40">→</span>
        <input type="number" value={round(track.to)} step={def.step} onChange={(e) => onChange({ to: parseFloat(e.target.value) || 0 })} aria-label={`${def.label} to value`} className="w-14 rounded border border-white/10 bg-black/30 px-1.5 py-1 font-mono text-white/80 outline-none" />
        <select value={track.easing} onChange={(e) => onChange({ easing: e.target.value as Track["easing"] })} aria-label={`${def.label} easing`} className="ml-auto appearance-none rounded border border-white/10 bg-white/[0.04] px-1.5 py-1 text-white/75 outline-none">
          {EASES.map((e) => <option key={e} value={e} className="bg-[#16161a]">{e}</option>)}
        </select>
      </div>
      <div className="mt-2 flex items-center gap-2 text-[11px] text-white/40">
        <span>Loops</span>
        {[1, 2, 3, 4].map((n) => <button key={n} onClick={() => onChange({ loops: n })} aria-label={`Set ${def.label} loops to ${n}`} aria-pressed={track.loops === n} className={`h-5 w-5 rounded ${track.loops === n ? "bg-white/20 text-white" : "text-white/40 hover:text-white"}`}>{n}</button>)}
        <span className="ml-2">Offset</span>
        <input type="range" min={0} max={1} step={0.01} value={track.offset} onChange={(e) => onChange({ offset: parseFloat(e.target.value) })} aria-label={`${def.label} phase offset`}
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-white/12 accent-[#ff5c33] [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ff5c33]" />
      </div>
    </div>
  );
}
const round = (v: number) => Math.round(v * 100) / 100;

function LockBtn({ label, on, onClick }: { label: string; on: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} aria-pressed={on} className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-[12px] font-medium transition ${on ? "border-[#ff5c33]/60 bg-[#ff5c33]/10 text-[#ff7a55]" : "border-white/10 text-white/55 hover:text-white"}`}><Lock className={`h-3 w-3 ${on ? "" : "opacity-40"}`} /> {label}</button>;
}
function ColorRow({ label, value, onChange, swatchOnly }: { label: string; value: string; onChange: (v: string) => void; swatchOnly?: boolean }) {
  return (
    <label className={`flex cursor-pointer items-center gap-2 ${swatchOnly ? "" : "rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2"}`}>
      <span className="relative inline-block h-7 w-7 overflow-hidden rounded-md ring-1 ring-white/15" style={{ background: value }}><input type="color" value={value} onChange={(e) => onChange(e.target.value)} aria-label={label} className="absolute inset-0 cursor-pointer opacity-0" /></span>
      {!swatchOnly && <span className="font-mono text-[12px] text-white/70">{value}</span>}
    </label>
  );
}
