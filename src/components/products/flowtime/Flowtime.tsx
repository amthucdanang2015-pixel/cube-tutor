"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Home, Timer as TimerIcon, NotebookPen, Calendar as CalIcon, Settings as SettingsIcon, Sparkles, Check, X, Play, Pause, Flame, Send } from "lucide-react";
import { dsFx, type DesignSystem } from "@/data/designSystems";
import { styleTransition } from "../engine/styleMotion";
import type { Device, DemoMode } from "../engine/contract";

/* =============================================================================
 * The canonical demo app: "Flowtime" — a focus timer product (D-012/D-013).
 * ONE implementation, two modes:
 *   showcase — scene-scripted cinematic autoplay (embedded preview)
 *   live     — fully interactive (route /styles/live), same rendering
 * Styles contribute tokens only. Scenes direct attention; the shell persists.
 * ===========================================================================*/

export type SceneKey = "splash" | "skeleton" | "dashboard" | "timer" | "tasks" | "assistant" | "alerts" | "settings" | "responsive";
/** Device/DemoMode are engine vocabulary (D-029) — re-exported for this product's internals. */
export type { Device } from "../engine/contract";
type AppMode = DemoMode;

/** The style's Motion facet. Lives in the engine now — every product shares it. */
export const sceneTransition = styleTransition;

