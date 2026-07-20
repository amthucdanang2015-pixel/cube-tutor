"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DESIGN_SYSTEMS, resolveStyle, TYPEFACES, MOTIONS, BG_PRESETS, ICON_STYLES, LOADINGS, SPLASHES, TRANSITIONS, dsFx, type StyleOverrides } from "@/data/designSystems";
import type { FacetId } from "@/data/products";
import { motionPreviewEase } from "./styleMotion";
import { Facet, Chips, FilterChip, Kbd } from "./ui";
import { ChevronDown, Repeat, RotateCcw, Search, X } from "lucide-react";

/* ============================================================================
 * StyleRail (D-028) — THE left rail of every Playground studio.
 *
 * It configures the design language and nothing else: pick one of the 112
 * languages, then turn the facet dials. Product settings (content, layout,
 * scenes, device, export) live with the stage on the right — never here.
 *
 * A product may hide facets it can't express (`facets`), and supplies its own
 * intro sentence and keyboard hints. Everything else is identical by
 * construction: that identity IS the feature.
 * ==========================================================================*/

export interface StyleRailProps {
  /** one-line, product-specific sentence at the top of the rail */
  intro: string;
  /** which Customize sections render, in the engine's canonical order */
  facets: readonly FacetId[];
  /** index into DESIGN_SYSTEMS */
  active: number;
  /** the owner also resets its derived state (scene, overrides) here */
  setActive: (i: number) => void;
  ov: StyleOverrides;
  /** live-edit an override WITHOUT replaying — for the continuous color inputs */
  patchStyle: (patch: Partial<StyleOverrides>) => void;
  /**
   * Commit a facet choice. The rail names the FACET; the product decides which
   * of its own scenes best demonstrates it (D-029). The rail must never know a
   * product's scene vocabulary.
   */
  applyFacet: (patch: Partial<StyleOverrides>, facet: FacetId) => void;
  resetAll: () => void;
  /** the owner holds picker state so its keyboard handler can open/ignore it */
  pickerOpen: boolean;
  setPickerOpen: (open: boolean) => void;
  /** omit to hide the toggle */
  autoTour?: { on: boolean; toggle: () => void };
  kbdHints?: React.ReactNode;
}

const DEFAULT_HINTS = (
  <>
    <Kbd>↑↓</Kbd> style <Kbd>S</Kbd> browse <Kbd>K</Kbd> play <Kbd>P</Kbd> prompt
  </>
);

