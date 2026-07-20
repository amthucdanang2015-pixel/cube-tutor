"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { REDESIGNS } from "@/data/redesigns";
import { getScreens } from "@/components/redesigns";
import { BrowserChrome, PhoneChrome } from "@/components/redesigns/_chrome";
import { CopyBlock } from "@/components/CopyBlock";
import { ChevronLeft, ChevronRight, FileText, X, Check, Sparkles } from "lucide-react";

type Mode = "after" | "before";

export function RedesignStudio() {
  const [i, setI] = useState(0);
  const [mode, setMode] = useState<Mode>("after");
  const [promptOpen, setPromptOpen] = useState(false);
  const r = REDESIGNS[i];
  const screens = getScreens(r.slug);

  const go = useCallback((dir: number) => {
    setMode("after");
    setI((prev) => (prev + dir + REDESIGNS.length) % REDESIGNS.length);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (promptOpen) {
        if (e.key === "Escape") setPromptOpen(false);
        return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); go(1); }
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
      else if (e.key.toLowerCase() === "b") setMode((m) => (m === "after" ? "before" : "after"));
      else if (e.key.toLowerCase() === "p" || e.key === "Enter") setPromptOpen(true);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, promptOpen]);

  const Screen = screens ? (mode === "after" ? screens.After : screens.Before) : null;
  const hasBefore = Boolean(screens?.Before);

  return (
    <div className="grid min-h-[calc(100svh-0px)] grid-cols-1 lg:grid-cols-[330px_1fr]">
      {/* ---------- left rail ---------- */}
      <aside className="border-b border-line lg:border-b-0 lg:border-r lg:h-[100svh] lg:overflow-y-auto">
        <div className="px-6 pb-4 pt-6 lg:pt-20">
          <h1 className="text-2xl font-semibold tracking-tight">
            design<span className="text-accent2"> studies</span>
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Products you know, rebuilt as studies — their version vs ours. Drag, compare, steal the prompt.
          </p>
        </div>
        <div className="px-3 pb-10">
          {REDESIGNS.map((item, idx) => (
            <button
              key={item.slug}
              onClick={() => { setI(idx); setMode("after"); }}
              className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                idx === i ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
              }`}
            >
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: `${item.accent}22` }}>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.accent }} />
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block truncate text-sm font-semibold ${idx === i ? "text-white" : "text-white/80"}`}>{item.product}</span>
                <span className="block truncate text-xs text-white/40">{item.screen} · {item.category}</span>
              </span>
              <span className="text-xs tabular-nums text-white/25">{String(idx + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
        <div className="hidden items-center gap-3 border-t border-line px-6 py-3 text-[11px] text-white/35 lg:flex">
          <Key>↑↓</Key> navigate <Key>B</Key> before/after <Key>P</Key> prompt
        </div>
      </aside>

      {/* ---------- stage ---------- */}
      <section className="relative flex flex-col px-5 pb-10 pt-16 lg:h-[100svh] lg:overflow-y-auto lg:px-10">
        {/* top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-bold" style={{ background: `${r.accent}22`, color: r.accent }}>
              {r.product[0]}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold tracking-tight">{r.product}</h2>
                <Badge>{r.category}</Badge>
                <Badge>{r.frame}</Badge>
              </div>
              <p className="text-sm text-white/55">{r.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasBefore && (
              <div className="flex rounded-full border border-line p-0.5 text-xs">
                <ToggleBtn active={mode === "before"} onClick={() => setMode("before")}>Before</ToggleBtn>
                <ToggleBtn active={mode === "after"} onClick={() => setMode("after")}>After</ToggleBtn>
              </div>
            )}
            <button onClick={() => setPromptOpen(true)} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-sm text-white/85 transition hover:border-white/30">
              <FileText className="h-4 w-4" /> Get prompt
            </button>
            <div className="flex gap-1">
              <IconBtn onClick={() => go(-1)}><ChevronLeft className="h-4 w-4" /></IconBtn>
              <IconBtn onClick={() => go(1)}><ChevronRight className="h-4 w-4" /></IconBtn>
            </div>
          </div>
        </div>

        {/* body: device + fix panel */}
        <div className="mt-8 grid flex-1 grid-cols-1 gap-8 xl:grid-cols-[1fr_360px]">
          {/* device — sticky so the demo is always on screen (D-004) */}
          <div className="relative flex min-h-[560px] items-center justify-center xl:sticky xl:top-6 xl:h-[calc(100svh-220px)] xl:min-h-0 xl:self-start">
            <div
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{ background: `radial-gradient(420px circle at 50% 45%, ${r.accent}22, transparent 70%)` }}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={`${r.slug}-${mode}`}
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -14, scale: 0.98 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 w-full"
              >
                {mode === "before" && (
                  <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-rose-500/90 px-3 py-0.5 text-[11px] font-bold text-white">
                    THEIR VERSION
                  </div>
                )}
                {r.frame === "phone" ? (
                  <div className="mx-auto h-[560px] w-[300px]">
                    <PhoneChrome statusDark={mode === "after" && r.slug === "duolingo-daily-home"}>{Screen && <Screen />}</PhoneChrome>
                  </div>
                ) : (
                  <div className="mx-auto h-[440px] w-full max-w-[680px]">
                    <BrowserChrome url={r.url ?? "example.com"}>{Screen && <Screen />}</BrowserChrome>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* fix panel */}
          <div className="space-y-6">
            <Panel title="What's broken" tone="bad">
              <ul className="space-y-2">
                {r.problems.map((p) => (
                  <li key={p} className="flex gap-2 text-[13px] leading-relaxed text-white/60">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-rose-400" /> {p}
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="What we'd ship" tone="good">
              <ul className="space-y-2">
                {r.fixes.map((f) => (
                  <li key={f} className="flex gap-2 text-[13px] leading-relaxed text-white/75">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" /> {f}
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Design system">
              <div className="flex gap-1.5">
                {r.system.palette.map((c) => (
                  <span key={c} className="h-7 flex-1 rounded-md ring-1 ring-white/10" style={{ background: c }} title={c} />
                ))}
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-white/60"><span className="text-white/80">Type:</span> {r.system.type}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/60"><span className="text-white/80">Motion:</span> {r.system.motion}</p>
            </Panel>
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-gradient-to-br from-accent/12 to-accent2/10 p-4">
              <Sparkles className="h-5 w-5 text-accent2" />
              <p className="flex-1 text-sm text-white/75">Want your product handled like this?</p>
              <a href="/work#intake" className="shrink-0 rounded-full bg-loop px-4 py-2 text-sm font-semibold text-ink transition hover:bg-loop/90">Get a Taste Review</a>
            </div>
          </div>
        </div>
      </section>

      {/* prompt modal */}
      <AnimatePresence>
        {promptOpen && (
          <motion.div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setPromptOpen(false)} />
            <motion.div
              initial={{ y: 30, scale: 0.98, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 20, scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="relative z-10 max-h-[90svh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-line bg-surface p-6 sm:rounded-3xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{r.product} · {r.screen}</h3>
                  <p className="mt-1 text-sm text-white/55">{r.tagline}</p>
                </div>
                <button onClick={() => setPromptOpen(false)} className="rounded-full border border-line p-2 text-white/70 hover:text-white"><X className="h-4 w-4" /></button>
              </div>
              <div className="mt-5"><CopyBlock text={r.prompt} label="Copy-paste prompt" /></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Panel({ title, tone, children }: { title: string; tone?: "good" | "bad"; children: React.ReactNode }) {
  const dot = tone === "good" ? "bg-emerald-400" : tone === "bad" ? "bg-rose-400" : "bg-white/40";
  return (
    <div className="rounded-2xl border border-line bg-white/[0.02] p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        <h4 className="text-xs font-bold uppercase tracking-widest text-white/50">{title}</h4>
      </div>
      {children}
    </div>
  );
}
function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border border-line px-2 py-0.5 text-[11px] capitalize text-white/55">{children}</span>;
}
function ToggleBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`rounded-full px-3 py-1.5 font-medium transition ${active ? "bg-white text-ink" : "text-white/60 hover:text-white"}`}>{children}</button>;
}
function IconBtn({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className="rounded-full border border-line p-2 text-white/70 transition hover:border-white/30 hover:text-white">{children}</button>;
}
function Key({ children }: { children: React.ReactNode }) {
  return <kbd className="rounded border border-line bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/60">{children}</kbd>;
}