/** Entrance pose per the style's transition facet (D-013). */
export function enterFrom(ds: DesignSystem): Record<string, number | string> {
  switch (ds.transitionK) {
    case "slide": return { opacity: 0, x: 28 };
    case "scale": return { opacity: 0, scale: 0.94 };
    case "blur": return { opacity: 0, filter: "blur(10px)" };
    default: return { opacity: 0, y: 12 };
  }
}
const enterTo = { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" };

export function CanonicalApp({ ds, scene = "dashboard", device = "desktop", mode = "showcase" }: { ds: DesignSystem; scene?: SceneKey; device?: Device; mode?: AppMode }) {
  const t = ds.t;
  const vars = {
    "--bg": t.bg, "--surface": t.surface, "--text": t.text, "--muted": t.muted,
    "--accent": t.accent, "--accent-text": t.accentText, "--border": t.border,
    "--radius": t.radius, "--ctl": t.ctlRadius, "--shadow": t.shadow, "--bw": t.borderW,
    "--icon-sw": String(ds.iconSw ?? 2),
  } as React.CSSProperties;
  const boot = scene === "splash" || scene === "skeleton";
  const group = boot ? scene : "app";

  return (
    <div className="ca relative h-full w-full overflow-hidden" data-scene={scene} style={{ ...vars, background: "var(--bg)", color: "var(--text)", fontFamily: t.font }}>
      <style>{`.ca *{transition:background-color .45s ease,color .45s ease,border-color .45s ease,box-shadow .45s ease,border-radius .45s ease}.ca svg{stroke-width:var(--icon-sw)}`}</style>
      <Fx ds={ds} />
      {/* Crossfade by GROUP so the app shell persists across app scenes (D-013). */}
      <AnimatePresence initial={false}>
        {/* safe-area: content clears the status bar / camera, bg stays edge-to-edge (D-014) */}
        <motion.div key={group} className="absolute inset-0" style={{ paddingTop: device === "mobile" ? 38 : device === "tablet" ? 22 : 0 }} initial={enterFrom(ds)} animate={enterTo} exit={{ opacity: 0, transition: { duration: 0.22 } }} transition={sceneTransition(ds)}>
          {group === "splash" && <Splash ds={ds} />}
          {group === "skeleton" && <Loading ds={ds} device={device} />}
          {group === "app" && <Shell ds={ds} scene={scene} device={device} mode={mode} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ---------------- background fx (GPU transforms only) ---------------- */
function Fx({ ds }: { ds: DesignSystem }) {
  const fx = dsFx(ds);
  const a = ds.t.accent;
  if (fx === "none") return null;
  if (fx === "scanlines") return <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.07] [background-image:repeating-linear-gradient(0deg,currentColor,currentColor_1px,transparent_1px,transparent_3px)]" style={{ color: a }} />;
  if (fx === "grid") return <motion.div className="pointer-events-none absolute -inset-[30%] z-0 opacity-[0.05] [background-image:linear-gradient(currentColor_1px,transparent_1px),linear-gradient(90deg,currentColor_1px,transparent_1px)] [background-size:36px_36px]" style={{ color: a }} animate={{ x: [0, 18, 0], y: [0, 10, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />;
  if (fx === "dots") return <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.08] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:22px_22px]" style={{ color: a }} />;
  if (fx === "noise") return <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />;
  if (fx === "mesh") return <motion.div className="pointer-events-none absolute -inset-1/4 z-0 opacity-[0.1]" style={{ background: `conic-gradient(from 0deg, ${a}, transparent 30%, ${a} 60%, transparent 80%, ${a})`, filter: "blur(60px)" }} animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} />;
  if (fx === "aurora") return (
    <>
      <motion.div className="pointer-events-none absolute left-[10%] top-[-10%] z-0 h-64 w-64 rounded-full blur-[70px]" style={{ background: a, opacity: 0.16 }} animate={{ x: [0, 50, -20, 0], y: [0, 25, -15, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="pointer-events-none absolute right-[5%] bottom-[-10%] z-0 h-72 w-72 rounded-full blur-[80px]" style={{ background: a, opacity: 0.1 }} animate={{ x: [0, -40, 20, 0], y: [0, -20, 10, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
    </>
  );
  if (fx === "gradient") {
    const [ca, cb] = ds.fxColors ?? [a, a];
    return (
      <>
        <motion.div className="pointer-events-none absolute left-[-10%] top-[-15%] z-0 h-[60%] w-[60%] rounded-full blur-[70px]" style={{ background: ca, opacity: 0.28 }} animate={{ x: [0, 60, -20, 0], y: [0, 30, -15, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="pointer-events-none absolute right-[-10%] bottom-[-15%] z-0 h-[60%] w-[60%] rounded-full blur-[70px]" style={{ background: cb, opacity: 0.24 }} animate={{ x: [0, -50, 25, 0], y: [0, -25, 15, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
      </>
    );
  }
  return <motion.div className="pointer-events-none absolute left-1/4 top-0 z-0 h-72 w-72 rounded-full blur-[80px]" style={{ background: a, opacity: 0.14 }} animate={{ x: [0, 60, -30, 0], y: [0, 30, -20, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />;
}

/* ---------------- shared bits ---------------- */
const up = (ds: DesignSystem): React.CSSProperties => ({ textTransform: ds.t.upper ? "uppercase" : "none", letterSpacing: ds.t.upper ? "0.06em" : "-0.01em" });
function Card({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return <div onClick={onClick} className={`relative p-4 ${className}`} style={{ background: "var(--surface)", border: "var(--bw) solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow)" }}>{children}</div>;
}
function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] uppercase tracking-[0.12em]" style={{ color: "var(--muted)" }}>{children}</p>;
}
function Av({ i, s = 22 }: { i: number; s?: number }) {
  const hues = ["#f59e0b", "#10b981", "#6366f1", "#ec4899"];
  return <span className="inline-flex shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white" style={{ width: s, height: s, background: hues[i % 4] }}>{"NMKL"[i % 4]}</span>;
}
function useCount(to: number, bump: number, dur = 900) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0; const from = n; const target = to + bump; const t0 = performance.now();
    const tick = (now: number) => { const p = Math.min(1, (now - t0) / dur); setN(Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, bump]);
  return n;
}

/* ---------------- boot scenes ---------------- */
function Splash({ ds }: { ds: DesignSystem }) {
  const kind = ds.splash ?? "draw";
  const Logo = () => (
    <motion.svg width="56" height="56" viewBox="0 0 56 56" initial="h" animate="s">
      <motion.circle cx="28" cy="28" r="22" fill="none" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round"
        variants={{ h: { pathLength: kind === "draw" ? 0 : 1 }, s: { pathLength: 1 } }} transition={{ duration: 0.9, ease: "easeOut" }} />
      <motion.path d="M28 16v12l8 5" fill="none" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
        variants={{ h: { pathLength: kind === "draw" ? 0 : 1 }, s: { pathLength: 1 } }} transition={{ duration: 0.6, delay: kind === "draw" ? 0.5 : 0, ease: "easeOut" }} />
    </motion.svg>
  );
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      {kind === "pop" ? (
        <motion.div initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 380, damping: 14 }}><Logo /></motion.div>
      ) : kind === "fade" ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}><Logo /></motion.div>
      ) : (
        <Logo />
      )}
      {kind === "type" ? (
        <p className="flex text-lg" style={{ fontWeight: ds.t.headWeight, ...up(ds) }}>
          {"Flowtime".split("").map((ch, i) => (
            <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 + i * 0.09 }}>{ch}</motion.span>
          ))}
        </p>
      ) : (
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="text-lg" style={{ fontWeight: ds.t.headWeight, ...up(ds) }}>Flowtime</motion.p>
      )}
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-[11px]" style={{ color: "var(--muted)" }}>deep work, actually deep</motion.p>
    </div>
  );
}
function Skeleton({ device }: { device: Device }) {
  const Sk = ({ className }: { className: string }) => (
    <div className={`relative overflow-hidden ${className}`} style={{ background: "var(--border)", borderRadius: "var(--ctl)", opacity: 0.5 }}>
      <motion.span className="absolute inset-0" style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)" }} animate={{ x: ["-100%", "160%"] }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} />
    </div>
  );
  // sized by the device prop, never viewport queries — frames lie to media queries
  return (
    <div className="flex h-full gap-4 p-5">
      {device === "desktop" && <div className="flex w-36 flex-col gap-2.5"><Sk className="h-8" /><Sk className="h-5" /><Sk className="h-5" /><Sk className="h-5" /><Sk className="h-5" /></div>}
      <div className="flex-1 space-y-3"><Sk className="h-9 w-1/2" /><div className={`grid gap-3 ${device === "mobile" ? "grid-cols-1" : "grid-cols-2"}`}><Sk className="h-40" /><div className="space-y-3"><Sk className="h-[74px]" /><Sk className="h-[74px]" /></div></div><Sk className="h-24" /></div>
    </div>
  );
}
/** Loading facet: skeleton (default) | spinner | dots | progress (D-013). */
function Loading({ ds, device }: { ds: DesignSystem; device: Device }) {
  const kind = ds.loading ?? "skeleton";
  if (kind === "skeleton") return <Skeleton device={device} />;
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      {kind === "spinner" && (
        <motion.span className="h-9 w-9 rounded-full border-[3px]" style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }} animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }} />
      )}
      {kind === "dots" && (
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => <motion.span key={i} className="h-2.5 w-2.5 rounded-full" style={{ background: "var(--accent)" }} animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} />)}
        </div>
      )}
      {kind === "progress" && (
        <span className="h-1.5 w-40 overflow-hidden rounded-full" style={{ background: "var(--border)" }}>
          <motion.span className="block h-full w-1/3 rounded-full" style={{ background: "var(--accent)" }} animate={{ x: ["-100%", "320%"] }} transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }} />
        </span>
      )}
      <p className="text-[11px]" style={{ color: "var(--muted)" }}>Loading your day…</p>
    </div>
  );
}