export function StyleRail({ intro, facets, active, setActive, ov, patchStyle, applyFacet, resetAll, pickerOpen, setPickerOpen, autoTour, kbdHints }: StyleRailProps) {
  const base = DESIGN_SYSTEMS[active % DESIGN_SYSTEMS.length];
  const ds = useMemo(() => resolveStyle(base, ov), [base, ov]);
  const customized = Object.values(ov).some(Boolean);
  const fxActive = ov.fx ?? dsFx(base);
  const has = (f: FacetId) => facets.includes(f);
  const setBg = (k: "bgA" | "bgB", v: string) => patchStyle(k === "bgA" ? { bgA: v } : { bgB: v });

  return (
    <>
      <div className="px-5 pb-4 pt-6 lg:pt-20">
        <p className="text-sm leading-relaxed text-white/55">{intro}</p>

        {/* current style → picker */}
        <button onClick={() => setPickerOpen(true)} className="mt-4 flex w-full items-center gap-3 rounded-xl border border-line bg-white/[0.03] p-3 text-left transition hover:border-white/25">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg ring-1 ring-white/10" style={{ background: base.t.bg }}>
            <span className="h-4 w-4" style={{ background: base.t.accent, borderRadius: base.t.radius === "0px" ? 0 : 5 }} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-white">{ds.name}</span>
            <span className="block truncate text-[11px] capitalize text-white/40">{base.mode} · {base.type} · {String(active + 1).padStart(2, "0")}/{DESIGN_SYSTEMS.length}</span>
          </span>
          <span className="flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[11px] text-white/60"><ChevronDown className="h-3 w-3" /> Change</span>
        </button>

        {autoTour && (
          <button onClick={autoTour.toggle} className={`mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11.5px] transition ${autoTour.on ? "border-accent2/50 bg-accent2/10 text-accent2" : "border-line text-white/45 hover:text-white/80"}`}>
            <Repeat className="h-3 w-3" /> Auto-tour styles {autoTour.on ? "on" : "off"}
          </button>
        )}
      </div>

      {/* Customize — curated facets (D-013) */}
      <div className="border-t border-line px-5 pb-10 pt-4">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-widest text-white/45">Customize</p>
          {customized && <button onClick={resetAll} className="flex items-center gap-1 text-[10.5px] text-accent2 hover:text-white"><RotateCcw className="h-3 w-3" /> Reset all</button>}
        </div>

        {has("accent") && (
          <Facet label="Accent color">
            <div className="flex items-center gap-2">
              <label className="relative h-8 w-8 cursor-pointer overflow-hidden rounded-lg ring-1 ring-white/15" style={{ background: ov.accent ?? ds.t.accent }}>
                <input type="color" value={ov.accent ?? ds.t.accent} onChange={(e) => patchStyle({ accent: e.target.value })} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Accent color" />
              </label>
              <span className="font-mono text-[11px] text-white/55">{ov.accent ?? ds.t.accent}</span>
              {ov.accent && <button onClick={() => patchStyle({ accent: undefined })} className="text-[10.5px] text-white/40 hover:text-white">reset</button>}
            </div>
          </Facet>
        )}

        {has("typography") && (
          <Facet label="Typography">
            <Chips items={TYPEFACES.map((t) => [t.slug, t.name] as [string, string])} value={ov.type} onPick={(v) => applyFacet({ type: ov.type === v ? undefined : v }, "typography")} render={(slug, name) => <><span style={{ fontFamily: TYPEFACES.find((t) => t.slug === slug)!.stack }}>Ag</span> {name}</>} />
          </Facet>
        )}

        {has("motion") && (
          <Facet label="Motion">
            <div className="grid grid-cols-2 gap-1.5">
              {MOTIONS.map((m) => {
                const on = ov.motion === m.slug;
                return (
                  <button key={m.slug} onClick={() => applyFacet({ motion: on ? undefined : m.slug }, "motion")} title={m.feel}
                    className={`flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-[11px] transition ${on ? "border-accent2/60 bg-accent2/10 text-accent2" : "border-line text-white/55 hover:text-white"}`}>
                    <span className="truncate">{m.name}</span>
                    <span className="relative h-1.5 w-10 shrink-0 overflow-hidden rounded-full bg-white/10">
                      {/* D-016: framer writes `transform` inline, so a Tailwind -translate-y
                          would be silently dropped. Dot and track are both 6px — top-0 centers it. */}
                      <motion.span className="absolute top-0 h-1.5 w-1.5 rounded-full" style={{ background: on ? "#22d3ee" : "rgba(255,255,255,0.55)", left: 2 }}
                        animate={{ x: [0, 28] }} transition={{ duration: Math.max(0.6, m.tokens.dur / 320), repeat: Infinity, repeatType: "mirror", ease: motionPreviewEase(m.tokens.ease) }} />
                    </span>
                  </button>
                );
              })}
            </div>
          </Facet>
        )}

        {has("background") && (
          <Facet label="Background">
            <div className="grid grid-cols-4 gap-1.5">
              {BG_PRESETS.map((p) => (
                <button key={p.slug} onClick={() => applyFacet({ fx: p.fx, bgA: p.colors?.[0], bgB: p.colors?.[1] }, "background")} title={p.name}
                  className={`relative h-10 overflow-hidden rounded-lg ring-1 transition ${(ov.fx ?? "") === p.fx && (p.colors ? ov.bgA === p.colors[0] : !ov.bgA) ? "ring-2 ring-accent2" : "ring-white/10 hover:ring-white/30"}`}
                  style={bgSwatch(p, ds.t.accent)}>
                  <span className="absolute inset-x-0 bottom-0 bg-black/45 px-1 py-0.5 text-left text-[8.5px] font-medium text-white/80">{p.name}</span>
                </button>
              ))}
            </div>
            {fxActive === "gradient" && (
              <div className="mt-2 flex items-center gap-2">
                {(["bgA", "bgB"] as const).map((k, i) => (
                  <label key={k} className="relative h-7 w-7 cursor-pointer overflow-hidden rounded-md ring-1 ring-white/15" style={{ background: ov[k] ?? (i === 0 ? ds.t.accent : "#22d3ee") }}>
                    <input type="color" value={ov[k] ?? (i === 0 ? ds.t.accent : "#22d3ee")} onChange={(e) => setBg(k, e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" aria-label={`Gradient color ${i + 1}`} />
                  </label>
                ))}
                <span className="text-[10.5px] text-white/40">mix your own</span>
              </div>
            )}
          </Facet>
        )}

        {has("loading") && (
          <Facet label="Loading">
            <div className="flex flex-wrap gap-1.5">
              {LOADINGS.map((l) => (
                <button key={l.slug} onClick={() => applyFacet({ loading: ov.loading === l.slug ? undefined : l.slug }, "loading")}
                  className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] transition ${ov.loading === l.slug ? "border-accent2/60 bg-accent2/10 text-accent2" : "border-line text-white/55 hover:text-white"}`}>
                  <LoadingMini kind={l.slug} /> {l.name}
                </button>
              ))}
            </div>
          </Facet>
        )}

        {has("splash") && (
          <Facet label="Splash">
            <div className="flex flex-wrap gap-1.5">
              {SPLASHES.map((s) => (
                <button key={s.slug} onClick={() => applyFacet({ splash: ov.splash === s.slug ? undefined : s.slug }, "splash")}
                  className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] transition ${ov.splash === s.slug ? "border-accent2/60 bg-accent2/10 text-accent2" : "border-line text-white/55 hover:text-white"}`}>
                  <SplashMini kind={s.slug} /> {s.name}
                </button>
              ))}
            </div>
          </Facet>
        )}

        {has("transition") && (
          <Facet label="Transition">
            <Chips items={TRANSITIONS.map((t) => [t.slug, t.name] as [string, string])} value={ov.transition} onPick={(v) => applyFacet({ transition: ov.transition === v ? undefined : (v as StyleOverrides["transition"]) }, "transition")} />
          </Facet>
        )}

        {has("icons") && (
          <Facet label="Icons">
            <div className="flex gap-1.5">
              {ICON_STYLES.map((ic) => (
                <button key={ic.slug} onClick={() => applyFacet({ icon: ov.icon === ic.slug ? undefined : ic.slug }, "icons")}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-[11px] transition ${ov.icon === ic.slug ? "border-accent2/60 bg-accent2/10 text-accent2" : "border-line text-white/55 hover:text-white"}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={ic.sw * 1.2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
                  {ic.name}
                </button>
              ))}
            </div>
          </Facet>
        )}
      </div>

      {/* keyboard hints — sticky footer, always visible (D-015) */}
      <div className="sticky bottom-0 z-10 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line bg-[#0a0a0c]/85 px-5 py-2.5 text-[11px] text-white/40 backdrop-blur-md">
        {kbdHints ?? DEFAULT_HINTS}
      </div>

      <StylePicker open={pickerOpen} onClose={() => setPickerOpen(false)} active={active} onPick={(i) => { setActive(i); setPickerOpen(false); }} />
    </>
  );
}

/* ---------- the full-library picker: left drawer, fixed frame (D-014) ---------- */
function StylePicker({ open, onClose, active, onPick }: { open: boolean; onClose: () => void; active: number; onPick: (i: number) => void }) {
  const [q, setQ] = useState("");
  const [mode, setMode] = useState<"all" | "light" | "dark">("all");
  const [type, setType] = useState<"all" | "sans" | "serif" | "mono">("all");
  useEffect(() => { if (open) { setQ(""); } }, [open]);

  const items = DESIGN_SYSTEMS.map((d, i) => ({ d, i })).filter(({ d }) =>
    (mode === "all" || d.mode === mode) && (type === "all" || d.type === type) &&
    (!q.trim() || `${d.name} ${d.blurb}`.toLowerCase().includes(q.trim().toLowerCase())),
  );

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div initial={{ x: "-105%" }} animate={{ x: 0 }} exit={{ x: "-105%" }} transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="absolute inset-y-0 left-0 flex w-[420px] max-w-[94vw] flex-col border-r border-line bg-surface shadow-2xl">
            <div className="border-b border-line p-4">
              <div className="flex items-center gap-3">
                <Search className="h-4 w-4 shrink-0 text-white/40" />
                <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${DESIGN_SYSTEMS.length} design languages…`} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/30" />
                <button onClick={onClose} aria-label="Close style picker" className="rounded-full border border-line p-2 text-white/70 hover:text-white"><X className="h-4 w-4" /></button>
              </div>
              <div className="mt-3 flex gap-1">
                {(["all", "light", "dark"] as const).map((m) => <FilterChip key={m} on={mode === m} onClick={() => setMode(m)}>{m}</FilterChip>)}
                <span className="mx-1 w-px self-stretch bg-line" />
                {(["all", "sans", "serif", "mono"] as const).map((t) => <FilterChip key={t} on={type === t} onClick={() => setType(t)}>{t}</FilterChip>)}
                <span className="ml-auto self-center text-[11px] tabular-nums text-white/35">{items.length}</span>
              </div>
            </div>
            {/* fixed frame — only this grid scrolls */}
            <div className="min-h-0 flex-1 overflow-y-auto p-3">
              <div className="grid grid-cols-2 content-start gap-2">
                {items.map(({ d, i }) => (
                  <button key={d.slug} onClick={() => onPick(i)}
                    className={`group flex flex-col overflow-hidden rounded-xl text-left ring-1 transition ${i === active ? "ring-2 ring-accent2" : "ring-white/10 hover:ring-white/30"}`}>
                    {/* mini-app preview: real tokens rendering a tiny screen */}
                    <span className="relative block h-[74px] p-2.5" style={{ background: d.t.bg }}>
                      <span className="block h-1.5 w-10 rounded-full" style={{ background: d.t.text, opacity: 0.85 }} />
                      <span className="mt-1 block h-1 w-14 rounded-full" style={{ background: d.t.muted, opacity: 0.6 }} />
                      <span className="mt-2 flex gap-1.5">
                        <span className="flex h-[26px] flex-1 flex-col justify-center gap-0.5 px-1.5" style={{ background: d.t.surface, border: `1px solid ${d.t.border}`, borderRadius: d.t.radius === "0px" ? 0 : 5, boxShadow: d.t.shadow }}>
                          <span className="block h-0.5 w-6 rounded-full" style={{ background: d.t.muted }} />
                          <span className="block h-1 w-4 rounded-full" style={{ background: d.t.text }} />
                        </span>
                        <span className="flex h-[26px] w-9 items-center justify-center text-[7px] font-bold" style={{ background: d.t.accent, color: d.t.accentText, borderRadius: d.t.ctlRadius === "0px" ? 0 : d.t.ctlRadius === "999px" ? 99 : 5 }}>Go</span>
                      </span>
                    </span>
                    <span className="flex items-center justify-between bg-black/45 px-2.5 py-1.5">
                      <span className="truncate text-[11.5px] text-white/85" style={{ fontFamily: d.t.font }}>{d.name}</span>
                      <span className="text-[9px] uppercase text-white/30">{d.mode}</span>
                    </span>
                  </button>
                ))}
              </div>
              {items.length === 0 && <p className="py-10 text-center text-sm text-white/40">Nothing matches “{q}”.</p>}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ---------- facet preview helpers (D-014: every picker previews itself) ---------- */
function bgSwatch(p: { fx: string; colors?: [string, string] }, accent: string): React.CSSProperties {
  if (p.fx === "gradient" && p.colors) return { background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})` };
  if (p.fx === "glow") return { background: `radial-gradient(circle at 35% 35%, ${accent}88, #101014 70%)` };
  if (p.fx === "aurora") return { background: `radial-gradient(circle at 25% 30%, ${accent}77, transparent 55%), radial-gradient(circle at 75% 75%, ${accent}44, #101014 75%)` };
  if (p.fx === "mesh") return { background: `conic-gradient(from 45deg, ${accent}66, #101014, ${accent}44, #101014, ${accent}66)` };
  if (p.fx === "grid") return { background: "#101014", backgroundImage: `linear-gradient(${accent}33 1px, transparent 1px), linear-gradient(90deg, ${accent}33 1px, transparent 1px)`, backgroundSize: "8px 8px" };
  if (p.fx === "dots") return { background: "#101014", backgroundImage: `radial-gradient(${accent}55 1px, transparent 1px)`, backgroundSize: "7px 7px" };
  if (p.fx === "scanlines") return { background: "#101014", backgroundImage: `repeating-linear-gradient(0deg, ${accent}33, ${accent}33 1px, transparent 1px, transparent 4px)` };
  if (p.fx === "noise") return { background: "#1a1a20", backgroundImage: `radial-gradient(rgba(255,255,255,0.22) 0.5px, transparent 0.5px)`, backgroundSize: "3px 3px" };
  return { background: "#101014" };
}
function LoadingMini({ kind }: { kind: string }) {
  if (kind === "spinner") return <motion.span className="h-3 w-3 rounded-full border-[1.5px] border-current border-t-transparent" animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }} />;
  if (kind === "dots") return <span className="flex gap-0.5">{[0, 1, 2].map((i) => <motion.span key={i} className="h-1 w-1 rounded-full bg-current" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />)}</span>;
  if (kind === "progress") return <span className="relative h-1 w-5 overflow-hidden rounded-full"><span className="absolute inset-0 bg-current opacity-20" /><motion.span className="absolute inset-y-0 w-2 rounded-full bg-current" animate={{ x: [-8, 20] }} transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }} /></span>;
  return <span className="relative h-2.5 w-5 overflow-hidden rounded-sm"><span className="absolute inset-0 bg-current opacity-20" /><motion.span className="absolute inset-y-0 w-2 bg-current opacity-50" animate={{ x: [-8, 20] }} transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }} /></span>;
}
function SplashMini({ kind }: { kind: string }) {
  if (kind === "pop") return <motion.span className="h-2.5 w-2.5 rounded-full bg-current" animate={{ scale: [0.4, 1.15, 1] }} transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.6 }} />;
  if (kind === "fade") return <motion.span className="h-2.5 w-2.5 rounded-full bg-current" animate={{ opacity: [0, 1] }} transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.6 }} />;
  if (kind === "type") return <motion.span className="h-3 w-0.5 bg-current" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />;
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <motion.circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" animate={{ pathLength: [0, 1] }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.5 }} />
    </svg>
  );
}
