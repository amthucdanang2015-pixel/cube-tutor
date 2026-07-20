"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Download, Film, Loader2, MonitorPlay, RefreshCw, X } from "lucide-react";
import type { DesignSystem } from "@/data/designSystems";
import { styleTransition } from "../engine/styleMotion";
import type { Device, DemoMode } from "../engine/contract";
import { CardPerformer, exportCardPng, exportCardVideo, LAYOUTS, CARD_DEFAULTS, type CardData, type Layout } from "./CardPerformer";
import type { CardScene } from "./scenes";

/* ============================================================================
 * Cardmaker — the PRODUCT (D-030). A card-designer app: content panel, layout
 * picker, live card canvas, present mode, export. ONE implementation, two
 * modes, exactly like Flowtime's CanonicalApp:
 *
 *   showcase — each scene beat scripts the app (typing types itself, layouts
 *              cycle, the card flips, export runs) — the studio film.
 *   live     — fully interactive: type your details, flip, present, export
 *              for real. This is /playground/cards/live, standalone.
 *
 * The card (CardPerformer) is the artifact this app produces — it is NOT the
 * product. Everything renders from ds tokens via the same CSS-var contract as
 * Flowtime; the app never hard-codes a colour, font, radius or duration.
 * ==========================================================================*/

export function CardMaker({ ds, scene = "editor", device = "desktop", mode = "showcase", initial }: {
  ds: DesignSystem;
  scene?: CardScene;
  device?: Device;
  mode?: DemoMode;
  /** live handoff: content + layout arriving from URL params */
  initial?: { data?: Partial<CardData>; layout?: Layout };
}) {
  const t = ds.t;
  const live = mode === "live";
  const accent = t.accent;

  const [data, setData] = useState<CardData>({ ...CARD_DEFAULTS, ...initial?.data });
  const [layout, setLayout] = useState<Layout>(initial?.layout ?? "classic");
  const [rot, setRot] = useState(0);
  const [present, setPresent] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [toast, setToast] = useState<"png" | "webm" | null>(null);
  const [exporting, setExporting] = useState<"" | "png" | "video">("");

  // showcase: each beat scripts the app — the film. Live never runs these.
  useEffect(() => {
    if (live) return;
    setExportOpen(false); setToast(null);
    if (scene === "editor") { setPresent(false); setLayout("classic"); setRot(0); setData({ ...CARD_DEFAULTS }); }
    else if (scene === "typing") {
      setPresent(false); setLayout("classic"); setRot(0);
      const name = CARD_DEFAULTS.name, co = CARD_DEFAULTS.company;
      setData({ ...CARD_DEFAULTS, name: "", company: "" });
      const timers = [
        ...name.split("").map((_, i) => setTimeout(() => setData((d) => ({ ...d, name: name.slice(0, i + 1) })), 400 + i * 110)),
        ...co.split("").map((_, i) => setTimeout(() => setData((d) => ({ ...d, company: co.slice(0, i + 1) })), 400 + name.length * 110 + 500 + i * 90)),
      ];
      return () => timers.forEach(clearTimeout);
    } else if (scene === "layouts") {
      setPresent(false); setRot(0); setLayout("classic");
      const a = setTimeout(() => setLayout("centered"), 1500);
      const b = setTimeout(() => setLayout("split"), 2950);
      return () => { clearTimeout(a); clearTimeout(b); };
    } else if (scene === "flip") { setPresent(false); setLayout("classic"); setRot(180); }
    else if (scene === "present") { setPresent(true); }
    else if (scene === "export") {
      setPresent(false); setLayout("classic"); setRot(0);
      setExportOpen(true);
      const a = setTimeout(() => { setExportOpen(false); setToast("png"); }, 2400);
      return () => clearTimeout(a);
    }
  }, [scene, live]);

  const vars = {
    "--bg": t.bg, "--surface": t.surface, "--text": t.text, "--muted": t.muted,
    "--accent": t.accent, "--accent-text": t.accentText, "--border": t.border,
    "--radius": t.radius, "--ctl": t.ctlRadius, "--shadow": t.shadow, "--bw": t.borderW,
    "--icon-sw": String(ds.iconSw ?? 2),
  } as React.CSSProperties;

  const set = (k: keyof CardData) => (e: React.ChangeEvent<HTMLInputElement>) => live && setData((d) => ({ ...d, [k]: e.target.value }));
  const flip = () => setRot((r) => r + 180);
  const doExport = async (kind: "png" | "video") => {
    setExporting(kind);
    try {
      await (kind === "png" ? exportCardPng : exportCardVideo)(ds, accent, layout, data);
      setToast(kind === "png" ? "png" : "webm");
      setTimeout(() => setToast(null), 2200);
    }
    finally { setExporting(""); setExportOpen(false); }
  };

  // Stack the panel above the canvas on any narrow frame. Size by the device
  // prop, never a media query — the device frame lies about its width (D-016).
  const stacked = device !== "desktop";
  const tr = styleTransition(ds);

  return (
    <div className="cm relative flex h-full w-full flex-col overflow-hidden" style={{ ...vars, background: "var(--bg)", color: "var(--text)", fontFamily: t.font }}>
      <style>{`.cm *{transition:background-color .45s ease,color .45s ease,border-color .45s ease}.cm svg{stroke-width:var(--icon-sw)}`}</style>

      {/* top bar — the app's own chrome */}
      <div className="flex h-10 shrink-0 items-center gap-2 border-b px-3" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <span className="h-2.5 w-2.5 shrink-0" style={{ background: "var(--accent)", borderRadius: t.ctlRadius === "0px" ? 0 : 99 }} />
        <span className="text-[12px] font-semibold" style={{ fontWeight: t.headWeight }}>Cardmaker</span>
        {device !== "mobile" && <span className="text-[10px]" style={{ color: "var(--muted)" }}>· your card, in your brand</span>}
        <div className="ml-auto flex items-center gap-1.5">
          <button onClick={() => live && setPresent((v) => !v)} aria-label={present ? "Exit present mode" : "Present mode"}
            className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium"
            style={{ color: present ? "var(--accent-text)" : "var(--muted)", background: present ? "var(--accent)" : "transparent", border: `var(--bw) solid ${present ? "var(--accent)" : "var(--border)"}`, borderRadius: "var(--ctl)" }}>
            {present ? <X className="h-3 w-3" /> : <MonitorPlay className="h-3 w-3" />} {present ? "Exit" : "Present"}
          </button>
          <button onClick={() => live && setExportOpen((v) => !v)} aria-label="Export card"
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold"
            style={{ background: "var(--accent)", color: "var(--accent-text)", borderRadius: "var(--ctl)" }}>
            <Download className="h-3 w-3" /> Export
          </button>
        </div>
      </div>

      <div className={`flex min-h-0 flex-1 ${stacked ? "flex-col" : ""}`}>
        {/* content panel — part of the product, so it lives INSIDE the demo (D-030) */}
        {!present && (
          <aside className={`${stacked ? "order-2 w-full border-t" : "w-[31%] min-w-[150px] max-w-[220px] border-r"} shrink-0 overflow-y-auto p-3`} style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
            <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Content</p>
            <div className="mt-1.5 space-y-1.5">
              <Field label="Name" value={data.name} onChange={set("name")} live={live} typing={!live && scene === "typing"} />
              <Field label="Title" value={data.title} onChange={set("title")} live={live} />
              <Field label="Company" value={data.company} onChange={set("company")} live={live} typing={!live && scene === "typing"} />
              <Field label="Email" value={data.email} onChange={set("email")} live={live} />
              <Field label="Phone" value={data.phone} onChange={set("phone")} live={live} />
              <Field label="Website" value={data.site} onChange={set("site")} live={live} />
            </div>

            <p className="mt-3 text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Layout</p>
            <div className="mt-1.5 flex gap-1">
              {LAYOUTS.map((l) => {
                const on = layout === l.id;
                return (
                  <button key={l.id} onClick={() => live && setLayout(l.id)} aria-label={`Layout ${l.name}`} aria-pressed={on}
                    className="flex-1 px-1 py-1.5 text-center"
                    style={{ border: `var(--bw) solid ${on ? "var(--accent)" : "var(--border)"}`, borderRadius: "var(--ctl)", color: on ? "var(--text)" : "var(--muted)", background: on ? "var(--bg)" : "transparent" }}>
                    <LayoutGlyph id={l.id} />
                    <span className="mt-0.5 block text-[8.5px]">{l.name}</span>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* canvas — the artifact this app produces */}
        <main className={`relative flex min-h-0 flex-1 items-center justify-center overflow-hidden ${stacked && !present ? "order-1 min-h-[52%]" : ""}`}>
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[70px] transition-colors duration-700" style={{ background: accent }} />
          <CardPerformer ds={ds} accent={accent} layout={layout} mode={present ? "turntable" : "float"} data={data} rot={rot}
            onFlip={live && !present ? flip : undefined} width={present ? "min(80%, 500px)" : "min(72%, 420px)"} />

          {live && !present && (
            <button onClick={flip} className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-1 text-[9.5px] font-medium"
              style={{ color: "var(--muted)", border: "var(--bw) solid var(--border)", borderRadius: "var(--ctl)", background: "var(--surface)" }}>
              <RefreshCw className="h-2.5 w-2.5" /> Flip
            </button>
          )}

          {/* export sheet: scripted progress in showcase, real buttons in live */}
          <AnimatePresence>
            {exportOpen && (
              <motion.div key="export" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={tr}
                className="absolute bottom-2.5 right-2.5 z-20 w-52 p-2.5" style={{ background: "var(--surface)", border: "var(--bw) solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow)" }}>
                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Export</p>
                {live ? (
                  <div className="mt-1.5 space-y-1">
                    <SheetBtn onClick={() => doExport("png")} busy={exporting === "png"} icon={<Download className="h-3 w-3" />} label="PNG · both sides" />
                    <SheetBtn onClick={() => doExport("video")} busy={exporting === "video"} icon={<Film className="h-3 w-3" />} label="Video · one spin" />
                  </div>
                ) : (
                  <div className="mt-2">
                    <p className="truncate font-mono text-[9.5px]">card-{ds.slug}.png</p>
                    <span className="relative mt-1.5 block h-1 overflow-hidden rounded-full" style={{ background: "var(--border)" }}>
                      <motion.span className="absolute inset-y-0 left-0" style={{ background: "var(--accent)" }} initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.9, ease: "easeInOut" }} />
                    </span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {toast && (
              <motion.div key="toast" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={tr}
                className="absolute bottom-2.5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 px-2.5 py-1.5 text-[10px]"
                style={{ background: "var(--surface)", border: "var(--bw) solid var(--border)", borderRadius: "var(--ctl)", boxShadow: "var(--shadow)" }}>
                <Check className="h-3 w-3" style={{ color: "var(--accent)" }} /> card-{ds.slug}.{toast} saved
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

/* ---------------- the app's own small pieces (token-consuming) ---------------- */
function Field({ label, value, onChange, live, typing }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; live: boolean; typing?: boolean }) {
  return (
    <label className="block">
      <span className="text-[8.5px] uppercase tracking-wider" style={{ color: "var(--muted)" }}>{label}</span>
      <span className="relative block">
        <input value={value} onChange={onChange} readOnly={!live} aria-label={label} maxLength={48}
          className="w-full px-2 py-1 text-[10.5px] outline-none"
          style={{ background: "var(--bg)", border: `var(--bw) solid ${typing ? "var(--accent)" : "var(--border)"}`, borderRadius: "var(--ctl)", color: "var(--text)" }} />
        {typing && <motion.span className="absolute right-1.5 top-1/2 h-3 w-px -translate-y-1/2" style={{ background: "var(--accent)" }} animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />}
      </span>
    </label>
  );
}
function SheetBtn({ onClick, busy, icon, label }: { onClick: () => void; busy: boolean; icon: React.ReactNode; label: string }) {
  return (
    <button onClick={onClick} disabled={busy} className="flex w-full items-center gap-1.5 px-2 py-1.5 text-[10px] disabled:opacity-50"
      style={{ border: "var(--bw) solid var(--border)", borderRadius: "var(--ctl)", color: "var(--text)" }}>
      {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : icon} {label}
    </button>
  );
}
function LayoutGlyph({ id }: { id: Layout }) {
  return (
    <span className="mx-auto flex h-5 w-8 flex-col justify-between rounded-[3px] p-[3px]" style={{ border: "1px solid var(--border)" }}>
      {id === "classic" && (<><span className="block h-[2px] w-3 rounded-full opacity-60" style={{ background: "currentColor" }} /><span className="block h-[3px] w-5 rounded-full" style={{ background: "currentColor" }} /></>)}
      {id === "centered" && (<><span className="mx-auto block h-[2px] w-2 rounded-full opacity-60" style={{ background: "currentColor" }} /><span className="mx-auto block h-[3px] w-4 rounded-full" style={{ background: "currentColor" }} /><span className="mx-auto block h-[1.5px] w-3 rounded-full opacity-50" style={{ background: "currentColor" }} /></>)}
      {id === "split" && (<span className="flex h-full gap-[3px]"><span className="block h-full w-[30%] rounded-[1.5px] opacity-70" style={{ background: "currentColor" }} /><span className="flex flex-1 flex-col justify-end gap-[2px]"><span className="block h-[2px] w-full rounded-full" style={{ background: "currentColor" }} /><span className="block h-[1.5px] w-2/3 rounded-full opacity-50" style={{ background: "currentColor" }} /></span></span>)}
    </span>
  );
}