/* ---------------- the app shell (persists across app scenes) ---------------- */
function Shell({ ds, scene, device, mode }: { ds: DesignSystem; scene: SceneKey; device: Device; mode: AppMode }) {
  const live = mode === "live";
  const tr = sceneTransition(ds);

  // ----- timer -----
  const [running, setRunning] = useState(true);
  const [secs, setSecs] = useState(25 * 60 - 9 * 60 - 47);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSecs((s) => (s <= 0 ? 25 * 60 : s - 1)), 1000);
    return () => clearInterval(id);
  }, [running]);

  // ----- tasks + stats -----
  const [done, setDone] = useState<Record<number, boolean>>({ 0: true });
  const [bump, setBump] = useState(0);
  const tasks = ["Ship pricing page", "Fix onboarding step 2", "Reply to beta users"];
  useEffect(() => {
    if (live || scene !== "tasks") return;
    const a = setTimeout(() => { setDone((d) => ({ ...d, 1: true })); setBump((b) => b + 1); }, 900);
    const b = setTimeout(() => { setDone((d) => ({ ...d, 2: true })); setBump((b2) => b2 + 1); }, 2400);
    const c = setTimeout(() => { setDone({ 0: true }); }, 4600);
    return () => { clearTimeout(a); clearTimeout(b); clearTimeout(c); };
  }, [scene, live]);

  // ----- drawers -----
  const [assistant, setAssistant] = useState(false);
  const [settings, setSettings] = useState(false);
  useEffect(() => {
    if (live) return;
    setAssistant(scene === "assistant");
    setSettings(scene === "settings");
  }, [scene, live]);

  // ----- alerts -----
  const showAlerts = !live && scene === "alerts";
  const [toast, setToast] = useState(false);
  useEffect(() => {
    if (live || scene !== "alerts") { setToast(false); return; }
    const a = setTimeout(() => setToast(true), 1600);
    const b = setTimeout(() => setToast(false), 4000);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [scene, live]);

  const [note, setNote] = useState("Ship the styles page today — the demo must feel alive.");
  const mobile = device === "mobile";
  const stacked = device !== "desktop"; // phones AND tablet frames are too narrow for the 2-col dashboard
  // full app flow (D-014): live mode navigates real views; showcase focuses via scenes
  const [view, setView] = useState<"home" | "focus" | "notes" | "calendar">("home");
  const effView = live ? view : scene === "timer" ? "focus" : "home";
  const focusTimer = scene === "timer";
  const navTo = (key: string) => (key === "settings" ? setSettings(!settings) : (setSettings(false), setView(key as typeof view)));
  const NAV = [["Home", Home, "home"], ["Focus", TimerIcon, "focus"], ["Notes", NotebookPen, "notes"], ["Calendar", CalIcon, "calendar"], ["Settings", SettingsIcon, "settings"]] as const;

  return (
    <div className="relative z-10 flex h-full">
      {/* sidebar (desktop) */}
      {device === "desktop" && (
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={tr} className="flex w-40 shrink-0 flex-col gap-1 p-3" style={{ borderRight: "var(--bw) solid var(--border)" }}>
          <span className="mb-2 flex items-center gap-2 px-2 text-[12px]" style={{ fontWeight: ds.t.headWeight, ...up(ds) }}><span className="h-2.5 w-2.5" style={{ background: "var(--accent)", borderRadius: 99 }} />Flowtime</span>
          {NAV.map(([label, I, key]) => {
            const on = key === "settings" ? settings : !settings && effView === key;
            return (
              <button key={key} onClick={live ? () => navTo(key) : undefined} className="flex items-center gap-2 px-2.5 py-1.5 text-left text-[11.5px]" style={on ? { background: "var(--accent)", color: "var(--accent-text)", borderRadius: "var(--ctl)" } : { color: "var(--muted)" }}>
                <I className="h-3.5 w-3.5" /> {label}
              </button>
            );
          })}
          <div className="mt-auto px-2.5">
            <Label>This week</Label>
            <WeekStrip />
          </div>
        </motion.div>
      )}

      {/* icon rail (tablet) — iPad-style compact nav so every view stays reachable */}
      {device === "tablet" && (
        <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={tr} className="flex w-12 shrink-0 flex-col items-center gap-1.5 py-3" style={{ borderRight: "var(--bw) solid var(--border)" }}>
          <span className="mb-1.5 h-2.5 w-2.5" style={{ background: "var(--accent)", borderRadius: 99 }} />
          {NAV.map(([label, I, key]) => {
            const on = key === "settings" ? settings : !settings && effView === key;
            return (
              <button key={key} onClick={live ? () => navTo(key) : undefined} aria-label={label} className="flex h-8 w-8 items-center justify-center" style={on ? { background: "var(--accent)", color: "var(--accent-text)", borderRadius: "var(--ctl)" } : { color: "var(--muted)" }}>
                <I className="h-4 w-4" />
              </button>
            );
          })}
        </motion.div>
      )}

      {/* main */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* header — compacts on narrow frames so the greeting never wraps */}
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <div className="min-w-0">
            <h2 className="truncate text-[15px] leading-tight" style={{ fontWeight: ds.t.headWeight, ...up(ds) }}>{mobile ? "Good morning" : "Good morning, Nam"}</h2>
            <p className="truncate text-[10.5px]" style={{ color: "var(--muted)" }}>2 sessions · 1h 40m focused</p>
          </div>
          <div className="flex shrink-0 items-center gap-2.5">
            <button onClick={live ? () => setAssistant((v) => !v) : undefined} aria-label="Assistant" className="flex items-center gap-1.5 px-2.5 py-1.5 text-[10.5px] font-semibold" style={{ background: "var(--accent)", color: "var(--accent-text)", borderRadius: "var(--ctl)", boxShadow: "var(--shadow)" }}>
              <Sparkles className="h-3 w-3" /> {!mobile && "Assistant"}
            </button>
            <span className="relative">
              <Bell className="h-4 w-4" style={{ color: "var(--muted)" }} />
              <AnimatePresence>{showAlerts && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-bold text-white" style={{ background: "#ef4444" }}>2</motion.span>}</AnimatePresence>
            </span>
            {!mobile && <Av i={0} s={26} />}
          </div>
        </div>

        {/* content — view switch (D-014: every nav item is a real view).
            Keyed entrance-only swap (no AnimatePresence): the old view unmounts
            instantly so exactly one view is ever mounted — no bleed-through, no
            stuck exits under React StrictMode (D-015). */}
        <div className="relative min-h-0 flex-1 overflow-hidden">
          <motion.div key={effView} className="absolute inset-0 overflow-hidden px-4 pb-4" style={{ background: "var(--bg)" }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={tr}>
          {effView === "focus" && <FocusView ds={ds} device={device} secs={secs} running={running} onToggle={() => setRunning((v) => !v)} onDone={live ? () => { setSecs(25 * 60); setRunning(false); setToast(true); setTimeout(() => setToast(false), 2200); } : undefined} />}
          {effView === "notes" && <NotesView live={live} />}
          {effView === "calendar" && <CalendarView ds={ds} live={live} />}
          {effView === "home" && (
          <motion.div initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.07 } } }} className={`grid gap-3 ${stacked ? "h-full grid-cols-1 content-start overflow-y-auto" : "h-full grid-cols-[1.15fr_1fr]"}`}>
            <motion.div variants={{ h: { opacity: 0, y: 16 }, s: { opacity: 1, y: 0 } }} transition={tr} className="min-h-0">
              <TimerCard ds={ds} secs={secs} running={running} focus={focusTimer} onToggle={() => setRunning((v) => !v)} live={live} />
            </motion.div>
            <div className="flex min-h-0 flex-col gap-3">
              <motion.div variants={{ h: { opacity: 0, y: 16 }, s: { opacity: 1, y: 0 } }} transition={tr}>
                <StatsCard bump={bump} />
              </motion.div>
              <motion.div variants={{ h: { opacity: 0, y: 16 }, s: { opacity: 1, y: 0 } }} transition={tr}>
                <Card>
                  <Label>Today</Label>
                  <div className="mt-2 space-y-1.5">
                    {tasks.map((task, i) => (
                      <button key={task} onClick={live ? () => { setDone((d) => ({ ...d, [i]: !d[i] })); setBump((b) => b + (done[i] ? -1 : 1)); } : undefined} className="flex w-full items-center gap-2 text-left">
                        <motion.span animate={done[i] ? { scale: [1, 1.25, 1] } : {}} transition={{ duration: 0.35 }} className="flex h-[15px] w-[15px] items-center justify-center" style={{ border: `var(--bw) solid ${done[i] ? "var(--accent)" : "var(--border)"}`, background: done[i] ? "var(--accent)" : "transparent", borderRadius: ds.t.ctlRadius === "0px" ? 0 : 4 }}>
                          {done[i] && <Check className="h-2.5 w-2.5" style={{ color: "var(--accent-text)" }} />}
                        </motion.span>
                        <span className="text-[11.5px]" style={{ color: done[i] ? "var(--muted)" : "var(--text)", textDecoration: done[i] ? "line-through" : "none" }}>{task}</span>
                      </button>
                    ))}
                  </div>
                </Card>
              </motion.div>
              {!stacked && (
                <motion.div variants={{ h: { opacity: 0, y: 16 }, s: { opacity: 1, y: 0 } }} transition={tr}>
                  <Card>
                    <Label>Quick note</Label>
                    {live ? (
                      <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="mt-1.5 w-full resize-none bg-transparent text-[11.5px] leading-relaxed outline-none" style={{ color: "var(--text)" }} />
                    ) : (
                      <p className="mt-1.5 text-[11.5px] leading-relaxed" style={{ color: "var(--text)" }}>{note}</p>
                    )}
                  </Card>
                </motion.div>
              )}
            </div>
          </motion.div>
          )}
          </motion.div>
        </div>

        {/* mobile tab bar */}
        {mobile && (
          <div className="flex items-center justify-around px-4 py-2" style={{ borderTop: "var(--bw) solid var(--border)", background: "var(--surface)" }}>
            {([["home", Home], ["focus", TimerIcon], ["notes", NotebookPen], ["calendar", CalIcon]] as const).map(([key, I]) => (
              <button key={key} onClick={live ? () => { setSettings(false); setView(key); } : undefined} aria-label={key} className="p-1">
                <I className="h-4 w-4" style={{ color: effView === key && !settings ? "var(--accent)" : "var(--muted)" }} />
              </button>
            ))}
            <button onClick={live ? () => setSettings(!settings) : undefined} aria-label="settings" className="p-1">
              <SettingsIcon className="h-4 w-4" style={{ color: settings ? "var(--accent)" : "var(--muted)" }} />
            </button>
          </div>
        )}

        {/* notification banner — centered by the flex wrapper; framer animates y+opacity only
            (never mix a Tailwind/percentage centering transform with a framer transform anim) */}
        <div className="pointer-events-none absolute inset-x-0 top-2 z-30 flex justify-center">
          <AnimatePresence>
            {showAlerts && (
              <motion.div key="alert-banner" initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} transition={tr} className="pointer-events-auto flex w-[78%] max-w-xs items-center gap-2.5 p-3" style={{ background: "var(--surface)", border: "var(--bw) solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow)" }}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--accent)" }}><Flame className="h-3.5 w-3.5" style={{ color: "var(--accent-text)" }} /></span>
                <div className="min-w-0"><p className="truncate text-[11.5px] font-semibold">12-day streak!</p><p className="truncate text-[10px]" style={{ color: "var(--muted)" }}>Your longest run yet — keep it going.</p></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* toast — flex-centered wrapper sits above the mobile tab bar; framer animates y+opacity only */}
        <div className="pointer-events-none absolute inset-x-0 z-30 flex justify-center" style={{ bottom: mobile ? 56 : 12 }}>
          <AnimatePresence>
            {toast && (
              <motion.div key="toast" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 14, opacity: 0 }} transition={tr} className="pointer-events-auto flex items-center gap-2 px-3.5 py-2" style={{ background: "var(--surface)", border: "var(--bw) solid var(--border)", borderRadius: "var(--ctl)", boxShadow: "var(--shadow)" }}>
                <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full" style={{ background: "var(--accent)" }}><Check className="h-2.5 w-2.5" style={{ color: "var(--accent-text)" }} /></span>
                <span className="text-[11px] font-medium">Session saved · 25 min</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* assistant drawer */}
        <Drawer open={assistant} onClose={live ? () => setAssistant(false) : undefined} ds={ds} title="Assistant" icon={<Sparkles className="h-3.5 w-3.5" />}>
          <AssistantBody active={assistant} live={live} />
        </Drawer>

        {/* settings drawer */}
        <Drawer open={settings} onClose={live ? () => setSettings(false) : undefined} ds={ds} title="Settings" icon={<SettingsIcon className="h-3.5 w-3.5" />}>
          <SettingsBody scripted={!live && scene === "settings"} />
        </Drawer>
      </div>
    </div>
  );
}

/* ---------------- cards ---------------- */
function TimerCard({ ds, secs, running, focus, onToggle, live }: { ds: DesignSystem; secs: number; running: boolean; focus: boolean; onToggle: () => void; live: boolean }) {
  const TOTAL = 25 * 60;
  const p = 1 - secs / TOTAL;
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const R = 56, C = 2 * Math.PI * R;
  return (
    <motion.div animate={focus ? { scale: 1.02 } : { scale: 1 }} transition={{ duration: 0.4 }} className="h-full">
      <Card className="flex h-full flex-col items-center justify-center !p-5">
        <Label>Focus session · 2 of 4</Label>
        {/* fixed size — fits the narrowest frame; never viewport queries inside frames */}
        <div className="relative mt-2 h-36 w-36">
          {running && <motion.span className="absolute inset-3 rounded-full" style={{ border: `1px solid var(--accent)`, opacity: 0.4 }} animate={{ scale: [1, 1.12], opacity: [0.35, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }} />}
          <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
            <circle cx="64" cy="64" r={R} fill="none" stroke="var(--border)" strokeWidth="6" />
            <circle cx="64" cy="64" r={R} fill="none" stroke="var(--accent)" strokeWidth="6" strokeLinecap={ds.t.radius === "0px" ? "butt" : "round"} strokeDasharray={C} strokeDashoffset={C * (1 - p)} style={{ transition: "stroke-dashoffset 1s linear, stroke .45s ease" }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl tabular-nums" style={{ fontWeight: ds.t.headWeight }}>{mm}:{ss}</span>
            <span className="text-[10px]" style={{ color: "var(--muted)" }}>{running ? "designing the fix" : "paused"}</span>
          </div>
        </div>
        {/* pomodoro dots */}
        <div className="mt-2.5 flex gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className="h-1.5 w-6 overflow-hidden rounded-full" style={{ background: "var(--border)" }}>
              {i === 0 && <span className="block h-full w-full" style={{ background: "var(--accent)" }} />}
              {i === 1 && <span className="block h-full" style={{ width: `${p * 100}%`, background: "var(--accent)", transition: "width 1s linear" }} />}
            </span>
          ))}
        </div>
        <button onClick={live ? onToggle : undefined} id="timer-toggle" className="mt-3.5 flex h-10 w-10 items-center justify-center active:scale-95" style={{ background: "var(--accent)", color: "var(--accent-text)", borderRadius: "var(--ctl)", boxShadow: "var(--shadow)" }} aria-label={running ? "Pause" : "Start"}>
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-px" />}
        </button>
      </Card>
    </motion.div>
  );
}

function StatsCard({ bump }: { bump: number }) {
  const focusHrs = useCount(128, bump * 2);
  const shipped = useCount(342, bump);
  const [pts, setPts] = useState<number[]>([40, 55, 45, 70, 60, 82, 74, 90]);
  useEffect(() => { const id = setInterval(() => setPts((p) => [...p.slice(1), 30 + Math.random() * 65]), 2000); return () => clearInterval(id); }, []);
  const d = pts.map((v, i) => `${(i / (pts.length - 1)) * 100},${100 - v}`).join(" ");
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div><Label>Focus hours</Label><p className="mt-0.5 text-lg tabular-nums" style={{ fontWeight: 700 }}>{focusHrs}</p></div>
        <div><Label>Shipped</Label><p className="mt-0.5 text-lg tabular-nums" style={{ fontWeight: 700 }}>{shipped}</p></div>
        <div className="text-right"><Label>Streak</Label><p className="mt-0.5 flex items-center gap-1 text-lg tabular-nums" style={{ fontWeight: 700 }}><Flame className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} />12</p></div>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="mt-2 h-12 w-full">
        <polyline points={d} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinejoin="round" style={{ transition: "all 1.4s ease" }} />
        <polyline points={`0,100 ${d} 100,100`} fill="var(--accent)" opacity="0.12" style={{ transition: "all 1.4s ease" }} />
      </svg>
    </Card>
  );
}

function WeekStrip() {
  const today = 3;
  return (
    <div className="mt-1.5 flex gap-1">
      {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
        <span key={i} className="flex h-6 w-5 flex-col items-center justify-center text-[8px]" style={{ background: i === today ? "var(--accent)" : "transparent", color: i === today ? "var(--accent-text)" : "var(--muted)", borderRadius: "var(--ctl)", border: i === today ? "none" : `1px solid var(--border)` }}>
          {d}
        </span>
      ))}
    </div>
  );
}

/* ---------------- drawers ---------------- */
function Drawer({ open, onClose, ds, title, icon, children }: { open: boolean; onClose?: () => void; ds: DesignSystem; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div key="drawer" className="absolute inset-y-0 right-0 z-40 flex w-[72%] max-w-[260px] flex-col" initial={{ x: "105%" }} animate={{ x: 0 }} exit={{ x: "105%" }} transition={sceneTransition(ds)}
          style={{ background: "var(--surface)", borderLeft: "var(--bw) solid var(--border)", boxShadow: "var(--shadow)" }}>
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "var(--bw) solid var(--border)" }}>
            <span className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "var(--text)" }}>{icon}{title}</span>
            {onClose && <button onClick={onClose} aria-label="Close"><X className="h-3.5 w-3.5" style={{ color: "var(--muted)" }} /></button>}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AssistantBody({ active, live }: { active: boolean; live: boolean }) {
  const full = "You focus best 9–11am. I blocked it for the onboarding fix and moved your two calls to the afternoon.";
  const [txt, setTxt] = useState("");
  useEffect(() => {
    if (!active) { setTxt(""); return; }
    let i = 0;
    const id = setInterval(() => { i += 2; setTxt(full.slice(0, i)); if (i >= full.length) clearInterval(id); }, 38);
    return () => clearInterval(id);
  }, [active]);
  const done = txt.length >= full.length;
  return (
    <div className="space-y-2.5">
      <div className="flex justify-end"><span className="max-w-[85%] px-3 py-1.5 text-[11px]" style={{ background: "var(--accent)", color: "var(--accent-text)", borderRadius: "var(--radius)" }}>Plan my morning?</span></div>
      <div className="px-3 py-2 text-[11px] leading-relaxed" style={{ background: "var(--bg)", border: "var(--bw) solid var(--border)", borderRadius: "var(--radius)" }}>
        {txt}{!done && <motion.span animate={{ opacity: [1, 0.2] }} transition={{ duration: 0.5, repeat: Infinity }} className="ml-0.5 inline-block h-2.5 w-1 align-middle" style={{ background: "var(--accent)" }} />}
      </div>
      {done && (
        <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full px-3 py-1.5 text-[10.5px] font-semibold" style={{ border: `var(--bw) solid var(--accent)`, color: "var(--accent)", borderRadius: "var(--ctl)" }}>
          Accept plan
        </motion.button>
      )}
      {live && (
        <div className="flex items-center gap-1.5 pt-1">
          <input placeholder="Ask anything…" className="min-w-0 flex-1 bg-transparent px-2.5 py-1.5 text-[11px] outline-none" style={{ border: "var(--bw) solid var(--border)", borderRadius: "var(--ctl)", color: "var(--text)" }} />
          <span className="flex h-7 w-7 items-center justify-center" style={{ background: "var(--accent)", borderRadius: "var(--ctl)" }}><Send className="h-3 w-3" style={{ color: "var(--accent-text)" }} /></span>
        </div>
      )}
    </div>
  );
}

function SettingsBody({ scripted }: { scripted: boolean }) {
  const [toggles, setToggles] = useState([true, false, true]);
  const [swatch, setSwatch] = useState(0);
  useEffect(() => {
    if (!scripted) return;
    const a = setTimeout(() => setToggles((t) => [t[0], true, t[2]]), 900);
    const b = setTimeout(() => setSwatch(2), 2000);
    const c = setTimeout(() => setSwatch(0), 3400);
    return () => { clearTimeout(a); clearTimeout(b); clearTimeout(c); };
  }, [scripted]);
  const rows = ["Focus reminders", "Ambient sounds", "Weekly report"];
  const swatches = ["var(--accent)", "#f59e0b", "#10b981", "#ec4899"];
  return (
    <div className="space-y-3">
      {rows.map((r, i) => (
        <button key={r} onClick={() => setToggles((t) => t.map((v, j) => (j === i ? !v : v)))} className="flex w-full items-center justify-between">
          <span className="text-[11.5px]" style={{ color: "var(--text)" }}>{r}</span>
          <span className="h-[18px] w-8 rounded-full p-0.5 transition-colors" style={{ background: toggles[i] ? "var(--accent)" : "var(--border)" }}>
            <motion.span layout className="block h-[14px] w-[14px] rounded-full bg-white shadow" animate={{ x: toggles[i] ? 14 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} />
          </span>
        </button>
      ))}
      <div>
        <Label>Accent</Label>
        <div className="mt-1.5 flex gap-1.5">
          {swatches.map((c, i) => (
            <button key={i} onClick={() => setSwatch(i)} className="relative h-6 w-6 rounded-full" style={{ background: c }} aria-label={`Accent ${i + 1}`}>
              {swatch === i && <motion.span layoutId="sw" className="absolute -inset-1 rounded-full" style={{ border: `2px solid var(--text)` }} transition={{ type: "spring", stiffness: 500, damping: 32 }} />}
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label>Session length</Label>
        <div className="mt-1.5 flex gap-1">
          {["15", "25", "50"].map((m, i) => (
            <span key={m} className="flex-1 py-1 text-center text-[10.5px] font-semibold" style={i === 1 ? { background: "var(--accent)", color: "var(--accent-text)", borderRadius: "var(--ctl)" } : { border: "var(--bw) solid var(--border)", color: "var(--muted)", borderRadius: "var(--ctl)" }}>{m}m</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- full app views (D-014) ---------------- */
const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';

/** The Focus view — flip-clock digits, session label, progress, controls.
 *  Digit size comes from the device prop — media queries see the viewport, not the frame. */
function FocusView({ ds, device, secs, running, onToggle, onDone }: { ds: DesignSystem; device: Device; secs: number; running: boolean; onToggle: () => void; onDone?: () => void }) {
  const TOTAL = 25 * 60;
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  const p = 1 - secs / TOTAL;
  const big = device !== "mobile";
  const Digit = ({ d }: { d: string }) => (
    <div className={`relative flex items-center justify-center overflow-hidden ${big ? "h-24 w-16" : "h-14 w-10"}`} style={{ background: "var(--surface)", border: "var(--bw) solid var(--border)", borderRadius: "var(--ctl)", boxShadow: "var(--shadow)" }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={d} initial={{ y: "-100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }} transition={{ duration: 0.28, ease: [0.3, 0.9, 0.3, 1] }} className={`tabular-nums ${big ? "text-5xl" : "text-2xl"}`} style={{ fontWeight: ds.t.headWeight, fontFamily: MONO }}>
          {d}
        </motion.span>
      </AnimatePresence>
      <span className="pointer-events-none absolute inset-x-0 top-1/2 h-px opacity-60" style={{ background: "var(--border)" }} />
    </div>
  );
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className={`flex items-center ${big ? "gap-2" : "gap-1.5"}`}>
        <Digit d={mm[0]} /><Digit d={mm[1]} />
        <div className={`flex flex-col px-0.5 ${big ? "gap-2" : "gap-1.5"}`}>{[0, 1].map((j) => <span key={j} className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--muted)" }} />)}</div>
        <Digit d={ss[0]} /><Digit d={ss[1]} />
      </div>
      <p className="text-[12px]" style={{ color: "var(--muted)" }}>Focus session · designing the fix</p>
      <div className="h-1.5 w-56 max-w-[70%] overflow-hidden rounded-full" style={{ background: "var(--border)" }}>
        <span className="block h-full rounded-full" style={{ width: `${p * 100}%`, background: "var(--accent)", transition: "width 1s linear" }} />
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onDone} aria-label="Mark done" className="flex h-9 w-9 items-center justify-center active:scale-95" style={{ border: "var(--bw) solid var(--border)", color: "var(--muted)", borderRadius: "var(--ctl)" }}>
          <Check className="h-4 w-4" />
        </button>
        <button onClick={onDone ? onToggle : undefined} aria-label={running ? "Pause" : "Start"} className="flex h-12 w-12 items-center justify-center active:scale-95" style={{ background: "var(--accent)", color: "var(--accent-text)", borderRadius: "var(--ctl)", boxShadow: "var(--shadow)" }}>
          {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-px" />}
        </button>
      </div>
    </div>
  );
}

/** The Notes view — quick capture list. */
function NotesView({ live }: { live: boolean }) {
  const [notes, setNotes] = useState<string[]>(["Ship the styles page today — the demo must feel alive.", "Ask beta users about the new onboarding.", "Flip-clock idea: digits should feel mechanical."]);
  const [draft, setDraft] = useState("");
  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col gap-2.5 pt-1">
      {live && (
        <div className="flex items-center gap-2">
          <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && draft.trim()) { setNotes((n) => [draft.trim(), ...n]); setDraft(""); } }} placeholder="Quick note… (Enter to save)" className="min-w-0 flex-1 bg-transparent px-3 py-2 text-[12px] outline-none" style={{ border: "var(--bw) solid var(--border)", borderRadius: "var(--ctl)", color: "var(--text)" }} />
        </div>
      )}
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
        {notes.map((n, i) => (
          <motion.div key={n} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-3 text-[12px] leading-relaxed" style={{ background: "var(--surface)", border: "var(--bw) solid var(--border)", borderRadius: "var(--radius)", boxShadow: "var(--shadow)", color: i === 0 ? "var(--text)" : "var(--muted)" }}>
            {n}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** The Calendar view — a real month grid with session heat, a selectable day, and its sessions. */
const CAL_TASKS = ["Onboarding fix", "Pricing page", "Beta user replies", "Deep work block", "Design review", "Ship styles page"];
const CAL_TIMES = ["09:00", "10:30", "13:15", "15:00", "16:45"];
const CAL_DUR = [50, 25, 25, 15, 50];
// July 2026 · 1st falls on a Wednesday (Mon-indexed → 2 leading blanks); today = the 3rd.
function sessionsFor(day: number): number {
  if (day <= 0) return 0;
  const dow = (day + 1) % 7; // 0=Mon
  if (dow === 5 || dow === 6) return day % 3 === 0 ? 1 : 0; // quiet weekends
  return ((day * 7) % 5) + 2; // 2–6 on weekdays, deterministic
}
function CalendarView({ ds, live }: { ds: DesignSystem; live: boolean }) {
  const today = 3;
  const [sel, setSel] = useState(today);
  const lead = 2, total = 31;
  const cells: (number | null)[] = [...Array(lead).fill(null), ...Array.from({ length: total }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);
  const maxS = 6;
  const count = sessionsFor(sel);
  const mins = Array.from({ length: count }).reduce<number>((a, _, i) => a + CAL_DUR[i % 5], 0);
  const monthTotal = Array.from({ length: total }, (_, i) => sessionsFor(i + 1)).reduce((a, b) => a + b, 0);
  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col gap-2.5 overflow-y-auto pt-1">
      <div className="flex items-baseline justify-between">
        <h3 className="text-[15px]" style={{ fontWeight: ds.t.headWeight, ...up(ds) }}>July 2026</h3>
        <span className="text-[10.5px]" style={{ color: "var(--muted)" }}>{monthTotal} sessions this month</span>
      </div>
      <div className="grid grid-cols-7 gap-x-1 text-center">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} className="pb-1 text-[9px] font-semibold" style={{ color: "var(--muted)" }}>{d}</span>
        ))}
        {cells.map((day, i) => {
          if (day == null) return <span key={i} />;
          const n = sessionsFor(day);
          const isToday = day === today, isSel = day === sel;
          return (
            <button key={i} onClick={live ? () => setSel(day) : undefined} className="flex aspect-square flex-col items-center justify-center gap-0.5"
              style={{ background: isSel ? "var(--accent)" : n > 0 ? "var(--surface)" : "transparent", border: isToday && !isSel ? `var(--bw) solid var(--accent)` : "var(--bw) solid transparent", borderRadius: "var(--ctl)" }}>
              <span className="text-[10px] tabular-nums" style={{ color: isSel ? "var(--accent-text)" : "var(--text)", fontWeight: isToday ? 800 : 500 }}>{day}</span>
              <span className="h-1 w-1 rounded-full" style={{ background: n > 0 ? (isSel ? "var(--accent-text)" : "var(--accent)") : "transparent", opacity: n > 0 ? Math.min(1, 0.35 + n / maxS) : 0 }} />
            </button>
          );
        })}
      </div>
      <div className="mt-0.5 flex-1">
        <div className="flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.12em]" style={{ color: "var(--muted)" }}>July {sel}</p>
          <p className="text-[10.5px]" style={{ color: "var(--muted)" }}>{count} sessions · {Math.floor(mins / 60)}h {mins % 60}m</p>
        </div>
        {count === 0 ? (
          <p className="mt-2 text-[11px]" style={{ color: "var(--muted)" }}>No focus sessions — a rest day.</p>
        ) : (
          <div className="mt-1.5 space-y-1.5">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2" style={{ background: "var(--surface)", border: "var(--bw) solid var(--border)", borderRadius: "var(--ctl)" }}>
                <span className="text-[10.5px] tabular-nums" style={{ color: "var(--muted)", minWidth: 34 }}>{CAL_TIMES[i % 5]}</span>
                <span className="flex-1 truncate text-[11.5px]" style={{ color: "var(--text)" }}>{CAL_TASKS[(sel + i) % CAL_TASKS.length]}</span>
                <span className="text-[10px] font-semibold tabular-nums" style={{ color: "var(--accent)" }}>{CAL_DUR[i % 5]}m</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
